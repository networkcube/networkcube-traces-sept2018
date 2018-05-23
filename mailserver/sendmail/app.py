efrom flask import Flask, request, make_response
from werkzeug.utils import secure_filename
from flask_cors import CORS

import os.path
import smtplib
import crypt
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.utils import getaddresses, parseaddr

try:
    FileNotFoundError
except NameError:
    FileNotFoundError = IOError

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = '/tmp'
ALLOWED_EXTENSIONS = set(['png', 'svg', 'csv', 'json'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.debug = True

valid_dest = set()
valid_passwd = {}

VALID_EMAILS_FILE = 'valid_emails.txt'
PASSWD_FILE = 'passwd'

LOG = None

def writelog(msg):
    if LOG is None:
        try:
            LOG = open('sendmail.log', 'w+')
        except:
            LOG = False
    if not LOG:
        return
    LOG.write(msg)
    LOG.write('\n')

def load_valid_emails():
    try:
        with open(VALID_EMAILS_FILE, 'r') as f:
            for valid in f:
                valid = valid.strip('\n')
                if valid:
                    valid_dest.add(valid)
                    #print('Adding %s'%valid)
    except FileNotFoundError:
        with open(VALID_EMAILS_FILE, 'w') as f:
            pass

def load_passwords():
    try:
        with open(PASSWD_FILE, 'r') as f:
            for passwd in f:
                passwd = passwd.strip('\n')
                fields = passwd.split(":")
                if fields and fields[0] and fields[1]:
                    valid_passwd[fields[0]] = fields[1]
                    #print('Adding user %s'%fields[0])
    except FileNotFoundError:
        with open(PASSWD_FILE, 'w') as out:
            out.write("jdf:jdQo0KARBewQQ\n")
            valid_passwd["jdf"] = "jdQo0KARBewQQ"

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def valid_user(user, password):
    return valid_passwd[user]==crypt.crypt(password, password)

def add_valid_email(email):
    email = email.strip()
    if len(email) < 5:
        raise ValueError("email %s too short"%email)
    _, short = parseaddr(email)
    if not short:
        raise ValueError("email %s is invalid"%email)
    email = short
    if email in valid_dest:
        raise KeyError("Email %s already valid"%email)
    valid_dest.add(email)
    #TODO lock the file
    with open(VALID_EMAILS_FILE, 'a') as out:
        out.write(email)
        out.write('\n')

def remove_valid_email(email):
    email = email.strip()
    valid_dest.remove(email)
    #TODO lock the file
    os.rename(VALID_EMAILS_FILE, VALID_EMAILS_FILE+"b")
    with open(VALID_EMAILS_FILE, 'w') as out:
        for e in sorted(valid_dest):
            out.write(e)
            out.write('\n')

def hello():
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form enctype=multipart/form-data method=post>
      <p>From: <input type=text name=from>
         To: <input type=text name=to>
         cc: <input type=text name=cc>
         Subject: <input type=text name=subject>
         Note: <input type=text name=note>
         Copy to Vistorian? <input type=checkbox name=CopyToVistorian value=Yes>
         Image: <input type=file name=image>
         SVG: <input type=file name=svg>
         Data: <input type=file name=data>
         <input type=submit>
    </form>
    '''

def add_valid_email_form(msg=""):
    return '''
    <!doctype html>
    <title>Add Valid EMail</title>
    <h1>Add Valid EMail</h1>
    <strong>{msg}</strong>
    <form method=post action="/addvalid">
      <p><label for="from">From:</label> <input type="text" name="from"><br>
         <label for="password">Password:</label> <input type="password" name="password"><br>
         <label for="email">EMail:</label> <input type="email" name="email"><br>
         <label for="rem">Remove:</label> <input type="checkbox" name="rem"><br>
         <label for="list">List:</label> <input type="checkbox" name="list"><br>
         <input type=submit>
    </form>
    '''.format(msg=msg)


@app.route("/test", methods=['GET', 'POST'])
def test():
    return "test OK"

@app.route("/addvalid", methods=['GET', 'POST'])
def addvalid():
    try:
        from_user = request.form['from'].strip()
        password = request.form['password'].strip()
        email = request.form['email'].strip()
        remove = request.form.get('rem')
        dolist = request.form.get('list')
    #pylint:disable=broad-except
    except Exception as e:
        return add_valid_email_form()
    try:
        if not valid_user(from_user, password):
            raise KeyError('Invalid user/password')
        if remove:
            #print('Removing %s'%email)
            remove_valid_email(email)
        else:
            #print('Adding %s'%email)
            add_valid_email(email)
    #pylint:disable=broad-except
    except Exception as e:
        #print('Exception %s'%e)
        return add_valid_email_form(str(e))

    if dolist:
        return '''
        <!doctype html>
        <title>List of Valid EMails</title>
        <h1>List of Valid EMail</h1>''' + \
        ",<br>".join([str(x) for x in sorted(valid_dest)]) + \
        "</html>"
    return "Done!"


@app.route("/register", methods=['GET', 'POST'])
def register():
    send_from = 'vistorian@inria.fr'
    send_to = 'vistorian@inria.fr'
    send_subject = '[Vistorian] New user tracking registration'
    send_note = "Hi Vistorians, This is a tracking request from a new user. Their email address is " + request.form['email'].strip() + "."
        
    msg = MIMEMultipart('')
    msg['Subject'] = send_subject
    msg['From'] = send_from
    msg['To'] = send_to
    msg.preamble = send_note

    note = MIMEText(send_note)
    msg.attach(note)
    
    tos = msg.get_all('to', [])
    # ccs = msg.get_all('cc', [])
    resent_tos = msg.get_all('resent-to', [])
    # resent_ccs = msg.get_all('resent-cc', [])
    all_recipients = getaddresses(tos + resent_tos)
    # Send the email via our own SMTP server.
    s = smtplib.SMTP('smtp.inria.fr')
    s.sendmail(send_from, all_recipients, msg.as_string())
    s.quit()
   
    response = "Mail sent!"
    #response = make_response(response)
    #response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route("/send", methods=['GET', 'POST'])
def send():
    try:
        send_from = request.form['from'].strip()
        send_to = request.form['to'].strip()
        send_cc = request.form['cc'].strip()
        send_subject = request.form['subject'].strip()
        send_note = request.form['note'].strip()
    #pylint:disable=broad-except
    except Exception:
        return hello()
    if send_to not in valid_dest:
        writelog("Invalid destination: "+send_to)
        return "Invalid destination: "+send_to #+" valids:"+",".join(list(valid_dest))
    if 'CopyToVistorian' in request.form:
        send_cc = "vistorian@inria.fr"
    if 'image' in request.files:
        send_image = request.files['image']
        if allowed_file(send_image.filename):
            filename = secure_filename(send_image.filename)
            print('Received the image %s' % filename)
            filename = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            send_image.save(filename)
            send_image = filename
        else:
            send_image = None
    else:
        send_image = None
    if 'svg' in request.files:
        send_svg = request.files['svg']
        if allowed_file(send_svg.filename):
            filename = secure_filename(send_svg.filename)
            print('Received the svg %s', filename)
            filename = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            send_svg.save(filename)
            send_svg = filename
        else:
            send_svg = None
    else:
        send_svg = None
    
    if 'data' in request.files:
        send_data = request.files['data']
        if allowed_file(send_data.filename):
            filename = secure_filename(send_data.filename)
            print('Received the image %s' % filename)
            filename = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            send_data.save(filename)
            send_data = filename
        else:
            send_data = None
    else:
        send_data = None

    msg = MIMEMultipart()
    msg['Subject'] = send_subject
    msg['From'] = send_from
    msg['To'] = send_to
    if send_cc is not None:
        msg['CC'] = send_cc

    msg.preamble = send_note

    note = MIMEText(send_note)
    msg.attach(note)

    # Assume we know that the image files are all in PNG format
    # Open the files in binary mode.  Let the MIMEImage class automatically
    # guess the specific image type.
    if send_image is not None:
        with open(send_image, 'rb') as fp:
            img = MIMEImage(fp.read())
        msg.attach(img)

    if send_svg is not None:
        with open(send_svg, 'rb') as fp:
            img = MIMEImage(fp.read(), _subtype="svg+xml")
        msg.attach(img)

    if send_data is not None:
        with open(send_data, 'rb') as fp:
            if send_data.endswith('.json'):
                img = MIMEImage(fp.read(), _subtype="application/json")
            elif send_data.endswith('.csv'):
                img = MIMEImage(fp.read(), _subtype="text/csv")
            else:
                # should not happen
                img = None
        if img is not None:
            msg.attach(img)

    tos = msg.get_all('to', [])
    ccs = msg.get_all('cc', [])
    resent_tos = msg.get_all('resent-to', [])
    resent_ccs = msg.get_all('resent-cc', [])
    all_recipients = getaddresses(tos + ccs + resent_tos + resent_ccs)
    # Send the email via our own SMTP server.
    s = smtplib.SMTP('smtp.inria.fr')
    s.sendmail(send_from, all_recipients, msg.as_string())
    s.quit()

    response = "Mail sent!"
    #response = make_response(response)
    #response.headers['Access-Control-Allow-Origin'] = "*"
    return response


load_valid_emails()
load_passwords()

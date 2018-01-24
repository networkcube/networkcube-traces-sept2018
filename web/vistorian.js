var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vistorian;
(function (vistorian) {
    var head = $('head');
    head.append("<link href='//fonts.googleapis.com/css?family=Open+Sans+Condensed:300italic,700,300&subset=latin,latin-ext' rel='stylesheet' type='text/css'></head>");
    head.append("<link href='//fonts.googleapis.com/css?family=Great+Vibes' rel='stylesheet' type='text/css'>");
    head.append("<link href='//fonts.googleapis.com/css?family=Playfair+Display' rel='stylesheet' type='text/css'>");
    head.append("<link href='//fonts.googleapis.com/css?family=Amatic+SC:400,700' rel='stylesheet' type='text/css'>");
    head.append("<link href='//fonts.googleapis.com/css?family=Lora' rel='stylesheet' type='text/css'>");
    head.append("<link href='//fonts.googleapis.com/css?family=Comfortaa' rel='stylesheet' type='text/css'>");
    head.append("<link href='//fonts.googleapis.com/css?family=Caveat' rel='stylesheet' type='text/css'>");
    head.append("<link href='//fonts.googleapis.com/css?family=IM+Fell+English' rel='stylesheet' type='text/css'>");
    head.append("<link rel='stylesheet' type='text/css' href='//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css'>");
    head.append('<script src="//cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>');
    head.append("<script src='//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js'></script>");
    function append(url) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        $("head").append(script);
    }
    var tables = [];
    var showMessageAgain = null;
    var VTable = (function () {
        function VTable(name, data) {
            this.name = name;
            this.data = data;
        }
        return VTable;
    })();
    vistorian.VTable = VTable;
    var VTableSchema = (function () {
        function VTableSchema(name) {
            this.name = name;
        }
        return VTableSchema;
    })();
    vistorian.VTableSchema = VTableSchema;
    var VNodeSchema = (function (_super) {
        __extends(VNodeSchema, _super);
        function VNodeSchema() {
            _super.call(this, 'userNodeSchema');
            this.relation = [];
            this.location = -1;
            this.id = 0;
            this.label = -1;
            this.time = -1;
            this.nodeType = -1;
        }
        ;
        return VNodeSchema;
    })(VTableSchema);
    vistorian.VNodeSchema = VNodeSchema;
    var VLinkSchema = (function (_super) {
        __extends(VLinkSchema, _super);
        function VLinkSchema() {
            _super.call(this, 'userLinkSchema');
            this.location_source = -1;
            this.location_target = -1;
            this.id = 0;
            this.source = -1;
            this.target = -1;
            this.weight = -1;
            this.time = -1;
            this.linkType = -1;
        }
        ;
        return VLinkSchema;
    })(VTableSchema);
    vistorian.VLinkSchema = VLinkSchema;
    var VLocationSchema = (function (_super) {
        __extends(VLocationSchema, _super);
        function VLocationSchema() {
            _super.call(this, 'userLocationSchema');
            this.id = 0;
            this.label = 1;
            this.geoname = 2;
            this.longitude = 3;
            this.latitude = 4;
        }
        ;
        return VLocationSchema;
    })(VTableSchema);
    vistorian.VLocationSchema = VLocationSchema;
    var Network = (function () {
        function Network(id) {
            this.networkConfig = 'both';
            this.id = id;
            this.userNodeSchema = new VNodeSchema();
            this.userLinkSchema = new VLinkSchema();
        }
        return Network;
    })();
    vistorian.Network = Network;
    function loadCSV(files, callBack, sessionid) {
        var loadCount = 0;
        var table;
        var tables = [];
        var fileContents = [];
        var readers = [];
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            reader.filename = f.name.split('_')[0];
            readers[i] = reader;
            reader.onload = function (f) {
                var obj = {
                    content: f.target.result,
                    name: f.target.filename
                };
                var i = readers.indexOf(f.target);
                fileContents[i] = obj;
                table = new VTable(files[i].name.replace('.csv', '').replace(' ', '_').trim(), Papa.parse(fileContents[i].content).data);
                formatTable(table);
                storage.saveUserTable(table, sessionid);
                loadCount++;
                console.log(loadCount, files.length);
                if (loadCount == files.length)
                    callBack();
            };
            reader.readAsText(f);
        }
    }
    vistorian.loadCSV = loadCSV;
    function exportTableCSV(table) {
        var csv = Papa.unparse(table.data, { quotes: true });
        var textFileAsBlob = new Blob([csv], { type: 'text/csv' });
        var fileNameToSaveAs = table.name + '.csv';
        var downloadLink = document.createElement('a');
        downloadLink.download = fileNameToSaveAs;
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        downloadLink.click();
    }
    vistorian.exportTableCSV = exportTableCSV;
    function exportLocationTableCSV(networkname, table) {
        var csv = Papa.unparse(table, { quotes: true });
        var textFileAsBlob = new Blob([csv], { type: 'text/csv' });
        var fileNameToSaveAs = networkname + '-locations.csv';
        var downloadLink = document.createElement('a');
        downloadLink.download = fileNameToSaveAs;
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        downloadLink.click();
    }
    vistorian.exportLocationTableCSV = exportLocationTableCSV;
    function formatTable(table) {
        var data = [];
        var indexify = !(table.data[0][0] == 'ID'
            || table.data[0][0] == 'id'
            || table.data[0][0] == 'Id'
            || table.data[0][0] == 'Index'
            || table.data[0][0].includes('index')
            || table.data[0][0].includes('Index'));
        var numCols = table.data[0].length;
        var emptyCols = 0;
        var row;
        for (var i = 0; i < table.data.length; i++) {
            row = [];
            emptyCols = 0;
            if (indexify) {
                if (i == 0)
                    row.push('Index');
                else
                    row.push((i - 1) + '');
            }
            for (var j = 0; j < numCols; j++) {
                if (table.data[i][j] == undefined) {
                    table.data[i][j] = '';
                }
                if (table.data[i][j].length == 0) {
                    emptyCols++;
                }
                row.push(table.data[i][j].trim());
            }
            if (emptyCols < numCols - 1) {
                data.push(row);
            }
        }
        table.data = data;
        return table;
    }
    vistorian.formatTable = formatTable;
    function checkTime(table, timeCol, timeFormat) {
        var timeString;
        var error = [];
        console.log('table', table);
        for (var i = 0; i < table.data.length; i++) {
            timeString = table.data[i][timeCol];
            if (timeString.length == 0) {
                error.push(i);
                continue;
            }
            try {
                moment(timeString, timeFormat);
            }
            catch (err) {
                error.push(i);
            }
        }
        return error;
    }
    vistorian.checkTime = checkTime;
    var requestTimer;
    var requestsRunning = 0;
    var fullGeoNames = [];
    function updateLocationTable(userLocationTable, locationSchema, callBack) {
        saveCurrentNetwork(false);
        var data = userLocationTable.data;
        requestsRunning = 0;
        fullGeoNames = [];
        for (var i = 1; i < data.length; i++) {
            console.log('send update request ', data[i][locationSchema.geoname]);
            updateEntryToLocationTableOSM(i, data[i][locationSchema.geoname], userLocationTable, locationSchema);
        }
        requestTimer = setInterval(function () {
            currentNetwork.userLocationTable = userLocationTable;
            checkRequests(callBack, []);
        }, 500);
    }
    vistorian.updateLocationTable = updateLocationTable;
    function checkRequests(callBack, locationsFound) {
        if (requestsRunning == 0) {
            clearInterval(requestTimer);
            callBack(locationsFound);
        }
    }
    function updateEntryToLocationTableDariah(index, geoname, locationTable, locationSchema) {
        geoname = geoname.trim();
        fullGeoNames.push(geoname);
        console.log('url', "http://ref.dariah.eu/tgnsearch/tgnquery2.xql?ac=" + geoname.split(',')[0].trim());
        var xhr = $.ajax({
            url: "http://ref.dariah.eu/tgnsearch/tgnquery2.xql?ac=" + geoname.split(',')[0].trim(),
            dataType: 'xml'
        })
            .done(function (data, text, XMLHttpRequest) {
            var data = x2js.xml2json(data);
            var entry;
            var length;
            var rowIndex = XMLHttpRequest.uniqueId + 1;
            var userLocationLabel = locationTable.data[rowIndex][locationSchema.label];
            if (data.response.term != undefined) {
                var validResults = [];
                var result;
                if (data.response.term[0] != undefined) {
                    for (var i = 0; i < data.response.term.length; i++) {
                        entry = data.response.term[i];
                        if (entry == undefined)
                            continue;
                        if (entry.longitude != undefined
                            && entry.latitude != undefined
                            && typeof entry.longitude == 'string'
                            && typeof entry.latitude == 'string') {
                            validResults.push(entry);
                        }
                    }
                }
                else {
                    validResults.push(data.response.term);
                }
                if (validResults.length == 0) {
                    locationTable.data[rowIndex] = [rowIndex - 1, userLocationLabel, geoname, undefined, undefined];
                    return;
                }
                if (validResults.length == 1) {
                    locationTable.data[rowIndex] = [rowIndex - 1, userLocationLabel, geoname, validResults[0].longitude, validResults[0].latitude];
                    return;
                }
                else {
                    console.log('multiple results found');
                    var geonameAttributes = fullGeoNames[rowIndex - 1];
                    geonameAttributes = geonameAttributes.split(',');
                    for (var j = 0; j < geonameAttributes.length; j++) {
                        geonameAttributes[j] = geonameAttributes[j].trim();
                    }
                    var regionTerms;
                    for (var i = 0; i < validResults.length; i++) {
                        regionTerms = validResults[i].path.split('|');
                        for (var j = 0; j < regionTerms.length; j++) {
                            regionTerms[j] = regionTerms[j].trim();
                        }
                        if (geonameAttributes.length > 1 && regionTerms.length > 1) {
                            for (var j = 1; j < geonameAttributes.length; j++) {
                                for (var k = 1; k < regionTerms.length; k++) {
                                    if (geonameAttributes[j] == regionTerms[k]) {
                                        locationTable.data[rowIndex] = [rowIndex - 1, userLocationLabel, geoname, validResults[i].longitude, validResults[i].latitude];
                                        console.log('update', geoname, validResults[i].longitude, validResults[i].latitude);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    locationTable.data[rowIndex] = [rowIndex - 1, userLocationLabel, geoname, validResults[0].longitude, validResults[0].latitude];
                    console.log('update', geoname, validResults[0].longitude, validResults[0].latitude);
                }
            }
            else {
                if (geoname == '')
                    return;
                locationTable.data[rowIndex] = [rowIndex - 1, userLocationLabel, geoname, undefined, undefined];
                console.log('update', geoname, undefined, undefined);
            }
        })
            .always(function () {
            requestsRunning--;
        });
        xhr['uniqueId'] = requestsRunning++;
    }
    function updateEntryToLocationTableOSM(index, geoname, locationTable, locationSchema) {
        geoname = geoname.trim();
        fullGeoNames.push(geoname);
        var xhr = $.ajax({
            url: "https://nominatim.openstreetmap.org/search",
            data: { format: "json", limit: "1", q: geoname.split(',')[0].trim() },
            dataType: 'json'
        })
            .done(function (data, text, XMLHttpRequest) {
            var entry;
            var length;
            var rowIndex = XMLHttpRequest.uniqueId + 1;
            var userLocationLabel = locationTable.data[rowIndex][locationSchema.label];
            if (data.length != 0) {
                var validResults = [];
                var result;
                for (var i = 0; i < data.length; i++) {
                    entry = data[i];
                    if (entry == undefined)
                        continue;
                    if ('lon' in entry &&
                        'lat' in entry &&
                        typeof entry.lon === 'string' &&
                        typeof entry.lat === 'string') {
                        validResults.push(entry);
                    }
                }
                if (validResults.length == 0) {
                    locationTable.data[rowIndex] = [rowIndex - 1, userLocationLabel, geoname, undefined, undefined];
                    return;
                }
                locationTable.data[rowIndex] = [rowIndex - 1, userLocationLabel, geoname, validResults[0].lon, validResults[0].lat];
            }
            else {
                if (geoname == '')
                    return;
                locationTable.data[rowIndex] = [rowIndex - 1, userLocationLabel, geoname, undefined, undefined];
                console.log('update', geoname, undefined, undefined);
            }
        })
            .always(function () {
            requestsRunning--;
        });
        xhr['uniqueId'] = requestsRunning++;
    }
    function cleanTable(table) {
        var emptyColBool = [];
        for (var i = 0; i < table.length; i++) {
            for (var j = 0; j < table[i].length; j++) {
                if (table[i][j] != undefined)
                    table[i][j] = table[i][j].trim();
            }
        }
    }
    vistorian.cleanTable = cleanTable;
    function setHeader(elementId, datasetname) {
        var header = $('<a href="index.html"><img width="100%" src="../logos/logo-networkcube.png"/></a>');
        $('#' + elementId).append(header);
        var dataname = $('<p style="margin:5px;background-color:#eeeeee;border-radius:2px;padding-left:10px;padding:5px;"><b>Data:</b> ' + datasetname + '</h2>');
        $('#' + elementId).append(dataname);
        $('#' + elementId).append('\
            <link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css"/>\
            <script src="//cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>\
            <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js"></script>\
            <script src="//cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js"></script>\
            <input id="enableDisableTrackingBtn" type="button" class="enable" onclick="vistorian.enableDisableTracking()" value="Enable tracking"></input>\
            <div id="trackingContainer">\
            </div>\
        ');
        if (networkcube.isTrackingEnabled()) {
            var url = location.href;
            $('#enableDisableTrackingBtn').prop('value', 'Disable tracking and screenshots').prop('class', 'disable');
            if (url.indexOf('dataview') > -1) {
                $('#trackingContainer').load('traces/questionnaires.html');
            }
            else {
                $('#trackingContainer').load('../traces/questionnaires.html');
            }
        }
        else {
            $('#enableDisableTrackingBtn').prop('value', 'Enable tracking and screenshots').prop('class', 'enable');
            if ($('#trackingButtonsDiv')) {
                $('#trackingButtonsDiv').remove();
            }
        }
        var vars = networkcube.getUrlVars();
        $('#' + elementId).append('<a href="../dataview.html?session=' + vars['session'] + '&datasetName' + vars['datasetName'] + '" style="margin:5px;padding-left:5px;" onclick="trace.event(null, \'ToolLaunch\', \'ReturnToDataview\', );" target="_blank">Return to Dataview</a>');
        $('#' + elementId).append('<br/><br/>');
    }
    vistorian.setHeader = setHeader;
    function enableDisableTracking() {
        var url = location.href;
        var relativePathToTracesDir = '';
        if (url.indexOf('dataview') > -1) {
            relativePathToTracesDir = '';
        }
        else {
            relativePathToTracesDir = '../';
        }
        if (networkcube.isTrackingEnabled()) {
            setupConditionalLoggingDisable(relativePathToTracesDir);
        }
        else {
            setupConditionalLogging(relativePathToTracesDir);
        }
    }
    vistorian.enableDisableTracking = enableDisableTracking;
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
    function setupConditionalLogging(relativePathToTracesDir) {
        bootbox.confirm({
            closeButton: true,
            size: "large",
            class: "text-left",
            message: '<p><strong><big>Consent to tracking</big></strong>\
            <p>When Tracking is ON, the Vistorian <strong>logs your activity</strong> (e.g. the fact that you created a node link diagram or a matrix, or used filters, or the fact that you uploaded a new file).\
            <br> This allows us to understand how the Vistorian is used and to improve it.\
            <p>This tracking data will be saved on a secure INRIA server which is accessible only by the Vistorian team.\
            <br>No personal information will be collected or saved with the tracking data.\
            <br>Your research data remains on your computer and is not saved anywhere else. In other words no-one else can see your data unless you personally email a screenshot or file to someone.\
            <p>If you agree to be tracked we will start tracking, and\
            <ul>\
            <li><strong>Contact you </strong>by email with a detailed consent form and a questionnaire, and answer all your questions unless we have already done so.\
            <li><strong>Turn on the &#147Mail me a screenshot&#148 </strong>feature (which we hope will be useful to you, and allow us to see screenshots of the work you wish to share with us).\
            </ul>\
            <p>Please enter your email: <input id="userEmailInput" type="text" name="userEmail" style="width:300px" onkeyup="localStorage.setItem(\'NETWORKCUBE_USEREMAIL\', document.getElementById(\'userEmailInput\').value)"> <span id="email-error" style="color:white;">An email address is required</span></p>\
            <p>You can turn tracking OFF at any time, and email us to request all your tracking data to be erased.\
            <p>Thank you for agreeing to participate in our research.\
            <p>The Vistorian Team (<a href="mailto:vistorian@inria.fr">vistorian@inria.fr</a>)\
            <br><small>Benjamin Bach\
            <br>Jean Daniel Fekete\
            <br>Catherine Plaisant\
            <br>Vanessa Serrano Molinero<small/>',
            buttons: {
                confirm: {
                    label: "I Agree",
                    className: "btn-success pull-right"
                },
                cancel: {
                    label: "Cancel",
                    className: "btn-warning pull-left"
                }
            },
            callback: function (result) {
                if (result == true) {
                    if (!validateEmail(localStorage.getItem("NETWORKCUBE_USEREMAIL"))) {
                        bootbox.alert({
                            message: "Please, enter a correct email!",
                            size: 'big'
                        });
                        $('#email-error').css('color', 'red');
                        return false;
                    }
                    else {
                        localStorage.setItem("NETWORKCUBE_IS_TRACKING_ENABLED", 'true');
                        $('#trackingContainer').load(relativePathToTracesDir + 'traces/questionnaires.html');
                        $('#enableDisableTrackingBtn')
                            .prop('value', 'Disable tracking and screenshots')
                            .prop('class', 'disable');
                        console.log('NETWORKCUBE_USEREMAIL: ', localStorage.getItem("NETWORKCUBE_USEREMAIL"));
                        trace.registerUser(localStorage.getItem("NETWORKCUBE_USEREMAIL"));
                    }
                }
                else {
                    localStorage.setItem("NETWORKCUBE_IS_TRACKING_ENABLED", 'false');
                    if ($('#trackingButtonsDiv')) {
                        $('#trackingButtonsDiv').remove();
                    }
                    $('#enableDisableTrackingBtn')
                        .prop('value', 'Enable tracking and screenshots')
                        .prop('class', 'enable');
                }
            }
        });
    }
    vistorian.setupConditionalLogging = setupConditionalLogging;
    function setupConditionalLoggingDisable(relativePathToTracesDir) {
        bootbox.confirm({
            closeButton: true,
            size: "large",
            class: "text-left",
            message: '<p><strong><big>Disable tracking</big></strong>\
            <p>Please confirm that you want Tracking to be disabled.\
            <br>Once tracking is disabled no more tracking information will be captured.  Nothing will be sent to the server.\
            <p>You will be able to restart tracking again (and getting screenshots) if you wish.\
            <p>The data we gathered from your past use of the Victorian is de-identified and contains no personal information.\
            <br>If you wish this data to be removed from the server please send a personal email to vistorian@inria.fr <vistorian@inria.fr>.\
            <p>Thank you for participating in our study.\
            <p>The Vistorian Team (<a href="mailto:vistorian@inria.fr">vistorian@inria.fr</a>)\
            <br><small>Benjamin Bach\
            <br>Jean Daniel Fekete\
            <br>Catherine Plaisant\
            <br>Vanessa Serrano Molinero<small/>',
            buttons: {
                confirm: {
                    label: "CONFIRM",
                    className: "btn-success pull-right"
                },
                cancel: {
                    label: "Cancel",
                    className: "btn-warning pull-left"
                }
            },
            callback: function (result) {
                if (result == false) {
                    localStorage.setItem("NETWORKCUBE_IS_TRACKING_ENABLED", 'true');
                    console.log('>>> TRACKING ENABLED');
                    $('#trackingContainer').load(relativePathToTracesDir + 'traces/questionnaires.html');
                    $('#enableDisableTrackingBtn').prop('value', 'Disable tracking and screenshots').prop('class', 'disable');
                }
                else {
                    localStorage.setItem("NETWORKCUBE_IS_TRACKING_ENABLED", 'false');
                    if ($('#trackingButtonsDiv')) {
                        $('#trackingButtonsDiv').remove();
                    }
                    $('#enableDisableTrackingBtn')
                        .prop('value', 'Enable tracking and screenshots')
                        .prop('class', 'enable');
                }
            }
        });
    }
    vistorian.setupConditionalLoggingDisable = setupConditionalLoggingDisable;
    function exportNetwork(network) {
        var blurb = network;
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(blurb)));
        element.setAttribute('download', network.name + '.vistorian');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    vistorian.exportNetwork = exportNetwork;
    function importData(network, session) {
        storage.saveNetwork(network, session);
    }
    vistorian.importData = importData;
    function importIntoNetworkcube(currentNetwork, sessionid, s) {
        if (currentNetwork.userNodeTable)
            vistorian.cleanTable(currentNetwork.userNodeTable.data);
        if (currentNetwork.userLinkTable)
            vistorian.cleanTable(currentNetwork.userLinkTable.data);
        var normalizedNodeTable = [];
        var normalizedLinkTable = [];
        var normalizedLocationTable = [];
        var networkcubeNodeSchema = currentNetwork.networkCubeDataSet.nodeSchema;
        var networkcubeLinkSchema = currentNetwork.networkCubeDataSet.linkSchema;
        var networkcubeLocationSchema = currentNetwork.networkCubeDataSet.locationSchema;
        var locationLabels = [];
        if (currentNetwork.userLocationTable != undefined) {
            for (var i = 1; i < currentNetwork.userLocationTable.data.length; i++) {
                locationLabels.push(currentNetwork.userLocationTable.data[i][currentNetwork.userLocationSchema.label]);
            }
        }
        console.log('locationLabels', locationLabels);
        var nodeIds = [];
        var names = [];
        var nodeLocations = [];
        var nodeTimes = [];
        if (currentNetwork.userNodeTable == undefined) {
            console.log('no node table found, create node table');
            var linkData = currentNetwork.userLinkTable.data;
            var id_source;
            var id_target;
            var name;
            var loc;
            var linkSchema = currentNetwork.userLinkSchema;
            var timeString;
            var timeFormatted;
            for (var i = 1; i < linkData.length; i++) {
                name = linkData[i][linkSchema.source];
                if (names.indexOf(name) < 0) {
                    id_source = nodeIds.length;
                    names.push(name);
                    nodeIds.push(id_source);
                    nodeLocations.push([]);
                    nodeTimes.push([]);
                }
                name = linkData[i][linkSchema.target];
                if (names.indexOf(name) < 0) {
                    id_target = nodeIds.length;
                    names.push(name);
                    nodeIds.push(id_target);
                    nodeLocations.push([]);
                    nodeTimes.push([]);
                }
            }
            normalizedLinkTable = [];
            var linkTime;
            var found = true;
            for (var i = 0; i < linkData.length; i++) {
                normalizedLinkTable.push([]);
                for (var j = 0; j < linkData[i].length; j++) {
                    normalizedLinkTable[i].push(linkData[i][j]);
                }
                if (networkcube.isValidIndex(linkSchema.source)) {
                    normalizedLinkTable[i][linkSchema.source] = nodeIds[names.indexOf(linkData[i][linkSchema.source])];
                }
                if (networkcube.isValidIndex(linkSchema.target)) {
                    normalizedLinkTable[i][linkSchema.target] = nodeIds[names.indexOf(linkData[i][linkSchema.target])];
                }
                id_source = names.indexOf(linkData[i][linkSchema.source]);
                id_target = names.indexOf(linkData[i][linkSchema.target]);
                if (id_source == -1 || id_target == -1)
                    continue;
                if (linkSchema.location_source > -1) {
                    loc = linkData[i][linkSchema.location_source].trim();
                    id = locationLabels.indexOf(loc);
                    if (id == -1)
                        continue;
                    found = false;
                    for (var t = 0; t < nodeTimes[id_source].length; t++) {
                        if (nodeTimes[id_source][t] == linkData[i][linkSchema.time]) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        nodeTimes[id_source].push(linkData[i][linkSchema.time]);
                        nodeLocations[id_source].push(id);
                    }
                    normalizedLinkTable[i][linkSchema.location_source] = id;
                }
                if (linkSchema.location_target > -1) {
                    loc = linkData[i][linkSchema.location_target].trim();
                    id = locationLabels.indexOf(loc);
                    if (id == -1)
                        continue;
                    found = false;
                    for (var t = 0; t < nodeTimes[id_target].length; t++) {
                        if (nodeTimes[id_target][t] == linkData[i][linkSchema.time]) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        nodeTimes[id_target].push(linkData[i][linkSchema.time]);
                        nodeLocations[id_target].push(id);
                    }
                    normalizedLinkTable[i][linkSchema.location_target] = id;
                }
            }
            normalizedLinkTable.shift();
            var time;
            normalizedNodeTable = [];
            networkcubeNodeSchema.label = 1;
            var locationsFound = false;
            var timeFound = false;
            if (nodeLocations.length > 0) {
                networkcubeNodeSchema.location = 4;
            }
            if (nodeTimes.length > 0) {
                networkcubeNodeSchema.location = 3;
            }
            for (var i = 0; i < nodeIds.length; i++) {
                if (nodeLocations[i].length > 0) {
                    locationsFound = true;
                    for (var j = 0; j < nodeLocations[i].length; j++) {
                        time = undefined;
                        if (nodeTimes[i][j]) {
                            time = nodeTimes[i][j].toString();
                        }
                        normalizedNodeTable.push([nodeIds[i], names[i], nodeTimes[i][j], nodeLocations[i][j]]);
                    }
                }
                else {
                    if (networkcube.isValidIndex(currentNetwork.userNodeSchema.time)) {
                        normalizedNodeTable.push([nodeIds[i], names[i], undefined, undefined]);
                    }
                    else {
                        normalizedNodeTable.push([nodeIds[i], names[i], undefined]);
                    }
                }
            }
        }
        if (currentNetwork.userNodeTable) {
            networkcubeNodeSchema = new networkcube.NodeSchema(0);
            networkcubeNodeSchema.id = currentNetwork.userNodeSchema.id;
            networkcubeNodeSchema.label = currentNetwork.userNodeSchema.label;
            if (networkcube.isValidIndex(currentNetwork.userNodeSchema.time)) {
                networkcubeNodeSchema.time = currentNetwork.userNodeSchema.time;
            }
            if (networkcube.isValidIndex(currentNetwork.userNodeSchema.location)) {
                networkcubeNodeSchema.location = currentNetwork.userNodeSchema.location;
            }
            if (networkcube.isValidIndex(currentNetwork.userNodeSchema.nodeType)) {
                networkcubeNodeSchema.nodeType = currentNetwork.userNodeSchema.nodeType;
            }
        }
        else {
            networkcubeNodeSchema = new networkcube.NodeSchema(0);
            networkcubeNodeSchema.id = 0;
            networkcubeNodeSchema.label = 1;
            if (networkcube.isValidIndex(currentNetwork.userLinkSchema.time)) {
                networkcubeNodeSchema.time = 2;
            }
            if (networkcube.isValidIndex(currentNetwork.userLinkSchema.location_source) || networkcube.isValidIndex(currentNetwork.userLinkSchema.location_target)) {
                networkcubeNodeSchema.location = 3;
            }
        }
        if (currentNetwork.userLinkTable == undefined) {
            console.log('Create and fill link table');
            var nodeData = currentNetwork.userNodeTable.data;
            console.log('nodeData', nodeData);
            var nodeSchema = currentNetwork.userNodeSchema;
            var id;
            var relCol;
            var newRow;
            var nodeId;
            var newNodeId = nodeData.length + 1;
            networkcubeLinkSchema.linkType = 3;
            if (networkcube.isValidIndex(nodeSchema.time))
                networkcubeLinkSchema.time = 4;
            for (var i = 1; i < nodeData.length; i++) {
                newRow = [];
                id = parseInt(nodeData[i][nodeSchema.id]);
                while (normalizedNodeTable.length < (id + 1)) {
                    normalizedNodeTable.push([]);
                }
                newRow.push(id);
                newRow.push(nodeData[i][nodeSchema.label]);
                normalizedNodeTable[id] = newRow;
            }
            networkcubeNodeSchema.label = 1;
            console.log('Create new links: ' + (nodeData.length * nodeSchema.relation.length), nodeData, nodeSchema.relation);
            for (var i = 1; i < nodeData.length; i++) {
                for (var j = 0; j < nodeSchema.relation.length; j++) {
                    relCol = nodeSchema.relation[j];
                    if (nodeData[i][relCol].length == 0)
                        continue;
                    nodeId = -1;
                    for (var k = 0; k < normalizedNodeTable.length; k++) {
                        if (normalizedNodeTable[k][1] == nodeData[i][relCol]) {
                            nodeId = k;
                            break;
                        }
                    }
                    if (nodeId < 0) {
                        nodeId = normalizedNodeTable.length;
                        newRow = [];
                        newRow.push(nodeId);
                        newRow.push(nodeData[i][relCol]);
                        newRow.push(undefined);
                        newRow.push(undefined);
                        normalizedNodeTable.push(newRow);
                    }
                    newRow = [];
                    newRow.push(normalizedLinkTable.length);
                    newRow.push(parseInt(nodeData[i][nodeSchema.id]));
                    newRow.push(nodeId);
                    newRow.push(nodeData[0][relCol]);
                    if (nodeSchema.time > -1)
                        newRow.push(nodeData[i][nodeSchema.time]);
                    normalizedLinkTable.push(newRow);
                }
            }
            console.log('normalizedLinkTable', normalizedLinkTable);
        }
        if (currentNetwork.userLinkTable) {
            for (var field in currentNetwork.userLinkSchema) {
                if (field == 'name')
                    continue;
                networkcubeLinkSchema[field] = currentNetwork.userLinkSchema[field];
            }
        }
        if (currentNetwork.hasOwnProperty('timeFormat') && currentNetwork.timeFormat != undefined && currentNetwork.timeFormat.length > 0) {
            var format = currentNetwork.timeFormat;
            if (networkcubeLinkSchema.time != undefined && networkcubeLinkSchema.time > -1) {
                for (var i = 0; i < normalizedLinkTable.length; i++) {
                    time = moment(normalizedLinkTable[i][networkcubeLinkSchema.time], format).format(networkcube.timeFormat());
                    if (time.indexOf('Invalid') > -1)
                        time = undefined;
                    normalizedLinkTable[i][networkcubeLinkSchema.time] = time;
                }
            }
            if (networkcubeNodeSchema.time != undefined && networkcubeNodeSchema.time > -1) {
                for (var i = 0; i < normalizedNodeTable.length; i++) {
                    time = moment(normalizedNodeTable[i][networkcubeNodeSchema.time], format).format(networkcube.timeFormat());
                    if (time.indexOf('Invalid') > -1)
                        time = undefined;
                    normalizedNodeTable[i][networkcubeNodeSchema.time] = time;
                }
            }
        }
        if (currentNetwork.userLocationTable) {
            currentNetwork.networkCubeDataSet.locationTable = currentNetwork.userLocationTable.data.slice(0);
            currentNetwork.networkCubeDataSet.locationTable.shift();
            currentNetwork.networkCubeDataSet.locationSchema = currentNetwork.userLocationSchema;
        }
        currentNetwork.networkCubeDataSet.nodeTable = normalizedNodeTable;
        currentNetwork.networkCubeDataSet.linkTable = normalizedLinkTable;
        currentNetwork.networkCubeDataSet.linkSchema = networkcubeLinkSchema;
        currentNetwork.networkCubeDataSet.nodeSchema = networkcubeNodeSchema;
        console.log('locationTable', currentNetwork.networkCubeDataSet.locationTable);
        storage.saveNetwork(currentNetwork, sessionid);
        networkcube.setDataManagerOptions({ keepOnlyOneSession: false });
        console.log('>> START IMPORT');
        networkcube.importData(sessionid, currentNetwork.networkCubeDataSet);
        console.log('>> IMPORTED: ', currentNetwork.networkCubeDataSet);
    }
    vistorian.importIntoNetworkcube = importIntoNetworkcube;
})(vistorian || (vistorian = {}));

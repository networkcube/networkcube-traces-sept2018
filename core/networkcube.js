define("classes/utils", ["require", "exports", "classes/dynamicgraph", "classes/queries", "moment", "d3"], function (require, exports, dynamicgraph_1, queries_1, moment, d3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getPriorityColor(element) {
        var j = 0;
        var selections = element.getSelections();
        while (!selections[j].showColor) {
            j++;
            if (j == selections.length) {
                j = -1;
                return;
            }
        }
        return element.getSelections()[j].color;
    }
    exports.getPriorityColor = getPriorityColor;
    function sortByPriority(s1, s2) {
        return s1.priority - s2.priority;
    }
    exports.sortByPriority = sortByPriority;
    function getUrlVars() {
        var vars = {};
        var params = window.location.search.replace("?", "").split('&');
        var tmp, value;
        params.forEach(function (item) {
            tmp = item.split("=");
            value = decodeURIComponent(tmp[1]);
            vars[tmp[0]] = value;
        });
        return vars;
    }
    exports.getUrlVars = getUrlVars;
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    exports.capitalizeFirstLetter = capitalizeFirstLetter;
    function isValidIndex(v) {
        return v != undefined && v > -1;
    }
    exports.isValidIndex = isValidIndex;
    function array(value, size) {
        var array = [];
        while (size--)
            array[size] = value;
        return array;
    }
    exports.array = array;
    function doubleArray(size1, size2, value) {
        var array = [];
        if (value == undefined)
            value = [];
        var a = [];
        if (size2) {
            while (size2--)
                a[size2] = value;
        }
        while (size1--)
            array[size1] = a.slice(0);
        return array;
    }
    exports.doubleArray = doubleArray;
    function isBefore(t1, t2) {
        return t1.time < t2.time;
    }
    exports.isBefore = isBefore;
    function isAfter(t1, t2) {
        return t1.time > t2.time;
    }
    exports.isAfter = isAfter;
    function hex2Rgb(hex) {
        return [hexToR(hex), hexToG(hex), hexToB(hex)];
    }
    exports.hex2Rgb = hex2Rgb;
    function hexToR(h) { return parseInt((cutHex(h)).substring(0, 2), 16); }
    function hexToG(h) { return parseInt((cutHex(h)).substring(2, 4), 16); }
    function hexToB(h) { return parseInt((cutHex(h)).substring(4, 6), 16); }
    function cutHex(h) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h; }
    function hex2web(v) {
        v = v + '';
        return v.replace('0x', '#');
    }
    exports.hex2web = hex2web;
    function hex2RgbNormalized(hex) {
        return [hexToR(hex) / 255, hexToG(hex) / 255, hexToB(hex) / 255];
    }
    exports.hex2RgbNormalized = hex2RgbNormalized;
    function getType(elements) {
        if (elements.length == 0)
            return;
        var type;
        if (elements[0] instanceof queries_1.Node)
            type = 'node';
        else if (elements[0] instanceof queries_1.Link) {
            type = 'link';
        }
        else if (elements[0] instanceof queries_1.Time) {
            type = 'time';
        }
        else if (elements[0] instanceof queries_1.NodePair) {
            type = 'nodePair';
        }
        else if (elements[0] instanceof dynamicgraph_1.LinkType) {
            type = 'linkType';
        }
        else if (typeof elements[0] == 'number') {
            type = 'number';
        }
        return type;
    }
    exports.getType = getType;
    function areEqualShallow(a, b) {
        for (var key in a) {
            if (!(key in b) || a[key] !== b[key]) {
                return false;
            }
        }
        for (var key in b) {
            if (!(key in a) || a[key] !== b[key]) {
                return false;
            }
        }
        return true;
    }
    exports.areEqualShallow = areEqualShallow;
    function compareTypesShallow(a, b) {
        if (a == null || b == null)
            return a == b;
        if (typeof a != typeof b)
            return false;
        else if (typeof a != 'object')
            return true;
        else if (a.constructor !== b.constructor)
            return false;
        else {
            return true;
        }
    }
    exports.compareTypesShallow = compareTypesShallow;
    function compareTypesDeep(a, b, depth) {
        var result = true;
        if (a == null || b == null)
            return a == b;
        if (typeof a != typeof b)
            return false;
        else if (typeof a != 'object')
            return true;
        else if (a.constructor !== b.constructor)
            return false;
        else {
            if (depth > 0) {
                for (var key in a) {
                    if (key in b
                        && a.hasOwnProperty(key)
                        && b.hasOwnProperty(key)
                        && !compareTypesDeep(a[key], b[key], depth - 1)) {
                        console.log("compareFailed for key", key, a[key], b[key]);
                        result = false;
                    }
                }
            }
            return result;
        }
    }
    exports.compareTypesDeep = compareTypesDeep;
    function copyPropsShallow(source, target) {
        for (var p in source) {
            if (source.hasOwnProperty(p))
                target[p] = source[p];
        }
        return target;
    }
    exports.copyPropsShallow = copyPropsShallow;
    function copyTimeseriesPropsShallow(source, target) {
        for (var q in source) {
            if (source.hasOwnProperty(q)) {
                for (var p in source[q]) {
                    if (source[q].hasOwnProperty(p)) {
                        target[q][p] = source[q][p];
                    }
                }
            }
        }
        return target;
    }
    exports.copyTimeseriesPropsShallow = copyTimeseriesPropsShallow;
    function copyArray(arr, ctorFunc) {
        var arrayClone = [];
        for (var elem in arr) {
            arrayClone.push(copyPropsShallow(arr[elem], ctorFunc()));
        }
        return arrayClone;
    }
    exports.copyArray = copyArray;
    function copyTimeSeries(arr, ctorFunc) {
        var arrayClone = [];
        for (var elem in arr) {
            arrayClone.push(copyTimeseriesPropsShallow(arr[elem], ctorFunc()));
        }
        return arrayClone;
    }
    exports.copyTimeSeries = copyTimeSeries;
    class Box {
        constructor(x1, y1, x2, y2) {
            this.x1 = Math.min(x1, x2);
            this.x2 = Math.max(x1, x2);
            this.y1 = Math.min(y1, y2);
            this.y2 = Math.max(y1, y2);
        }
        get width() {
            return this.x2 - this.x1;
        }
        get height() {
            return this.y2 - this.y1;
        }
        isPoint() {
            return (this.width == 0) && (this.height == 0);
        }
    }
    exports.Box = Box;
    function inBox(x, y, box) {
        return (x > box.x1
            && x < box.x2
            && y > box.y1
            && y < box.y2);
    }
    exports.inBox = inBox;
    function isSame(a, b) {
        if (a.length != b.length)
            return false;
        var found = true;
        for (var i = 0; i < a.length; i++) {
            found = false;
            for (var j = 0; j < b.length; j++) {
                if (a[i] == b[j])
                    found = true;
            }
            if (!found)
                return false;
        }
        return true;
    }
    exports.isSame = isSame;
    function sortNumber(a, b) {
        return a - b;
    }
    exports.sortNumber = sortNumber;
    class ElementCompound {
        constructor() {
            this.nodes = [];
            this.links = [];
            this.times = [];
            this.nodePairs = [];
            this.locations = [];
        }
    }
    exports.ElementCompound = ElementCompound;
    class IDCompound {
        constructor() {
            this.nodeIds = [];
            this.linkIds = [];
            this.timeIds = [];
            this.nodePairIds = [];
            this.locationIds = [];
        }
    }
    exports.IDCompound = IDCompound;
    function cloneCompound(compound) {
        var result = new IDCompound();
        if (compound.nodeIds) {
            result.nodeIds = [];
            for (var i = 0; i < compound.nodeIds.length; i++) {
                result.nodeIds.push(compound.nodeIds[i]);
            }
        }
        if (compound.linkIds) {
            result.linkIds = [];
            for (var i = 0; i < compound.linkIds.length; i++) {
                result.linkIds.push(compound.linkIds[i]);
            }
        }
        if (compound.nodePairIds) {
            result.nodePairIds = [];
            for (var i = 0; i < compound.nodePairIds.length; i++) {
                result.nodePairIds.push(compound.nodePairIds[i]);
            }
        }
        if (compound.timeIds) {
            result.timeIds = [];
            for (var i = 0; i < compound.timeIds.length; i++) {
                result.timeIds.push(compound.timeIds[i]);
            }
        }
        return result;
    }
    exports.cloneCompound = cloneCompound;
    function makeIdCompound(elements) {
        var result = new IDCompound;
        if (elements != undefined) {
            if (elements.nodes) {
                result.nodeIds = elements.nodes.map((n, i) => n.id());
            }
            if (elements.links) {
                result.linkIds = elements.links.map((n, i) => n.id());
            }
            if (elements.times) {
                result.timeIds = elements.times.map((n, i) => n.id());
            }
            if (elements.nodePairs) {
                result.nodePairIds = elements.nodePairs.map((n, i) => n.id());
            }
        }
        return result;
    }
    exports.makeIdCompound = makeIdCompound;
    function makeElementCompound(elements, g) {
        var result = new ElementCompound;
        if (elements != undefined) {
            if (elements.nodeIds) {
                result.nodes = elements.nodeIds.map((id, i) => g.node(id));
            }
            if (elements.linkIds) {
                result.links = elements.linkIds.map((id, i) => g.link(id));
            }
            if (elements.timeIds) {
                result.times = elements.timeIds.map((id, i) => g.time(id));
            }
            if (elements.nodePairIds) {
                result.nodePairs = elements.nodePairIds.map((id, i) => g.nodePair(id));
            }
        }
        return result;
    }
    exports.makeElementCompound = makeElementCompound;
    function attributeSort(a, b, attributeName, asc) {
        var value = a.attr(attributeName);
        var result;
        if (typeof value == 'string') {
            result = a.attr(attributeName).localeCompare(b.attr(attributeName));
        }
        else if (typeof value == 'number') {
            result = b.attr(attributeName) - a.attr(attributeName);
        }
        else {
            result = 0;
        }
        if (asc == false) {
            result = -result;
        }
        return result;
    }
    exports.attributeSort = attributeSort;
    function formatAtGranularity(time, granualarity) {
        switch (granualarity) {
            case 0: return time.millisecond();
            case 1: return time.second();
            case 2: return time.minute();
            case 3: return time.hour();
            case 4: return time.day();
            case 5: return time.week();
            case 6: return time.month() + 1;
            case 7: return time.year();
        }
    }
    exports.formatAtGranularity = formatAtGranularity;
    function arraysEqual(a, b) {
        if (a === b)
            return true;
        if (a == null || b == null)
            return false;
        if (a.length != b.length)
            return false;
        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    }
    exports.arraysEqual = arraysEqual;
    function encapsulate(array, attrName) {
        if (attrName == undefined) {
            attrName = 'element';
        }
        var a = [];
        var o;
        for (var i = 0; i < array.length; i++) {
            o = {
                index: i,
            };
            o[attrName] = array[i];
            a.push(o);
        }
        return a;
    }
    exports.encapsulate = encapsulate;
    function isPointInPolyArray(poly, pt) {
        for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1])) && (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0]) && (c = !c);
        return c;
    }
    exports.isPointInPolyArray = isPointInPolyArray;
    function formatTimeAtGranularity(time, granualarity) {
        var momentTime = moment(time.unixTime());
        switch (granualarity) {
            case 0: return momentTime.millisecond();
            case 1: return momentTime.second();
            case 2: return momentTime.minute();
            case 3: return momentTime.hour();
            case 4: return momentTime.day();
            case 5: return momentTime.week();
            case 6: return momentTime.month() + 1;
            default: return momentTime.year();
        }
    }
    exports.formatTimeAtGranularity = formatTimeAtGranularity;
    function downloadPNGFromCanvas(name) {
        var blob = getBlobFromCanvas(document.getElementsByTagName('canvas')[0]);
        var fileNameToSaveAs = name + '_' + new Date().toUTCString() + '.png';
        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.click();
    }
    exports.downloadPNGFromCanvas = downloadPNGFromCanvas;
    function getBlobFromCanvas(canvas) {
        var dataURL = canvas.toDataURL("image/png");
        return dataURItoBlob(dataURL);
    }
    function downloadPNGfromSVG(name, svgId) {
        var blob = getBlobFromSVG(name, svgId);
    }
    exports.downloadPNGfromSVG = downloadPNGfromSVG;
    function getBlobFromSVG(name, svgId, callback) {
        var width = $('#' + svgId).width();
        var height = $('#' + svgId).height();
        console.log('SVG SIZE: ' + width, height);
        getBlobFromSVGString(name, getSVGString(d3.select('#' + svgId).node()), width, height, callback);
    }
    exports.getBlobFromSVG = getBlobFromSVG;
    function getBlobFromSVGNode(name, svgNode, callback, backgroundColor) {
        var string = getSVGString(svgNode);
        var width = svgNode.getAttribute('width');
        var height = svgNode.getAttribute('height');
        if (width == null) {
            width = window.innerWidth + 1000;
        }
        if (height == null) {
            height = window.innerHeight + 1000;
        }
        getBlobFromSVGString(name, string, width, height, callback, backgroundColor);
    }
    exports.getBlobFromSVGNode = getBlobFromSVGNode;
    function getBlobFromSVGString(name, svgString, width, height, callback, backgroundColor) {
        console.log('width', width);
        console.log('height', height);
        var format = format ? format : 'png';
        var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext("2d");
        var image = new Image();
        image.src = imgsrc;
        console.log('image', image);
        image.onload = function () {
            context.clearRect(0, 0, width, height);
            if (backgroundColor) {
                context.fillStyle = backgroundColor;
                context.fillRect(0, 0, canvas.width, canvas.height);
            }
            context.drawImage(image, 0, 0, width, height);
            canvas.toBlob(function (blob) {
                console.log('BLOB', blob);
                callback(blob, name);
            });
        };
    }
    exports.getBlobFromSVGString = getBlobFromSVGString;
    function getSVGString(svgNode) {
        console.log('SVG NODE', svgNode);
        svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        var cssStyleText = getCSSStyles(svgNode);
        appendCSS(cssStyleText, svgNode);
        var serializer = new XMLSerializer();
        var svgString = serializer.serializeToString(svgNode);
        svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=');
        svgString = svgString.replace(/NS\d+:href/g, 'xlink:href');
        return svgString;
        function getCSSStyles(parentElement) {
            var selectorTextArr = [];
            selectorTextArr.push('#' + parentElement.id);
            for (var c = 0; c < parentElement.classList.length; c++)
                if (!contains('.' + parentElement.classList[c], selectorTextArr))
                    selectorTextArr.push('.' + parentElement.classList[c]);
            var nodes = parentElement.getElementsByTagName("*");
            for (var i = 0; i < nodes.length; i++) {
                var id = nodes[i].id;
                if (!contains('#' + id, selectorTextArr))
                    selectorTextArr.push('#' + id);
                var classes = nodes[i].classList;
                for (var c = 0; c < classes.length; c++)
                    if (!contains('.' + classes[c], selectorTextArr))
                        selectorTextArr.push('.' + classes[c]);
            }
            var extractedCSSText = "";
            for (var i = 0; i < document.styleSheets.length; i++) {
                var s = document.styleSheets[i];
                try {
                    if (!s.cssRules)
                        continue;
                }
                catch (e) {
                    if (e.name !== 'SecurityError')
                        throw e;
                    continue;
                }
                var cssRules = s.cssRules;
                for (var r = 0; r < cssRules.length; r++) {
                    var rule = cssRules[r];
                    if (contains(rule.selectorText, selectorTextArr))
                        extractedCSSText += rule.cssText;
                }
            }
            return extractedCSSText;
            function contains(str, arr) {
                return arr.indexOf(str) === -1 ? false : true;
            }
        }
        function appendCSS(cssText, element) {
            var styleElement = document.createElement("style");
            styleElement.setAttribute("type", "text/css");
            styleElement.innerHTML = cssText;
            var refNode = element.hasChildNodes() ? element.children[0] : null;
            element.insertBefore(styleElement, refNode);
        }
    }
    exports.getSVGString = getSVGString;
    function dataURItoBlob(dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        console.log('mimeString', mimeString);
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], { type: mimeString });
    }
    var msgBox;
    function showMessage(message, timeout) {
        if ($('.messageBox'))
            $('.messageBox').remove();
        msgBox = $('<div id="div" class="messageBox" style="\
            width: 100%;\
            height: 100%;\
            background-color: #ffffff;\
            opacity: .9;\
            position: absolute;\
            top: 0px;\
            left: 0px;"></div>');
        msgBox.append('<div id="div" style="\
            font-size: 20pt;\
            font-weight: bold;\
            font-family: "Helvetica Neue", Helvetica, sans-serif;\
            width: 500px;\
            padding-top: 300px;\
            text-align: center;\
            margin:auto;">\
            <p>' + message + '</p></div>');
        $('body').append(msgBox);
        msgBox.click(function () {
            $('.messageBox').remove();
        });
        if (timeout) {
            window.setTimeout(function () {
                $('.messageBox').fadeOut(1000);
            }, timeout);
        }
    }
    exports.showMessage = showMessage;
});
define("classes/queries", ["require", "exports", "classes/utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BasicElement {
        constructor(id, type, dynamicGraph) {
            this._id = id;
            this.type = type;
            this.g = dynamicGraph;
        }
        id() {
            return this._id;
        }
        attr(attr) {
            return this.g.attr(attr, this._id, this.type);
        }
        getSelections() {
            return this.g.attributeArrays[this.type].selections[this._id];
        }
        addToSelection(b) {
            this.g.attributeArrays[this.type].selections[this._id].push(b);
        }
        removeFromSelection(b) {
            var arr = this.g.attributeArrays[this.type].selections[this._id];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == b)
                    this.g.attributeArrays[this.type].selections[this._id].splice(i, 1);
            }
        }
        inSelection(s) {
            return this.getSelections().indexOf(s) > -1;
        }
        isSelected(selection) {
            if (!selection)
                return this.getSelections().length > 0;
            var selections = this.g.attributeArrays[this.type].selections[this._id];
            for (var i = 0; i < selections.length; i++) {
                if (selections[i] == this.g.defaultNodeSelection || selections[i] == this.g.defaultLinkSelection) {
                    continue;
                }
                if (selections[i] == selection)
                    return true;
            }
            return false;
        }
        isHighlighted() {
            return this.g.isHighlighted(this._id, this.type);
        }
        isFiltered() {
            return this.g.isFiltered(this._id, this.type);
        }
        isVisible() {
            var selections = this.getSelections();
            if (selections.length == 0)
                return true;
            for (var i = 0; i < selections.length; i++) {
                if (selections[i].filter)
                    return false;
            }
            return true;
        }
        presentIn(start, end) {
            var presence = this.attr('presence');
            if (!end)
                end = start;
            for (var i = start._id; i <= end._id; i++) {
                if (presence.indexOf(i) > -1)
                    return true;
            }
            return false;
        }
    }
    exports.BasicElement = BasicElement;
    class Time extends BasicElement {
        constructor(id, dynamicGraph) {
            super(id, 'time', dynamicGraph);
        }
        time() { return this.attr('momentTime'); }
        moment() { return this.attr('momentTime'); }
        label() { return this.attr('label'); }
        unixTime() { return this.attr('unixTime'); }
        links() {
            return new LinkQuery(this.attr('links'), this.g);
        }
        year() { return this.time().year(); }
        month() { return this.time().month(); }
        week() { return this.time().week(); }
        day() { return this.time().day(); }
        hour() { return this.time().hour(); }
        minute() { return this.time().minute(); }
        second() { return this.time().second(); }
        millisecond() { return this.time().millisecond(); }
        format(format) {
            return this.time().format(format);
        }
    }
    exports.Time = Time;
    class Node extends BasicElement {
        constructor(id, graph) {
            super(id, 'node', graph);
        }
        label() { return '' + this.attr('label'); }
        nodeType() { return this.attr('nodeType'); }
        neighbors(t1, t2) {
            if (t2 != undefined) {
                return new NodeQuery(this.attr('neighbors').period(t1, t2).toFlatArray(true), this.g);
            }
            if (t1 != undefined) {
                return new NodeQuery(this.attr('neighbors').get(t1), this.g);
            }
            return new NodeQuery(this.attr('neighbors').toFlatArray(), this.g);
        }
        inNeighbors(t1, t2) {
            if (t2 != undefined) {
                return new NodeQuery(this.attr('inNeighbors').period(t1, t2).toFlatArray(true), this.g);
            }
            if (t1 != undefined) {
                return new NodeQuery(this.attr('inNeighbors').get(t1), this.g);
            }
            return new NodeQuery(this.attr('inNeighbors').toFlatArray(true), this.g);
        }
        outNeighbors(t1, t2) {
            if (t2 != undefined) {
                return new NodeQuery(this.attr('outNeighbors').period(t1, t2).toFlatArray(true), this.g);
            }
            if (t1 != undefined) {
                return new NodeQuery(this.attr('outNeighbors').get(t1), this.g);
            }
            return new NodeQuery(this.attr('outNeighbors').toFlatArray(), this.g);
        }
        links(t1, t2) {
            if (t2 != undefined) {
                return new LinkQuery(this.attr('links').period(t1, t2).toFlatArray(true), this.g);
            }
            if (t1 != undefined) {
                return new LinkQuery(this.attr('links').get(t1), this.g);
            }
            return new LinkQuery(this.attr('links').toFlatArray(true), this.g);
        }
        inLinks(t1, t2) {
            if (t2 != undefined) {
                return new LinkQuery(this.attr('inLinks').period(t1, t2).toFlatArray(true), this.g);
            }
            if (t1 != undefined) {
                return new LinkQuery(this.attr('inLinks').get(t1), this.g);
            }
            return new LinkQuery(this.attr('inLinks').toFlatArray(true), this.g);
        }
        outLinks(t1, t2) {
            if (t2 != undefined) {
                return new LinkQuery(this.attr('outLinks').period(t1, t2).toFlatArray(true), this.g);
            }
            if (t1 != undefined) {
                return new LinkQuery(this.attr('outLinks').get(t1), this.g);
            }
            return new LinkQuery(this.attr('outLinks').toFlatArray(true), this.g);
        }
        locations(t1, t2) {
            if (t2 != undefined) {
                return new LocationQuery(this.attr('locations').period(t1, t2).toArray(), this.g);
            }
            if (t1 != undefined) {
                return new LocationQuery([this.attr('locations').get(t1)], this.g);
            }
            return new LocationQuery(this.attr('locations').toArray(), this.g);
        }
        locationSerie(t1, t2) {
            var serie;
            if (t2 != undefined)
                serie = this.attr('locations').period(t1, t2);
            else if (t1 != undefined)
                serie = this.attr('locations').get(t1);
            else
                serie = this.attr('locations');
            serie = serie.serie;
            var serie2 = new ScalarTimeSeries();
            for (var t in serie) {
                serie2.set(this.g.time(parseInt(t)), this.g.location(serie[t]));
            }
            return serie2;
        }
        linksBetween(n) {
            var links = this.links().toArray();
            var finalLinks = [];
            var l;
            for (var i = 0; i < links.length; i++) {
                l = links[i];
                if (l.source == n || l.target == n)
                    finalLinks.push(l);
            }
            return new LinkQuery(finalLinks, this.g);
        }
    }
    exports.Node = Node;
    class Link extends BasicElement {
        constructor(id, graph) {
            super(id, 'link', graph);
        }
        linkType() { return this.attr('linkType'); }
        get source() { return this.g._nodes[this.attr('source')]; }
        get target() { return this.g._nodes[this.attr('target')]; }
        nodePair() { return this.g._nodePairs[this.attr('nodePair')]; }
        directed() { return this.attr('directed'); }
        other(n) {
            return this.source == n ? this.target : this.source;
        }
        weights(start, end) {
            if (start == undefined)
                return new NumberQuery(this.attr('weights').toArray());
            if (end == undefined)
                return new NumberQuery([this.attr('weights').get(start)]);
            return new NumberQuery(this.attr('weights').period(start, end).toArray());
        }
        presentIn(start, end) {
            var presence = this.weights(start, end).toArray();
            return presence.length > 0;
        }
        times() {
            return new TimeQuery(this.attr('presence'), this.g);
        }
    }
    exports.Link = Link;
    class NodePair extends BasicElement {
        constructor(id, graph) {
            super(id, 'nodePair', graph);
        }
        get source() { return this.g._nodes[this.attr('source')]; }
        get target() { return this.g._nodes[this.attr('target')]; }
        links() { return new LinkQuery(this.attr('links'), this.g); }
        nodeType() { return this.attr('nodeType'); }
        presentIn(start, end) {
            for (var i = 0; i < this.links.length; i++) {
                if (this.links[i].presentIn(start, end))
                    return true;
            }
            return false;
        }
    }
    exports.NodePair = NodePair;
    class Location extends BasicElement {
        constructor(id, graph) {
            super(id, 'location', graph);
        }
        label() { return this.attr('label') + ''; }
        longitude() { return this.attr('longitude'); }
        latitude() { return this.attr('latitude'); }
        x() { return this.attr('x'); }
        y() { return this.attr('y'); }
        z() { return this.attr('z'); }
        radius() { return this.attr('radius'); }
    }
    exports.Location = Location;
    class ScalarTimeSeries {
        constructor() {
            this.serie = {};
        }
        period(t1, t2) {
            var t1id = t1.id();
            var t2id = t2.id();
            var s = new ScalarTimeSeries();
            for (var prop in this.serie) {
                if (parseInt(prop) >= t1id
                    && parseInt(prop) <= t2id) {
                    s.serie[prop] = this.serie[prop];
                }
            }
            return s;
        }
        set(t, element) {
            this.serie[t.id()] = element;
        }
        get(t) {
            if (this.serie[t.id()] == undefined)
                return;
            return this.serie[t.id()];
        }
        size() {
            return this.toArray().length;
        }
        toArray(removeDuplicates) {
            if (removeDuplicates == undefined)
                removeDuplicates = false;
            var a = [];
            if (removeDuplicates) {
                for (var prop in this.serie) {
                    a.push(this.serie[prop]);
                }
            }
            else {
                for (var prop in this.serie) {
                    if (a.indexOf(this.serie[prop]) == -1)
                        a.push(this.serie[prop]);
                }
            }
            return a;
        }
    }
    exports.ScalarTimeSeries = ScalarTimeSeries;
    class ArrayTimeSeries {
        constructor() {
            this.serie = {};
        }
        period(t1, t2) {
            var t1id = t1.id();
            var t2id = t1.id();
            var s = new ArrayTimeSeries();
            for (var prop in this.serie) {
                if (parseInt(prop) >= t1id
                    && parseInt(prop) <= t1id) {
                    s.serie[prop] = this.serie[prop];
                }
            }
            return s;
        }
        add(t, element) {
            if (t == undefined) {
                return;
            }
            if (!this.serie[t._id])
                this.serie[t._id] = [];
            this.serie[t._id].push(element);
        }
        get(t) {
            return this.serie[t._id];
        }
        toArray() {
            var a = [];
            for (var prop in this.serie) {
                a.push(this.serie[prop]);
            }
            return a;
        }
        toFlatArray(removeDuplicates) {
            if (removeDuplicates == undefined)
                removeDuplicates = false;
            var a = [];
            for (var prop in this.serie) {
                for (var i = 0; i < this.serie[prop].length; i++) {
                    if (!removeDuplicates || (removeDuplicates && a.indexOf(this.serie[prop]) == -1)) {
                        a.push(this.serie[prop][i]);
                    }
                }
            }
            return a;
        }
    }
    exports.ArrayTimeSeries = ArrayTimeSeries;
    class Query {
        constructor(elements) {
            this._elements = [];
            if (elements) {
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i] != undefined)
                        this._elements.push(elements[i]);
                }
            }
        }
        addUnique(element) {
            if (this._elements.indexOf(element) == -1)
                this._elements.push(element);
        }
        add(element) {
            this._elements.push(element);
        }
        addAll(elements) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i] != undefined)
                    this._elements.push(elements[i]);
            }
        }
        addAllUnique(elements) {
            for (var i = 0; i < elements.length; i++) {
                this.addUnique(elements[i]);
            }
        }
        get length() {
            return this._elements.length;
        }
        ;
        size() { return this._elements.length; }
        ;
        ids() {
            return this._elements;
        }
        removeDuplicates() {
            var elements = this._elements.slice(0);
            this._elements = [];
            for (var i = 0; i < elements.length; i++) {
                if (this._elements.indexOf(elements[i]) == -1)
                    this._elements.push(elements[i]);
            }
            return this;
        }
        generic_intersection(q) {
            var intersection = [];
            for (var i = 0; i < this._elements.length; i++) {
                for (var j = 0; j < q._elements.length; j++) {
                    if (this._elements[i] == q._elements[j]) {
                        intersection.push(this._elements[i]);
                    }
                }
            }
            return new Query(intersection);
        }
    }
    exports.Query = Query;
    class NumberQuery extends Query {
        clone() {
            return this._elements.slice(0);
        }
        min() {
            var min = this._elements[0];
            for (var i = 1; i < this._elements.length; i++) {
                if (this._elements[i] != undefined)
                    min = Math.min(min, this._elements[i]);
            }
            return min;
        }
        max() {
            var max = this._elements[0];
            for (var i = 1; i < this._elements.length; i++) {
                if (this._elements[i] != undefined)
                    max = Math.max(max, this._elements[i]);
            }
            return max;
        }
        mean() {
            var v = 0;
            var count = 0;
            for (var i = 0; i < this._elements.length; i++) {
                if (typeof this._elements[i] == 'number') {
                    v += this._elements[i];
                    count++;
                }
            }
            return v / count;
        }
        sum() {
            var sum = 0;
            for (var i = 0; i < this._elements.length; i++) {
                if (typeof this._elements[i] == 'number') {
                    sum += this._elements[i];
                }
            }
            return sum;
        }
        toArray() {
            return this._elements.slice(0);
        }
        get(index) {
            return this._elements[index];
        }
        forEach(f) {
            for (var i = 0; i < this._elements.length; i++) {
                f(this._elements[i], i);
            }
            return this;
        }
    }
    exports.NumberQuery = NumberQuery;
    class StringQuery {
        constructor(elements) {
            if (elements)
                this._elements = elements.slice(0);
        }
        contains(element) {
            return this._elements.indexOf(element) > -1;
        }
        addUnique(element) {
            if (this._elements.indexOf(element) == -1)
                this._elements.push(element);
        }
        add(element) {
            this._elements.push(element);
        }
        addAll(elements) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i] != undefined)
                    this._elements.push(elements[i]);
            }
        }
        addAllUnique(elements) {
            for (var i = 0; i < elements.length; i++) {
                this.addUnique(elements[i]);
            }
        }
        get length() { return this._elements.length; }
        ;
        size() { return this._elements.length; }
        ;
        toArray() {
            return this._elements.slice(0);
        }
        forEach(f) {
            for (var i = 0; i < this._elements.length; i++) {
                f(this._elements[i], i);
            }
            return this;
        }
    }
    exports.StringQuery = StringQuery;
    class GraphElementQuery extends Query {
        constructor(elements, g) {
            super(elements);
            this.elementType = '';
            this.g = g;
        }
        generic_filter(filter) {
            var arr = [];
            for (var i = 0; i < this._elements.length; i++) {
                try {
                    if (filter(this.g.get(this.elementType, this._elements[i]))) {
                        arr.push(this._elements[i]);
                    }
                }
                catch (ex) {
                }
            }
            return arr;
        }
        generic_selected() {
            var arr = [];
            for (var i = 0; i < this._elements.length; i++) {
                if (this.g.get(this.elementType, this._elements[i]).isSelected()) {
                    arr.push(this._elements[i]);
                }
            }
            return arr;
        }
        generic_visible() {
            var arr = [];
            for (var i = 0; i < this._elements.length; i++) {
                if (this.g.get(this.elementType, this._elements[i]).isVisible()) {
                    arr.push(this._elements[i]);
                }
            }
            return arr;
        }
        generic_highlighted() {
            var arr = [];
            for (var i = 0; i < this._elements.length; i++) {
                if (this.g.get(this.elementType, this._elements[i]).isHighlighted()) {
                    arr.push(this._elements[i]);
                }
            }
            return arr;
        }
        generic_presentIn(start, end) {
            var arr = [];
            for (var i = 0; i < this._elements.length; i++) {
                if (this.g.get(this.elementType, this._elements[i]).presentIn(start, end)) {
                    arr.push(this._elements[i]);
                }
            }
            return arr;
        }
        generic_sort(attrName, asc) {
            if (this._elements.length == 0) {
                return this;
            }
            var array = this._elements.slice(0);
            array.sort((e1, e2) => {
                return utils_1.attributeSort(this.g.get(this.elementType, e1), this.g.get(this.elementType, e2), attrName, asc);
            });
            this._elements = array;
            return this;
        }
        generic_removeDuplicates() {
            var uniqueElements = [];
            for (var i = 0; i < this._elements.length; i++) {
                if (uniqueElements.indexOf(this._elements[i]) == -1)
                    uniqueElements.push(this._elements[i]);
            }
            this._elements = uniqueElements;
            return this;
        }
    }
    exports.GraphElementQuery = GraphElementQuery;
    class NodeQuery extends GraphElementQuery {
        constructor(elements, g) {
            super(elements, g);
            this.elementType = 'node';
            if (elements.length > 0 && elements[0] instanceof Node) {
                this._elements = [];
                for (var i = 0; i < elements.length; i++) {
                    this._elements.push(elements[i].id());
                }
            }
            else if (elements.length > 0 && typeof elements[0] == 'number') {
                this._elements = [];
                for (var i = 0; i < elements.length; i++) {
                    this._elements.push(elements[i]);
                }
            }
            this.elementType = 'node';
        }
        contains(n) {
            return this._elements.indexOf(n.id()) > -1;
        }
        highlighted() {
            return new NodeQuery(super.generic_highlighted(), this.g);
        }
        visible() {
            return new NodeQuery(super.generic_visible(), this.g);
        }
        selected() {
            return new NodeQuery(super.generic_selected(), this.g);
        }
        filter(filter) {
            return new NodeQuery(super.generic_filter(filter), this.g);
        }
        presentIn(t1, t2) {
            return new NodeQuery(super.generic_presentIn(t1, t2), this.g);
        }
        sort(attributeName, asc) {
            return super.generic_sort(attributeName, asc);
        }
        label() {
            var q = new StringQuery();
            for (var i = 0; i < this._elements.length; i++) {
                q.add('' + this.g.attr('label', this._elements[i], 'node'));
            }
            return q;
        }
        neighbors(t1, t2) {
            return new NodeQuery(getBulkAttributes('neighbors', this._elements, 'node', this.g, t1, t2), this.g);
        }
        links(t1, t2) {
            return new LinkQuery(getBulkAttributes('links', this._elements, 'node', this.g, t1, t2), this.g);
        }
        locations(t1, t2) {
            return new LocationQuery(getBulkAttributes('locations', this._elements, 'node', this.g, t1, t2), this.g);
        }
        nodeTypes() {
            var q = new StringQuery();
            for (var i = 0; i < this._elements.length; i++) {
                q.add(this.g.attr('nodeType', this._elements[i], 'node'));
            }
            return q;
        }
        get(i) { return this.g._nodes[this._elements[i]]; }
        last() { return this.g._nodes[this._elements[this._elements.length - 1]]; }
        toArray() {
            var a = [];
            for (var i = 0; i < this._elements.length; i++) {
                a.push(this.g._nodes[this._elements[i]]);
            }
            return a;
        }
        createAttribute(attrName, f) {
            if (this.g.nodeArrays[attrName] == undefined) {
                this.g.nodeArrays[attrName] = [];
                for (var i = 0; i < this.g._nodes.length; i++) {
                    this.g.nodeArrays[attrName].push();
                }
            }
            for (var i = 0; i < this._elements.length; i++) {
                this.g.nodeArrays[attrName][this._elements[i]] = f(this.g._nodes[this._elements[i]]);
            }
            return this;
        }
        intersection(q) {
            return new NodeQuery(this.generic_intersection(q)._elements, this.g);
        }
        removeDuplicates() {
            return new NodeQuery(this.generic_removeDuplicates()._elements, this.g);
        }
        forEach(f) {
            for (var i = 0; i < this._elements.length; i++) {
                f(this.g.node(this._elements[i]), i);
            }
            return this;
        }
    }
    exports.NodeQuery = NodeQuery;
    class LinkQuery extends GraphElementQuery {
        constructor(elements, g) {
            super(elements, g);
            this.elementType = 'link';
            if (elements.length > 0 && elements[0] instanceof Link) {
                this._elements = [];
                for (var i = 0; i < elements.length; i++) {
                    this._elements.push(elements[i].id());
                }
            }
            if (elements.length > 0 && typeof elements[0] == 'number') {
                this._elements = [];
                for (var i = 0; i < elements.length; i++) {
                    this._elements.push(elements[i]);
                }
            }
        }
        contains(l) {
            return this._elements.indexOf(l.id()) > -1;
        }
        highlighted() {
            return new LinkQuery(super.generic_highlighted(), this.g);
        }
        visible() {
            return new LinkQuery(super.generic_visible(), this.g);
        }
        selected() {
            return new LinkQuery(super.generic_selected(), this.g);
        }
        filter(filter) {
            return new LinkQuery(super.generic_filter(filter), this.g);
        }
        presentIn(t1, t2) {
            return new LinkQuery(super.generic_presentIn(t1, t2), this.g);
        }
        sort(attributeName) {
            return super.generic_sort(attributeName);
        }
        get(i) { return this.g._links[this._elements[i]]; }
        last() { return this.g._links[this._elements[this._elements.length - 1]]; }
        toArray() {
            var a = [];
            for (var i = 0; i < this._elements.length; i++) {
                a.push(this.g._links[this._elements[i]]);
            }
            return a;
        }
        weights(start, end) {
            var s = new NumberQuery();
            for (var i = 0; i < this._elements.length; i++) {
                s.addAll(this.g.link(i).weights(start, end).toArray());
            }
            return s;
        }
        createAttribute(attrName, f) {
            if (this.g.linkArrays[attrName] == undefined) {
                this.g.linkArrays[attrName] = [];
                for (var i = 0; i < this.g._links.length; i++) {
                    this.g.linkArrays[attrName].push();
                }
            }
            for (var i = 0; i < this._elements.length; i++) {
                this.g.linkArrays[attrName][this._elements[i]] = f(this.g._links[this._elements[i]]);
            }
            return this;
        }
        linkTypes() {
            var linkTypes = [];
            var s;
            for (var i = 0; i < this._elements.length; i++) {
                s = this.g.link(this._elements[i]).linkType();
                if (linkTypes.indexOf(s) == -1)
                    linkTypes.push(s);
            }
            return linkTypes;
        }
        sources() {
            var nodes = [];
            var link;
            for (var i = 0; i < this._elements.length; i++) {
                link = this.g.link(this._elements[i]);
                if (nodes.indexOf(link.source) == -1)
                    nodes.push(link.source.id());
            }
            return new NodeQuery(nodes, this.g);
        }
        targets() {
            var nodes = [];
            var link;
            for (var i = 0; i < this._elements.length; i++) {
                link = this.g.link(this._elements[i]);
                if (nodes.indexOf(link.target) == -1)
                    nodes.push(link.target.id());
            }
            return new NodeQuery(nodes, this.g);
        }
        intersection(q) {
            return new LinkQuery(this.generic_intersection(q)._elements, this.g);
        }
        removeDuplicates() {
            return new LinkQuery(this.generic_removeDuplicates()._elements, this.g);
        }
        forEach(f) {
            for (var i = 0; i < this._elements.length; i++) {
                f(this.g.link(this._elements[i]), i);
            }
            return this;
        }
    }
    exports.LinkQuery = LinkQuery;
    class NodePairQuery extends GraphElementQuery {
        constructor(elements, g) {
            super(elements, g);
            this.elementType = 'nodePair';
            this.elementType = 'nodePair';
            if (elements.length > 0 && elements[0] instanceof NodePair) {
                this._elements = [];
                for (var i = 0; i < elements.length; i++) {
                    this._elements.push(elements[i].id());
                }
            }
            if (elements.length > 0 && typeof elements[0] == 'number') {
                this._elements = [];
                for (var i = 0; i < elements.length; i++) {
                    this._elements.push(elements[i]);
                }
            }
        }
        contains(n) {
            return this._elements.indexOf(n.id()) > -1;
        }
        highlighted() {
            return new NodePairQuery(super.generic_highlighted(), this.g);
        }
        visible() {
            return new NodePairQuery(super.generic_visible(), this.g);
        }
        selected() {
            return new NodePairQuery(super.generic_selected(), this.g);
        }
        filter(filter) {
            return new NodePairQuery(super.generic_filter(filter), this.g);
        }
        presentIn(t1, t2) {
            return new NodePairQuery(super.generic_presentIn(t1, t2), this.g);
        }
        sort(attributeName) {
            return super.generic_sort(attributeName);
        }
        get(i) { return this.g._nodePairs[this._elements[i]]; }
        last() { return this.g._links[this._elements[this._elements.length - 1]]; }
        toArray() {
            var a = [];
            for (var i = 0; i < this._elements.length; i++) {
                a.push(this.g._nodePairs[this._elements[i]]);
            }
            return a;
        }
        createAttribute(attrName, f) {
            if (this.g.nodePairArrays[attrName] == undefined) {
                this.g.nodePairArrays[attrName] = [];
                for (var i = 0; i < this.g._nodePairs.length; i++) {
                    this.g.nodePairArrays[attrName].push();
                }
            }
            for (var i = 0; i < this._elements.length; i++) {
                this.g.nodePairArrays[attrName][this._elements[i]] = f(this.g._nodePairs[this._elements[i]]);
            }
            return this;
        }
        intersection(q) {
            return new NodePairQuery(this.generic_intersection(q)._elements, this.g);
        }
        removeDuplicates() {
            return new NodePairQuery(this.generic_removeDuplicates()._elements, this.g);
        }
        forEach(f) {
            for (var i = 0; i < this._elements.length; i++) {
                f(this.g.nodePair(this._elements[i]), i);
            }
            return this;
        }
    }
    exports.NodePairQuery = NodePairQuery;
    class TimeQuery extends GraphElementQuery {
        constructor(elements, g) {
            super(elements, g);
            this.elementType = 'time';
            this.elementType = 'time';
            if (elements.length > 0 && elements[0] instanceof Time) {
                this._elements = [];
                for (var i = 0; i < elements.length; i++) {
                    this._elements.push(elements[i].id());
                }
            }
            if (elements.length > 0 && typeof elements[0] == 'number') {
                this._elements = [];
                for (var i = 0; i < elements.length; i++) {
                    this._elements.push(elements[i]);
                }
            }
        }
        contains(t) {
            return this._elements.indexOf(t.id()) > -1;
        }
        highlighted() {
            return new TimeQuery(super.generic_highlighted(), this.g);
        }
        visible() {
            return new TimeQuery(super.generic_visible(), this.g);
        }
        selected() {
            return new TimeQuery(super.generic_selected(), this.g);
        }
        filter(filter) {
            return new TimeQuery(super.generic_filter(filter), this.g);
        }
        presentIn(t1, t2) {
            return new TimeQuery(super.generic_presentIn(t1, t2), this.g);
        }
        sort(attributeName) {
            return super.generic_sort(attributeName);
        }
        links() {
            var links = [];
            for (var i = 0; i < this._elements.length; i++) {
                links = links.concat(this.g.attr('links', this._elements[i], 'time'));
            }
            return new LinkQuery(links, this.g);
        }
        get(i) { return this.g._times[this._elements[i]]; }
        last() { return this.g._times[this._elements[this._elements.length - 1]]; }
        toArray() {
            var a = [];
            var allTimes = this.g._times;
            for (var i = 0; i < this._elements.length; i++) {
                a.push(allTimes[this._elements[i]]);
            }
            return a;
        }
        createAttribute(attrName, f) {
            if (this.g.timeArrays[attrName] == undefined) {
                this.g.timeArrays[attrName] = [];
                for (var i = 0; i < this.g._times.length; i++) {
                    this.g.timeArrays[attrName].push();
                }
            }
            for (var i = 0; i < this._elements.length; i++) {
                this.g.timeArrays[attrName][this._elements[i]] = f(this.g._times[this._elements[i]]);
            }
            return this;
        }
        unixTimes() {
            var unixTimes = [];
            for (var i = 0; i < this._elements.length; i++) {
                unixTimes.push(this.g.time(this._elements[i]).unixTime());
            }
            return unixTimes;
        }
        intersection(q) {
            return new TimeQuery(this.generic_intersection(q)._elements, this.g);
        }
        forEach(f) {
            for (var i = 0; i < this._elements.length; i++) {
                f(this.g.time(this._elements[i]), i);
            }
            return this;
        }
    }
    exports.TimeQuery = TimeQuery;
    class LocationQuery extends GraphElementQuery {
        constructor(elements, g) {
            super(elements, g);
            this.elementType = 'location';
            this.elementType = 'location';
            if (elements.length > 0 && elements[0] instanceof Location) {
                this._elements = [];
                for (var i = 0; i < elements.length; i++) {
                    this._elements = elements[i].id();
                }
            }
            if (elements.length > 0 && typeof elements[0] == 'number') {
                this._elements = [];
                for (var i = 0; i < elements.length; i++) {
                    this._elements.push(elements[i]);
                }
            }
        }
        contains(l) {
            return this._elements.indexOf(l.id()) > -1;
        }
        highlighted() {
            return new LocationQuery(super.generic_highlighted(), this.g);
        }
        visible() {
            return new LocationQuery(super.generic_visible(), this.g);
        }
        selected() {
            return new LocationQuery(super.generic_selected(), this.g);
        }
        filter(filter) {
            return new LocationQuery(super.generic_filter(filter), this.g);
        }
        presentIn(t1, t2) {
            return new LocationQuery(super.generic_presentIn(t1, t2), this.g);
        }
        sort(attributeName) {
            return super.generic_sort(attributeName);
        }
        get(i) { return this.g._locations[this._elements[i]]; }
        last() { return this.g._locations[this._elements[this._elements.length - 1]]; }
        toArray() {
            var a = [];
            for (var i = 0; i < this._elements.length; i++) {
                a.push(this.g._locations[this._elements[i]]);
            }
            return a;
        }
        createAttribute(attrName, f) {
            if (this.g.locationArrays[attrName] == undefined) {
                this.g.locationArrays[attrName] = [];
                for (var i = 0; i < this.g._locations.length; i++) {
                    this.g.locationArrays[attrName].push();
                }
            }
            for (var i = 0; i < this._elements.length; i++) {
                this.g.locationArrays[attrName][this._elements[i]] = f(this.g._locations[this._elements[i]]);
            }
            return this;
        }
        intersection(q) {
            return new LocationQuery(this.generic_intersection(q)._elements, this.g);
        }
        removeDuplicates() {
            return new LocationQuery(this.generic_removeDuplicates()._elements, this.g);
        }
        forEach(f) {
            for (var i = 0; i < this._elements.length; i++) {
                f(this.g.location(this._elements[i]), i);
            }
            return this;
        }
    }
    exports.LocationQuery = LocationQuery;
    function getBulkAttributes(attrName, ids, type, g, t1, t2) {
        var a = [];
        var temp;
        for (var i = 0; i < ids.length; i++) {
            if (t2 != undefined) {
                temp = g.attr(attrName, ids[i], type).period(t1, t2).toArray();
            }
            else if (t1 != undefined) {
                temp = [g.attr(attrName, ids[i], type).get(t1)];
            }
            else {
                temp = g.attr(attrName, ids[i], type).toArray();
            }
            for (var j = 0; j < temp.length; j++) {
                if (temp[j] instanceof Array) {
                    a = a.concat(temp[j]);
                }
                else {
                    if (a.indexOf(temp[j]) == -1)
                        a.push(temp[j]);
                }
            }
        }
        return a;
    }
    class Motif {
        constructor(nodes, links) {
            this.nodes = [];
            this.links = [];
            this.times = [];
            this.nodes = nodes.slice(0);
            this.links = links.slice(0);
        }
        print() {
            console.log('nodes:', this.nodes.length, 'links:', this.links.length);
        }
    }
    exports.Motif = Motif;
    class MotifTemplate {
        constructor(nodes, links) {
            this.nodes = [];
            this.links = [];
            this.nodes = nodes.slice(0);
            this.links = links.slice(0);
        }
    }
    exports.MotifTemplate = MotifTemplate;
    class MotifSequence {
        constructor() {
            this.motifs = [];
        }
        push(m) {
            this.motifs.push(m);
        }
    }
    exports.MotifSequence = MotifSequence;
});
define("classes/datamanager", ["require", "exports", "classes/dynamicgraph", "classes/utils", "lz-string"], function (require, exports, dynamicgraph_2, utils_2, LZString) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DataManager {
        constructor(options) {
            this.keepOnlyOneSession = false;
            this.sessionDataPrefix = "ncubesession";
            this.SEP = "_";
            if (options) {
                if (options.keepOnlyOneSession)
                    this.setOptions(options);
            }
            else {
                this.keepOnlyOneSession = false;
            }
        }
        setOptions(options) {
            this.keepOnlyOneSession = options.keepOnlyOneSession;
        }
        clearSessionData(session) {
            var searchPrefix = this.sessionDataPrefix + this.SEP + session;
            var keysToClear = [];
            console.log('clearSessionData');
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key.indexOf(searchPrefix) == 0)
                    keysToClear.push(key);
                else if (key.indexOf('connectoscope1') == 0)
                    keysToClear.push(key);
            }
            for (var i = 0; i < keysToClear.length; i++) {
                var key = keysToClear[i];
                console.log('remove from storage', key);
                localStorage.removeItem(key);
            }
        }
        clearAllSessionData() {
            this.clearSessionData('');
        }
        isSessionCached(session, dataSetName) {
            var prefix = this.sessionDataPrefix + this.SEP + session + this.SEP + dataSetName;
            var firstSessionKey = null;
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key.indexOf(prefix) == 0) {
                    return true;
                }
            }
            return false;
        }
        importData(session, data) {
            this.session = session;
            console.log('import data set', data.name, data);
            if (!data.nodeTable && !data.linkTable) {
                console.log('Empty tables. No data imported.');
                return;
            }
            if (!data.nodeTable) {
                console.log('[n3] Node table missing!');
            }
            if (!data.linkTable) {
                console.log('[n3] Link table missing!');
            }
            if (!data.nodeSchema) {
                console.log('[n3] Node schema missing!');
            }
            if (!data.linkSchema) {
                console.log('[n3] Link schema missing!');
            }
            for (var i = 0; i < data.nodeTable.length; i++) {
                for (var j = 0; j < data.nodeTable[i].length; j++) {
                    if (typeof data.nodeTable[i][j] == 'string')
                        data.nodeTable[i][j] = data.nodeTable[i][j].trim();
                }
            }
            for (var i = 0; i < data.linkTable.length; i++) {
                for (var j = 0; j < data.linkTable[i].length; j++) {
                    if (typeof data.linkTable[i][j] == 'string')
                        data.linkTable[i][j] = data.linkTable[i][j].trim();
                }
            }
            if (this.isSchemaWellDefined(data)) {
                console.log('data is well-schematized, caching dynamicGraph');
                if (this.keepOnlyOneSession)
                    this.clearAllSessionData();
                var graphForCaching = new dynamicgraph_2.DynamicGraph();
                graphForCaching.initDynamicGraph(data);
                graphForCaching.saveDynamicGraph(this);
                var doubleCheckSave = false;
                if (doubleCheckSave) {
                    var testGraph = new dynamicgraph_2.DynamicGraph();
                    testGraph.loadDynamicGraph(this, data.name);
                    testGraph.debugCompareTo(graphForCaching);
                }
            }
            else {
                console.log('data is not well-schematized, so not caching dynamicGraph');
            }
        }
        saveToStorage(dataName, valueName, value, replacer) {
            if (value == undefined) {
                console.log('attempting to save undefined value. aborting', dataName, valueName);
                return;
            }
            var stringifyResult = JSON.stringify(value, replacer);
            var stringToSave;
            if (stringifyResult.length > 1024 * 1024 * 4)
                stringToSave = LZString.compress(stringifyResult);
            else
                stringToSave = stringifyResult;
            localStorage[this.sessionDataPrefix + this.SEP
                + this.session
                + this.SEP + dataName
                + this.SEP + valueName] = stringToSave;
        }
        getFromStorage(dataName, valueName, reviver, state) {
            console.assert(this.session && this.session != '');
            var statefulReviver;
            if (reviver)
                statefulReviver = function (key, value) {
                    return reviver(key, value, state);
                };
            else
                statefulReviver = null;
            var storedResult = localStorage[this.sessionDataPrefix
                + this.SEP + this.session
                + this.SEP + dataName
                + this.SEP + valueName];
            if (storedResult && storedResult != "undefined") {
                var parseText;
                if ("\"'[{0123456789".indexOf(storedResult[0]) >= 0)
                    parseText = storedResult;
                else
                    parseText = LZString.decompress(storedResult);
                return JSON.parse(parseText, statefulReviver);
            }
            else {
                return undefined;
            }
        }
        removeFromStorage(dataName, valueName) {
            localStorage.removeItem(this.sessionDataPrefix
                + this.SEP + this.session
                + this.SEP + dataName
                + this.SEP + valueName);
        }
        getGraph(session, dataname) {
            this.session = session;
            if (!this.dynamicGraph || this.dynamicGraph.name != dataname) {
                this.dynamicGraph = new dynamicgraph_2.DynamicGraph();
                this.dynamicGraph.loadDynamicGraph(this, dataname);
            }
            return this.dynamicGraph;
        }
        isSchemaWellDefined(data) {
            console.log('isSchemaWellDefined');
            if (data.locationTable && !utils_2.isValidIndex(data.locationSchema.id))
                return false;
            if (data.nodeTable.length > 0 && !utils_2.isValidIndex(data.nodeSchema.id))
                return false;
            if (data.linkTable.length > 0
                && !(utils_2.isValidIndex(data.linkSchema.id)
                    && utils_2.isValidIndex(data.linkSchema.source)
                    && utils_2.isValidIndex(data.linkSchema.target)))
                return false;
            return true;
        }
    }
    exports.DataManager = DataManager;
    function getDefaultNodeSchema() {
        return new NodeSchema(0);
    }
    exports.getDefaultNodeSchema = getDefaultNodeSchema;
    function getDefaultLinkSchema() {
        return new LinkSchema(0, 1, 2);
    }
    exports.getDefaultLinkSchema = getDefaultLinkSchema;
    function getDefaultLocationSchema() {
        return new LocationSchema(0, 1, 2, 3, 4, 5, 6, 7, 8);
    }
    exports.getDefaultLocationSchema = getDefaultLocationSchema;
    class DataSet {
        constructor(params) {
            this.locationTable = [];
            this.selections = [];
            this.name = params.name;
            this.nodeTable = params.nodeTable;
            this.linkTable = params.linkTable;
            if (params.nodeSchema == undefined)
                this.nodeSchema = getDefaultNodeSchema();
            else
                this.nodeSchema = params.nodeSchema;
            if (params.linkSchema == undefined)
                this.linkSchema = getDefaultLinkSchema();
            else
                this.linkSchema = params.linkSchema;
            if (params.locationTable != undefined)
                this.locationTable = params.locationTable;
            if (params.locationSchema == undefined)
                this.locationSchema = getDefaultLocationSchema();
            else
                this.locationSchema = params.locationSchema;
            console.log('[n3] data set created', this);
        }
    }
    exports.DataSet = DataSet;
    class TableSchema {
        constructor(name) {
            this.name = name;
        }
    }
    exports.TableSchema = TableSchema;
    class NodeSchema extends TableSchema {
        constructor(id) {
            super('nodeSchema');
            this.id = id;
        }
    }
    exports.NodeSchema = NodeSchema;
    class LinkSchema extends TableSchema {
        constructor(id, source, target) {
            super('linkSchema');
            this.linkType = -1;
            this.directed = -1;
            this.time = -1;
            this.source = source;
            this.target = target;
            this.id = id;
        }
    }
    exports.LinkSchema = LinkSchema;
    class LocationSchema extends TableSchema {
        constructor(id, label, geoname, longitude, latitude, x, y, z, radius) {
            super('locationSchema');
            this.geoname = -1;
            this.longitude = -1;
            this.latitude = -1;
            this.x = -1;
            this.y = -1;
            this.z = -1;
            this.radius = -1;
            this.id = id;
            this.label = label;
            if (utils_2.isValidIndex(geoname))
                this.geoname = geoname;
            if (utils_2.isValidIndex(longitude))
                this.longitude = longitude;
            if (utils_2.isValidIndex(latitude))
                this.latitude = latitude;
            if (utils_2.isValidIndex(x))
                this.x = x;
            if (utils_2.isValidIndex(y))
                this.y = y;
            if (utils_2.isValidIndex(z))
                this.z = z;
            if (utils_2.isValidIndex(radius))
                this.radius = radius;
        }
    }
    exports.LocationSchema = LocationSchema;
});
define("classes/dynamicgraph", ["require", "exports", "classes/queries", "classes/utils", "moment"], function (require, exports, queries_2, utils_3, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GRANULARITY = ['millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'year', 'decade', 'century', 'millenium'];
    exports.DGRAPH_SUB = "[*dgraph*]";
    exports.DGRAPH_SER_VERBOSE_LOGGING = false;
    function dgraphReviver(dgraph, key, value) {
        if (value == exports.DGRAPH_SUB)
            return dgraph;
        else
            return value;
    }
    exports.dgraphReviver = dgraphReviver;
    function dgraphReplacer(key, value) {
        if (exports.DGRAPH_SER_VERBOSE_LOGGING) {
            console.log("dgraphReplacer", key, value);
        }
        if (value instanceof DynamicGraph) {
            console.log("dgraphReplacer found a DynamicGraph property", key);
            return exports.DGRAPH_SUB;
        }
        return value;
    }
    exports.dgraphReplacer = dgraphReplacer;
    class DynamicGraph {
        constructor() {
            this.selectionColor_pointer = 0;
            this.minWeight = 10000000;
            this.maxWeight = -10000000;
            this._nodes = [];
            this._links = [];
            this._nodePairs = [];
            this._locations = [];
            this._times = [];
            this.timeObjects = [];
            this.matrix = [];
            this.nodeArrays = new NodeArray();
            this.linkArrays = new LinkArray();
            this.nodePairArrays = new NodePairArray();
            this.timeArrays = new TimeArray();
            this.linkTypeArrays = new LinkTypeArray();
            this.nodeTypeArrays = new NodeTypeArray();
            this.locationArrays = new LocationArray();
            this.attributeArrays = {
                node: this.nodeArrays,
                link: this.linkArrays,
                time: this.timeArrays,
                nodePair: this.nodePairArrays,
                linkType: this.linkTypeArrays,
                nodeType: this.nodeTypeArrays,
                location: this.locationArrays
            };
            this.highlightArrays = new utils_3.IDCompound();
            this.currentSelection_id = 0;
            this.selections = [];
            this.gran_min_NAME = "gran_min";
            this.gran_max_NAME = "gran_max_NAME";
            this.minWeight_NAME = "minWeight_NAME";
            this.maxWeight_NAME = "maxWeight_NAME";
            this.matrix_NAME = "matrix_NAME";
            this.nodeArrays_NAME = "nodeArrays_NAME";
            this.linkArrays_NAME = "linkArrays_NAME";
            this.nodePairArrays_NAME = "nodePairArrays_NAME";
            this.timeArrays_NAME = "timeArrays_NAME";
            this.linkTypeArrays_NAME = "linkTypeArrays_NAME";
            this.nodeTypeArrays_NAME = "nodeTypeArrays_NAME";
            this.locationArrays_NAME = "locationArrays_NAME";
        }
        attr(field, id, type) {
            var r;
            try {
                r = this.attributeArrays[type][field][id];
            }
            catch (e) {
                r = undefined;
            }
            return r;
        }
        standardArrayReplacer(key, value) {
            if (value instanceof DynamicGraph) {
                console.log("standardReplacer found a DynamicGraph property", key);
                return exports.DGRAPH_SUB;
            }
            else if (key == 'selections')
                return undefined;
            return value;
        }
        static timeReviver(k, v, s) {
            if (k == '') {
                return utils_3.copyPropsShallow(v, new queries_2.Time(v.id, s));
            }
            else {
                return dgraphReviver(s, k, v);
            }
        }
        static nodeArrayReviver(k, v, s) {
            switch (k) {
                case '':
                    return utils_3.copyPropsShallow(v, new NodeArray());
                case 'outLinks':
                case 'inLinks':
                case 'links':
                    return utils_3.copyTimeSeries(v, function () { return new queries_2.ArrayTimeSeries(); });
                case 'outNeighbors':
                case 'inNeighbors':
                case 'neighbors':
                    return utils_3.copyTimeSeries(v, function () { return new queries_2.ArrayTimeSeries(); });
                case 'locations':
                    return utils_3.copyTimeSeries(v, function () { return new queries_2.ScalarTimeSeries(); });
                default:
                    return v;
            }
        }
        static linkArrayReviver(k, v, s) {
            switch (k) {
                case '':
                    return utils_3.copyPropsShallow(v, new LinkArray());
                case 'weights':
                    return utils_3.copyTimeSeries(v, function () { return new queries_2.ScalarTimeSeries(); });
                default:
                    return v;
            }
        }
        static nodePairArrayReviver(k, v, s) {
            switch (k) {
                case '':
                    return utils_3.copyPropsShallow(v, new NodePairArray());
                default:
                    return v;
            }
        }
        static timeArrayReviver(k, v, s) {
            switch (k) {
                case '':
                    return utils_3.copyPropsShallow(v, new TimeArray());
                case 'time':
                    var vAsArray = v;
                    return vAsArray.map(function (s, i) { return moment(s); });
                default:
                    return v;
            }
        }
        static linkTypeArrayReviver(k, v, s) {
            switch (k) {
                case '':
                    return utils_3.copyPropsShallow(v, new LinkTypeArray());
                default:
                    return v;
            }
        }
        static nodeTypeArrayReviver(k, v, s) {
            switch (k) {
                case '':
                    return utils_3.copyPropsShallow(v, new NodeTypeArray());
                default:
                    return v;
            }
        }
        static locationArrayReviver(k, v, s) {
            switch (k) {
                case '':
                    return utils_3.copyPropsShallow(v, new LocationArray());
                default:
                    return v;
            }
        }
        loadDynamicGraph(dataMgr, dataSetName) {
            this.clearSelections();
            this.name = dataSetName;
            var thisGraph = this;
            this.gran_min = dataMgr.getFromStorage(this.name, this.gran_min_NAME);
            console.log('this.gran_min', this.gran_min);
            this.gran_max = dataMgr.getFromStorage(this.name, this.gran_max_NAME);
            this.minWeight = dataMgr.getFromStorage(this.name, this.minWeight_NAME);
            this.maxWeight = dataMgr.getFromStorage(this.name, this.maxWeight_NAME);
            this.matrix = dataMgr.getFromStorage(this.name, this.matrix_NAME);
            this.nodeArrays = dataMgr.getFromStorage(this.name, this.nodeArrays_NAME, DynamicGraph.nodeArrayReviver);
            this.linkArrays = dataMgr.getFromStorage(this.name, this.linkArrays_NAME, DynamicGraph.linkArrayReviver);
            this.nodePairArrays = dataMgr.getFromStorage(this.name, this.nodePairArrays_NAME, DynamicGraph.nodePairArrayReviver);
            this.timeArrays = dataMgr.getFromStorage(this.name, this.timeArrays_NAME, DynamicGraph.timeArrayReviver);
            if (!('timeArrays' in this) || !this.timeArrays) {
                console.log('No timeArrays');
                this.timeArrays = new TimeArray();
            }
            else if ('momentTime' in this.timeArrays && 'unixTime' in this.timeArrays) {
                var ta = this.timeArrays['momentTime'];
                for (var i = 0; i < ta.length; i++) {
                    ta[i] = moment.utc(this.timeArrays['unixTime'][i]);
                }
            }
            else if ('unixTime' in this.timeArrays) {
                console.log('No time in timeArrays');
                this.timeArrays['momentTime'] = this.timeArrays['unixTime'].map(moment.utc);
            }
            else {
                console.log('No time or unixTime in timeArrays');
                this.timeArrays['momentTime'] = [];
            }
            this.linkTypeArrays = dataMgr.getFromStorage(this.name, this.linkTypeArrays_NAME, DynamicGraph.linkTypeArrayReviver);
            this.nodeTypeArrays = dataMgr.getFromStorage(this.name, this.nodeTypeArrays_NAME, DynamicGraph.nodeTypeArrayReviver);
            this.locationArrays = dataMgr.getFromStorage(this.name, this.locationArrays_NAME, DynamicGraph.locationArrayReviver);
            this.attributeArrays = {
                node: this.nodeArrays,
                link: this.linkArrays,
                time: this.timeArrays,
                nodePair: this.nodePairArrays,
                linkType: this.linkTypeArrays,
                nodeType: this.nodeTypeArrays,
                location: this.locationArrays
            };
            this.createGraphObjects(true, true);
            this.createSelections(true);
        }
        saveDynamicGraph(dataMgr) {
            dataMgr.saveToStorage(this.name, this.gran_min_NAME, this.gran_min);
            dataMgr.saveToStorage(this.name, this.gran_max_NAME, this.gran_max);
            dataMgr.saveToStorage(this.name, this.minWeight_NAME, this.minWeight);
            dataMgr.saveToStorage(this.name, this.maxWeight_NAME, this.maxWeight);
            dataMgr.saveToStorage(this.name, this.matrix_NAME, this.matrix);
            dataMgr.saveToStorage(this.name, this.nodeArrays_NAME, this.nodeArrays, this.standardArrayReplacer);
            dataMgr.saveToStorage(this.name, this.linkArrays_NAME, this.linkArrays, this.standardArrayReplacer);
            dataMgr.saveToStorage(this.name, this.nodePairArrays_NAME, this.nodePairArrays, this.standardArrayReplacer);
            dataMgr.saveToStorage(this.name, this.timeArrays_NAME, this.timeArrays, this.standardArrayReplacer);
            dataMgr.saveToStorage(this.name, this.linkTypeArrays_NAME, this.linkTypeArrays, this.standardArrayReplacer);
            dataMgr.saveToStorage(this.name, this.nodeTypeArrays_NAME, this.nodeTypeArrays, this.standardArrayReplacer);
            dataMgr.saveToStorage(this.name, this.locationArrays_NAME, this.locationArrays, this.standardArrayReplacer);
        }
        debugCompareTo(other) {
            var result = true;
            if (this.name != other.name) {
                console.log("name different");
                result = false;
            }
            if (this.gran_min != other.gran_min) {
                console.log("gran_min different", this.gran_min, other.gran_min);
                result = false;
            }
            if (this.gran_max != other.gran_max) {
                console.log("gran_max different", this.gran_max, other.gran_max);
                result = false;
            }
            if (this._nodes.length != other._nodes.length
                || !utils_3.compareTypesDeep(this._nodes, other._nodes, 2)) {
                console.log("nodes different");
                result = false;
            }
            if (this._links.length != other._links.length
                || !utils_3.compareTypesDeep(this._links, other._links, 2)) {
                console.log("links different");
                result = false;
            }
            if (this._nodePairs.length != other._nodePairs.length
                || !utils_3.compareTypesDeep(this._nodePairs, other._nodePairs, 2)) {
                console.log("nodePairs different");
                result = false;
            }
            if (this._locations.length != other._locations.length
                || !utils_3.compareTypesDeep(this._locations, other._locations, 2)) {
                console.log("locations different");
                result = false;
            }
            if (this._times.length != other._times.length
                || !utils_3.compareTypesDeep(this._times, other._times, 2)) {
                console.log("times different");
                result = false;
            }
            if ((this.nodeOrders && this.nodeOrders.length != other.nodeOrders.length)
                || !utils_3.compareTypesDeep(this.nodeOrders, other.nodeOrders, 2)) {
                console.log("nodeOrders different", this.nodeOrders, other.nodeOrders);
                result = false;
            }
            if (this.matrix.length != other.matrix.length
                || !utils_3.compareTypesDeep(this.matrix, other.matrix, 2)) {
                console.log("matrix different", this.matrix, other.matrix);
                result = false;
            }
            if (this.nodeArrays.length != other.nodeArrays.length
                || !utils_3.compareTypesDeep(this.nodeArrays, other.nodeArrays, 2)) {
                console.log("nodeArrays different", this.nodeArrays, other.nodeArrays);
                result = false;
            }
            if (this.linkArrays.length != other.linkArrays.length
                || !utils_3.compareTypesDeep(this.linkArrays, other.linkArrays, 2)) {
                console.log("linkArrays different", this.linkArrays, other.linkArrays);
                result = false;
            }
            if (this.nodePairArrays.length != other.nodePairArrays.length
                || !utils_3.compareTypesDeep(this.nodePairArrays, other.nodePairArrays, 2)) {
                console.log("nodePairArrays different", this.nodePairArrays, other.nodePairArrays);
                result = false;
            }
            if (this.timeArrays.length != other.timeArrays.length
                || !utils_3.compareTypesDeep(this.timeArrays, other.timeArrays, 2)) {
                console.log("timeArrays different", this.timeArrays, other.timeArrays);
                result = false;
            }
            if (this.linkTypeArrays.length != other.linkTypeArrays.length
                || !utils_3.compareTypesDeep(this.linkTypeArrays, other.linkTypeArrays, 2)) {
                console.log("linkTypeArrays different", this.linkTypeArrays, other.linkTypeArrays);
                result = false;
            }
            if (this.nodeTypeArrays.length != other.nodeTypeArrays.length
                || !utils_3.compareTypesDeep(this.nodeTypeArrays, other.nodeTypeArrays, 2)) {
                console.log("nodeTypeArrays different", this.nodeTypeArrays, other.nodeTypeArrays);
                result = false;
            }
            if (this.locationArrays.length != other.locationArrays.length
                || !utils_3.compareTypesDeep(this.locationArrays, other.locationArrays, 2)) {
                console.log("locationArrays different", this.locationArrays, other.locationArrays);
                result = false;
            }
            if (this.defaultLinkSelection.elementIds.length != other.defaultLinkSelection.elementIds.length
                || !utils_3.compareTypesDeep(this.defaultLinkSelection, other.defaultLinkSelection, 2)) {
                console.log("defaultLinkSelection different", this.defaultLinkSelection, other.defaultLinkSelection);
                result = false;
            }
            if (this.defaultNodeSelection.elementIds.length != other.defaultNodeSelection.elementIds.length
                || !utils_3.compareTypesDeep(this.defaultNodeSelection, other.defaultNodeSelection, 2)) {
                console.log("defaultNodeSelection different", this.defaultNodeSelection, other.defaultNodeSelection);
                result = false;
            }
            if (this.selections.length != other.selections.length
                || !utils_3.compareTypesDeep(this.selections, other.selections, 2)) {
                console.log("selections different", this.selections, other.selections);
                result = false;
            }
            return result;
        }
        initDynamicGraph(data) {
            this.clearSelections();
            console.log('[dynamicgraph.ts] Create dynamic graph for ', data.name, data);
            this.name = data.name;
            this.gran_min = 0;
            this.gran_max = 0;
            if (utils_3.isValidIndex(data.linkSchema.time)) {
                var timeLabels = [];
                var timeLabel;
                var unixTimes = [];
                var unixTime;
                for (var i = 0; i < data.linkTable.length; i++) {
                    timeLabel = data.linkTable[i][data.linkSchema.time];
                    unixTime = parseInt(moment(timeLabel, TIME_FORMAT).format('x'));
                    if (unixTime == undefined)
                        continue;
                    if (unixTimes.indexOf(unixTime) == -1) {
                        unixTimes.push(unixTime);
                    }
                }
                unixTimes.sort(utils_3.sortNumber);
                var diff = 99999999999999;
                for (var i = 0; i < unixTimes.length - 2; i++) {
                    diff = Math.min(diff, unixTimes[i + 1] - unixTimes[i]);
                }
                var diff_min = diff;
                if (diff >= 1000)
                    this.gran_min = 1;
                if (diff >= 1000 * 60)
                    this.gran_min = 2;
                if (diff >= 1000 * 60 * 60)
                    this.gran_min = 3;
                if (diff >= 1000 * 60 * 60 * 24)
                    this.gran_min = 4;
                if (diff >= 1000 * 60 * 60 * 24 * 7)
                    this.gran_min = 5;
                if (diff >= 1000 * 60 * 60 * 24 * 30)
                    this.gran_min = 6;
                if (diff >= 1000 * 60 * 60 * 24 * 30 * 12)
                    this.gran_min = 7;
                if (diff >= 1000 * 60 * 60 * 24 * 30 * 12 * 10)
                    this.gran_min = 8;
                if (diff >= 1000 * 60 * 60 * 24 * 30 * 12 * 100)
                    this.gran_min = 9;
                if (diff >= 1000 * 60 * 60 * 24 * 30 * 12 * 1000)
                    this.gran_min = 10;
                diff = unixTimes[unixTimes.length - 1] - unixTimes[0];
                this.gran_max = 0;
                if (diff >= 1000)
                    this.gran_max = 1;
                if (diff >= 1000 * 60)
                    this.gran_max = 2;
                if (diff >= 1000 * 60 * 60)
                    this.gran_max = 3;
                if (diff >= 1000 * 60 * 60 * 24)
                    this.gran_max = 4;
                if (diff >= 1000 * 60 * 60 * 24 * 7)
                    this.gran_max = 5;
                if (diff >= 1000 * 60 * 60 * 24 * 30)
                    this.gran_max = 6;
                if (diff >= 1000 * 60 * 60 * 24 * 30 * 12)
                    this.gran_max = 7;
                if (diff >= 1000 * 60 * 60 * 24 * 30 * 12 * 10)
                    this.gran_max = 8;
                if (diff >= 1000 * 60 * 60 * 24 * 30 * 12 * 100)
                    this.gran_max = 9;
                if (diff >= 1000 * 60 * 60 * 24 * 30 * 12 * 1000)
                    this.gran_max = 10;
                console.log('[Dynamic Graph] Minimal granularity', exports.GRANULARITY[this.gran_min]);
                console.log('[Dynamic Graph] Maximal granularity', exports.GRANULARITY[this.gran_max]);
                for (var i = 0; i < unixTimes.length; i++) {
                    this.timeArrays.id.push(i);
                    this.timeArrays.momentTime.push(moment(unixTimes[i]));
                    this.timeArrays.label.push(this.timeArrays.momentTime[i].format(TIME_FORMAT));
                    this.timeArrays.unixTime.push(unixTimes[i]);
                    this.timeArrays.selections.push([]);
                    this.timeArrays.filter.push(false);
                    this.timeArrays.links.push([]);
                    this._times.push(new queries_2.Time(i, this));
                }
                console.log('#TIMES:', this._times.length);
                console.log('   minTime', this.timeArrays.label[0]);
                console.log('   maxTime', this.timeArrays.label[this.timeArrays.length - 1]);
                for (var g = 0; g <= exports.GRANULARITY.length; g++) {
                    this.timeObjects.push([]);
                }
            }
            if (this.timeArrays.length == 0) {
                this.timeArrays.id.push(0);
                this.timeArrays.momentTime.push(moment(0));
                this.timeArrays.unixTime.push(0);
                this.timeArrays.selections.push([]);
                this.timeArrays.filter.push(false);
                this.timeArrays.links.push([]);
                this._times.push(new queries_2.Time(0, this));
            }
            var id_loc;
            var location;
            console.assert(!data.locationTable || utils_3.isValidIndex(data.locationSchema.id));
            if (data.locationTable) {
                for (var i = 0; i < data.locationTable.length; i++) {
                    this.locationArrays.id.push(data.locationTable[i][data.locationSchema.id]);
                    this.locationArrays.label.push(data.locationTable[i][data.locationSchema.label]);
                    this.locationArrays.longitude.push(data.locationTable[i][data.locationSchema.longitude]);
                    this.locationArrays.latitude.push(data.locationTable[i][data.locationSchema.latitude]);
                    this.locationArrays.x.push(data.locationTable[i][data.locationSchema.x]);
                    this.locationArrays.y.push(data.locationTable[i][data.locationSchema.y]);
                    this.locationArrays.z.push(data.locationTable[i][data.locationSchema.z]);
                    this.locationArrays.radius.push(data.locationTable[i][data.locationSchema.radius]);
                }
            }
            if ('id' in this.locationArrays)
                console.log('locations', this.locationArrays.id.length);
            var row;
            var nodeId_data;
            var nodeId_table;
            var attribute;
            var time;
            console.assert(data.nodeTable.length == 0 || utils_3.isValidIndex(data.nodeSchema.id), 'either there is no nodeTable data, or we have a schema for the nodetable');
            var nodeUserProperties = [];
            for (var prop in data.nodeSchema) {
                if (data.nodeSchema.hasOwnProperty(prop)
                    && prop != 'id'
                    && prop != 'label'
                    && prop != 'time'
                    && prop != 'name'
                    && prop != 'nodeType'
                    && prop != 'location'
                    && prop != 'constructor') {
                    nodeUserProperties.push(prop);
                    this.nodeArrays[prop] = [];
                }
            }
            for (var i = 0; i < data.nodeTable.length; i++) {
                row = data.nodeTable[i];
                nodeId_data = row[data.nodeSchema.id];
                nodeId_table = this.nodeArrays.id.indexOf(nodeId_data);
                if (nodeId_table == -1) {
                    nodeId_table = this.nodeArrays.id.length;
                    this.nodeArrays.id.push(nodeId_data);
                    this.nodeArrays.nodeType.push('');
                    this.nodeArrays.outLinks.push(new queries_2.ArrayTimeSeries());
                    this.nodeArrays.inLinks.push(new queries_2.ArrayTimeSeries());
                    this.nodeArrays.links.push(new queries_2.ArrayTimeSeries());
                    this.nodeArrays.outNeighbors.push(new queries_2.ArrayTimeSeries());
                    this.nodeArrays.inNeighbors.push(new queries_2.ArrayTimeSeries());
                    this.nodeArrays.neighbors.push(new queries_2.ArrayTimeSeries());
                    this.nodeArrays.selections.push([]);
                    this.nodeArrays.filter.push(false);
                    this.nodeArrays.locations.push(new queries_2.ScalarTimeSeries());
                    this.nodeArrays.attributes.push(new Object());
                    if (utils_3.isValidIndex(data.nodeSchema.label)) {
                        this.nodeArrays.label.push(row[data.nodeSchema.label]);
                    }
                    else {
                        this.nodeArrays.label.push(row[data.nodeSchema.id]);
                    }
                }
                if (utils_3.isValidIndex(data.nodeSchema.time)) {
                    timeLabel = row[data.nodeSchema.time];
                    if (timeLabel == undefined) {
                        time = this._times[0];
                    }
                    else {
                        time = this._times[this.getTimeIdForUnixTime(parseInt(moment(timeLabel, TIME_FORMAT).format('x')))];
                    }
                }
                else {
                    time = this._times[0];
                }
                if (time == undefined)
                    time = this._times[0];
                if (utils_3.isValidIndex(data.nodeSchema.location)) {
                    var locId = row[data.nodeSchema.location];
                    if (locId == null || locId == undefined)
                        continue;
                    this.nodeArrays.locations[nodeId_data].set(time, locId);
                }
                if (utils_3.isValidIndex(data.nodeSchema.nodeType)) {
                    typeName = data.nodeTable[i][data.nodeSchema.nodeType];
                    typeId = this.nodeTypeArrays.name.indexOf(typeName);
                    if (typeId < 0) {
                        typeId = this.nodeTypeArrays.length;
                        this.nodeTypeArrays.id.push(typeId);
                        this.nodeTypeArrays.name.push(typeName);
                    }
                    this.nodeArrays.nodeType[nodeId_table] = typeName;
                    data.nodeTable[i][data.nodeSchema.nodeType] = typeId;
                }
                for (var p = 0; p < nodeUserProperties.length; p++) {
                    prop = nodeUserProperties[p];
                    this.nodeArrays[prop].push(row[data.nodeSchema[prop]]);
                }
            }
            if ('id' in this.nodeArrays) {
                for (var i = 0; i < this.nodeArrays.id.length; i++) {
                    this.matrix.push(utils_3.array(undefined, this.nodeArrays.id.length));
                }
            }
            var s, t;
            var id;
            var timeId;
            var nodePairId;
            var linkId;
            var typeName;
            var typeId;
            var linkUserProperties = [];
            for (var prop in data.linkSchema) {
                if (data.linkSchema.hasOwnProperty(prop)
                    && prop != 'id'
                    && prop != 'linkType'
                    && prop != 'time'
                    && prop != 'name'
                    && prop != 'source'
                    && prop != 'target'
                    && prop != 'weight'
                    && prop != 'directed') {
                    linkUserProperties.push(prop);
                    this.linkArrays[prop] = [];
                }
            }
            console.log('linkUserProperties', linkUserProperties);
            console.assert(data.linkTable.length == 0 || (utils_3.isValidIndex(data.linkSchema.id)
                && utils_3.isValidIndex(data.linkSchema.source)
                && utils_3.isValidIndex(data.linkSchema.target)), 'either there are no links, or the linkschema is defined');
            for (var i = 0; i < data.linkTable.length; i++) {
                row = data.linkTable[i];
                linkId = row[data.linkSchema.id];
                this.linkArrays.directed.push(false);
                if (this.linkArrays.id.indexOf(linkId) == -1) {
                    this.linkArrays.id[linkId] = linkId;
                    this.linkArrays.source[linkId] = row[data.linkSchema.source];
                    this.linkArrays.target[linkId] = row[data.linkSchema.target];
                    this.linkArrays.linkType[linkId] = row[data.linkSchema.linkType];
                    this.linkArrays.directed[linkId] = row[data.linkSchema.directed];
                    this.linkArrays.weights[linkId] = new queries_2.ScalarTimeSeries();
                    this.linkArrays.presence[linkId] = [];
                    this.linkArrays.selections.push([]);
                    this.linkArrays.nodePair.push(undefined);
                    this.linkArrays.filter.push(false);
                }
                var TIME_FORMAT = 'YYYY-MM-DD hh:mm:ss';
                if (utils_3.isValidIndex(data.linkSchema.time)) {
                    timeLabel = data.linkTable[i][data.linkSchema.time];
                    unixTime = parseInt(moment(timeLabel, TIME_FORMAT).format('x'));
                    timeId = this.getTimeIdForUnixTime(unixTime);
                }
                else {
                    timeId = 0;
                }
                if (timeId == undefined)
                    timeId = 0;
                time = this._times[timeId];
                this.linkArrays.presence[linkId].push(timeId);
                if (utils_3.isValidIndex(data.linkSchema.weight) && data.linkTable[i][data.linkSchema.weight] != undefined) {
                    this.linkArrays.weights[linkId].set(time, data.linkTable[i][data.linkSchema.weight]);
                    this.minWeight = Math.min(this.minWeight, data.linkTable[i][data.linkSchema.weight]);
                    this.maxWeight = Math.max(this.maxWeight, data.linkTable[i][data.linkSchema.weight]);
                }
                else {
                    this.minWeight = 0;
                    this.maxWeight = 1;
                    this.linkArrays.weights[linkId].set(time, 1);
                }
                s = this.nodeArrays.id.indexOf(row[data.linkSchema.source]);
                t = this.nodeArrays.id.indexOf(row[data.linkSchema.target]);
                this.nodeArrays.neighbors[s].add(time, t);
                this.nodeArrays.neighbors[t].add(time, s);
                this.nodeArrays.links[s].add(time, linkId);
                this.nodeArrays.links[t].add(time, linkId);
                if (this.linkArrays.directed[i]) {
                    this.nodeArrays.outNeighbors[s].add(time, t);
                    this.nodeArrays.inNeighbors[t].add(time, s);
                    this.nodeArrays.outLinks[s].add(time, linkId);
                    this.nodeArrays.inLinks[t].add(time, linkId);
                }
                nodePairId = this.matrix[s][t];
                if (!utils_3.isValidIndex(nodePairId)) {
                    nodePairId = this.nodePairArrays.length;
                    this.matrix[s][t] = nodePairId;
                    this.nodePairArrays.id.push(nodePairId);
                    this.nodePairArrays.source.push(s);
                    this.nodePairArrays.target.push(t);
                    this.nodePairArrays.links.push([]);
                    this.nodePairArrays.selections.push([]);
                    this.nodePairArrays.filter.push(false);
                }
                if (this.nodePairArrays.links[nodePairId].indexOf(linkId) == -1) {
                    this.nodePairArrays.links[nodePairId].push(linkId);
                    this.linkArrays.nodePair[linkId] = nodePairId;
                }
                if (this.linkArrays.directed[i]) {
                    nodePairId = this.matrix[t][s];
                    if (!nodePairId) {
                        nodePairId = this.nodePairArrays.id.length;
                        this.matrix[t][s] = nodePairId;
                        this.nodePairArrays.id.push(nodePairId);
                        this.nodePairArrays.source.push(t);
                        this.nodePairArrays.target.push(s);
                        this.nodePairArrays.links.push(utils_3.doubleArray(this._times.length));
                    }
                    if (this.nodePairArrays.links[nodePairId].indexOf(linkId) == -1) {
                        this.nodePairArrays.links[nodePairId].push(linkId);
                        this.linkArrays.nodePair[linkId] = nodePairId;
                    }
                }
                if (utils_3.isValidIndex(data.linkSchema.linkType)) {
                    typeName = data.linkTable[i][data.linkSchema.linkType];
                    typeId = this.linkTypeArrays.name.indexOf(typeName);
                    if (typeId < 0) {
                        typeId = this.linkTypeArrays.length;
                        this.linkTypeArrays.id.push(typeId);
                        this.linkTypeArrays.name.push(typeName);
                    }
                    data.linkTable[i][data.linkSchema.linkType] = typeId;
                }
                for (var p = 0; p < linkUserProperties.length; p++) {
                    prop = linkUserProperties[p];
                    this.linkArrays[prop].push(row[data.linkSchema[prop]]);
                }
            }
            for (var i = 0; i < this.linkArrays.length; i++) {
                for (var j = 0; j < this.timeArrays.length; j++) {
                    if (this.linkArrays.weights[i].serie.hasOwnProperty(this.timeArrays.id[j].toString())) {
                        this.timeArrays.links[j].push(this.linkArrays.id[i]);
                    }
                }
            }
            var linkTypeCount = this.linkTypeArrays.length;
            console.log('[Dynamic Graph] Dynamic Graph created: ', this.nodeArrays.length);
            console.log('[Dynamic Graph]    - Nodes: ', this.nodeArrays.length);
            console.log('[Dynamic Graph]    - Edges: ', this.linkArrays.length);
            console.log('[Dynamic Graph]    - Times: ', this.timeArrays.length);
            console.log('[Dynamic Graph]    - Link types: ', this.linkTypeArrays.length);
            console.log('[Dynamic Graph]    - Node Pairs: ', this.nodePairArrays.length);
            console.log('>>>this.nodeArrays["neighbors"][0]', this.nodeArrays['neighbors'][0]);
            this.createGraphObjects(true, true);
            this.createSelections(false);
        }
        createSelections(shouldCreateArrays) {
            if (shouldCreateArrays) {
                if (!('nodeArrays' in this && this.nodeArrays)) {
                    this.nodeArrays = new NodeArray();
                    this.linkArrays = new LinkArray();
                    this.timeArrays = new TimeArray();
                    this.nodePairArrays = new NodePairArray();
                }
                this.nodeArrays.selections = new Array(this.nodeArrays.length);
                for (var i = 0; i < this.nodeArrays.selections.length; i++) {
                    this.nodeArrays.selections[i] = [];
                }
                this.linkArrays.selections = new Array(this.linkArrays.length);
                for (var i = 0; i < this.linkArrays.selections.length; i++) {
                    this.linkArrays.selections[i] = [];
                }
                this.timeArrays.selections = new Array(this.timeArrays.length);
                for (var i = 0; i < this.timeArrays.selections.length; i++) {
                    this.timeArrays.selections[i] = [];
                }
                this.nodePairArrays.selections = new Array(this.nodePairArrays.length);
                for (var i = 0; i < this.nodePairArrays.selections.length; i++) {
                    this.nodePairArrays.selections[i] = [];
                }
            }
            this.defaultNodeSelection = this.createSelection('node');
            this.defaultNodeSelection.name = 'Unselected';
            for (var i = 0; i < this._nodes.length; i++) {
                this.defaultNodeSelection.elementIds.push(i);
                this.addToAttributeArraysSelection(this.defaultNodeSelection, 'node', this._nodes[i].id());
            }
            this.defaultNodeSelection.color = '#000000';
            this.defaultNodeSelection.showColor = false;
            this.defaultNodeSelection.priority = 10000;
            this.selectionColor_pointer--;
            this.defaultLinkSelection = this.createSelection('link');
            this.defaultLinkSelection.name = 'Unselected';
            for (var i = 0; i < this._links.length; i++) {
                this.defaultLinkSelection.elementIds.push(i);
                this.addToAttributeArraysSelection(this.defaultLinkSelection, 'link', this._links[i].id());
            }
            this.defaultLinkSelection.color = '#000000';
            this.defaultLinkSelection.showColor = false;
            this.defaultLinkSelection.priority = 10000;
            this.selectionColor_pointer--;
            var types = [];
            var type, index;
            var selection;
            var nodeSelections = [];
            for (var i = 0; i < this.nodeArrays.nodeType.length; i++) {
                type = this.nodeArrays.nodeType[i];
                if (type == undefined || type.length == 0 || type == 'undefined')
                    continue;
                index = types.indexOf(type);
                if (index == -1) {
                    selection = this.createSelection('node');
                    selection.name = type;
                    nodeSelections.push(selection);
                    types.push(type);
                }
                else {
                    selection = nodeSelections[index];
                }
                this.addElementToSelection(selection, this._nodes[i]);
            }
            if (nodeSelections.length == 1) {
                console.log('nodeSelections[0]:', nodeSelections[0]);
                nodeSelections[0].color = '#444';
            }
            types = [];
            var linkSelections = [];
            for (var i = 0; i < this.linkArrays.linkType.length; i++) {
                type = this.linkArrays.linkType[i];
                if (!type || type == 'undefined')
                    continue;
                index = types.indexOf(type);
                if (index == -1) {
                    selection = this.createSelection('link');
                    selection.name = type;
                    linkSelections.push(selection);
                    types.push(type);
                }
                else {
                    selection = linkSelections[index];
                }
                this.addElementToSelection(selection, this._links[i]);
            }
            if (linkSelections.length == 1)
                linkSelections[0].color = '#444';
            this.currentSelection_id = 0;
        }
        createGraphObjects(shouldCreateTimes, shouldCreateLinkTypes) {
            console.log('[DynamicNetwork:createGraph()] >>> ');
            var d = Date.now();
            if (this.locationArrays && 'id' in this.locationArrays) {
                for (var i = 0; i < this.locationArrays.id.length; i++) {
                    this._locations.push(new queries_2.Location(this.locationArrays.id[i], this));
                }
            }
            else {
                this.locationArrays = new LocationArray();
            }
            var nodes = [];
            var locations;
            if ('nodeArrays' in this && this.nodeArrays) {
                for (var i = 0; i < this.nodeArrays.id.length; i++) {
                    nodes.push(new queries_2.Node(i, this));
                }
            }
            var links = [];
            var link;
            var source, target;
            if ('linkArrays' in this && this.linkArrays) {
                for (var i = 0; i < this.linkArrays.source.length; i++) {
                    link = new queries_2.Link(i, this);
                    links.push(link);
                }
            }
            var s, t;
            var pairLinks;
            var pair;
            var pairLinkId;
            var thisGraphNodePairIds = [];
            if ('nodePairArrays' in this && this.nodePairArrays) {
                for (var i = 0; i < this.nodePairArrays.length; i++) {
                    pairLinks = this.nodePairArrays.links[i];
                    this._nodePairs.push(new queries_2.NodePair(i, this));
                }
            }
            this._nodes = nodes;
            this._links = links;
            if (shouldCreateTimes) {
                this._times = [];
                for (var i = 0; i < this.timeArrays.length; i++)
                    this._times.push(new queries_2.Time(i, this));
            }
            console.log('[DynamicNetwork:getGraph()] <<< ', Date.now() - d, 'msec');
        }
        nodeAttr(attr, id) {
            return this.attr(attr, id, 'node');
        }
        linkAttr(attr, id) {
            return this.attr(attr, id, 'link');
        }
        pairAttr(attr, id) {
            return this.attr(attr, id, 'nodePair');
        }
        timeAttr(attr, id) {
            return this.attr(attr, id, 'time');
        }
        get startTime() { return this._times[0]; }
        get endTime() { return this._times[this._times.length - 1]; }
        highlight(action, idCompound) {
            if (action == 'reset') {
                this.highlightArrays.nodeIds = [];
                this.highlightArrays.linkIds = [];
                this.highlightArrays.nodePairIds = [];
                this.highlightArrays.timeIds = [];
                return;
            }
            if (!idCompound) {
                console.error('[DynamicGraph] highlight: idCompound not set!');
                return;
            }
            if (action == 'set') {
                this.highlight('reset');
                this.highlight('add', idCompound);
                return;
            }
            if (action == 'add') {
                for (var type in idCompound) {
                    for (var i = 0; i < idCompound[type].length; i++) {
                        this.highlightArrays[type].push(idCompound[type][i]);
                    }
                }
            }
            else if (action == 'remove') {
                var index;
                for (var type in idCompound) {
                    for (var i = 0; i < idCompound[type].length; i++) {
                        index = this.highlightArrays[type].indexOf(idCompound[type][i]);
                        if (index >= 0)
                            this.highlightArrays[type].splice(index, 1);
                    }
                }
            }
        }
        selection(action, idCompound, selectionId) {
            if (selectionId == undefined)
                selectionId = this.currentSelection_id;
            var selection = this.getSelection(selectionId);
            if (!selection)
                console.error('[DynamicGraph] Selection with ', selectionId, 'not found in ', this.selections);
            var self = this;
            if (action == 'set') {
                var c = new utils_3.IDCompound();
                c[selection.acceptedType] = selection.elementIds;
                this.selection('remove', c, selectionId);
                this.selection('add', idCompound, selectionId);
            }
            else if (action == 'add') {
                idCompound.linkIds.forEach((v, i, arr) => self.addToSelectionByTypeAndId(selection, 'link', v));
                idCompound.nodeIds.forEach((v, i, arr) => self.addToSelectionByTypeAndId(selection, 'node', v));
                idCompound.timeIds.forEach((v, i, arr) => self.addToSelectionByTypeAndId(selection, 'time', v));
                idCompound.nodePairIds.forEach((v, i, arr) => self.addToSelectionByTypeAndId(selection, 'nodePair', v));
            }
            else if (action == 'remove') {
                idCompound.linkIds.forEach((v, i, arr) => self.removeFromSelectionByTypeAndId(selection, 'link', v));
                idCompound.nodeIds.forEach((v, i, arr) => self.removeFromSelectionByTypeAndId(selection, 'node', v));
                idCompound.timeIds.forEach((v, i, arr) => self.removeFromSelectionByTypeAndId(selection, 'time', v));
                idCompound.nodePairIds.forEach((v, i, arr) => self.removeFromSelectionByTypeAndId(selection, 'nodePair', v));
            }
        }
        addToAttributeArraysSelection(selection, type, id) {
            var elementSelections = this.attributeArrays[type].selections[id];
            for (var i = 0; i < elementSelections.length; i++) {
                if (elementSelections[i].priority > selection.priority) {
                    this.attributeArrays[type].selections[id].splice(i, 0, selection);
                    return;
                }
            }
            this.attributeArrays[type].selections[id].push(selection);
        }
        removeFromAttributeArraysSelection(selection, type, id) {
            var arr = this.attributeArrays[type].selections[id];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == selection)
                    this.attributeArrays[type].selections[id].splice(i, 1);
            }
        }
        addElementToSelection(selection, e) {
            this.addToSelectionByTypeAndId(selection, e.type, e.id());
        }
        addToSelectionByTypeAndId(selection, type, id) {
            if (type != selection.acceptedType) {
                console.log('attempting to put object of the wrong type into a selection');
                return;
            }
            selection.elementIds.push(id);
            this.addToAttributeArraysSelection(selection, type, id);
            var i;
            if (type == 'node') {
                i = this.defaultNodeSelection.elementIds.indexOf(id);
                if (i > -1) {
                    this.removeFromAttributeArraysSelection(this.defaultNodeSelection, type, id);
                    this.defaultNodeSelection.elementIds.splice(i, 1);
                }
            }
            else if (type == 'link') {
                i = this.defaultLinkSelection.elementIds.indexOf(id);
                if (i > -1) {
                    this.removeFromAttributeArraysSelection(this.defaultLinkSelection, type, id);
                    this.defaultLinkSelection.elementIds.splice(i, 1);
                }
            }
        }
        removeElementFromSelection(selection, e) {
            this.removeFromSelectionByTypeAndId(selection, e.type, e.id());
        }
        removeFromSelectionByTypeAndId(selection, type, id) {
            var i = selection.elementIds.indexOf(id);
            if (i == -1)
                return;
            selection.elementIds.splice(i, 1);
            this.removeFromAttributeArraysSelection(selection, type, id);
            if (this.getSelectionsByTypeAndId(type, id).length == 0) {
                if (type == 'node') {
                    this.defaultNodeSelection.elementIds.push(id);
                    this.addToAttributeArraysSelection(this.defaultNodeSelection, type, id);
                }
                else if (type == 'link') {
                    this.defaultLinkSelection.elementIds.push(id);
                    this.addToAttributeArraysSelection(this.defaultLinkSelection, type, id);
                }
            }
        }
        getSelectionsByTypeAndId(type, id) {
            return this.attributeArrays[type].selections[id];
        }
        filterSelection(selectionId, filter) {
            this.getSelection(selectionId).filter = filter;
        }
        isFiltered(id, type) {
            return this.attributeArrays[type + 's'].filter;
        }
        isHighlighted(id, type) {
            return this.highlightArrays[type + 'Ids'].indexOf(id) > -1;
        }
        getHighlightedIds(type) {
            return this.highlightArrays[type + 'Ids'];
        }
        setCurrentSelection(id) {
            console.log('[DynamicGraph] setCurrentSelectionId ', id);
            this.currentSelection_id = id;
        }
        getCurrentSelection() {
            return this.getSelection(this.currentSelection_id);
        }
        addSelection(id, color, acceptedType, priority) {
            var s = this.createSelection(acceptedType);
            s.id = id;
            s.color = color;
            s.priority = priority;
        }
        createSelection(type) {
            var s = new Selection(this.selections.length, type);
            s.color = this.BOOKMARK_COLORS(this.selectionColor_pointer % 10);
            this.selectionColor_pointer++;
            this.selections.push(s);
            return s;
        }
        deleteSelection(selectionId) {
            var s = this.getSelection(selectionId);
            var idCompound = new utils_3.IDCompound();
            idCompound[s.acceptedType + 'Ids'] = s.elementIds.slice(0);
            console.log('Delete selection->remove elemeents', s.elementIds.slice(0));
            this.selection('remove', idCompound, s.id);
            this.selections.splice(this.selections.indexOf(s), 1);
        }
        setSelectionColor(id, color) {
            var s = this.getSelection(id);
            if (!s) {
                return;
            }
            s.color = color;
        }
        getSelections(type) {
            var selections = [];
            if (type) {
                for (var i = 0; i < this.selections.length; i++) {
                    if (this.selections[i].acceptsType(type))
                        selections.push(this.selections[i]);
                }
                return selections;
            }
            else {
                return this.selections;
            }
        }
        getSelection(id) {
            for (var i = 0; i < this.selections.length; i++) {
                if (id == this.selections[i].id)
                    return this.selections[i];
            }
            console.error('[DynamicGraph] No selection with id ', id, 'found!');
        }
        clearSelections() {
            this.selections = [];
        }
        getTimeIdForUnixTime(unixTime) {
            var timeId;
            for (timeId = 0; timeId < this.timeArrays.length; timeId++) {
                if (unixTime == this.timeArrays.unixTime[timeId]) {
                    timeId;
                    return timeId;
                }
            }
            console.error('Time object for unix time', unixTime, 'not found!');
            return undefined;
        }
        addNodeOrdering(name, order) {
            for (var i = 0; i < this.nodeOrders.length; i++) {
                if (this.nodeOrders[i].name == name) {
                    console.error('Ordering', name, 'already exists');
                    return;
                }
            }
            var o = new Ordering(name, order);
            this.nodeOrders.push(o);
        }
        setNodeOrdering(name, order) {
            for (var i = 0; i < this.nodeOrders.length; i++) {
                if (this.nodeOrders[i].name == name) {
                    this.nodeOrders[i].order = order;
                    return;
                }
            }
            console.error('Ordering', name, 'does not exist');
        }
        removeNodeOrdering(name, order) {
            for (var i = 0; i < this.nodeOrders.length; i++) {
                if (this.nodeOrders[i].name == name) {
                    this.nodeOrders.splice(i, 1);
                }
            }
        }
        getNodeOrder(name) {
            for (var i = 0; i < this.nodeOrders.length; i++) {
                if (this.nodeOrders[i].name == name) {
                    return this.nodeOrders[i];
                }
            }
            console.error('Ordering', name, 'not found!');
            return;
        }
        nodes() {
            return new queries_2.NodeQuery(this.nodeArrays.id, this);
        }
        links() {
            return new queries_2.LinkQuery(this.linkArrays.id, this);
        }
        times() {
            return new queries_2.TimeQuery(this.timeArrays.id, this);
        }
        locations() {
            return new queries_2.LocationQuery(this.locationArrays.id, this);
        }
        nodePairs() {
            return new queries_2.NodePairQuery(this.nodePairArrays.id, this);
        }
        linksBetween(n1, n2) {
            var nodePairId = this.matrix[n1.id()][n2.id()];
            if (nodePairId == undefined)
                nodePairId = this.matrix[n2.id()][n1.id()];
            if (nodePairId == undefined)
                return new queries_2.LinkQuery([], this);
            return new queries_2.LinkQuery(this.nodePair(nodePairId).links().toArray(), this);
        }
        get(type, id) {
            if (type.indexOf('nodePair') > -1)
                return this.nodePair(id);
            if (type.indexOf('node') > -1)
                return this.node(id);
            if (type.indexOf('link') > -1)
                return this.link(id);
            if (type.indexOf('time') > -1)
                return this.time(id);
            if (type.indexOf('locations') > -1)
                return this.location(id);
        }
        getAll(type) {
            if (type == 'nodes')
                return this.nodes();
            if (type == 'links')
                return this.links();
            if (type == 'times')
                return this.times();
            if (type == 'nodePairs')
                return this.nodePairs();
            if (type == 'locations')
                return this.locations();
        }
        node(id) {
            for (var i = 0; i < this._nodes.length; i++) {
                if (this._nodes[i].id() == id)
                    return this._nodes[i];
            }
        }
        link(id) {
            for (var i = 0; i < this._links.length; i++) {
                if (this._links[i].id() == id)
                    return this._links[i];
            }
        }
        time(id) {
            for (var i = 0; i < this._times.length; i++) {
                if (this._times[i].id() == id)
                    return this._times[i];
            }
        }
        location(id) {
            for (var i = 0; i < this._locations.length; i++) {
                if (this._locations[i].id() == id)
                    return this._locations[i];
            }
        }
        nodePair(id) {
            for (var i = 0; i < this._nodePairs.length; i++) {
                if (this._nodePairs[i].id() == id)
                    return this._nodePairs[i];
            }
        }
        getMinGranularity() { return this.gran_min; }
        getMaxGranularity() { return this.gran_max; }
    }
    exports.DynamicGraph = DynamicGraph;
    class Selection {
        constructor(id, acceptedType) {
            this.showColor = true;
            this.filter = false;
            this.priority = 0;
            this.id = id;
            this.name = 'Selection-' + this.id;
            this.elementIds = [];
            this.acceptedType = acceptedType;
            this.priority = id;
        }
        acceptsType(type) {
            return this.acceptedType == type;
        }
    }
    exports.Selection = Selection;
    class AttributeArray {
        constructor() {
            this.id = [];
        }
        get length() {
            return this.id.length;
        }
    }
    exports.AttributeArray = AttributeArray;
    class NodeArray extends AttributeArray {
        constructor() {
            super(...arguments);
            this.id = [];
            this.label = [];
            this.outLinks = [];
            this.inLinks = [];
            this.links = [];
            this.outNeighbors = [];
            this.inNeighbors = [];
            this.neighbors = [];
            this.selections = [];
            this.attributes = [];
            this.locations = [];
            this.filter = [];
            this.nodeType = [];
        }
    }
    exports.NodeArray = NodeArray;
    class LinkArray extends AttributeArray {
        constructor() {
            super(...arguments);
            this.source = [];
            this.target = [];
            this.linkType = [];
            this.directed = [];
            this.nodePair = [];
            this.presence = [];
            this.weights = [];
            this.selections = [];
            this.filter = [];
            this.attributes = new Object;
        }
    }
    exports.LinkArray = LinkArray;
    class NodePairArray extends AttributeArray {
        constructor() {
            super(...arguments);
            this.source = [];
            this.target = [];
            this.links = [];
            this.selections = [];
            this.filter = [];
        }
    }
    exports.NodePairArray = NodePairArray;
    class TimeArray extends AttributeArray {
        constructor() {
            super(...arguments);
            this.id = [];
            this.momentTime = [];
            this.label = [];
            this.unixTime = [];
            this.selections = [];
            this.filter = [];
            this.links = [];
        }
    }
    exports.TimeArray = TimeArray;
    class LinkTypeArray extends AttributeArray {
        constructor() {
            super(...arguments);
            this.name = [];
            this.count = [];
            this.color = [];
            this.filter = [];
        }
    }
    exports.LinkTypeArray = LinkTypeArray;
    class NodeTypeArray extends AttributeArray {
        constructor() {
            super(...arguments);
            this.name = [];
            this.count = [];
            this.color = [];
            this.filter = [];
        }
    }
    exports.NodeTypeArray = NodeTypeArray;
    class LocationArray extends AttributeArray {
        constructor() {
            super(...arguments);
            this.id = [];
            this.label = [];
            this.longitude = [];
            this.latitude = [];
            this.x = [];
            this.y = [];
            this.z = [];
            this.radius = [];
        }
    }
    exports.LocationArray = LocationArray;
    class LinkType {
        constructor(id, name, color) {
            this.id = id;
            this.name = name;
            this.color = color;
        }
    }
    exports.LinkType = LinkType;
    class NodeType {
        constructor(id, name, color) {
            this.id = id;
            this.name = name;
            this.color = color;
        }
    }
    exports.NodeType = NodeType;
    class Ordering {
        constructor(name, order) {
            this.order = [];
            this.name = name;
            this.order = order;
        }
    }
    exports.Ordering = Ordering;
});
define("classes/analytics", ["require", "exports", "classes/queries"], function (require, exports, queries_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function findDegree(nodes) {
        var motifs = [];
        var ns;
        var ls;
        var finalLinks;
        var n;
        for (var i = 0; i < nodes.length; i++) {
            n = nodes[i];
            ns = n.neighbors().removeDuplicates().toArray().concat(n);
            ls = n.links().removeDuplicates().toArray();
            motifs.push(new queries_3.Motif(ns, ls));
        }
        return motifs;
    }
    exports.findDegree = findDegree;
});
define("classes/colors", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.schema1 = [
        '#775566',
        '#6688bb',
        '#556677',
        '#88aa88',
        '#88bb33',
        '#cc7744',
        '#003366',
        '#994422',
        '#331111'
    ];
    exports.schema2 = [
        '#44B3C2',
        '#F1A94E',
        '#E45641',
        '#5D4C46',
        '#7B8D8E',
        '#2ca02c',
        '#003366',
        '#9467bd',
        '#bcbd22',
        '#e377c2'
    ];
    exports.schema3 = [
        '#001166',
        '#0055aa',
        '#1199cc',
        '#99ccdd',
        '#002222',
        '#ddffff',
        '#446655',
        '#779988',
        '#115522'
    ];
    exports.schema4 = [
        '#1f77b4',
        '#ff7f0e',
        '#2ca02c',
        '#d62728',
        '#9467bd',
        '#8c564b',
        '#e377c2',
        '#7f7f7f',
        '#bcbd22',
        '#17becf'
    ];
    exports.schema5 = [
        '#1f77b4',
        '#aec7e8',
        '#ff7f0e',
        '#ffbb78',
        '#2ca02c',
        '#98df8a',
        '#d62728',
        '#ff9896',
        '#9467bd',
        '#c5b0d5',
        '#8c564b',
        '#c49c94',
        '#e377c2',
        '#f7b6d2',
        '#7f7f7f',
        '#c7c7c7',
        '#bcbd22',
        '#dbdb8d',
        '#17becf',
        '#9edae5'
    ];
    exports.schema6 = [
        '#a6cee3',
        '#1f78b4',
        '#b2df8a',
        '#33a02c',
        '#fb9a99',
        '#e31a1c',
        '#fdbf6f',
        '#ff7f00',
        '#cab2d6',
        '#6a3d9a',
        '#ffff99',
        '#b15928'
    ];
});
define("classes/main", ["require", "exports", "classes/utils", "classes/datamanager", "swiftset"], function (require, exports, utils_4, datamanager_1, setOps) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TIME_FORMAT = 'YYYY-MM-DD hh:mm:ss';
    function timeFormat() {
        return exports.TIME_FORMAT;
    }
    exports.timeFormat = timeFormat;
    var dataManager = new datamanager_1.DataManager();
    var session;
    function getSessionId() {
        return session;
    }
    exports.getSessionId = getSessionId;
    function setDataManagerOptions(options) {
        dataManager.setOptions(options);
    }
    exports.setDataManagerOptions = setDataManagerOptions;
    function isSessionCached(session, dataSetName) {
        return dataManager.isSessionCached(session, dataSetName);
    }
    exports.isSessionCached = isSessionCached;
    function importData(sessionName, data) {
        console.log('[n3] Import data', data.name);
        session = sessionName;
        dataManager.importData(sessionName, data);
    }
    exports.importData = importData;
    function clearAllDataManagerSessionCaches() {
        dataManager.clearAllSessionData();
    }
    exports.clearAllDataManagerSessionCaches = clearAllDataManagerSessionCaches;
    function getDynamicGraph(dataName, session) {
        var so = setOps;
        so.pushUid(function () {
            return this._id;
        });
        var vars = utils_4.getUrlVars();
        if (!dataName)
            dataName = vars['datasetName'];
        if (!session)
            this.session = vars['session'];
        else
            this.session = session;
        return dataManager.getGraph(this.session, dataName);
    }
    exports.getDynamicGraph = getDynamicGraph;
    function openVisualizationWindow(session, visUri, dataName) {
        openView(session, visUri, dataName, false);
    }
    exports.openVisualizationWindow = openVisualizationWindow;
    function openVisualizationTab(session, visUri, dataName) {
        openView(session, visUri, dataName, true);
    }
    exports.openVisualizationTab = openVisualizationTab;
    function createTabVisualizations(parentId, visSpec, session, dataName, width, height, visParams) {
        var parent = $('#' + parentId);
        var tabDiv = $('<div></div>');
        parent.append(tabDiv);
        var visDiv = $('<div></div>');
        parent.append(visDiv);
        var ul = $('<ul class="networkcube-tabs"\
                style="\
                    list-style-type: none;\
                    margin: 0;\
                    padding:2px;\
                    overflow: hidden;\
                    border: none;\
                    background-color: #f1f1f1;"\
                ></ul>');
        tabDiv.append(ul);
        for (var i = 0; i < visSpec.length; i++) {
            visSpec[i].name = visSpec[i].name.replace(' ', '-');
            ul.append($('<li style="float: left;"><a style="\
                display: inline-block;\
                color: black;\
                margin-right: 8px;\
                margin-left: 8px;\
                padding: 5px;\
                text-align: left;\
                text-decoration: none;\
                transition: 0.3s;\
                font-weight: 800;\
                border: #fff 1px solid;\
                border-raduis: 5px;\
                font-size: 13px;" href="#" class="networkcube-tablinks" onclick="networkcube.switchVisTab(event, \'' + visSpec[i].name + '\')">' + visSpec[i].name + '</a></li>'));
            visDiv.append($('<div id="networkcube-visTab-' + visSpec[i].name + '" style="display:' + (i == 0 ? 'block' : 'none') + ';" class="networkcube-visTabContent"></div>'));
            createVisualizationIFrame('networkcube-visTab-' + visSpec[i].name, visSpec[i].url, session, dataName, width, height, visParams);
        }
    }
    exports.createTabVisualizations = createTabVisualizations;
    function switchVisTab(evt, visName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("networkcube-visTabContent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("networkcube-tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById('networkcube-visTab-' + visName).style.display = "block";
        evt.currentTarget.className += " active";
    }
    exports.switchVisTab = switchVisTab;
    function createVisualizationIFrame(parentId, visUri, session, dataName, width, height, visParams) {
        $('#' + parentId)
            .append('<iframe></iframe>')
            .attr('width', width)
            .attr('height', height);
        var iframe = $('#' + parentId + '> iframe');
        var visParamString = '';
        for (var prop in visParams) {
            visParamString += '&' + prop + '=' + visParams[prop];
        }
        iframe.attr('src', visUri + '?'
            + 'session=' + session
            + '&datasetName=' + dataName
            + visParamString);
        if (width)
            iframe.attr('width', width);
        if (height)
            iframe.attr('height', height);
        if (visParams != undefined && visParams.hasOwnProperty('scrolling')) {
            iframe.attr('scrolling', visParams.scrolling);
        }
        return iframe;
    }
    exports.createVisualizationIFrame = createVisualizationIFrame;
    function openView(session, visUri, dataname, tab) {
        var url = visUri + '?session=' + session + '&datasetName=' + dataname;
        if (tab)
            window.open(url, '_blank');
        else
            window.open(url);
    }
    function getURLString(dataName) {
        return '?session=' + session + '&datasetName=' + dataName;
    }
    exports.getURLString = getURLString;
    var OrderType;
    (function (OrderType) {
        OrderType[OrderType["Local"] = 0] = "Local";
        OrderType[OrderType["Global"] = 1] = "Global";
        OrderType[OrderType["Data"] = 2] = "Data";
    })(OrderType = exports.OrderType || (exports.OrderType = {}));
    ;
    function isTrackingEnabled() {
        var value = localStorage.getItem("NETWORKCUBE_IS_TRACKING_ENABLED");
        console.log('>>>>>>>', value);
        return value == 'true' ? true : false;
    }
    exports.isTrackingEnabled = isTrackingEnabled;
    function isTrackingSet() {
        var value = localStorage.getItem("NETWORKCUBE_IS_TRACKING_ENABLED");
        return value === null ? false : true;
    }
    exports.isTrackingSet = isTrackingSet;
});
define("classes/search", ["require", "exports", "classes/utils"], function (require, exports, utils_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function searchForTerm(term, dgraph, type) {
        var terms = term.toLowerCase().split(',');
        var result = new utils_5.IDCompound();
        for (var i = 0; i < terms.length; i++) {
            term = terms[i].trim();
            console.log('search term', term);
            if (!type || type == 'node')
                result.nodeIds = result.nodeIds.concat(dgraph.nodes().filter((e) => e.label().toLowerCase().indexOf(term) > -1
                    || e.nodeType().toLowerCase().indexOf(term) > -1).ids());
            if (!type || type == 'link')
                result.linkIds = result.linkIds.concat(dgraph.links().filter((e) => e.source.label().toLowerCase().indexOf(term) > -1
                    || e.target.label().toLowerCase().indexOf(term) > -1
                    || e.linkType().indexOf(term) > -1).ids());
            if (!type || type == 'locations')
                result.locationIds = result.locationIds.concat(dgraph.locations().filter((e) => e.label().toLowerCase().indexOf(term) > -1).ids());
        }
        return result;
    }
    exports.searchForTerm = searchForTerm;
    class StringContainsFilter {
        constructor(pattern) {
            this.pattern = pattern;
        }
        test(word) {
            console.log('contains:', word, this.pattern);
            return word.indexOf(this.pattern) > -1;
        }
    }
});
define("classes/messenger", ["require", "exports", "classes/utils", "classes/dynamicgraph", "classes/main", "classes/search", "trace"], function (require, exports, utils_6, dynamicgraph_3, main_1, search_1, trace) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MESSAGE_HIGHLIGHT = 'highlight';
    exports.MESSAGE_SELECTION = 'selection';
    exports.MESSAGE_TIME_RANGE = 'timeRange';
    exports.MESSAGE_SELECTION_CREATE = 'createSelection';
    exports.MESSAGE_SELECTION_DELETE = 'deleteSelection';
    exports.MESSAGE_SELECTION_SET_CURRENT = 'setCurrentSelectionId';
    exports.MESSAGE_SELECTION_COLORING = 'setSelectionColor';
    exports.MESSAGE_SELECTION_SET_COLORING_VISIBILITY = 'selectionColoring';
    exports.MESSAGE_SELECTION_FILTER = 'selectionFilter';
    exports.MESSAGE_SELECTION_PRIORITY = 'selectionPriority';
    exports.MESSAGE_SEARCH_RESULT = 'searchResult';
    var MESSENGER_PROPAGATE = true;
    var MESSAGE_HANDLERS = [
        exports.MESSAGE_HIGHLIGHT,
        exports.MESSAGE_SELECTION,
        exports.MESSAGE_TIME_RANGE,
        exports.MESSAGE_SELECTION_CREATE,
        exports.MESSAGE_SELECTION_DELETE,
        exports.MESSAGE_SELECTION_SET_CURRENT,
        exports.MESSAGE_SELECTION_SET_COLORING_VISIBILITY,
        exports.MESSAGE_SELECTION_FILTER,
        exports.MESSAGE_SELECTION_PRIORITY,
        exports.MESSAGE_SEARCH_RESULT,
        exports.MESSAGE_SELECTION_COLORING
    ];
    var messageHandlers = [];
    class MessageHandler {
    }
    var messageHandler = new MessageHandler();
    var previousMessageId = -1;
    function addEventListener(messageType, handler) {
        console.log('>>> addEventListener', messageType);
        messageHandler[messageType] = handler;
    }
    exports.addEventListener = addEventListener;
    function setDefaultEventListener(handler) {
        for (var i = 0; i < MESSAGE_HANDLERS.length; i++) {
            messageHandler[MESSAGE_HANDLERS[i]] = handler;
        }
    }
    exports.setDefaultEventListener = setDefaultEventListener;
    window.addEventListener('storage', receiveMessage, false);
    class Message {
        constructor(type) {
            this.id = Math.random();
            this.type = type;
            this.body = null;
        }
    }
    exports.Message = Message;
    function sendMessage(type, body) {
        var m = new Message(type);
        m.body = body;
        distributeMessage(m, true);
    }
    exports.sendMessage = sendMessage;
    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    function highlight(action, elementCompound) {
        var g = main_1.getDynamicGraph();
        var idCompound = utils_6.makeIdCompound(elementCompound);
        var highlightAnyElement = false;
        if (elementCompound != null && !isEmpty(elementCompound)) {
            highlightAnyElement = true;
        }
        console.log('>>>>' + highlightAnyElement);
        trace.event(null, 'toolFunctionUse', exports.MESSAGE_HIGHLIGHT, highlightAnyElement);
        if (!elementCompound == undefined)
            action = 'reset';
        var m;
        m = new HighlightMessage(action, idCompound);
        distributeMessage(m);
        if (elementCompound && g.currentSelection_id > 0) {
            $('body').css('cursor', 'url(/networkcube/icons/brush.png),auto');
        }
        else {
            $('body').css('cursor', 'auto');
        }
    }
    exports.highlight = highlight;
    class HighlightMessage extends Message {
        constructor(action, idCompound) {
            super(exports.MESSAGE_HIGHLIGHT);
            this.action = action;
            this.idCompound = idCompound;
        }
    }
    exports.HighlightMessage = HighlightMessage;
    function selection(action, compound, selectionId) {
        var g = main_1.getDynamicGraph();
        if (!selectionId)
            selectionId = g.currentSelection_id;
        var selection = g.getSelection(selectionId);
        trace.event(null, 'toolFunctionUse', exports.MESSAGE_SELECTION, compound);
        var idCompound = utils_6.makeIdCompound(compound);
        var m = new SelectionMessage(action, idCompound, selectionId);
        distributeMessage(m);
    }
    exports.selection = selection;
    class SelectionMessage extends Message {
        constructor(action, idCompound, selectionId) {
            super(exports.MESSAGE_SELECTION);
            this.action = action;
            this.idCompound = idCompound;
            this.selectionId = selectionId;
        }
    }
    exports.SelectionMessage = SelectionMessage;
    function timeRange(startUnix, endUnix, single, propagate) {
        var m = new TimeRangeMessage(startUnix, endUnix);
        if (propagate == undefined)
            propagate = false;
        trace.event(null, 'toolFunctionUse', exports.MESSAGE_TIME_RANGE);
        if (propagate)
            distributeMessage(m);
        else
            processMessage(m);
    }
    exports.timeRange = timeRange;
    class TimeRangeMessage extends Message {
        constructor(start, end) {
            super(exports.MESSAGE_TIME_RANGE);
            this.startUnix = start;
            this.endUnix = end;
        }
    }
    exports.TimeRangeMessage = TimeRangeMessage;
    function createSelection(type, name) {
        trace.event(null, 'toolFunctionUse', exports.MESSAGE_SELECTION_CREATE);
        var g = main_1.getDynamicGraph();
        var b = g.createSelection(type);
        b.name = name;
        var m = new CreateSelectionMessage(b);
        distributeMessage(m, false);
        return b;
    }
    exports.createSelection = createSelection;
    class CreateSelectionMessage extends Message {
        constructor(b) {
            super(exports.MESSAGE_SELECTION_CREATE);
            this.selection = b;
        }
    }
    exports.CreateSelectionMessage = CreateSelectionMessage;
    function setCurrentSelection(b) {
        trace.event(null, 'toolFunctionUse', exports.MESSAGE_SELECTION_SET_CURRENT);
        var g = main_1.getDynamicGraph();
        var m = new SetCurrentSelectionIdMessage(b);
        distributeMessage(m);
    }
    exports.setCurrentSelection = setCurrentSelection;
    class SetCurrentSelectionIdMessage extends Message {
        constructor(b) {
            super(exports.MESSAGE_SELECTION_SET_CURRENT);
            this.selectionId = b.id;
        }
    }
    exports.SetCurrentSelectionIdMessage = SetCurrentSelectionIdMessage;
    function showSelectionColor(selection, showColor) {
        trace.event(null, 'toolFunctionUse', exports.MESSAGE_SELECTION_SET_COLORING_VISIBILITY);
        var m = new ShowSelectionColorMessage(selection, showColor);
        distributeMessage(m);
    }
    exports.showSelectionColor = showSelectionColor;
    class ShowSelectionColorMessage extends Message {
        constructor(selection, showColor) {
            super(exports.MESSAGE_SELECTION_SET_COLORING_VISIBILITY);
            this.selectionId = selection.id;
            this.showColor = showColor;
        }
    }
    exports.ShowSelectionColorMessage = ShowSelectionColorMessage;
    function filterSelection(selection, filter) {
        trace.event(null, 'toolFunctionUse', exports.MESSAGE_SELECTION_FILTER);
        var m = new FilterSelectionMessage(selection, filter);
        distributeMessage(m);
    }
    exports.filterSelection = filterSelection;
    class FilterSelectionMessage extends Message {
        constructor(selection, filter) {
            super(exports.MESSAGE_SELECTION_FILTER);
            this.selectionId = selection.id;
            this.filter = filter;
        }
    }
    exports.FilterSelectionMessage = FilterSelectionMessage;
    function swapPriority(s1, s2) {
        trace.event(null, 'toolFunctionUse', exports.MESSAGE_SELECTION_PRIORITY);
        var m = new SelectionPriorityMessage(s1, s2, s2.priority, s1.priority);
        distributeMessage(m);
    }
    exports.swapPriority = swapPriority;
    class SelectionPriorityMessage extends Message {
        constructor(s1, s2, p1, p2) {
            super(exports.MESSAGE_SELECTION_PRIORITY);
            this.selectionId1 = s1.id;
            this.selectionId2 = s2.id;
            this.priority1 = p1;
            this.priority2 = p2;
        }
    }
    exports.SelectionPriorityMessage = SelectionPriorityMessage;
    function deleteSelection(selection) {
        trace.event(null, 'toolFunctionUse', exports.MESSAGE_SELECTION_DELETE);
        var m = new DeleteSelectionMessage(selection);
        distributeMessage(m);
    }
    exports.deleteSelection = deleteSelection;
    class DeleteSelectionMessage extends Message {
        constructor(selection) {
            super(exports.MESSAGE_SELECTION_DELETE);
            this.selectionId = selection.id;
        }
    }
    exports.DeleteSelectionMessage = DeleteSelectionMessage;
    function setSelectionColor(s, color) {
        trace.event(null, 'toolFunctionUse', exports.MESSAGE_SELECTION_COLORING);
        distributeMessage(new SelectionColorMessage(s, color));
    }
    exports.setSelectionColor = setSelectionColor;
    class SelectionColorMessage extends Message {
        constructor(selection, color) {
            super(exports.MESSAGE_SELECTION_COLORING);
            this.selectionId = selection.id;
            this.color = color;
        }
    }
    function search(term, type) {
        trace.event(null, 'toolFunctionUse', exports.MESSAGE_SEARCH_RESULT, term);
        var idCompound = search_1.searchForTerm(term, main_1.getDynamicGraph(), type);
        distributeMessage(new SearchResultMessage(term, idCompound));
    }
    exports.search = search;
    class SearchResultMessage extends Message {
        constructor(searchTerm, idCompound) {
            super(exports.MESSAGE_SEARCH_RESULT);
            this.idCompound = idCompound;
            this.searchTerm = searchTerm;
        }
    }
    exports.SearchResultMessage = SearchResultMessage;
    var MESSAGE_KEY = 'networkcube_message';
    localStorage[MESSAGE_KEY] = undefined;
    function distributeMessage(message, ownView) {
        if (ownView == undefined || ownView)
            processMessage(message);
        if (MESSENGER_PROPAGATE) {
            localStorage[MESSAGE_KEY] = JSON.stringify(message, function (k, v) { return dynamicgraph_3.dgraphReplacer(k, v); });
        }
    }
    exports.distributeMessage = distributeMessage;
    function receiveMessage() {
        var s = localStorage[MESSAGE_KEY];
        if (s == undefined || s == 'undefined')
            return;
        var dgraph = main_1.getDynamicGraph();
        var m = JSON.parse(s, function (k, v) { return dynamicgraph_3.dgraphReviver(dgraph, k, v); });
        if (!m || m.id == previousMessageId) {
            return;
        }
        previousMessageId = m.id;
        processMessage(m);
    }
    function processMessage(m) {
        var graph = main_1.getDynamicGraph();
        if (messageHandler[m.type]) {
            if (m.type == exports.MESSAGE_HIGHLIGHT) {
                var m2 = m;
                graph.highlight(m2.action, m2.idCompound);
            }
            else if (m.type == exports.MESSAGE_SELECTION) {
                var m3 = m;
                graph.selection(m3.action, m3.idCompound, m3.selectionId);
            }
            else if (m.type == exports.MESSAGE_TIME_RANGE) {
            }
            else if (m.type == exports.MESSAGE_SELECTION_SET_COLORING_VISIBILITY) {
                var m4 = m;
                graph.getSelection(m4.selectionId).showColor = m4.showColor;
            }
            else if (m.type == exports.MESSAGE_SELECTION_PRIORITY) {
                var m5 = m;
                graph.getSelection(m5.selectionId1).priority = m5.priority1;
                graph.getSelection(m5.selectionId2).priority = m5.priority2;
                var linkElements = graph.links().selected().toArray();
                for (var i = 0; i < linkElements.length; i++) {
                    linkElements[i].getSelections().sort(utils_6.sortByPriority);
                }
                var nodeElements = graph.nodes().selected().toArray();
                for (var i = 0; i < nodeElements.length; i++) {
                    nodeElements[i].getSelections().sort(utils_6.sortByPriority);
                }
                var nodePairElements = graph.nodePairs().selected().toArray();
                for (var i = 0; i < nodePairElements.length; i++) {
                    nodePairElements[i].getSelections().sort(utils_6.sortByPriority);
                }
            }
            else if (m.type == exports.MESSAGE_SELECTION_FILTER) {
                var m6 = m;
                graph.filterSelection(m6.selectionId, m6.filter);
            }
            else if (m.type == exports.MESSAGE_SELECTION_CREATE) {
                var m7 = m;
                graph.addSelection(m7.selection.id, m7.selection.color, m7.selection.acceptedType, m7.selection.priority);
            }
            else if (m.type == exports.MESSAGE_SELECTION_SET_CURRENT) {
                var m8 = m;
                graph.setCurrentSelection(m8.selectionId);
            }
            else if (m.type == exports.MESSAGE_SELECTION_DELETE) {
                var m10 = m;
                graph.deleteSelection(m10.selectionId);
            }
            else if (m.type == exports.MESSAGE_SEARCH_RESULT) {
                var m11 = m;
                graph.highlight('set', m11.idCompound);
            }
            else if (m.type == exports.MESSAGE_SELECTION_COLORING) {
                var m12 = m;
                graph.getSelection(m12.selectionId).color = m12.color;
            }
            callHandler(m);
        }
    }
    function callHandler(message) {
        if (messageHandler[message.type] && messageHandler[message.type] != undefined) {
            messageHandler[message.type](message);
        }
    }
});
define("classes/motifs", ["require", "exports", "swiftset", "classes/queries", "netclustering"], function (require, exports, Set, queries_4, netClustering) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function findTemplate(nodes, template, config) {
        var nodeCount = template.nodes.length;
        var linkCount = template.links.length;
        var n;
        var links;
        var candidateNodes = [];
        for (var i = 0; i < nodes.length; i++) {
            links = nodes[i].links().toArray();
            for (var j = 0; j < nodeCount; j++) {
                for (var k = 0; k < linkCount; k++) {
                    if (template.links[k][0] == template.nodes[j])
                        for (var l = 0; l < linkCount; l++) {
                        }
                }
            }
        }
    }
    exports.findTemplate = findTemplate;
    function findClusters(nodes, config) {
        if (nodes.length == 0)
            return [];
        var g = nodes[0].g;
        var links = nodes[0].g.links().toArray();
        for (var i = 0; i < links.length; i++) {
            links[i].value = links[i].weights().sum();
        }
        var clusters = netClustering.cluster(nodes, links);
        var motifs = [];
        var clusterArray = [];
        var clusterLinks = [];
        var cl;
        var s, t;
        for (var c = 0; c < clusters.length; c++) {
            clusterLinks = [];
            cl = clusters[c];
            if (cl.length < 4)
                continue;
            for (var j = 0; j < cl.length; j++) {
                cl[j] = g.node(parseInt(cl[j]));
            }
            for (var i = 0; i < cl.length; i++) {
                for (var j = i + 1; j < cl.length; j++) {
                    clusterLinks = clusterLinks.concat(cl[i].linksBetween(cl[j]).toArray());
                }
            }
            motifs.push({ nodes: cl, links: clusterLinks });
        }
        return motifs;
    }
    exports.findClusters = findClusters;
    function findCliques(nodes, config) {
        var cliques = [];
        var p = nodes.slice();
        var r = [];
        var x = [];
        if (!config)
            var config = {};
        if (config.links == undefined)
            config.links = nodes[0].g.links().toArray();
        cliques = bronKerboschIterative(nodes, config);
        var motifs = [];
        var cliqueLinks = [];
        for (var c = 0; c < cliques.length; c++) {
            if (cliques[c].length < 4)
                continue;
            cliqueLinks = [];
            for (var i = 0; i < cliques[c].length; i++) {
                for (var j = i + 1; j < cliques[c].length; j++) {
                    cliqueLinks.push(cliques[c][i].linksBetween(cliques[c][j]).get(0));
                }
            }
            motifs.push({ nodes: cliques[c], links: cliqueLinks });
        }
        return motifs;
    }
    exports.findCliques = findCliques;
    ;
    function bronKerbosch(nodes, r, p, x, cliques, config) {
        if (p.length === 0 && x.length === 0) {
            cliques.push(r);
            return;
        }
        p.forEach(function (v) {
            var tempR = r.splice(0);
            tempR.push(v);
            bronKerbosch(nodes, tempR, p.filter(function (temp) {
                return v.neighbors().contains(temp);
            }), x.filter(function (temp) {
                return v.neighbors().contains(temp);
            }), cliques, config);
            p.splice(p.indexOf(v), 1);
            if (x.indexOf(v) == -1)
                x.push(v);
        });
    }
    function bronKerboschIterative(nodes, config) {
        var cliques = [];
        var stack = [];
        var R = 0;
        var P = 1;
        var X = 2;
        stack.push([[], nodes, []]);
        var r, p, x, p2, x2;
        var step;
        var newStep;
        var v;
        var count = 0;
        while (stack.length > 0) {
            count++;
            step = stack.pop();
            r = [].concat(step[R]);
            p = [].concat(step[P]);
            x = [].concat(step[X]);
            if (p.length == 0
                && x.length == 0) {
                cliques.push(r.slice());
            }
            if (p.length > 0) {
                v = p[0];
                p2 = p.slice();
                p2.splice(p2.indexOf(v), 1);
                x2 = x.slice();
                if (x2.indexOf(v) == -1)
                    x2.push(v);
                stack.push([r.slice(), p2, x2]);
                if (r.indexOf(v) == -1)
                    r.push(v);
                newStep = [r];
                p = Set.intersection(p2, v.neighbors().toArray());
                p2 = [];
                for (var i = 0; i < p.length; i++) {
                    if (p2.indexOf(p[i]) == -1)
                        p2.push(p[i]);
                }
                newStep.push(p2);
                x = Set.intersection(x2, v.neighbors().toArray());
                x2 = [];
                for (var i = 0; i < x.length; i++) {
                    if (x2.indexOf(x[i]) == -1)
                        x2.push(x[i]);
                }
                newStep.push(x2);
                stack.push(newStep);
            }
        }
        return cliques;
    }
    function findFullEgoNetwork(nodes, config) {
        var motifs = [];
        var ns;
        var ls;
        var finalLinks;
        var n;
        for (var i = 0; i < nodes.length; i++) {
            n = nodes[i];
            finalLinks = [];
            ns = n.neighbors().removeDuplicates();
            ls = ns.links().removeDuplicates().toArray();
            ns = ns.toArray().concat(n);
            for (var j = 0; j < ls.length; j++) {
                if (ls[j] == undefined)
                    continue;
                if (ns.indexOf(ls[j].source) > -1 && ns.indexOf(ls[j].target) > -1) {
                    finalLinks.push(ls[j]);
                }
            }
            motifs.push(new queries_4.Motif(ns, finalLinks));
        }
        return motifs;
    }
    exports.findFullEgoNetwork = findFullEgoNetwork;
    function findStars(nodes, config) {
        if (!config)
            var config = {};
        if (config.minLinkCount == undefined)
            config.minLinkCount = 5;
        if (config.minNeighborCount == undefined) {
            config.minNeighborCount = 5;
            config.minLinkCount = 5;
        }
        if (config.links == undefined)
            config.links = nodes[0].g.links().toArray();
        var motifs = [];
        var n;
        var lls;
        var m;
        var neighbors;
        for (var i = 0; i < nodes.length; i++) {
            n = nodes[i];
            lls = n.links().toArray();
            lls = Set.intersection(lls, config.links);
            if (lls.length <= config.minLinkCount)
                continue;
            neighbors = [];
            for (var j = 0; j < lls.length; j++) {
                if (neighbors.indexOf(lls[j].other(n)) == -1)
                    neighbors.push(lls[j].other(n));
            }
            if (neighbors.length <= config.minNeighborCount)
                continue;
            m = new queries_4.Motif([n], []);
            for (var j = 0; j < lls.length; j++) {
                m.links.push(lls[j]);
                m.nodes.push(lls[j].other(n));
            }
            motifs.push(m);
        }
        return motifs;
    }
    exports.findStars = findStars;
    function findTriangles(nodes, config) {
        if (!config)
            var config = {};
        if (config.links == undefined)
            config.links = nodes[0].g.links().toArray();
        var motifs = [];
        var g = nodes[0].g;
        var l;
        var s, t;
        var ns, nt;
        var common;
        var n;
        var ll1, ll2;
        var found;
        var m;
        for (var i = 0; i < config.links.length; i++) {
            s = config.links[i].source;
            ns = s.neighbors().toArray();
            ns = Set.intersection(ns, nodes);
            if (ns.length == 0)
                continue;
            t = config.links[i].target;
            nt = t.neighbors().toArray();
            nt = Set.intersection(nt, nodes);
            if (nt.length == 0)
                continue;
            common = Set.intersection(ns, nt);
            common = Set.difference(common, [s, t]);
            if (common.length == 0)
                continue;
            for (var j = 0; j < common.length; j++) {
                n = common[j];
                ll1 = Set.intersection(g.linksBetween(s, n).toArray(), config.links);
                if (ll1.length == 0)
                    continue;
                ll2 = Set.intersection(g.linksBetween(t, n).toArray(), config.links);
                if (ll2.length == 0)
                    continue;
                ll1 = ll1.concat(ll2);
                ll1.push(config.links[i]);
                motifs.push(new queries_4.Motif([s, t, n], ll1));
            }
        }
        return motifs;
    }
    exports.findTriangles = findTriangles;
});
define("classes/ordering", ["require", "exports", "science", "reorder.js"], function (require, exports, science, reorder) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function orderNodes(graph, config) {
        var max = 0;
        var similarityMatrix = [];
        var order = graph.nodes().ids();
        var distance = config.distance ? config.distance : science.stats.distance.manhattan;
        var nodes = config.nodes ? config.nodes : graph.nodes().toArray();
        var links = config.links ? config.links : graph.links().toArray();
        var start = config.start ? config.start : graph.startTime;
        var end = config.end ? config.end : graph.endTime;
        var arr;
        for (var i = 0; i < nodes.length; i++) {
            arr = [];
            similarityMatrix.push(arr);
            for (var j = 0; j < nodes.length; j++) {
                similarityMatrix[i].push(0);
            }
        }
        var weight = 0;
        var l;
        var s;
        var t;
        for (var i = 0; i < links.length; i++) {
            weight = 0;
            s = nodes.indexOf(links[i].source);
            t = nodes.indexOf(links[i].target);
            if (s == -1 || t == -1)
                continue;
            weight += links[i].weights(start, end).mean();
            if (weight) {
                similarityMatrix[s][t] = weight;
                similarityMatrix[t][s] = weight;
            }
            else {
                console.log('weight', weight);
            }
        }
        var leafOrder = reorder
            .optimal_leaf_order()
            .distance(distance)
            .reorder(similarityMatrix);
        leafOrder.forEach(function (lo, i) {
            order[nodes[lo].id()] = i;
        });
        return order;
    }
    exports.orderNodes = orderNodes;
    class OrderingConfiguration {
    }
    exports.OrderingConfiguration = OrderingConfiguration;
});
define("helper/glutils", ["require", "exports", "three", "bspline"], function (require, exports, THREE, BSpline) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var glutils;
    (function (glutils) {
        function makeAlphaBuffer(array, stretch) {
            var buffer = new Float32Array(array.length * stretch);
            for (var i = 0; i < array.length; i++) {
                for (var j = 0; j < stretch; j++) {
                    buffer[i * stretch + j] = array[i];
                }
            }
            return buffer;
        }
        glutils.makeAlphaBuffer = makeAlphaBuffer;
        function addBufferedHatchedRect(vertexArray, x, y, z, width, height, colorArray, c) {
            var HATCH_NUM = 3;
            var LINE_WIDTH = 1;
            var hatchWidth = width / HATCH_NUM;
            width = width / 2;
            height = height / 2;
            var startX = x + width;
            var startY = y - height;
            for (var i = 1; i <= HATCH_NUM; i++) {
                vertexArray.push([startX - hatchWidth * i, startY, z], [startX - hatchWidth * i + LINE_WIDTH, startY, z], [startX, startY + hatchWidth * i + LINE_WIDTH, z], [startX, startY + hatchWidth * i + LINE_WIDTH, z], [startX, startY + hatchWidth * i, z], [startX - hatchWidth * i, startY, z]);
                colorArray.push([c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]]);
            }
        }
        glutils.addBufferedHatchedRect = addBufferedHatchedRect;
        function addBufferedRect(vertexArray, x, y, z, width, height, colorArray, c) {
            width = width / 2;
            height = height / 2;
            vertexArray.push([x - width, y - height, z], [x + width, y - height, z], [x + width, y + height, z], [x + width, y + height, z], [x - width, y + height, z], [x - width, y - height, z]);
            colorArray.push([c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]]);
        }
        glutils.addBufferedRect = addBufferedRect;
        function addBufferedCirlce(vertexArray, x, y, z, radius, colorArray, c) {
            var segments = 11;
            var angle = Math.PI / (segments / 2);
            for (var i = 0; i < segments; i++) {
                vertexArray.push([x + Math.cos(i * angle) * radius, y + Math.sin(i * angle) * radius, z], [x + Math.cos((i + 1) * angle) * radius, y + Math.sin((i + 1) * angle) * radius, z], [x, y, z]);
                colorArray.push([c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]]);
            }
        }
        glutils.addBufferedCirlce = addBufferedCirlce;
        function addBufferedDiamond(vertexArray, x, y, z, width, height, colorArray, c) {
            width = width / 2;
            height = height / 2;
            vertexArray.push([x - width, y, z], [x, y - height, z], [x + width, y, z], [x + width, y, z], [x, y + height, z], [x - width, y, z]);
            colorArray.push([c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]], [c[0], c[1], c[2], c[3]]);
        }
        glutils.addBufferedDiamond = addBufferedDiamond;
        function createRectFrame(w, h, color, lineThickness) {
            w = w / 2;
            h = h / 2;
            var geom = new THREE.Geometry();
            geom.vertices = [
                new THREE.Vector3(-w, -h, 0),
                new THREE.Vector3(-w, h, 0),
                new THREE.Vector3(w, h, 0),
                new THREE.Vector3(w, -h, 0),
                new THREE.Vector3(-w, -h, 0)
            ];
            var material = new THREE.LineBasicMaterial({
                color: color,
            });
            return new THREE.Line(geom, material);
        }
        glutils.createRectFrame = createRectFrame;
        function createDiagonalCross(w, h, color, lineThickness) {
            w = w / 2;
            h = h / 2;
            var geom = new THREE.Geometry();
            geom.vertices = [
                new THREE.Vector3(-w, -h, 0),
                new THREE.Vector3(-w, h, 0),
                new THREE.Vector3(w, h, 0),
                new THREE.Vector3(w, -h, 0),
                new THREE.Vector3(-w, -h, 0),
                new THREE.Vector3(w, h, 0),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(-w, h, 0),
                new THREE.Vector3(w, -h, 0)
            ];
            var material = new THREE.LineBasicMaterial({
                color: color,
                linewidth: lineThickness,
            });
            return new THREE.Line(geom, material);
        }
        glutils.createDiagonalCross = createDiagonalCross;
        function makeBuffer3f(array) {
            var buffer = new Float32Array(array.length * 3);
            for (var i = 0; i < array.length; i++) {
                buffer[i * 3 + 0] = array[i][0];
                buffer[i * 3 + 1] = array[i][1];
                buffer[i * 3 + 2] = array[i][2];
            }
            return buffer;
        }
        glutils.makeBuffer3f = makeBuffer3f;
        function makeBuffer4f(array) {
            var buffer = new Float32Array(array.length * 4);
            for (var i = 0; i < array.length; i++) {
                buffer[i * 4 + 0] = array[i][0];
                buffer[i * 4 + 1] = array[i][1];
                buffer[i * 4 + 2] = array[i][2];
                buffer[i * 4 + 3] = array[i][3];
            }
            return buffer;
        }
        glutils.makeBuffer4f = makeBuffer4f;
        function updateBuffer(buffer, array, size) {
            for (var i = 0; i < array.length; i++) {
                for (var j = 0; j < size; j++) {
                    buffer[i * size + j] = array[i][j];
                }
            }
        }
        glutils.updateBuffer = updateBuffer;
        var fontMap = new Map();
        function createText(string, x, y, z, size, color, weight = 'normal', align = 'left') {
            var font = fontMap.get('helvetiker_' + weight);
            var textGeom = new THREE.TextGeometry(string, {
                size: size,
                height: 1,
                curveSegments: 1,
                font: font
            });
            var textMaterial = new THREE.MeshBasicMaterial({ color: color });
            var label = new THREE.Mesh(textGeom, textMaterial);
            if (align == 'right') {
                label.geometry.computeBoundingBox();
                var bounds = label.geometry.boundingBox;
                x -= bounds.max.x - bounds.min.x;
            }
            label.position.set(x, y, z);
            return label;
        }
        glutils.createText = createText;
        function getMousePos(canvas, x, y) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: x - rect.left,
                y: y - rect.top
            };
        }
        glutils.getMousePos = getMousePos;
        var txtCanvas = document.createElement("canvas");
        class WebGL {
            constructor(params) {
                this.elementQueries = [];
                txtCanvas = document.createElement("canvas");
                txtCanvas.setAttribute('id', 'textCanvas');
            }
            render() {
                for (var i = 0; i < this.elementQueries.length; i++) {
                    if (this.elementQueries[i].updateAttributes || this.elementQueries[i].updateStyle) {
                        this.elementQueries[i].set();
                    }
                }
                this.renderer.render(this.scene, this.camera);
            }
            selectAll() {
                return glutils.selectAll();
            }
            enableZoom(b) {
                function mouseWheel(event) {
                    event.preventDefault();
                    webgl.camera.zoom += event.wheelDelta / 1000;
                    webgl.camera.zoom = Math.max(0.1, webgl.camera.zoom);
                    webgl.camera.updateProjectionMatrix();
                    webgl.render();
                }
                if (b) {
                    window.addEventListener("mousewheel", mouseWheel, false);
                }
                else {
                    window.addEventListener("mousewheel", mouseWheel, false);
                }
            }
            enablePanning(b) {
                this.interactor.isPanEnabled = b;
            }
            enableHorizontalPanning(b) {
                this.interactor.isHorizontalPanEnabled = b;
            }
        }
        glutils.WebGL = WebGL;
        var webgl;
        function initWebGL(parentId, width, height, params) {
            webgl = new WebGL(params);
            webgl.camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 1000);
            webgl.scene = new THREE.Scene();
            webgl.scene.add(webgl.camera);
            webgl.camera.position.z = 100;
            webgl.renderer = new THREE.WebGLRenderer({
                antialias: true,
                preserveDrawingBuffer: true
            });
            webgl.renderer.setSize(width, height);
            webgl.renderer.setClearColor(0xffffff, 1);
            webgl.canvas = webgl.renderer.domElement;
            $("#" + parentId).append(webgl.canvas);
            webgl.interactor = new WebGLInteractor(webgl.scene, webgl.canvas, webgl.camera);
            var light = new THREE.PointLight(0x000000, 1, 100);
            light.position.set(0, 0, 1000);
            webgl.scene.add(light);
            return webgl;
        }
        glutils.initWebGL = initWebGL;
        function setWebGL(scene, camera, renderer, canvas) {
            webgl = new WebGL();
            webgl.camera = camera;
            webgl.scene = scene;
            webgl.renderer = renderer;
        }
        glutils.setWebGL = setWebGL;
        function selectAll() {
            var q = new glutils.WebGLElementQuery();
            webgl.elementQueries.push(q);
            return q;
        }
        glutils.selectAll = selectAll;
        class WebGLElementQuery {
            constructor() {
                this.dataElements = [];
                this.visualElements = [];
                this.children = [];
                this.x = [];
                this.y = [];
                this.z = [];
                this.r = [];
                this.fill = [];
                this.stroke = [];
                this.strokewidth = [];
                this.opacity = [];
                this.updateAttributes = false;
                this.updateStyle = false;
                this.IS_SHADER = false;
                this.scene = webgl.scene;
            }
            data(arr) {
                this.dataElements = arr.slice(0);
                return this;
            }
            append(shape) {
                var elements = [];
                switch (shape) {
                    case 'circle':
                        createCirclesWithBuffers(this, this.scene);
                        break;
                    case 'path':
                        elements = createPaths(this.dataElements, this.scene);
                        break;
                    case 'line':
                        elements = createLines(this.dataElements, this.scene);
                        break;
                    case 'rect':
                        elements = createRectangles(this.dataElements, this.scene);
                        break;
                    case 'text':
                        elements = createWebGLText(this.dataElements, this.scene);
                        break;
                    case 'polygon':
                        elements = createPolygons(this.dataElements, this.scene);
                        break;
                    default: console.error('Shape', shape, 'does not exist.');
                }
                if (!this.IS_SHADER) {
                    for (var i = 0; i < elements.length; i++) {
                        this.x.push(0);
                        this.y.push(0);
                        this.z.push(0);
                    }
                }
                this.shape = shape;
                this.visualElements = elements;
                return this;
            }
            push(e) {
                this.dataElements.push(e);
                return this;
            }
            getData(i) {
                return this.dataElements[this.visualElements.indexOf(i)];
            }
            getVisual(i) {
                return this.visualElements[this.dataElements.indexOf(i)];
            }
            get length() {
                return this.dataElements.length;
            }
            filter(f) {
                var arr = [];
                var visArr = [];
                for (var i = 0; i < this.dataElements.length; i++) {
                    if (f(this.dataElements[i], i)) {
                        arr.push(this.dataElements[i]);
                        visArr.push(this.visualElements[i]);
                    }
                }
                var q = new WebGLElementQuery()
                    .data(arr);
                q.visualElements = visArr;
                return q;
            }
            attr(name, v) {
                var l = this.visualElements.length;
                if (this.IS_SHADER) {
                    for (var i = 0; i < this.dataElements.length; i++) {
                        this[name][i] = v instanceof Function ? v(this.dataElements[i], i) : v;
                    }
                }
                else {
                    for (var i = 0; i < l; i++) {
                        this.setAttr(this.visualElements[i], name, v instanceof Function ? v(this.dataElements[i], i) : v, i);
                        if (this.visualElements[i].hasOwnProperty('wireframe')) {
                            this.setAttr(this.visualElements[i].wireframe, name, v instanceof Function ? v(this.dataElements[i], i) : v, i);
                        }
                    }
                }
                this.updateAttributes = true;
                return this;
            }
            style(name, v) {
                var l = this.visualElements.length;
                if (this.IS_SHADER) {
                    name = name.replace('-', '');
                    for (var i = 0; i < this.dataElements.length; i++) {
                        this[name][i] = v instanceof Function ? v(this.dataElements[i], i) : v;
                    }
                }
                else {
                    for (var i = 0; i < l; i++) {
                        setStyle(this.visualElements[i], name, v instanceof Function ? v(this.dataElements[i], i) : v, this);
                    }
                }
                this.updateStyle = true;
                return this;
            }
            set() {
                if (!this.IS_SHADER)
                    return this;
                var l = this.visualElements.length;
                var vertexPositionBuffer = [];
                var vertexColorBuffer = [];
                var c;
                if (this.shape == 'circle') {
                    for (var i = 0; i < this.dataElements.length; i++) {
                        c = new THREE.Color(this.fill[i]);
                        addBufferedCirlce(vertexPositionBuffer, this.x[i], this.y[i], this.z[i], this.r[i], vertexColorBuffer, [c.r, c.g, c.b, this.opacity[i]]);
                    }
                }
                var geometry = this.mesh.geometry;
                geometry.addAttribute('position', new THREE.BufferAttribute(makeBuffer3f(vertexPositionBuffer), 3));
                geometry.addAttribute('customColor', new THREE.BufferAttribute(makeBuffer4f(vertexColorBuffer), 4));
                this.mesh.material.needsUpdate = true;
                this.updateAttributes = false;
                this.updateStyle = false;
                return this;
            }
            text(v) {
                var l = this.visualElements.length;
                for (var i = 0; i < l; i++) {
                    this.visualElements[i]['text'] = v instanceof Function ? v(this.dataElements[i], i) : v;
                    if (this.visualElements[i]['text'] == undefined)
                        continue;
                    setText(this.visualElements[i], this.visualElements[i]['text']);
                }
                return this;
            }
            on(event, f) {
                switch (event) {
                    case 'mouseover':
                        this.mouseOverHandler = f;
                        break;
                    case 'mousemove':
                        this.mouseMoveHandler = f;
                        break;
                    case 'mouseout':
                        this.mouseOutHandler = f;
                        break;
                    case 'mousedown':
                        this.mouseDownHandler = f;
                        break;
                    case 'mouseup':
                        this.mouseUpHandler = f;
                        break;
                    case 'click':
                        this.clickHandler = f;
                        break;
                }
                webgl.interactor.register(this, event);
                return this;
            }
            call(method, dataElement, event) {
                var i = this.dataElements.indexOf(dataElement);
                switch (method) {
                    case 'mouseover':
                        this.mouseOverHandler(dataElement, i, event);
                        break;
                    case 'mousemove':
                        this.mouseMoveHandler(dataElement, i, event);
                        break;
                    case 'mouseout':
                        this.mouseOutHandler(dataElement, i, event);
                        break;
                    case 'mousedown':
                        this.mouseDownHandler(dataElement, i, event);
                        break;
                    case 'mouseup':
                        this.mouseUpHandler(dataElement, i, event);
                        break;
                    case 'click':
                        this.clickHandler(dataElement, i, event);
                        break;
                }
                return this;
            }
            setAttr(element, attr, v, index) {
                switch (attr) {
                    case 'x':
                        element.position.x = v;
                        this.x[index] = v;
                        break;
                    case 'y':
                        element.position.y = v;
                        this.y[index] = v;
                        break;
                    case 'z':
                        element.position.z = v;
                        this.z[index] = v;
                        break;
                    case 'x1':
                        setX1(element, v);
                        break;
                    case 'y1':
                        setY1(element, v);
                        break;
                    case 'x2':
                        setX2(element, v);
                        break;
                    case 'y2':
                        setY2(element, v);
                        break;
                    case 'r':
                        element.scale.set(v, v, v);
                        break;
                    case 'width':
                        element.scale.setX(v);
                        break;
                    case 'height':
                        element.scale.setY(v);
                        break;
                    case 'depth':
                        element.scale.setZ(v);
                        break;
                    case 'd':
                        createPath(element, v);
                        break;
                    case 'points':
                        createPolygon(element, v);
                        break;
                    case 'rotation':
                        element.rotation.z = v * Math.PI / 180;
                        break;
                    case 'scaleX':
                        element.scale.x = v;
                        break;
                    case 'scaleY':
                        element.scale.y = v;
                        break;
                    default: console.error('Attribute', attr, 'does not exist.');
                }
            }
            removeAll() {
                for (var i = 0; i < this.visualElements.length; i++) {
                    if (this.visualElements[i].wireframe)
                        this.scene.remove(this.visualElements[i].wireframe);
                    this.scene.remove(this.visualElements[i]);
                }
            }
        }
        glutils.WebGLElementQuery = WebGLElementQuery;
        function setStyle(element, attr, v, query) {
            switch (attr) {
                case 'fill':
                    if (query.shape == 'text')
                        setText(element, element['text'], { color: v });
                    else
                        element.material.color = new THREE.Color(v);
                    break;
                case 'stroke':
                    if (element.hasOwnProperty('wireframe')) {
                        element.wireframe.material.color = new THREE.Color(v);
                    }
                    else {
                        element.material.color = new THREE.Color(v);
                    }
                    break;
                case 'opacity':
                    element.material.opacity = v;
                    if (element.hasOwnProperty('wireframe'))
                        element.wireframe.material.opacity = v;
                    break;
                case 'stroke-width':
                    if (element.hasOwnProperty('wireframe'))
                        element.wireframe.material.linewidth = v;
                    else
                        element.material.linewidth = v;
                    break;
                case 'font-size':
                    element.scale.x = v / 30;
                    element.scale.y = v / 30;
                    element.geometry.verticesNeedUpdate = true;
                    break;
                default: console.error('Style', attr, 'does not exist.');
            }
            element.material.needsUpdate = true;
            if (element.hasOwnProperty('wireframe'))
                element.wireframe.material.needsUpdate = true;
        }
        function setText(mesh, text, parConfig) {
            var config = parConfig;
            if (config == undefined) {
                config = {};
            }
            if (config.color == undefined)
                config.color = '#000000';
            mesh['text'] = text;
            var backgroundMargin = 10;
            var txtCanvas = document.createElement("canvas");
            var context = txtCanvas.getContext("2d");
            var SIZE = 30;
            context.font = SIZE + "pt Helvetica";
            var WIDTH = context.measureText(text).width;
            txtCanvas.width = WIDTH;
            txtCanvas.height = SIZE;
            context.textAlign = "left";
            context.textBaseline = "middle";
            context.fillStyle = config.color;
            context.font = SIZE + "pt Helvetica";
            context.fillText(text, 0, txtCanvas.height / 2);
            var tex = new THREE.Texture(txtCanvas);
            tex.minFilter = THREE.LinearFilter;
            tex.flipY = true;
            tex.needsUpdate = true;
            mesh.material.map = tex;
            mesh.material.transparent = true;
            mesh.material.needsUpdate = true;
            mesh.geometry = new THREE.PlaneGeometry(WIDTH, SIZE);
            mesh.geometry.needsUpdate = true;
            mesh.geometry.verticesNeedUpdate = true;
            mesh.needsUpdate = true;
        }
        function setX1(mesh, v) {
            var geometry = mesh.geometry;
            geometry.vertices[0].x = v;
        }
        function setY1(mesh, v) {
            var geometry = mesh.geometry;
            geometry.vertices[0].y = v;
        }
        function setX2(mesh, v) {
            var geometry = mesh.geometry;
            geometry.vertices[1].x = v;
        }
        function setY2(mesh, v) {
            var geometry = mesh.geometry;
            geometry.vertices[1].y = v;
        }
        function createG(dataElements, scene) {
            var visualElements = [];
            for (var i = 0; i < dataElements.length; i++) {
                visualElements.push(new GroupElement());
            }
            return visualElements;
        }
        class GroupElement {
            constructor() {
                this.position = { x: 0, y: 0, z: 0 };
                this.children = [];
            }
        }
        function createCirclesNoShader(dataElements, scene) {
            var material;
            var geometry;
            var visualElements = [];
            var c;
            for (var i = 0; i < dataElements.length; i++) {
                material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true });
                geometry = new THREE.CircleGeometry(1, 10);
                geometry.dynamic = true;
                c = new THREE.Mesh(geometry, material);
                visualElements.push(c);
                c.position.set(0, 0, 1);
                c.scale.set(10, 10, 1);
                scene.add(c);
            }
            return visualElements;
        }
        var vertexShaderProgram = "\
        attribute vec4 customColor;\
        varying vec4 vColor;\
        void main() {\
            vColor = customColor;\
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1 );\
        }";
        var fragmentShaderProgram = "\
        varying vec4 vColor;\
        void main() {\
            gl_FragColor = vec4(vColor[0], vColor[1], vColor[2], vColor[3]);\
        }";
        function createCirclesWithBuffers(query, scene) {
            var dataElements = query.dataElements;
            query.IS_SHADER = true;
            var attributes = {
                customColor: { type: 'c', value: [] }
            };
            var shaderMaterial = new THREE.ShaderMaterial({
                defines: attributes,
                vertexShader: vertexShaderProgram,
                fragmentShader: fragmentShaderProgram,
                lineWidth: 2
            });
            shaderMaterial.blending = THREE.NormalBlending;
            shaderMaterial.depthTest = true;
            shaderMaterial.transparent = true;
            shaderMaterial.side = THREE.DoubleSide;
            var visualElements = [];
            var c;
            var vertexPositionBuffer = [];
            var vertexColorBuffer = [];
            var geometry = new THREE.BufferGeometry();
            addBufferedRect([], 0, 0, 0, 10, 10, [], [0, 0, 1, .5]);
            for (var i = 0; i < dataElements.length; i++) {
                query.x.push(0);
                query.y.push(0);
                query.z.push(0);
                query.r.push(0);
                query.fill.push(0x000000);
                query.stroke.push(0x000000);
                query.strokewidth.push(1);
                query.opacity.push(1);
            }
            geometry.addAttribute('position', new THREE.BufferAttribute(makeBuffer3f([]), 3));
            geometry.addAttribute('customColor', new THREE.BufferAttribute(makeBuffer4f([]), 4));
            query.mesh = new THREE.Mesh(geometry, shaderMaterial);
            query.mesh.position.set(0, 0, 1);
            scene.add(query.mesh);
            return query;
        }
        function createRectangles(dataElements, scene) {
            var material;
            var geometry;
            var visualElements = [];
            var c;
            for (var i = 0; i < dataElements.length; i++) {
                var rectShape = new THREE.Shape();
                rectShape.moveTo(0, 0);
                rectShape.lineTo(0, -1);
                rectShape.lineTo(1, -1);
                rectShape.lineTo(1, 0);
                rectShape.lineTo(0, 0);
                geometry = new THREE.ShapeGeometry(rectShape);
                c = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true }));
                c.position.set(0, 0, 1);
                visualElements.push(c);
                scene.add(c);
                geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, -1, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0));
                var wireframe = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, linewidth: 1 }));
                c['wireframe'] = wireframe;
                wireframe.position.set(0, 0, 1.1);
                scene.add(wireframe);
            }
            return visualElements;
        }
        function createPaths(dataElements, scene) {
            var material;
            var geometry;
            var visualElements = [];
            var c, p;
            for (var i = 0; i < dataElements.length; i++) {
                geometry = new THREE.Geometry();
                c = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x000000, transparent: true }));
                c.position.set(0, 0, 0);
                visualElements.push(c);
                scene.add(c);
            }
            return visualElements;
        }
        function createPolygons(dataElements, scene) {
            var material;
            var geometry;
            var visualElements = [];
            var c, p;
            for (var i = 0; i < dataElements.length; i++) {
                geometry = new THREE.Geometry();
                c = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, side: THREE.DoubleSide }));
                c.doubleSided = true;
                c.position.set(0, 0, 0);
                visualElements.push(c);
                scene.add(c);
            }
            return visualElements;
        }
        function createLines(dataElements, scene) {
            var material;
            var geometry;
            var visualElements = [];
            var c, p;
            for (var i = 0; i < dataElements.length; i++) {
                geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(-10, 0, 0), new THREE.Vector3(0, 10, 0));
                c = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x000000, transparent: true }));
                c.position.set(0, 0, 0);
                visualElements.push(c);
                scene.add(c);
            }
            return visualElements;
        }
        function createWebGLText(dataElements, scene) {
            var visualElements = [];
            var mesh;
            for (var i = 0; i < dataElements.length; i++) {
                mesh = new THREE.Mesh(new THREE.PlaneGeometry(1000, 100), new THREE.MeshBasicMaterial());
                mesh.doubleSided = true;
                visualElements.push(mesh);
                scene.add(mesh);
            }
            return visualElements;
        }
        function createPath(mesh, points) {
            var geometry = this.mesh.geometry;
            geometry.vertices = [];
            for (var i = 0; i < points.length; i++) {
                geometry.vertices.push(new THREE.Vector3(points[i].x, points[i].y, 0));
            }
            geometry.verticesNeedUpdate = true;
        }
        function createPolygon(mesh, points) {
            var vectors = [];
            var shape = new THREE.Shape(points);
            mesh.geometry = new THREE.ShapeGeometry(shape);
            mesh.geometry.verticesNeedUpdate = true;
        }
        class WebGLInteractor {
            constructor(scene, canvas, camera) {
                this.mouse = [];
                this.mouseStart = [];
                this.mouseDown = false;
                this.cameraStart = [];
                this.panOffset = [];
                this.lastIntersectedSelections = [];
                this.lastIntersectedElements = [];
                this.isPanEnabled = true;
                this.isHorizontalPanEnabled = true;
                this.isLassoEnabled = true;
                this.lassoPoints = [];
                this.mouseOverSelections = [];
                this.mouseMoveSelections = [];
                this.mouseOutSelections = [];
                this.mouseDownSelections = [];
                this.mouseUpSelections = [];
                this.clickSelections = [];
                this.scene = scene;
                this.canvas = canvas;
                this.camera = camera;
                this.mouse = [0, 0];
                canvas.addEventListener('mousemove', (e) => {
                    this.mouseMoveHandler(e);
                });
                canvas.addEventListener('mousedown', (e) => {
                    this.mouseDownHandler(e);
                });
                canvas.addEventListener('mouseup', (e) => {
                    this.mouseUpHandler(e);
                });
                canvas.addEventListener('click', (e) => {
                    this.clickHandler(e);
                });
            }
            register(selection, method) {
                switch (method) {
                    case 'mouseover':
                        this.mouseOverSelections.push(selection);
                        break;
                    case 'mousemove':
                        this.mouseMoveSelections.push(selection);
                        break;
                    case 'mouseout':
                        this.mouseOutSelections.push(selection);
                        break;
                    case 'mousedown':
                        this.mouseDownSelections.push(selection);
                        break;
                    case 'mouseup':
                        this.mouseUpSelections.push(selection);
                        break;
                    case 'click':
                        this.clickSelections.push(selection);
                        break;
                }
            }
            addEventListener(eventName, f) {
                if (eventName == 'lassoStart')
                    this.lassoStartHandler = f;
                if (eventName == 'lassoEnd')
                    this.lassoEndHandler = f;
                if (eventName == 'lassoMove')
                    this.lassoMoveHandler = f;
            }
            mouseMoveHandler(e) {
                this.mouse = mouseToWorldCoordinates(e.clientX, e.clientY);
                if (this.isLassoEnabled && e.which == 2) {
                    this.lassoPoints.push(this.mouse);
                    if (this.lassoMoveHandler)
                        this.lassoMoveHandler(this.lassoPoints);
                }
                else {
                    var intersectedVisualElements = [];
                    for (var i = 0; i < this.lastIntersectedSelections.length; i++) {
                        for (var j = 0; j < this.lastIntersectedElements[i].length; j++) {
                            this.lastIntersectedSelections[i].call('mouseout', this.lastIntersectedElements[i][j]);
                        }
                    }
                    this.lastIntersectedSelections = [];
                    this.lastIntersectedElements = [];
                    var nothingIntersected = true;
                    for (var i = 0; i < this.mouseOverSelections.length; i++) {
                        intersectedVisualElements = this.intersect(this.mouseOverSelections[i], this.mouse[0], this.mouse[1]);
                        if (intersectedVisualElements.length > 0) {
                            this.lastIntersectedElements.push(intersectedVisualElements);
                            this.lastIntersectedSelections.push(this.mouseOverSelections[i]);
                        }
                        for (var j = 0; j < intersectedVisualElements.length; j++) {
                            this.mouseOverSelections[i].call('mouseover', intersectedVisualElements[j], e);
                        }
                        if (intersectedVisualElements.length > 0)
                            nothingIntersected = false;
                    }
                    for (var i = 0; i < this.mouseMoveSelections.length; i++) {
                        intersectedVisualElements = this.intersect(this.mouseMoveSelections[i], this.mouse[0], this.mouse[1]);
                        for (var j = 0; j < intersectedVisualElements.length; j++) {
                            this.mouseMoveSelections[i].call('mousemove', intersectedVisualElements[j], e);
                        }
                        if (intersectedVisualElements.length > 0)
                            nothingIntersected = false;
                    }
                    if (nothingIntersected && this.mouseDown) {
                        if (this.isPanEnabled) {
                            this.panOffset = [e.clientX - this.mouseStart[0], e.clientY - this.mouseStart[1]];
                            if (this.isHorizontalPanEnabled)
                                webgl.camera.position.x = this.cameraStart[0] - this.panOffset[0] / webgl.camera.zoom;
                            webgl.camera.position.y = this.cameraStart[1] + this.panOffset[1] / webgl.camera.zoom;
                            webgl.render();
                        }
                    }
                }
            }
            clickHandler(e) {
                this.mouse = mouseToWorldCoordinates(e.clientX, e.clientY);
                var intersectedVisualElements = [];
                for (var i = 0; i < this.clickSelections.length; i++) {
                    intersectedVisualElements = this.intersect(this.clickSelections[i], this.mouse[0], this.mouse[1]);
                    for (var j = 0; j < intersectedVisualElements.length; j++) {
                        this.clickSelections[i].call('click', intersectedVisualElements[j], e);
                    }
                }
                this.mouseDown = false;
            }
            mouseDownHandler(e) {
                this.mouse = mouseToWorldCoordinates(e.clientX, e.clientY);
                this.mouseStart = [e.clientX, e.clientY];
                this.cameraStart = [webgl.camera.position.x, webgl.camera.position.y];
                this.mouseDown = true;
                var intersectedVisualElements = [];
                for (var i = 0; i < this.mouseDownSelections.length; i++) {
                    intersectedVisualElements = this.intersect(this.mouseDownSelections[i], this.mouse[0], this.mouse[1]);
                    for (var j = 0; j < intersectedVisualElements.length; j++) {
                        this.mouseDownSelections[i].call('mousedown', intersectedVisualElements[j], e);
                    }
                }
                this.lassoPoints = [];
                this.lassoPoints.push(this.mouse);
                if (this.lassoStartHandler && e.which == 2) {
                    this.lassoStartHandler(this.lassoPoints);
                }
            }
            mouseUpHandler(e) {
                this.mouse = mouseToWorldCoordinates(e.clientX, e.clientY);
                var intersectedVisualElements = [];
                for (var i = 0; i < this.mouseUpSelections.length; i++) {
                    intersectedVisualElements = this.intersect(this.mouseUpSelections[i], this.mouse[0], this.mouse[1]);
                    for (var j = 0; j < intersectedVisualElements.length; j++) {
                        this.mouseUpSelections[i].call('mouseup', intersectedVisualElements[j], e);
                    }
                }
                this.mouseDown = false;
                if (this.lassoEndHandler && e.which == 2) {
                    this.lassoEndHandler(this.lassoPoints);
                }
            }
            intersect(selection, mousex, mousey) {
                switch (selection.shape) {
                    case 'circle': return this.intersectCircles(selection);
                    case 'rect': return this.intersectRects(selection);
                    case 'path': return this.intersectPaths(selection);
                    case 'text': return this.intersectRects(selection);
                }
                return [];
            }
            intersectCircles(selection) {
                var intersectedElements = [];
                var d;
                for (var i = 0; i < selection.dataElements.length; i++) {
                    d = Math.sqrt(Math.pow(this.mouse[0] - selection.x[i], 2) + Math.pow(this.mouse[1] - selection.y[i], 2));
                    if (d <= selection.r[i])
                        intersectedElements.push(selection.dataElements[i]);
                }
                return intersectedElements;
            }
            intersectRects(selection) {
                var intersectedElements = [];
                var d;
                var e;
                for (var i = 0; i < selection.visualElements.length; i++) {
                    e = selection.visualElements[i];
                    if (this.mouse[0] >= e.position.x && this.mouse[0] <= e.position.x + e.geometry.vertices[0].x * e.scale.x
                        && this.mouse[1] <= e.position.y && this.mouse[1] >= e.position.y + e.geometry.vertices[1].y * e.scale.y)
                        intersectedElements.push(selection.dataElements[i]);
                }
                return intersectedElements;
            }
            intersectPaths(selection) {
                var intersectedElements = [];
                var e;
                var v1, v2;
                var x, y;
                var found = false;
                for (var i = 0; i < selection.visualElements.length; i++) {
                    e = selection.visualElements[i];
                    for (var j = 1; j < e.geometry.vertices.length; j++) {
                        v1 = e.geometry.vertices[j - 1];
                        v1 = { x: v1.x + selection.x[i],
                            y: v1.y + selection.y[i]
                        };
                        v2 = e.geometry.vertices[j];
                        v2 = { x: v2.x + selection.x[i],
                            y: v2.y + selection.y[i]
                        };
                        if (distToSegmentSquared({ x: this.mouse[0], y: this.mouse[1] }, v1, v2) < 3) {
                            intersectedElements.push(selection.dataElements[i]);
                            found = true;
                            break;
                        }
                    }
                    if (found)
                        break;
                }
                return intersectedElements;
                function sqr(x) {
                    return x * x;
                }
                function dist2(v, w) {
                    return sqr(v.x - w.x) + sqr(v.y - w.y);
                }
                function distToSegmentSquared(p, v, w) {
                    var l2 = dist2(v, w);
                    if (l2 == 0)
                        return dist2(p, v);
                    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
                    if (t < 0)
                        return dist2(p, v);
                    if (t > 1)
                        return dist2(p, w);
                    return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
                }
                function distToSegment(p, v, w) {
                    return Math.sqrt(distToSegmentSquared(p, v, w));
                }
            }
        }
        glutils.WebGLInteractor = WebGLInteractor;
        function mouseToWorldCoordinates(mouseX, mouseY) {
            var rect = webgl.canvas.getBoundingClientRect();
            var x = webgl.camera.position.x + webgl.camera.left / webgl.camera.zoom + (mouseX - rect.left) / webgl.camera.zoom;
            var y = webgl.camera.position.y + webgl.camera.top / webgl.camera.zoom - (mouseY - rect.top) / webgl.camera.zoom;
            return [x, y];
        }
        glutils.mouseToWorldCoordinates = mouseToWorldCoordinates;
        function curve(points) {
            var arrayPoints = [];
            for (var i = 0; i < points.length; i++) {
                if (!isNaN(points[i].x))
                    arrayPoints.push([points[i].x, points[i].y]);
            }
            var spline = new BSpline(arrayPoints, 3);
            var curvePoints = [];
            for (var t = 0; t <= 1; t += 0.01) {
                var p = spline.calcAt(t);
                curvePoints.push({ x: p[0], y: p[1] });
            }
            return curvePoints;
        }
        glutils.curve = curve;
        class CheckBox {
            constructor() {
                this.selected = false;
                this.frame = selectAll()
                    .data([0])
                    .append('circle')
                    .attr('r', 5)
                    .style('fill', '#fff')
                    .style('stroke', '#000000')
                    .on('click', () => {
                    this.selected = !this.selected;
                    this.circle.style('opacity', this.selected ? 1 : 0);
                    if (this.changeCallBack != undefined)
                        this.changeCallBack();
                });
                this.circle = selectAll()
                    .data([0]);
            }
            attr(attrName, value) {
                switch (attrName) {
                    case 'x':
                        this.frame.attr('x', value);
                        return this;
                    case 'y':
                        this.frame.attr('y', value);
                        return this;
                }
            }
            on(eventType, fn) {
                switch (eventType) {
                    case 'change': this.changeCallBack = fn;
                }
            }
        }
        glutils.CheckBox = CheckBox;
    })(glutils || (glutils = {}));
    var THREEx = THREEx || {};
    THREEx.DynamicTexture = function (width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        this.canvas = canvas;
        var context = canvas.getContext('2d');
        this.context = context;
        var texture = new THREE.Texture(canvas);
        this.texture = texture;
    };
    THREEx.DynamicTexture.prototype.clear = function (fillStyle) {
        if (fillStyle !== undefined) {
            this.context.fillStyle = fillStyle;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        else {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        this.texture.needsUpdate = true;
        return this;
    };
    THREEx.DynamicTexture.prototype.drawText = function (text, x, y, fillStyle, contextFont) {
        if (contextFont !== undefined)
            this.context.font = contextFont;
        if (x === undefined || x === null) {
            var textSize = this.context.measureText(text);
            x = (this.canvas.width - textSize.width) / 2;
        }
        this.context.fillStyle = fillStyle;
        this.context.fillText(text, x, y);
        this.texture.needsUpdate = true;
        return this;
    };
    THREEx.DynamicTexture.prototype.drawTextCooked = function (text, options) {
        var context = this.context;
        var canvas = this.canvas;
        options = options || {};
        var params = {
            margin: options.margin !== undefined ? options.margin : 0.1,
            lineHeight: options.lineHeight !== undefined ? options.lineHeight : 0.1,
            align: options.align !== undefined ? options.align : 'left',
            fillStyle: options.fillStyle !== undefined ? options.fillStyle : 'black',
        };
        context.save();
        context.fillStyle = params.fillStyle;
        var y = (params.lineHeight + params.margin) * canvas.height;
        while (text.length > 0) {
            var maxText = computeMaxTextLength(text);
            text = text.substr(maxText.length);
            var textSize = context.measureText(maxText);
            if (params.align === 'left') {
                var x = params.margin * canvas.width;
            }
            else if (params.align === 'right') {
                var x = (1 - params.margin) * canvas.width - textSize.width;
            }
            else if (params.align === 'center') {
                var x = (canvas.width - textSize.width) / 2;
            }
            else
                console.assert(false);
            this.context.fillText(maxText, x, y);
            y += params.lineHeight * canvas.height;
        }
        context.restore();
        this.texture.needsUpdate = true;
        return this;
        function computeMaxTextLength(text) {
            var maxText = '';
            var maxWidth = (1 - params.margin * 2) * canvas.width;
            while (maxText.length !== text.length) {
                var textSize = context.measureText(maxText);
                if (textSize.width > maxWidth)
                    break;
                maxText += text.substr(maxText.length, 1);
            }
            return maxText;
        }
    };
    THREEx.DynamicTexture.prototype.drawImage = function () {
        this.context.drawImage.apply(this.context, arguments);
        this.texture.needsUpdate = true;
        return this;
    };
    var geometry;
    (function (geometry) {
        function length(v1) {
            return Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
        }
        geometry.length = length;
        function normalize(v) {
            var l = length(v);
            return [v[0] / l, v[1] / l];
        }
        geometry.normalize = normalize;
        function setLength(v, l) {
            var len = length(v);
            return [l * v[0] / len, l * v[1] / len];
        }
        geometry.setLength = setLength;
    })(geometry || (geometry = {}));
});
//# sourceMappingURL=networkcube.js.map
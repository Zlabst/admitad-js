(function (window, document) {

    'use strict';

    var Math = window.Math,
        HTMLElement = window.HTMLElement,
        encodeURIComponent = window.encodeURIComponent,
        parseInt = window.parseInt;

    window.AdmitadFrameEvent = ({
        frameVisibleSizeCallback: null,
        resizeCallback: null,
        scrollCallback: null,
        windowSizeCallback: null,
        scrollToFrame: false,
        trackPath: false,
        sizeMessagePrefix: 'size=',
        pathMessagePrefix: 'path=',
        frameVisibleSizeMessagePrefix: 'getFrameVisibleSize',
        windowSizesMessagePrefix: 'getWindowSize',
        resizeCallbackPrefix: 'setResizeCallback',
        scrollCallbackPrefix: 'setScrollCallback',
        scrollMessagePrefix: 'scroll=',
        showLoaderPrefix: 'showLoader',
        hideLoaderPrefix: 'hideLoader',
        isPostMessageSupported: function () {
            return !!window.postMessage && window.onmessage !== undefined;
        },
        isFrame: function () {
            return window.top.location !== window.location;
        },
        isSupportedFrame: function () {
            return this.isFrame() && this.isPostMessageSupported();
        },
        isElement: function (elm) {
            return !!elm && (
                typeof HTMLElement === 'object' ?
                        elm instanceof HTMLElement : elm &&
                        typeof elm === 'object' && elm.nodeType === 1 &&
                        typeof elm.nodeName === 'string'
            );
        },
        isSupportsHistoryApi: function () {
            return !!(window.history && history.pushState);
        },
        getWindowSize: function () {
            var doc = document.documentElement,
                body = document.body || document.getElementsByTagName('body')[0],
                x = window.innerWidth || doc.clientWidth || body.clientWidth,
                y = window.innerHeight || doc.clientHeight || body.clientHeight;
            return [x, y];
        },
        getElementHeight: function (elm) {
            return (elm.clip !== undefined && elm.clip.height) ||
                elm.style.pixelHeight || elm.offsetHeight;
        },
        getElementWidth: function (elm) {
            return (elm.clip !== undefined && elm.clip.width) ||
                elm.style.pixelWidth || elm.offsetWidth;
        },
        strToObj: function (data) {
            var parts = data.split(','), i, part, obj = {};
            for (i = 0; i < parts.length; i += 1) {
                part = parts[i].split('=');
                obj[part[0]] = +part[1];
            }
            return obj;
        },
        setScrollToFrame: function (value) {
            this.scrollToFrame = value;
            return this;
        },
        setTrackPath: function (value) {
            this.trackPath = value;
            return this;
        },
        setFrameVisibleSizeCallback: function (func) {
            this.frameVisibleSizeCallback = func;
            return this;
        },
        setResizeCallback: function (func) {
            this.resizeCallback = func;
            return this;
        },
        setScrollCallback: function (func) {
            this.scrollCallback = func;
            return this;
        },
        setWindowSizeCallback: function (func) {
            this.windowSizeCallback = func;
            return this;
        },
        getDocumentSize: function () {
            var body = document.body || document.getElementsByTagName('body')[0],
                width = Math.max(body.clientWidth || 0, body.offsetWidth || 0),
                height = Math.max(body.clientHeight || 0, body.offsetHeight || 0);
            return height + ',' + width;
        },
        getDocumentPath: function () {
            return window.location.pathname + window.location.search;
        },
        sendMessage: function (message) {
            if (this.isSupportedFrame()) {
                // if browser supports, then send message with PostMessage tech
                window.parent.postMessage(message, '*');
            }
        },
        sendSizeMessage: function () {
            this.sendMessage(this.sizeMessagePrefix + this.getDocumentSize());
        },
        sendPathMessage: function () {
            this.sendMessage(this.pathMessagePrefix + encodeURIComponent(this.getDocumentPath()));
        },
        resizeParent: function () {
            this.sendSizeMessage();
        },
        centerElementWithinFrame: function (elm) {
            if (!this.isElement(elm)) { return; }
            var elmWidth = this.getElementWidth(elm),
                elmHeight = this.getElementHeight(elm),
                windowWidth = this.getWindowSize()[0];
            this.requestFrameVisibleSize(function (data) {
                var top, left;
                left = (windowWidth - elmWidth) / 2;
                top = data.top + (data.bottom - data.top - elmHeight) / 2;
                elm.style.position = 'absolute';
                elm.style.top = top + 'px';
                elm.style.left = left + 'px';
            });
        },
        sendScrollMessage: function () {
            // message to scroll parent window to position
            // of beginning of frame
            this.sendMessage(this.scrollMessagePrefix + 'frame');
        },
        addEvent: function (event, func, elem) {
            elem = elem || window;
            if (elem.addEventListener) {
                elem.addEventListener(event, func, false);
            } else if (elem.attachEvent) {
                elem.attachEvent('on' + event, func);
            } else {
                var fn = elem['on' + event];
                elem['on' + event] = function () {
                    func();
                    if (fn) { fn(); }
                };
            }
        },
        removeEvent: function (event, func, elem) {
            elem = elem || window;
            if (elem.removeEventListener) {
                elem.removeEventListener(event, func, false);
            } else if (elem.detachEvent) {
                elem.detachEvent('on' + event, func);
            } else {
                delete elem['on' + event];
            }
        },
        requestFrameVisibleSize: function (callback) {
            if (!this.isFrame()) { return; }
            this.sendMessage(this.frameVisibleSizeMessagePrefix);
            // store callback
            this.setFrameVisibleSizeCallback(callback);
        },
        requestResizeCallback: function (callback) {
            if (!this.isFrame()) { return; }
            this.sendMessage(this.resizeCallbackPrefix);
            // store callback
            this.setResizeCallback(callback);
        },
        requestScrollCallback: function (callback) {
            if (!this.isFrame()) { return; }
            this.sendMessage(this.scrollCallbackPrefix);
            // store callback
            this.setScrollCallback(callback);
        },
        requestWindowSize: function (callback) {
            if (!this.isFrame()) { return; }
            this.sendMessage(this.windowSizesMessagePrefix);
            // store callback
            this.setWindowSizeCallback(callback);
        },
        requestShowLoader: function () {
            if (!this.isFrame()) { return; }
            this.sendMessage(this.showLoaderPrefix);
        },
        requestHideLoader: function () {
            if (!this.isFrame()) { return; }
            this.sendMessage(this.hideLoaderPrefix);
        },
        requestScrollToFrameTopOffset: function (value) {
            // message to scroll parent window to frame top offset
            this.sendMessage(this.scrollMessagePrefix + value);
        },
        processScrollCallback: function (data) {
            if (!data) { return; }
            var size = data.match(/scroll=((\w+=\d+(\.\d+)?,){8}\w+=\d+(\.\d+)?)$/),
                obj;
            if (size) {
                // parse data string
                obj = this.strToObj(size[1]);
                if (typeof this.scrollCallback === 'function') {
                    this.scrollCallback(obj);
                }
            }
        },
        processFrameVisibleSizeCallback: function (data) {
            if (!data) { return; }
            var size = data.match(/size=(\d+),(\d+)$/),
                top,
                bottom;
            if (size) {
                top = parseInt(size[1], 10);
                bottom = parseInt(size[2], 10);
                if (typeof this.frameVisibleSizeCallback === 'function') {
                    this.frameVisibleSizeCallback({top: top, bottom: bottom});
                }
            }
        },
        processWindowSizeCallback: function (data) {
            if (!data) { return; }
            var size = data.match(/size=((\w+=\d+(\.\d+)?,){8}\w+=\d+(\.\d+)?)$/),
                obj;
            if (size) {
                // parse data string
                obj = this.strToObj(size[1]);
                if (typeof this.windowSizeCallback === 'function') {
                    this.windowSizeCallback(obj);
                    this.windowSizeCallback = null;
                }
                if (typeof this.resizeCallback === 'function') {
                    this.resizeCallback(obj);
                }
            }
        },
        bindRequestEvents: function () {
            if (!this.isSupportedFrame()) { return this; }
            var self = this;
            this.addEvent('message', function (e) {
                e = e.originalEvent || e;
                var data = e.data;
                self.processScrollCallback(data);
                self.processFrameVisibleSizeCallback(data);
                self.processWindowSizeCallback(data);
            });
            return this;
        },
        bindResizeEvents: function () {
            if (!this.isSupportedFrame()) { return this; }
            var self = this;
            function loadCallback() {
                if (!loadCallback.loaded) {
                    loadCallback.loaded = true;
                    self.addEvent('resize', self.sendSizeMessage());
                    self.sendSizeMessage();
                    if (self.isSupportsHistoryApi() && self.trackPath) {
                        self.sendPathMessage();
                    }
                    if (self.scrollToFrame) {
                        self.sendScrollMessage();
                    }
                }
            }
            loadCallback.loaded = false;
            // on load events
            if (document.readyState === 'complete') {
                loadCallback();
            } else {
                this.addEvent('load', loadCallback);
            }
            return this;
        }
    }).bindResizeEvents().bindRequestEvents();

}(window, window.document));

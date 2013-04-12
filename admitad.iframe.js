(function (window, document) {

    "use strict";

    var Math = window.Math,
        HTMLElement = window.HTMLElement,
        parseInt = window.parseInt;

    window.AdmitadFrameEvent = ({
        frameVisibleSizeCallback: null,
        scrollToFrame: false,
        sizeMessagePrefix: 'size=',
        frameVisibleSizeMessagePrefix: 'getFrameVisibleSize',
        scrollMessagePrefix: 'scroll=',
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
                typeof HTMLElement === "object" ?
                        elm instanceof HTMLElement : elm &&
                        typeof elm === "object" && elm.nodeType === 1 &&
                        typeof elm.nodeName === "string"
            );
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
        setScrollToFrame: function (value) {
            this.scrollToFrame = value;
        },
        setFrameVisibleSizeCallback: function (func) {
            this.frameVisibleSizeCallback = func;
        },
        getDocumentSize: function () {
            var body = document.body || document.getElementsByTagName('body')[0],
                width = Math.max(body.clientWidth || 0, body.offsetWidth || 0),
                height = Math.max(body.clientHeight || 0, body.offsetHeight || 0);
            return height + ',' + width;
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
                elm.style.position = "absolute";
                elm.style.top = top + "px";
                elm.style.left = left + "px";
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
        bindFrameVisibleSizeEvent: function () {
            if (!this.isSupportedFrame()) { return this; }
            // if postMessage is supporting then attach event
            var self = this;
            this.addEvent('message', function (e) {
                e = e.originalEvent || e;
                var data = e.data,
                    size = data.match(/size=(\d+),(\d+)$/),
                    top,
                    bottom;
                if (size) {
                    top = parseInt(size[1], 10);
                    bottom = parseInt(size[2], 10);
                    if (typeof self.frameVisibleSizeCallback === 'function') {
                        self.frameVisibleSizeCallback({top: top, bottom: bottom});
                    }
                }
            });
            return this;
        },
        bindResizeEvents: function () {
            if (!this.isSupportedFrame()) { return this; }
            var self = this;
            function loadCallback() {
                if (!loadCallback.loaded) {
                    loadCallback.loaded = true;
                    self.sendSizeMessage();
                    if (self.scrollToFrame) {
                        self.sendScrollMessage();
                    }
                }
            }
            loadCallback.loaded = false;
            this.addEvent('resize', self.sendSizeMessage());
            // on load events
            if (document.readyState === "complete") {
                loadCallback();
            } else {
                this.addEvent('load', loadCallback);
            }
            return this;
        }
    }).bindResizeEvents().bindFrameVisibleSizeEvent();

}(window, window.document));

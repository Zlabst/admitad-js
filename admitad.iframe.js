(function (window, document) {

    "use strict";

    var Math = window.Math;

    window.AdmitadFrameEvent = ({
        frameVisibleSizeCallback: null,
        scrollToFrame: false,
        sizeMessagePrefix: 'size=',
        getFrameVisibleSizeMessagePrefix: 'getFrameVisibleSize',
        scrollMessagePrefix: 'scroll=',
        setScrollToFrame: function (value) {
            this.scrollToFrame = value;
        },
        isPostMessageSupported: function () {
            return !!window.postMessage && window.onmessage !== undefined;
        },
        setFrameVisibleSizeCallback: function (func) {
            this.frameVisibleSizeCallback = func;
        },
        getDocumentSize: function () {
            var body = document.body,
                width = Math.max(body.clientWidth || 0, body.offsetWidth || 0),
                height = Math.max(body.clientHeight || 0, body.offsetHeight || 0);
            return height + ',' + width;
        },
        sendMessage: function (message) {
            // if no within frame - skip
            if (window.top.location === window.location) { return; }
            if (this.isPostMessageSupported()) {
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
                elem['on' + event] = func;
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
            if (window.top.location === window.location) { return; }
            this.sendMessage(this.getFrameVisibleSizeMessagePrefix);
            // store callback
            this.setFrameVisibleSizeCallback(callback);
        },
        bindFrameVisibleSizeEvent: function () {
            if (this.isPostMessageSupported()) {
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
            }
            return this;
        },
        bindResizeEvents: function () {
            var self = this,
                loadCallback = function () {
                    self.sendSizeMessage();
                    if (self.scrollToFrame) {
                        self.sendScrollMessage();
                    }
                };
            this.addEvent('load', loadCallback);
            this.addEvent('resize', self.sendSizeMessage());
            return this;
        }
    }).bindResizeEvents().bindFrameVisibleSizeEvent();

}(window, window.document));

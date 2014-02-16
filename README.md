admitad-js
==================

admitad-js is a Javascript library that helps to deal with Admitad applications frames.

Install
----------

    <script src="PATH_TO_SRC/admitad.iframe.js" type="text/javascript"></script>

Usage
-------

To scroll to the top of the frame. Set to true in order to scroll the window
to the top of the frame on the onload event.

    window.AdmitadFrameEvent.setScrollToFrame(true);

To resize the parent window so that to fit the frame body.

    window.AdmitadFrameEvent.resizeParent();

To send a iframe path in the parent window. The path will be set as *path* query parameter with History API.

    window.AdmitadFrameEvent.setTrackPath(true);

To get a visible frame size(height). The callback will be called
with the frame visible part coordinates {top: top, bottom: bottom}.

    window.AdmitadFrameEvent.requestFrameVisibleSize(function(data) {
        console.log('top is ' + data.top);
        console.log('bottom is ' + data.bottom);
    });

To center an element(on example pop-up) relative to the frame visible part.

    window.AdmitadFrameEvent.centerElementWithinFrame(elm);

To get a parent window size.

    window.AdmitadFrameEvent.requestWindowSize(function (data) {
        console.log('documentHeight is ' + data.documentHeight);
        console.log('documentWidth is ' + data.documentWidth);
        console.log('frameHeight is ' + data.frameHeight);
        console.log('frameWidth is ' + data.frameWidth);
        console.log('frameLeft is ' + data.frameLeft);
        console.log('frameTop is ' + data.frameTop);
        console.log('windowHeight is ' + data.windowHeight);
        console.log('windowScrollTop is '  + data.windowScrollTop);
        console.log('windowWidth is ' + data.windowWidth);
    });

To bind the onscroll event of the parent window. It will send a parent window size into a callback.

    window.AdmitadFrameEvent.requestScrollCallback(function (data) {
        console.log('documentHeight is ' + data.documentHeight);
        console.log('documentWidth is ' + data.documentWidth);
        console.log('frameHeight is ' + data.frameHeight);
        console.log('frameWidth is ' + data.frameWidth);
        console.log('frameLeft is ' + data.frameLeft);
        console.log('frameTop is ' + data.frameTop);
        console.log('windowHeight is ' + data.windowHeight);
        console.log('windowScrollTop is '  + data.windowScrollTop);
        console.log('windowWidth is ' + data.windowWidth);
    });

To bind the onresize event of the parent window. It will send a parent window size into a callback.

    window.AdmitadFrameEvent.requestResizeCallback(function (data) {
        console.log('documentHeight is ' + data.documentHeight);
        console.log('documentWidth is ' + data.documentWidth);
        console.log('frameHeight is ' + data.frameHeight);
        console.log('frameWidth is ' + data.frameWidth);
        console.log('frameLeft is ' + data.frameLeft);
        console.log('frameTop is ' + data.frameTop);
        console.log('windowHeight is ' + data.windowHeight);
        console.log('windowScrollTop is '  + data.windowScrollTop);
        console.log('windowWidth is ' + data.windowWidth);
    });


To show the loader on the parent window.

    window.AdmitadFrameEvent.requestShowLoader();

To hide the loader on the parent window.

    window.AdmitadFrameEvent.requestHideLoader();

To scroll the parent window relative the frame top with some offset

    window.AdmitadFrameEvent.requestScrollToFrameTopOffset(500)


Notes
------

Often there is no need to invoke resizeParent() by itself.  
The function will be invoked also when "onresize" and "onload" events will be triggered.

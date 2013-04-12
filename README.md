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

To resize a parent window so that to fit the frame body.

    window.AdmitadFrameEvent.resizeParent();

To get a visible frame size(height). The callback will be called
with the frame visible part coordinates {top: top, bottom: bottom}.

    window.AdmitadFrameEvent.requestFrameVisibleSize(function(data) {
        console.log('top is ' + data.top);
        console.log('bottom is ' + data.bottom);
    });

To center a element(on example pop-up) relative to the frame visible part.

    window.AdmitadFrameEvent.centerElementWithinFrame(elm);

Notes
------

Often there is no need to invoke resizeParent() by itself.  
The function will be invoked also when "onresize" and "onload" events will be triggered.

admitad-js
==================

admitad-js is a Javascript library that helps to deal with Admitad applications frames.

Install
----------
Include in the your application page.

    <script src="PATH_TO_SRC/admitad.iframe.js" type="text/javascript"></script>

Usage
-------

To scroll to the top of the frame. If set to try then the window
will be scroilled to the top of the frame on the page loaded event.

    window.AdmitadFrameEvent.setScrollToFrame(true);

To resize parent window so that to fit the frame body:

    window.AdmitadFrameEvent.resizeParent();

To get a visible frame size(height). The callback will be called
with the frame visible part coordinates {top: top, bottom: bottom}

    window.AdmitadFrameEvent.requestFrameVisibleSize(callback);


Notes
------

No need to call resizeParent() every time. There are binded
"onresize" and "onload" events that will be invoked resizeParent() itself.

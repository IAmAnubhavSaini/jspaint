(function() {
    "use strict";

    function warningPrefix() {
        return 'You are visiting jspaint in an insecure way!';
    }

    function appHomePage() {
        return 'https://iamanubhavsaini.github.io/jspaint/index.html';
    }

    function setBlockerStyle(blocker) {
        blocker.style.width = '100%';
        blocker.style.height = '100%';
        blocker.style.minHeight = '600px';
        blocker.style.minWidth = '800px';
        blocker.style.lineHeight = '600px';
        blocker.style.textAlign = 'center';
        blocker.style.fontSize = '72px';
        blocker.style.backgroundColor = '#FF0000';
        blocker.style.color = '#FFFFFF';
        blocker.style.textShadow = '2px 2px #000000';
        blocker.style.position = 'fixed';
        blocker.style.top = '0';

        return blocker;
    }

    function createBlocker() {
        var blocker = document.createElement('div');

        blocker = setBlockerStyle(blocker);

        blocker.innerHTML = warningPrefix() + 'Please visit ' + appHomePage();

        return blocker;
    }

    function injectBlocker() {
        (document.getElementsByTagName('html'))[0].appendChild(createBlocker());
    }

    function alertMessage() {
        return 'Security risk! Go to original page: ' + window.self.location.href;
    }

    function alertUserAboutScam() {
        alert(alertMessage());
    }

    function goToJSPaintHome() {
        window.top.location.replace(window.self.location.href);
    }

    if (window.top !== window.self) {
        injectBlocker();
        alertUserAboutScam();
        goToJSPaintHome();
    }
})();

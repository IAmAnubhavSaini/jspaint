const iFrameBuster = (function () {
    "use strict";

    function IFrameBuster() {
        const self = this instanceof IFrameBuster ? this : Object.create(IFrameBuster.prototype);
        self.warningPrefix = (function () {
            return 'You are visiting jspaint in an insecure way!';
        })();
        self.appHomePage = (function () {
            return 'http://IAmAnubhavSaini.github.io/jspaint';
        })();
        self.alertMessage = (function () {
            return 'Security risk! Go to original page: ' + window.self.location.href;
        })();
        self.activationStatus = false;
        return self;
    }

    IFrameBuster.prototype.isActivated = function () {
        return this.activationStatus === true;
    };

    IFrameBuster.prototype.alertUserAboutScam = function () {
        alert(this.alertMessage);
    };

    IFrameBuster.prototype.setBlockerStyle = function (blocker) {
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
    };

    IFrameBuster.prototype.createBlocker = function () {
        const blocker = this.setBlockerStyle(document.createElement('div'));
        blocker.innerHTML = this.warningPrefix + 'Please visit ' + this.appHomePage;
        return blocker;
    };

    IFrameBuster.prototype.injectBlocker = function () {
        (document.getElementsByTagName('html'))[0].appendChild(this.createBlocker());
    };

    IFrameBuster.prototype.goToJSPaintHome = function () {
        window.top.location.replace(window.self.location.href);
    };

    IFrameBuster.prototype.activate = function () {
        if (window.top !== window.self) {
            this.injectBlocker();
            this.alertUserAboutScam();
            this.goToJSPaintHome();
            this.activationStatus = true;
        }
    };

    const buster = new IFrameBuster();
    buster.activate();
    return buster;
})();

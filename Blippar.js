(function(w) {
    var Blippar = {};
    var customUrl = "";
    function deviceFamily() {
        if (navigator.userAgent.match(/Android/i)) {
            return "android";
        } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            return "ios";
        } else if (navigator.userAgent.match(/IEMobile/i)) {
            return "windowsphone"
        }
        return "unknown";
    }
    var altUrl = "http://get.blippar.com";
    var timer;
    var heartbeat;
    var iframe_timer;
    function clearTimers() {
        clearTimeout(timer);
        clearTimeout(heartbeat);
        clearTimeout(iframe_timer);
    }
    function intervalHeartbeat() {
        if (document.webkitHidden || document.hidden) {
            clearTimers();
        }
    }
    function tryIframeApproach() {
        var iframe = document.createElement("iframe");
        iframe.style.border = "none";
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        iframe.onload = function() {
            document.location = altUrl;
        }
        ;
        iframe.src = customUrl;
        document.body.appendChild(iframe);
    }
    function tryWebkitApproach() {
        document.location = customUrl;
        timer = setTimeout(function() {
            document.location = altUrl;
        }, 2500);
    }
    function useIntent(address, protocol, returnToBrowser) {
        param = returnToBrowser ? "sourceAppURL" : "sourceURL";
        document.location = "intent://#Intent;scheme=" + protocol + ";package=com.blippar.ar.android.beta;S." + param + "=" + document.URL + ";S.address=" + address + ";end";
    }
    function isChrome() {
        if (navigator.userAgent.match(/Chrome/)) {
            var version = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
            if (version >= 25) {
                return true;
            }
        }
        return false;
    }
    function launchBlippAndroid(address, protocol, returnToBrowser) {
        heartbeat = setInterval(intervalHeartbeat, 200);
        if (isChrome()) {
            useIntent(address, protocol, returnToBrowser);
        } else if (navigator.userAgent.match(/Firefox/)) {
            tryWebkitApproach();
            iframe_timer = setTimeout(function() {
                tryIframeApproach();
            }, 1500);
        } else {
            tryIframeApproach();
        }
    }
    function launchBlippiOS() {
        setTimeout(function() {
            if (!document.webkitHidden) {
                window.location = "http://get.blippar.com";
            }
        }, 300);
        window.location = customUrl;
    }
    Blippar.triggerBlipp = function(event, address, protocol, returnToBrowser) {
        customUrl = protocol + "://" + address + "?sourceURL=" + document.URL;
        if (returnToBrowser) {
            customUrl = customUrl + "&sourceAppURL=" + document.URL;
        }
        var type = deviceFamily();
        if (type === "android") {
            launchBlippAndroid(address, protocol, returnToBrowser);
        } else if (type === "ios") {
            launchBlippiOS();
        } else if (type === "windowsphone") {
            setTimeout(function() {
                window.location = "http://get.blippar.com";
            }, 40);
            window.location = customUrl;
        } else {
            window.location = "http://get.blippar.com";
        }
        event && event.preventDefault();
    }
    w.Blippar = Blippar;
})(window);

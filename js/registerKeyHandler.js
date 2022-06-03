var uhdStatus = false;

// Handle input from remote
var registerKeyHandler = function (player) {
    document.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            case 13:    // Enter
                player.toggleFullscreen();
                break;
            case 415:   // MediaPlay
                player.play();
            break;
            case 19:    // MediaPause
                player.pause();
                break;
            case 413:   // MediaStop
                player.stop();
                break;
            case 417:   // MediaFastForward
                player.ff();
                break;
            case 412:   // MediaRewind
                player.rew();
                break;
            case 48: //Key 0
                log();
                break;
            case 49: //Key 1
                setUhd();
                break;
            case 50: //Key 2
                player.getTracks();
                break;
            case 51: //Key 3
                player.getProperties();
                break;
            case 10009: // Return
                if (webapis.avplay.getState() !== 'IDLE' && webapis.avplay.getState() !== 'NONE') {
                    player.stop();
                }
                tizen.application.getCurrentApplication().hide();
                break;
            default:
                log(e.keyCode);
        }
    });
}

// registeration key for emulator 
var registerKeys = function() {
    var usedKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",  "ChannelUp", "ChannelDown", "MediaPlay", "MediaPause", "MediaFastForward", "MediaRewind", "Exit" ];
    usedKeys.forEach(function (keyName) {tizen.tvinputdevice.registerKey(keyName); });
}

// chgitem inchi hamara piti usumnasirem
function setUhd() {
    if (!uhdStatus) {
        if (webapis.productinfo.isUdPanelSupported()) {log('4k enabled');uhdStatus = true;} 
        else { log('this device does not have a panel capable of displaying 4k content') }
    } 
    else { log('4k disabled');uhdStatus = false }
    player.setUhd(uhdStatus);
}

// paint screen data on tv 
var displayVersion = function() {
    var el = document.createElement('div');
    el.id = 'version';
    el.innerHTML = 'ver: ' + tizen.application.getAppInfo().version;
    document.body.appendChild(el);
}

// Log tizen data on tv 
var log = function(msg) {
    var logsEl = document.getElementById('logs');
    if (msg) { 
        logsEl.innerHTML += msg + '<br />'; 
    } 
    else {logsEl.innerHTML = '';}
    logsEl.scrollTop = logsEl.scrollHeight;
}


function VideoPlayer(config) {
    var log = config.logger;
    var AV_Player = config.player;
    var isFullscreen = false;
    var info = config.info;
    var isUhd = false;

    return {

    	open: function(url){
    		/* Create listener object. */
            var listener = {
                onbufferingstart: function () {
                    log("Buffering start.");
                },
                onbufferingprogress: function (percent) {
                    log("Buffering progress data : " + percent);
                },
                onbufferingcomplete: function () {
                    log("Buffering complete.");
                },
                oncurrentplaytime: function (currentTime) {
                    log("Current playtime: " + currentTime);
                },
                onevent: function (eventType, eventData) {
                    log("event type: " + eventType + ", data: " + eventData);
                },
                onstreamcompleted: function () {
                    log("Stream Completed");
                    this.stop();
                }.bind(this),
                onerror: function (eventType) {
                    log("event type error : " + eventType);
                }
            };

            if (!url) {url = config.url}
            log('videoPlayer open: ' + url);
            
            try {
                webapis.avplay.open(url);
                webapis.avplay.setDisplayRect( 20,20,1054,800 );
                webapis.avplay.setListener(listener);
            } catch (e) { log(e) }
            
    	},
    	
        play: function () {
            //set 4k
            if ( isUhd ) { this.set4K() }
            if (webapis.avplay.getState() === 'IDLE') {
            	webapis.avplay.prepare();                
                webapis.avplay.play();
            } else if(webapis.avplay.getState() === 'PAUSED'){
            	webapis.avplay.play();
            }            
        },
       
        stop: function () {
            webapis.avplay.stop();
            if (isFullscreen === true) { this.toggleFullscreen() }
            info.innerHTML = '';
        },

        pause: function (url) {
            if (!url) { url = config.url }
            webapis.avplay.pause();
        },

        toggleFullscreen: function () {
            if (isFullscreen === false) {
                webapis.avplay.setDisplayRect(0, 0, 1920, 1080);
                AV_Player.classList.add('fullscreenMode');
                isFullscreen = true;
            } else {
                log('Fullscreen off');
                try {webapis.avplay.setDisplayRect( 20,20,1054,800 )} 
                catch (e) { log(e) }
                AV_Player.classList.remove('fullscreenMode');
                isFullscreen = false;
            }
        },

        ff: function () {
            webapis.avplay.jumpForward('3000');
        },

        rew: function () {
            webapis.avplay.jumpBackward('1000');
        },

        setUhd: function (isEnabled) {
            isUhd = isEnabled;
        },
        /*** Set to TV to play UHD content... */
         
        set4K: function () {
            webapis.avplay.setStreamingProperty("SET_MODE_4K", "true");
        },

        setBitrate: function (from, to, start, skip) {
            var bitrates = '|BITRATES=' + from + '~' + to;

            if (start !== '' && start !== undefined) {
                bitrates += '|STARTBITRATE=' + start;
            }
            if (to !== '' && to !== undefined) {
                bitrates += '|SKIPBITRATE=' + skip;
            }

            webapis.avplay.setStreamingProperty("ADAPTIVE_INFO", bitrates);
        },

        setTrack: function (type, index) {
            webapis.avplay.setSelectTrack(type, index);
        },

        getTracks: function () {
            var trackInfo = webapis.avplay.getTotalTrackInfo();
            var text = 'type of track info: ' + typeof trackInfo + '<br />';
            text += 'length: ' + trackInfo.length + '<br />';
            for (var i = 0; i < trackInfo.length; i++) {
                text += 'index: ' + trackInfo[i].index + ' ';
                text += 'type: ' + trackInfo[i].type + ' ';
                text += 'extra_info: ' + trackInfo[i].extra_info + '<br />';
            }
            info.innerHTML = JSON.stringify(trackInfo);
        },

        getProperties: function () {
            var text = 'AVAILABLE_BITRATE: ' + webapis.avplay.getStreamingProperty("AVAILABLE_BITRATE") + '<br />';
            text += 'CURRENT_BANDWIDTH: ' + webapis.avplay.getStreamingProperty("CURRENT_BANDWITH") + '<br />';
            text += 'DURATION: ' + webapis.avplay.getStreamingProperty("DURATION") + '<br />';
            text += 'BUFFER_SIZE: ' + webapis.avplay.getStreamingProperty("BUFFER_SIZE") + '<br />';
            text += 'START_FRAGMENT: ' + webapis.avplay.getStreamingProperty("START_FRAGMENT") + '<br />';
            text += 'COOKIE: ' + webapis.avplay.getStreamingProperty("COOKIE") + '<br />';
            text += 'CUSTOM_MESSAGE: ' + webapis.avplay.getStreamingProperty("CUSTOM_MESSAGE");
            info.innerHTML = text;
        },
        

    };
}

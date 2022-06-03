(function () {
    'use strict';
    var player;
    
    window.onload = function () {

        if (window.tizen === undefined) 
        {log('This application needs to be run on Tizen device');return;}
        displayVersion();
        registerKeys();
        

        var config = {
            url: 'http://fcf2e861.ucomist.net/iptv/CB5F2GMTR7SUDF/7208/index.m3u8',
            player: document.getElementById('av-player'),
            info:document.getElementById('info'),
            logger:log //Function used for logging
        };

        //Check the screen width so that the AVPlay can be scaled accordingly
        tizen.systeminfo.getPropertyValue("DISPLAY",function (display) {
            player = new VideoPlayer(config);
            registerKeyHandler(player);
            player.open(config.url);
            player.play();
        },
        function(error) {log("An error occurred " + error.message)}
    )};
}());








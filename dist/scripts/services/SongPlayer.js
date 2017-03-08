(function() {
    function SongPlayer(Fixtures) {
        /**
        * @desc audio file container
        * @type {Object}
        */
        var SongPlayer = {};
        
        /**
        * @desc uses the Fixture service's getAlbum method to load audio files from album
        * @ type {Object}
        */
        var currentAlbum = Fixtures.getAlbum();
        
        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            SongPlayer.currentSong = song;
        };
        
        /**
        * @function playSong
        * @desc plays currentBuzzObject and sets playing method to true
        * @param {Object} song
        */
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        };
        
        /**
        * @function getSongIndex
        * @desc returns the index value of a song from the current album object
        * @param {Object} song
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        
        /**
        * @desc active song object from list of songs
        * @type {Object}
        */
        SongPlayer.currentSong = null;
        
        /**
        * @function play
        * desc Play current or new song
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
                //currentBuzzObject.play();
                //song.playing = true;
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                    //currentBuzzObject.play();
                }
            }
        };
        
        /** 
        * @function pause
        * @desc Pause current song
        * @param {Object} song
        */ 
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        * @function previous
        * @desc gets index of currentSong, decrements this value by 1. if the currentSong reduces to zero, the song stops. otherwise, the previous song will play. 
        */
        SongPlayer.previous = function() {
          var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', ['Fixtures', SongPlayer]);
})();
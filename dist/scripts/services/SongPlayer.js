(function() {
    function SongPlayer($rootScope, Fixtures) {
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
                stopSong(SongPlayer.currentSong);
                //currentBuzzObject.stop();
                //SongPlayer.currentSong.playing = null;
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });
            
            currentBuzzObject.bind('volumechange', function() {
                $rootScope.$apply(function() {
                    SongPlayer.volume = currentBuzzObject.getVolume();
                });
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
        * @function stopSong
        * @desc stops currentBuzzObject and sets playing method to null
        * @param {Object} song
        */
        var stopSong = function(song) {
            currentBuzzObject.stop();
            song.playing = null;
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
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;
        
        /**
        * @desc Current playback volume level
        * @type {Number}
        */
        SongPlayer.volume = null;
        
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
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
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
                stopSong(song);
                //currentBuzzObject.stop();
                //SongPlayer.currentSong.playing = null;
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /**
        * @function next
        * @desc gets index of currentSong, increments this value by 1 and plays the next song. if the currentSong was the last song of the album object, this function starts playing the first song from the album object.  
        */
        SongPlayer.next = function() {
          var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
            if (currentSongIndex >= currentAlbum.songs.length) {
                currentSongIndex = 0;
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
                
        /**
        * @function setVolume
        * @desc Set volume level of playback
        * @param {Number} volume level
        */
        SongPlayer.setVolume = function(value) {
            if (currentBuzzObject) {
                SongPlayer.volume = currentBuzzObject.setVolume(value);
            }
        };
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
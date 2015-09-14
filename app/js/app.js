'use strict';

// collapse bootstrap menu when you click outside of it...
$(document).on('click',function(){
  $('.collapse').collapse('hide');
})

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}

// Declare app level module which depends on views, and components
var ArbitrageApp = angular.module('myApp', [
  'ngRoute',
  'ArbitrageControllers',
  'fcsa-number',
  'ngAnimate',
  'ngNumeraljs',
  'angularUtils.directives.dirDisqus'
]);


ArbitrageApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/index', {
                templateUrl: 'views/partials/index.html',
                controller: 'IndexCtrl'
            }).
            when('/videos/:videoId', {
                templateUrl: 'views/partials/video.html',
                controller: 'VideoCtrl'
            }).
            when('/videos', {
                templateUrl: 'views/partials/videos.html',
                controller: 'VideoListCtrl'
            }).
            when('/signup', {
                templateUrl: 'views/partials/signup.html',
                controller: 'SignupCtrl'
            }).
            when('/login', {
                templateUrl: 'views/partials/login.html',
                controller: 'LoginCtrl'
            }).
            when('/profile', {
                templateUrl: 'views/partials/profile.html',
                controller: 'VideoListCtrl'
            }).
            when('/contact', {
                templateUrl: 'views/partials/contact.html',
                controller: 'ContactCtrl'
            }).
            when('/careers', {
                templateUrl: 'views/partials/careers.html',
                controller: 'CareersCtrl'
            }).
            when('/about', {
                templateUrl: 'views/partials/about.html',
                controller: 'AboutCtrl'
            }).
            otherwise({redirectTo: '/videos'});

        $locationProvider.html5Mode(false).hashPrefix("!");
    }
]);

// directive replaces "youtube" tags with iframe html player
ArbitrageApp.directive('youtube', function($window, $http) {
  return {
    restrict: "E",

    scope: {
      videoid: "@",
      videodbid: "@"
    },

    template: '<div></div>',

    link: function(scope, element) {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        var player;
        var is_video_complete = false;


        function onProgress(video_percent_complete) {

            if (video_percent_complete >= 90 && !is_video_complete) {

                is_video_complete = true;

                $http.post('api/updateUserVideoViews', {videodbid: scope.videodbid})
                .success(function (data, status, headers, config) {
                    console.log('Success status: ' + status);
                })
                .
                error(function(data, status, headers, config) {
                    console.log('ERROR status: ' + status);
                });;
            }
        }


        $window.onYouTubeIframeAPIReady = function() {

            // sets player = to a new instance of YT.Player with listed options
            player = new YT.Player(element.children()[0], {
                playerVars: {
                    autoplay: 0,
                    html5: 1,
                    modesbranding: 0,
                    iv_load_policy: 3,
                    rel: 0,
                    controls: 1
                },

                videoId: scope.videoid,
                events: {
                    onReady: function(event) {

                        event.target.cueVideoById(scope.videoid);
                        // autoplay the video...
                        // event.target.playVideo();

                        var video_current_time = 0;
                        var timeupdater = null;
                        var video_percent_complete = 0;

                        function updateTime() {

                            var oldTime = video_current_time;
                            if(player && player.getCurrentTime) {

                                video_current_time = player.getCurrentTime();
                            }
                            // if time is not the same, call onProgress to check percentage complete
                            if(video_current_time !== oldTime) {
                                var video_length = player.getDuration();
                                video_percent_complete = (video_current_time / video_length * 100);
                                console.log("video_percent_complete: " + video_percent_complete);
                                onProgress(video_percent_complete);
                            }
                        }

                        timeupdater = setInterval(updateTime, 100);
                    },
                    onStateChange: function(event) {
                        console.log("STATUS CHANGED. New status: " + event.data);

                    }
                }
            });


        };

        // watch scope.videoid for changes and update accordingly
        scope.$watch('videoid', function(newValue, oldValue) {

            if (newValue == oldValue) {
                console.log('no url change');
                return;
            }
            // call onYouTubeIframeAPIReady() if videoid is set... this will call onReady on the YT.Player
            // fix for double click issue where first click would change videoid, but wouldn't reload the player
            else if (scope.videoid) {
                onYouTubeIframeAPIReady();
            }

        });
        // watch scope.videodbid for changes and update accordingly
        scope.$watch('videodbid', function(newValue, oldValue) {

            if (newValue == oldValue) {
                console.log('no url change');
                return;
            }

        });

    }
  };
});

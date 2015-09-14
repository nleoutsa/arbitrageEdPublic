'use strict';

/* Controllers */

var ArbitrageControllers = angular.module('ArbitrageControllers', []);

ArbitrageControllers.controller('MainCtrl', ['$scope', '$rootScope','$http',
  function ($scope, $rootScope, $http) {

  }]);

ArbitrageControllers.controller('VideoListCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$sce',
  function ($scope, $rootScope, $routeParams, $http, $sce) {


    $scope.formData = {};

    // when landing on the page, get all videos and show them
    $http.get('/api/videos')
      .success(function(data) {

        $scope.videos = data;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });


    // // submit form to Node API
    // $scope.createVideos = function() {
    //   $http.post('/api/videos', $scope.formData)
    //     .success(function(data) {
    //       $scope.formData = {}; // clear the form so it is ready to enter another
    //       $scope.videos = data;
    //     })
    //     .error(function(data) {
    //       console.log('Error: ' + data);
    //     });
    // };

    // // delete a video
    // $scope.deleteVideos = function(id) {
    //   $http.delete('/api/videos/' + id)
    //     .success(function(data) {
    //       $scope.videos = data;
    //     })
    //     .error(function(data) {
    //       console.log('Error: ' + data);
    //     });
    // };

  }]);



ArbitrageControllers.controller('ResearchToolCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('data/cpi-data.json').success(function (data) {
      $scope.cpi_data = data;

      $scope.base_cost = 1000;
      $scope.month1 = 0;
      $scope.year1 = 1999;
      $scope.month2 = 11;
      $scope.year2 = 2014;

    });
  }]);


ArbitrageControllers.controller('VideoCtrl', ['$scope', '$routeParams', '$http', '$sce', '$window',
  function ($scope, $routeParams, $http, $sce, $window) {
    $scope.formData = {};
    $scope.lessonLoaded = false;


      $http.get('/api/videos/' + $routeParams.videoId)
        .success(function(data) {


          $scope.video = data;

          // $scope.videoid = $scope.video.video.youtube_id;
          // $scope.videoDbId = $scope.video._id;

          // var origin = "http://localhost:8080";
          // $scope.vidUrl = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + $scope.video.video.youtube_id + "?enablejsapi=1&origin=" + origin);

          $scope.lessonLoaded = true;

          $scope.question;
          $scope.radio;
          $scope.correct;
          $scope.user_answer = [];
          $scope.userAnswer;
          $scope.answer; // jshint ignore:line
          var question_variables = [];
          $scope.showCalc = false;

          $scope.toggleCalc = function () {
            $scope.showCalc = !$scope.showCalc;
          };

          $scope.evaluateQuestion = function (ind) {
            $scope.radio = $scope.video.problemSets[ind].radio;
            $scope.question_index = ind;
            var ques = $scope.video.problemSets[ind].question;
            var ans = $scope.video.problemSets[ind].answer;

            if (!($scope.radio) && question_variables[ind]) {
              var vars = $scope.video.problemSets[ind].variables;
              var keys = Object.keys(vars);

              for (var i = 0; i < keys.length; i++) {

                var str = '' + keys[i];

                var str = new RegExp(str, 'g');

                var random_no = question_variables[ind][i];


                ques = ques.replace(str, random_no);

                random_no = numeral().unformat(random_no);
                ans = ans.replace(str, random_no);
              }

              ans = eval(ans);
              if(Math.round(ans) !== ans) {
                  ans = ans.toFixed(2);
              }
            }


            $scope.question = ques;
            // ans = '' + numeral(ans).format('$0,0.00');
            $scope.answer = ans; // jshint ignore:line

            // render mathjax latex
            MathJax.Hub.Queue(['Typeset',MathJax.Hub]);
          };



          $scope.setVariables = function (ind) {
            var variable_array = [];
            var vars;
            var keys;
            var random_no;
            var min, max, no_type, no_format;

            vars = $scope.video.problemSets[ind].variables;
            keys = Object.keys(vars);

            for (var i = 0; i < keys.length; i++) {  //jshint ignore:line

              min = vars[keys[i]][0];
              max = vars[keys[i]][1];
              no_type = vars[keys[i]][2];
              no_format = vars[keys[i]][3];

              if (no_type === 'i') {
                random_no = Math.floor((Math.random() * ((max + 1) - min)) + min);
              }
              else if (no_type === 'f') {
                random_no = ((Math.random() * ((max + 1) - min)) + min);
              }

              if (no_format === 'c') {
                random_no = numeral(random_no).format('$0,0.00');
              }
              else if (no_format === 'y') {

                switch (random_no) {
                  case 1:
                    random_no = "January";
                    break;
                  case 2:
                    random_no = "February";
                    break;
                  case 3:
                    random_no = "March";
                    break;
                  case 4:
                    random_no = "April";
                    break;
                  case 5:
                    random_no = "May";
                    break;
                  case 6:
                    random_no = "June";
                    break;
                  case 7:
                    random_no = "July";
                    break;
                  case 8:
                    random_no = "August";
                    break;
                  case 9:
                    random_no = "September";
                    break;
                  case 10:
                    random_no = "October";
                    break;
                  case 11:
                    random_no = "November";
                    break;
                  case 12:
                    random_no = "December";
                    break;
                  default:
                    random_no = numeral(random_no).format('0');
                    break;
                }

                // random_no = numeral(random_no).format('0');
              }
              else if (no_format === 'p') {
                random_no = random_no / 100;
                random_no = numeral(random_no).format('0.00%');
              }


              // random_no = numeral().unformat(random_no);

              variable_array.push(random_no);
            }

            question_variables[ind] = variable_array;
          };


        })
        .error(function(data) {
          console.log('Error: ' + data);
        });

  }]);


ArbitrageControllers.controller('IndexCtrl', [
  function () {
  }]);

ArbitrageControllers.controller('SignupCtrl', [
  function () {
  }]);

ArbitrageControllers.controller('LoginCtrl', [
  function () {
  }]);

ArbitrageControllers.controller('AboutCtrl', [
  function () {
  }]);

ArbitrageControllers.controller('CareersCtrl', [
  function () {
  }]);

ArbitrageControllers.controller('SignupCtrl', [
  function () {
  }]);

ArbitrageControllers.controller('ContactCtrl', [
  function () {
  }]);

ArbitrageControllers.controller('ProfileCtrl', [
  function () {
  }]);

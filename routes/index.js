'use strict';

var express = require('express');
var router = express.Router();

var User = require('../models/user.js');
var Video = require('../models/video.js');

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call next() to call the next request handler
    // Passport adds this method to request object.
    if (req.isAuthenticated()) {
        return next();
    }
    // if user is NOT authenticated, redirect
    console.log('not authenticated');
    res.redirect('/home#!/login');
};



module.exports = function (passport) {

// ////////////////////////////////////////////////////

    router.get('/api/videos', function(req, res) {
        // use mongoose to get all videos in the database
        Video.find({},function(err, videos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(videos); // return all videos in JSON format
        });
    });


    // // Sample: securites
    // router.get('/api/videos/559c47a9e4b09a230e990ab6', function(req, res) {

    //     Video.find({ _id: '559c47a9e4b09a230e990ab6' }, function(err, video) {

    //             if (video[0].video.times_viewed) {
    //                 video[0].video["times_viewed"] += 1;
    //             }
    //             else {
    //                 video[0].video["times_viewed"] = 1;
    //             }
    //             video[0].markModified("video");

    //             video[0].save(function(err) {
    //                 if (err) throw err;
    //             });

    //         console.log('Sample Video. USER: ' + req.user);
    //         res.json(video[0]);
    //     });

    // });
    // // Sample: student loan basics
    // router.get('/api/videos/55b6e547e4b01d0a17ce00ca', function(req, res) {

    //     Video.find({ _id: '55b6e547e4b01d0a17ce00ca' }, function(err, video) {

    //             if (video[0].video.times_viewed) {
    //                 video[0].video["times_viewed"] += 1;
    //             }
    //             else {
    //                 video[0].video["times_viewed"] = 1;
    //             }
    //             video[0].markModified("video");

    //             video[0].save(function(err) {
    //                 if (err) throw err;
    //             });

    //         console.log('Sample Video. USER: ' + req.user);
    //         res.json(video[0]);
    //     });

    // });



    function findWithAttr(array, attr, value) {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
    }

    var lessons_viewed_index;

    // get one video
    router.get('/api/videos/:video_id', function(req, res) {

        // save video id to user document if user is signed in
        if (req.user) {
            lessons_viewed_index = findWithAttr(req.user.lessons_viewed, 'video_id', req.params.video_id);

            Video.find({ _id: req.params.video_id }, function(err, video) {

                if (!(lessons_viewed_index >= 0)) {
                    // console.log('create new video tracking object');
                    req.user.lessons_viewed.push({"video_id": req.params.video_id, "video_title": video[0].video.title, "views": 0, "complete_views": 0});
                    lessons_viewed_index = findWithAttr(req.user.lessons_viewed, 'video_id', req.params.video_id);
                }
                req.user.lessons_viewed[lessons_viewed_index].views += 1;


                req.user.markModified("lessons_viewed");

                req.user.save(function(err) {
                    if (err) throw err;

                    // console.log('User successfully updated!');
                });

                if (video[0].video.times_viewed) {
                    video[0].video["times_viewed"] += 1;
                }
                else {
                    video[0].video["times_viewed"] = 1;
                }
                video[0].markModified("video");

                video[0].save(function(err) {
                    if (err) throw err;
                });

                res.json(video[0]);
            });
        }

        else if (!req.user) {

            Video.find({ _id: req.params.video_id }, function(err, video) {

                if (video[0].video.times_viewed) {
                    video[0].video["times_viewed"] += 1;
                }
                else {
                    video[0].video["times_viewed"] = 1;
                }
                video[0].markModified("video");

                video[0].save(function(err) {
                    if (err) throw err;
                });

                res.json(video[0]);
            });
        }
    });

    router.post('/api/updateUserVideoViews', function(req, res, next) {
        var videodbid = req.body.videodbid;
        if (req.user) {
            req.user.lessons_viewed[lessons_viewed_index].complete_views += 1;

            req.user.markModified("lessons_viewed");

            req.user.save(function(err) {
                if (err) throw err;
                // console.log('User successfully updated!');
            });
        }

        Video.find({ _id: videodbid }, function(err, video) {
            if (video[0].video.times_completely_viewed) {
                video[0].video["times_completely_viewed"] += 1;
            }
            else {
                video[0].video["times_completely_viewed"] = 1;
            }
            video[0].markModified("video");
            video[0].save(function(err) {
                if (err) throw err;
            });
        });
    });
// TODO: create CMS for video creation

    // // create video and send back all videos after creation
    // router.post('/api/videos', function(req, res) {

    //     // create a video, information comes from AJAX request from Angular
    //     Video.create({

    //         video: req.body.video,
    //         problemSets: req.body.problemSets,
    //         links: req.body.links

    //     }, function(err, video) {
    //         if (err)
    //             res.send(err);

    //         // get and return all the videos after you create another
    //         Video.find(function(err, videos) {
    //             if (err)
    //                 res.send(err)
    //             res.json(videos);
    //         });
    //     });

    // });


    // // delete a video
    // router.delete('/api/videos/:video_id', function(req, res) {
    //     Video.remove({
    //         _id : req.params.video_id
    //     }, function(err, video) {
    //         if (err)
    //             res.send(err);

    //         // get and return all the videos after you delete another
    //         Video.find(function(err, videos) {
    //             if (err)
    //                 res.send(err)
    //             res.json(videos);
    //         });
    //     });
    // });

// SERVER SIDE ROUTES

    router.get('/', function (req, res) {
        res.render('index', { user : req.user });
    });

    router.post('/login', function(req, res, next) {

      // generate the authenticate method and pass the req/res
      passport.authenticate('login', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/'); }

        // req / res held in closure
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect(req.body.redirectTo);
        });

      })(req, res, next);

    });

    // POST new user's params
    router.post('/signup', function(req, res, next) {

      // generate the authenticate method and pass the req/res
      passport.authenticate('signup', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/'); }

        // req / res held in closure
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect(req.body.redirectTo);
        });

      })(req, res, next);

    });


    // GET home page
    router.get('/home',function (req, res) {
        res.render('home', { user : req.user });
    });


    // GET signout and send them to videos page
    router.get('/signout', function (req, res) {
        req.logout();
        res.redirect('home#!/videos');
    });

    return router;

};


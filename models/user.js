'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    id: String,
    username: String,
    password: String,
    email: String,
    profile_pic: String,
    lessons_viewed: Array
});
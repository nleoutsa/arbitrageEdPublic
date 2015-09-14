'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('Video', {
    video: Object,
    problemSets: Array,
    links: Array
});
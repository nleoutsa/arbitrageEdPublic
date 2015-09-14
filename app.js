'use strict';


var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

var flash = require('connect-flash');

var port = process.env.PORT || 8080;

// MongoDB configuration
var dbConfig = require('./db.js');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);



var app = express();


app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'app')));

app.use(flash());

// Passport configuration
var passport = require('passport');
var expressSession = require('express-session');

var MongoStore = require('connect-mongo')(expressSession);

app.use(expressSession({
    secret:'mySecretKey',
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore(
        { mongooseConnection: mongoose.connection },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        })
}));

// app.use(expressSession({secret: 'mySecretKey'}));


app.use(passport.initialize());
app.use(passport.session());


var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use('/*', function(req, res, next) {
  // Use res.sendfile, as it streams instead of reading the file into memory.
  res.sendfile(__dirname + '/app/index.html');
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

module.exports = app;

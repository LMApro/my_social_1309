var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
require('./models/Posts');
require('./models/Comments');
require('./models/Users');
var passport = require("passport");
require('./config/passport');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var posts = require('./routes/posts');
var users = require('./routes/users');

var app = express();
// mongoose.connect('mongodb://localhost/news');
mongoose.connect('mongodb://makatz:matn821309@ds027491.mongolab.com:27491/news');

// view engine setup
app.set('views', path.join(__dirname, 'dist'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /dist
app.use(favicon(__dirname + '/dist/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(passport.initialize());

app.use('/', posts);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

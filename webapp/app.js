var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var login = require('./routes/login');
var apiRest = require('./routes/ApiRest');
var client = require('./routes/client');
var rasp = require('./routes/rasp');
var controlpanel = require('./routes/controlPanel');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'abcd1234',
    resave: false,
    saveUninitialized: false

}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', login);
app.use('/apiRest', apiRest);
app.use('/client', client);
app.use('/rasp', rasp);
app.use('/controlPanel', controlpanel);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

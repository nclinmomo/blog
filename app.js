var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa')
const mLogger = require('./helpers/logger.js');
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var userRouter = require('./routes/controller');
var usersController = require('./routes/usersController').router;
var usersControllerV2 = require('./routes/usersController').routerV2;
var usersControllerV3 = require('./routes/usersController').routerV3;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(mLogger.express);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));


app.use('/api/am/health', function (req, res) {
  const SUCCESS = {
    "service": "Activation Management",
    "status": "200",
    // "version": PACKAGE_INFO.version,
    "note": ""
  }
  res.json(SUCCESS);
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// App
// app.use('/api/v1/user', userRouter);
app.use('/api/am/v1/users', usersController);
app.use('/api/am/v2/users', usersControllerV2);
app.use('/api/am/v3/users', usersControllerV3);
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

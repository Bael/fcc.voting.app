const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const {MongoClient, ObjectID} = require('mongodb');

/*-------------- Declare routes ---------------*/
const index = require('./server/routes/index');
const users = require('./server/routes/users');
const profileRoute = require('./server/routes/profile');
const pollsRoute = require('./server/routes/polls');

/*-------------- Set up express ---------------*/

let app = express();

// view engine setup
app.set('views', path.join(__dirname, "server", 'views/pages'));
app.set('view engine', 'ejs');

// Database configuration
// connect to our database
mongoose.connect(process.env.MONGO_URI);
// Check if MongoDB is running
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
  throw new Error("MongoDB Connection Error. Make sure MongoDB is running.");

});

// Passport configuration
require('./server/config/passport-config')(passport);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





// auth work
console.log(`process.env.SESSION_SECRET is ${process.env.SESSION_SECRET}`);

var session_configuration = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
};

// !!!!!!!!!!!!for development purposes
session_configuration.cookie.secure = false;

app.use(session(session_configuration));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// --------------------------  Routing ----------------------------
app.use('/', index);
app.use('/users', users);
app.use('/profile', profileRoute);
app.use('/polls', pollsRoute);
// -------------------------- End of Routing ----------------------------


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

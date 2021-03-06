var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var graphqlHttp = require('express-graphql');
var mongoose = require('mongoose');
var graphqlSchema = require('./graphql/schema/index');
var graphqlRootValue = require('./graphql/rootValue/index');
var isAuth = require('./middleware/is-auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if(req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(isAuth);

//database connection
var dbUri = 'mongodb://admin:admin123@ds263146.mlab.com:63146/booking'
mongoose.connect(dbUri, (err) => {
  console.log('database connected');
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlRootValue,
  graphiql: true
}))
app.use('/', indexRouter);
app.use('/users', usersRouter);

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

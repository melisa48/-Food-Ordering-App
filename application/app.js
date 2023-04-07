var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs')


const partials = path.join(__dirname, "views/partials");
hbs.registerPartials(partials);

// home
var indexRouter = require('./routes/index');
// about-me pages
var andyRouter = require('./routes/about-routes/andy');
var juandavidRouter = require('./routes/about-routes/juandavid');
var emilyRouter = require('./routes/about-routes/emily');
var euniceRouter = require('./routes/about-routes/eunice');
var melisaRouter = require('./routes/about-routes/melisa');
// about team
var aboutRouter = require('./routes/about-routes/about');
//  login routes
var adminLoginRouter = require("./routes/login-routes/adminLogin");
var driverLoginRouter = require("./routes/login-routes/driverLogin");
var restaurantLoginRouter = require("./routes/login-routes/restaurantLogin");
var sfsuLoginRouter = require("./routes/login-routes/sfsuLogin");
//registration routes
var driverRegistrationRouter = require("./routes/registration-routes/driverRegistration");
var restaurantRegistrationRouter = require("./routes/registration-routes/restaurantRegistration");
var sfsuRegistrationRouter = require("./routes/registration-routes/sfsuRegistration");
//router for page that lists searchResult after search
var searchResultRouter = require("./routes/searchResult");

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//home
app.use('/', indexRouter);
//about
app.use('/andy', andyRouter);
app.use('/juandavid', juandavidRouter);
app.use('/emily', emilyRouter);
app.use('/eunice', euniceRouter);
app.use('/melisa', melisaRouter);
app.use('/about', aboutRouter);
// login 
app.use('/adminLogin', adminLoginRouter);
app.use('/driverLogin', driverLoginRouter);
app.use('/restaurantLogin', restaurantLoginRouter);
app.use('/sfsuLogin', sfsuLoginRouter);
//registration
app.use('/driverRegistration', driverRegistrationRouter);
app.use('/restaurantRegistration', restaurantRegistrationRouter);
app.use('/sfsuRegistration', sfsuRegistrationRouter);
//list of searchResult hbs
app.use('/searchResult', searchResultRouter);


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



// // db test
// const db = require('./conf/database');
// app.get('/', (req, res)=>{
//   console.log('test');
//   db.query("SELECT * FROM team7.team WHERE name=?;", ['Emily'], function(err, results, fields){
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log(results);
//       // console.log("test");
//       // results.forEach(row => console.log(row));
//       // console.log("test2");
//     }
//   });
// });



module.exports = app;

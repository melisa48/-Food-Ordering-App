var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs')


const partials = path.join(__dirname, "views/partials");
hbs.registerPartials(partials);

hbs.registerHelper('categoryFunction', function(category, setCategory) {
  return category == setCategory;
});
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
var driverLoginRouter = require("./routes/login-routes/driverLogin");
var restaurantLoginRouter = require("./routes/login-routes/restaurantLogin");
var sfsuLoginRouter = require("./routes/login-routes/sfsuLogin");
//registration routes
var driverRegistrationRouter = require("./routes/registration-routes/driverRegistration");
var restaurantRegistrationRouter = require("./routes/registration-routes/restaurantRegistration");
var sfsuRegistrationRouter = require("./routes/registration-routes/sfsuRegistration");
//router for page that lists searchResult after search
var searchResultRouter = require("./routes/searchResult");
// Driver Page Routes
var driverOrderListRouter = require("./routes/driver-routes/driverOrderList");
var driverOrderDetailsRouter = require("./routes/driver-routes/driverOrderDetails");
var driverDeliveryMapRouter = require("./routes/driver-routes/driverDeliveryMap");
// Resturant Routes
var restaurantsRouter = require('./routes/restaurants');

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
app.use('/driverLogin', driverLoginRouter);
app.use('/restaurantLogin', restaurantLoginRouter);
app.use('/sfsuLogin', sfsuLoginRouter);
//registration
app.use('/driverRegistration', driverRegistrationRouter);
app.use('/restaurantRegistration', restaurantRegistrationRouter);
app.use('/sfsuRegistration', sfsuRegistrationRouter);
//list of searchResult hbs
app.use('/searchResult', searchResultRouter);
// driver page hbs
app.use('/driverOrderList', driverOrderListRouter);
app.use('/driverOrderDetails', driverOrderDetailsRouter);
app.use('/driverDeliveryMap', driverDeliveryMapRouter);
//resturant
app.use('/restaurants', restaurantsRouter);

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

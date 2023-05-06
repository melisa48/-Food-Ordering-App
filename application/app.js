var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var session = require('express-session');

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
var restaurantOwnerRegistrationRouter = require("./routes/registration-routes/restaurantOwnerRegistration");
var sfsuRegistrationRouter = require("./routes/registration-routes/sfsuRegistration");
//router for page that lists searchResult after search
var searchResultRouter = require("./routes/sfsu-user-routes/searchResult");
// Driver Page Routes
var driverOrderListRouter = require("./routes/driver-routes/driverOrderList");
var driverOrderDetailsRouter = require("./routes/driver-routes/driverOrderDetails");
var driverDeliveryMapRouter = require("./routes/driver-routes/driverDeliveryMap");
// Restaurant Page Routes
var myRestaurantsRouter = require('./routes/restaurant-routes/myRestaurants');
var restaurantApplicationRouter = require('./routes/registration-routes/restaurantApplication');
//User Page Routes
var restaurantMenuCartRouter = require('./routes/sfsu-user-routes/restaurantMenuCart');
var checkOutRouter = require('./routes/sfsu-user-routes/checkOut');


var app = express();

app.use(session({
  secret : 'team7',
  resave : false,
  saveUninitialized : true
}));

app.use((req, res, next)=>{
  if(req.session.email){
    // res.locals.loggedinUser = req.session;
    // console.log(res.locals.loggedinUser);
    res.locals.email = req.session.email;
    res.locals.userId = req.session.userid;
    res.locals.firstname = req.session.firstName;
    res.locals.lastname = req.session.lastName;
    res.locals.logged = true;
    // console.log("locals: email: %s, id: %d, firstname: %s, lastname: %s",res.locals.email, res.locals.userId, res.locals.firstname, res.locals.lastname);
  }
  if(!req.session.userid){
    res.locals.userId = -1;
  }
  if(req.session.driver){
    res.locals.driver = true;
  }
  if(req.session.restaurantOwner){
    res.locals.restaurantOwner = true;
  }
  next();
})

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
app.use('/restaurantOwnerRegistration', restaurantOwnerRegistrationRouter);
app.use('/sfsuRegistration', sfsuRegistrationRouter);
//list of searchResult hbs
app.use('/searchResult', searchResultRouter);
// driver page hbs
app.use('/driverOrderList', driverOrderListRouter);
app.use('/driverOrderDetails', driverOrderDetailsRouter);
app.use('/driverDeliveryMap', driverDeliveryMapRouter);
//resturant pages hbs
app.use('/myrestaurants', myRestaurantsRouter);
app.use('/restaurantApplication', restaurantApplicationRouter);
//user pages hbs
app.use('/restaurantMenuCart' , restaurantMenuCartRouter);
app.use('/checkOut' , checkOutRouter);

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

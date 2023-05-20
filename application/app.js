var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');

const partials = path.join(__dirname, "views/partials");
hbs.registerPartials(partials);

hbs.registerHelper('categoryFunction', function(category, setCategory) {
  return category == setCategory;
});

hbs.registerHelper('sumTotal', function(list){
  return list.reduce(
    (newSum, a) => Math.round((newSum + a.cartItemTotal) * 100)/100, 0
  )
})

// home
var indexRouter = require('./routes/index');
// about team
var aboutRouter = require('./routes/about');
//driver route
var driversRouter =require('./routes/drivers');
var restaurantsRouter = require('./routes/restaurants');
var sfsuUserRouter = require('./routes/sfsuUser');


//router for page that lists searchResult after search

// Driver Page Routes
var driverOrderListRouter = require("./routes/driver-routes/driverOrderList");
var driverOrderDetailsRouter = require("./routes/driver-routes/driverOrderDetails");
var driverDeliveryMapRouter = require("./routes/driver-routes/driverDeliveryMap");
// Restaurant Page Routes
var myRestaurantsRouter = require('./routes/restaurant-routes/myRestaurants');
//User Page Routes
//Order Summary Routes

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


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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
app.use('/about', aboutRouter);
//drivers
app.use('/drivers', driversRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/sfsuUser', sfsuUserRouter);




// driver page hbs
app.use('/driverOrderList', driverOrderListRouter);
app.use('/driverOrderDetails', driverOrderDetailsRouter);
app.use('/driverDeliveryMap', driverDeliveryMapRouter);
//resturant pages hbs
app.use('/myrestaurants', myRestaurantsRouter);
//user pages hbs


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

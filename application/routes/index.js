var express = require('express');
var router = express.Router();
const db = require('../conf/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home'});
});

//login routes
router.get('/sfsuLogin', function(req, res, next) {
  res.render('login/sfsuLogin', { title: 'SFSU Login'});
});

router.get('/driverLogin', function(req, res, next) {
  res.render('login/driverLogin', {title: 'Driver Login'});
});

router.get('/restaurantOwnerLogin', function(req, res, next) {
  res.render('login/restaurantOwnerLogin', {title: 'Restaurant Login'});
});


//registration routes
router.get('/sfsuRegistration', function(req, res, next) {
  res.render('registration/sfsuRegistration', {title: 'SFSU Registration'});
});

router.get('/driverRegistration', function(req, res, next) {
  res.render('registration/driverRegistration', {title: 'Driver Registration'});
});

router.get('/restaurantOwnerRegistration', function(req, res, next) {
  res.render('registration/restaurantOwnerRegistration', {title: 'Restaurant Registration'});
});


//restaurant pages
router.get('/restaurantApplication',function(req, res, next) {
  if(!req.session.restaurantOwner){
    res.render('login/restaurantOwnerLogin', { message: "Please log in as a restaurant owner first before registering a restaurant", error: true});
  }else{
    res.render('registration/restaurantApplication', {title: 'Restaurant Application'});
  }
});



module.exports = router;

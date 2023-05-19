var express = require('express');
var router = express.Router();
const db = require('../conf/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home'});
});

//login routes
router.get('/driverLogin', function(req, res, next) {
  res.render('login/driverLogin', {title: 'Driver Login'});
});

router.get('/restaurantOwnerLogin', function(req, res, next) {
  res.render('login/restaurantOwnerLogin', {title: 'Restaurant Login'});
});

router.get('/sfsuLogin', function(req, res, next) {
  res.render('login/sfsuLogin', { title: 'SFSU Login'});
});

module.exports = router;

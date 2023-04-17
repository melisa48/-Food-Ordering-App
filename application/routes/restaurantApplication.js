restaurantApplication.js
var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
 res.render('application/restaurantApplication', {title: 'Restaurant Application'});
});
router.post('/', function(req, res, next) {
 let restaurantName = req.body.restaurantName;
 let foodCategory = req.body.foodCategory;
 let deliveryTime = req.body.deliveryTime;
 let description = req.body.description;
 let menu = req.body.menu;
 res.render('application/restaurantApplication', {
   title: 'Restaurant Application',
   restaurantName,
   foodCategory,
   deliveryTime,
   description,
   menu
 });
});
module.exports = router;

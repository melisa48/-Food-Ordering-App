// restaurantApplication.js
var express = require('express');
var router = express.Router();
var db = require("../../conf/database");

router.get('/', function(req, res, next) {
 res.render('registration/restaurantApplication', {title: 'Restaurant Application'});
});
router.post('/', function(req, res, next) {
  //TODO change the req.body
  let restaurantName = req.body.restaurantName;
  let foodCategory = req.body.foodCategory;
  let deliveryTime = req.body.deliveryTime;
  let description = req.body.description;
  let address = req.body.address;
  let menu = req.body.menu;
  //TODO not working :
  let currentOwner = res.locals.userId;
  var sql = "INSERT restaurant_name, category, description, address, restaurantOwner FROM restaurant VALUES(?,?,?,?,?);";
  console.log(currentOwner);
  // db.query(sql, [restaurantName, foodCategory, description, address, currentOwner], function(err, result, fields){
    // let restaurantID = result[0].restaurant_id;
    // var menuQuery = "INSERT name, description, price, restaurant FROM menu VALUES (?,?,?,?);";
    // db.query(menuQuery, [])
  // })
  res.render('restaurant-pages/myRestaurants', {
  //   title: 'Restaurant Application',
  //   restaurantName,
  //   foodCategory,
  //   deliveryTime,
  //   description,
  //   menu
  });
});
module.exports = router;

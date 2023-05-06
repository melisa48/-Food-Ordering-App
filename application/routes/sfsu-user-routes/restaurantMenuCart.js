var express = require('express');
var router = express.Router();
var db = require("../../conf/database");

//Author: Eunice
/*
  Description: Used to make nested queries to display a menu from a specific restaurant
*/
/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  let restaurantIdentifier = req.query.restaurant;
  // console.log("Restaurant name: %s", restaurantName);
  var sql = "SELECT * FROM restaurant WHERE id = ?;";
  db.query(sql, [restaurantIdentifier], function(err, result, fields){
    let restaurantID = result[0].restaurant_id;
    let restaurantName = result[0].restaurant_name;
    var menuQuery = "SELECT * FROM menu WHERE restaurant = ?";
    db.query(menuQuery, [restaurantID], function(err, result, fields){
      let menuResults = result;
      res.render('sfsu-user-pages/restaurantMenuCart', {title: restaurantName, menu: menuResults});
    })
  });
});


module.exports = router;

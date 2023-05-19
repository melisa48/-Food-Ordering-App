var express = require('express');
var router = express.Router();
var db = require("../../conf/database");
/* GET home page. */
router.get('/', function(req, res, next) {
  var getOrders = `SELECT orderID, total, restaurant.images, restaurant.restaurant_name, dropoffPoints.name, roomNumber FROM team7.order
  JOIN restaurant ON restaurant.restaurant_id = order.restaurantName 
  JOIN dropoffPoints ON dropoffPoints.pointID = order.dropoff
  WHERE driver IS NULL;`;
  db.query(getOrders, (err, result)=>{
    if (err) throw err;
    console.log(result);
    res.render('driver-pages/driverOrderList', { title: 'Orders', orderList: result});
  })
});



module.exports = router;

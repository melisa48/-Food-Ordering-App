var express = require('express');
var router = express.Router();
var db = require("../../conf/database");

/* GET home page. */
router.get('/', function(req, res, next) {
  let orderIdentifier = req.query.order;
  // console.log(orderIdentifier);
  var getOrder = `SELECT order.orderID, restaurant.restaurant_name, restaurant.address, dropoffPoints.name AS "building", roomNumber 
  FROM team7.order 
  JOIN restaurant ON restaurant.restaurant_id = order.restaurantName 
  JOIN dropoffPoints ON dropoffPoints.pointID = order.dropoff
  WHERE order.orderID = ?;`;
  let getTickets = `SELECT menu.name, menu.images, quantity FROM ticket 
  JOIN menu ON menu.menuID = ticket.menuItem
  WHERE orderID = ?;`;
  db.query(getOrder, [orderIdentifier], (err, orderResult)=>{
    if(err) throw err;
    console.log(orderResult);
    db.query(getTickets,[orderIdentifier],(err,ticketsResult)=>{
      if(err) throw err;
      console.log(ticketsResult);
      res.render('driver-pages/driverOrderDetails', { title: 'Order Details', orders: orderResult, tickets: ticketsResult});
    })
  })
});

router.post('/deliveryMap', function(req, res, next){
  let currentDriver = res.locals.userId;
  let updateOrder = parseInt(req.body.orderID);
 
  var updateDriver = "UPDATE team7.order SET driver = ? WHERE orderID = ?;";
  var getOrder = `SELECT order.orderID, dropoffPoints.name AS "building", roomNumber 
  FROM team7.order 
  JOIN dropoffPoints ON dropoffPoints.pointID = order.dropoff
  WHERE order.orderID = ?;`;
  let getTickets = `SELECT menu.name, menu.images, quantity FROM ticket 
  JOIN menu ON menu.menuID = ticket.menuItem
  WHERE orderID = ?;`;
  db.query(updateDriver, [currentDriver, updateOrder], (err, updatedDriver)=>{
    if(err) throw err;
        db.query(getOrder, [updateOrder], (err, orderResult)=>{
          if(err) throw err;
          db.query(getTickets, [updateOrder], (err, ticketResult)=>{
            if(err) throw err;
            
            res.render('driver-pages/driverDeliveryMap', {title: "Delivery Map", orders: orderResult, tickets: ticketResult });
          })
        })
  })

})



module.exports = router;

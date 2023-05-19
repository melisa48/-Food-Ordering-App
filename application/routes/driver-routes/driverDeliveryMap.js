var express = require('express');
var router = express.Router();
var db = require("../../conf/database");

/* GET home page. */
router.get('/', function(req, res, next) {
  let currentDriver = res.locals.userId;

  var getOrder = `SELECT order.orderID, dropoffPoints.name AS "building", roomNumber 
  FROM team7.order 
  JOIN dropoffPoints ON dropoffPoints.pointID = order.dropoff
  WHERE order.driver = ? AND order.progress = 1;`;
  let getTickets = `SELECT menu.name, menu.images, quantity FROM ticket 
  JOIN menu ON menu.menuID = ticket.menuItem
  WHERE orderID = ?;`;

  db.query(getOrder, [currentDriver], (err, orderResult)=>{
    if(err) throw err;
    if(orderResult.length >= 1){
      let currentOrder = orderResult[0].orderID;
      // console.log(currentOrder);
      db.query(getTickets, [currentOrder], (err, ticketResult)=>{
        if(err) throw err;
        // console.log(ticketResult);
        res.render('driver-pages/driverDeliveryMap', { title: 'Delivery Map' , orders: orderResult, tickets: ticketResult });
      })
    }else{
      res.render('driver-pages/driverDeliveryMap', { title: 'Delivery Map',  message: "No ongoing orders"});
    }
  })
  
});

router.post('/deliveryStatus', function(req, res, next){
  let deliveryStatus = req.body.status;
  let orderID = parseInt(req.body.orderID);
  let deliveryProgress;
  let orderStatus = `UPDATE team7.order SET progress = ? WHERE order.orderID = ?;`;
  let orderAndDriverStatus = `UPDATE team7.order SET progress = ?, driver = ? WHERE order.orderID = ?;`;
  if(deliveryStatus == "cancel"){
    console.log("delivery cancelled");
    deliveryProgress = 1;
    db.query(orderAndDriverStatus, [deliveryProgress, null, orderID], (err, cancelledOrder)=>{
      if(err) throw err;
    });
  }
  if(deliveryStatus == "complete"){
    console.log("delivery completed");
    deliveryProgress = 2;
    db.query(orderStatus, [deliveryProgress, orderID], (err, completedOrder)=>{
      if(err) throw err;
    });
  }
  res.redirect('/driverOrderList');
})

module.exports = router;

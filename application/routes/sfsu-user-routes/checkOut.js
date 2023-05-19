/*
  Author: Eunice
  This file is used to retrieve the items inside of the user's cart
  and allow them to place an order
*/
var express = require('express');
var router = express.Router();
var db = require("../../conf/database");
var cartResults = [];
/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  //Rendering the cart in the orders page
  if(res.locals.logged){

    let currentOwner = res.locals.userId;
    
    var displayCart = "SELECT menu.menuID, menu.name, menu.images, menu.price, cart.quantity, cart.cartItemTotal FROM cart JOIN menu ON cart.cartItem = menu.menuID WHERE cart.userCart = ?";
    db.query(displayCart, [currentOwner], function(err, result, fields){
      if(err) throw err;
      cartResults = result;
      console.log(cartResults);
      res.render('sfsu-user-pages/checkOut', {usersCart : cartResults, title: "Check Out"});
    });
  }else{
    res.render('login/sfsuLogin', { message: "You must be logged in to view your cart.", error: true});
  }
  });

//Tutorial used: https://www.webslesson.info/2022/07/nodejs-autocomplete-search-with-mysql-database.html 
router.get('/getBuildings', function(req, res, next){
  var search_query = req.query.search_query;
  var sql = "SELECT name FROM dropoffPoints WHERE name LIKE ? LIMIT 3;";
  db.query(sql, ['%' + search_query + '%'], (err, result)=>{
    // console.log(result);
    res.json(result);
  }) 
});

router.post('/submitOrder', function(req,res,next){
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;
  let currentOwner = res.locals.userId;    


  let ticketItems = req.body.ticket;
  let buildingName = req.body.building;
  let room = req.body.room;
  let total = parseFloat(req.body.total);
  let restaurant = parseInt(req.body.ticket[0].restaurantID);
  console.log(req.body);
  console.log(restaurant);
  let numTicketItems = Object.keys(req.body.ticket).length;
  var newTickets = [];
  var cartIDs = [];
  //Getting the building id
  var buildingID = "SELECT pointID FROM dropoffPoints WHERE name = ?;";
  //Storing items inside of the orders table
  var insertOrder = "INSERT INTO team7.order(customerID, total, orderDate, restaurantName, dropoff, roomNumber) VALUES (?,?,?,?,?,?);";
  //Storing the menu items into the ticket
  var insertTicket = "INSERT INTO ticket(orderID, menuItem, quantity) VALUES ?";
  //Deleting items from the cart
  var deleteCartItems = "DELETE FROM cart WHERE cartID IN (?);";

  db.query(buildingID, [buildingName], (err, result)=>{
    if(err) throw err;
    if(result){
      let dropoffID = result[0].pointID;
      db.query(insertOrder, [currentOwner, total, currentDate, restaurant, dropoffID, room], (err, secondres)=>{
        if(err) throw err;
        let orderID = secondres.insertId;

        //Storing the individual ticket items in the array and storing the cart ids
        for(let i = 0; i < numTicketItems; i++){
          let individualTickets = [];
          individualTickets.push(orderID);
          individualTickets.push(parseInt(req.body.ticket[i].menuID));
          individualTickets.push(parseInt(req.body.ticket[i].quantity));
          newTickets.push(individualTickets);
          cartIDs.push(parseInt(req.body.ticket[i].cart));
        }

        db.query(insertTicket, [newTickets], (err, ticketRes)=>{
          if(err) throw err;
        })

        //Deleting the individual items from the cart table
        db.query(deleteCartItems, [cartIDs], (err, deleteCarts)=>{
          if(err) throw err;
        })
      })
    }
  })
  res.redirect('/orderCompleted');
});

//Delete ticket from the cart table
router.post('/deleteItem', function(req, res, next){
  let currentOwner = res.locals.userId;
  let ticketMenuID = req.body.ticket[0].delete;
  // console.log(req.body.ticket);
  let displayRestaurant;
  // console.log(ticketMenuID);
  

  var deleteItemFromCart = "DELETE FROM cart WHERE cartItem = ? AND userCart = ?;";
  db.query(deleteItemFromCart, [ticketMenuID, currentOwner], (err, result)=>{
    if(err) throw err;
  });
  
  //Getting the restaurant to be displayed again
  var getRestaurant = "SELECT restaurant FROM menu WHERE menu.menuID = ?";
  var showNewCart = "SELECT menu.menuID, menu.name, menu.images, menu.price, cart.quantity, cart.cartItemTotal FROM cart JOIN menu ON cart.cartItem = menu.menuID WHERE cart.userCart = ? AND cart.restaurantIDMenu = ?;";

  db.query(getRestaurant, [ticketMenuID], (err, result)=>{
    if(err) throw err;
    console.log(result[0].restaurant);
    displayRestaurant = result[0].restaurant;

    db.query(showNewCart, [currentOwner, displayRestaurant], (err, result)=>{
      if(err) throw err;
      console.log(result);
      cartResults = result;
      res.render('sfsu-user-pages/checkOut', {usersCart : cartResults});

    })
  })
    
})
module.exports = router;

//Routes for all the pages except for about team pages
// Author(s): Eunice, Emily
var express = require('express');
var router = express.Router();
const db = require('../conf/database');
var executeSearch = require("../public/js/searchModule.js").executeSearch;
var categoryLength = require("../public/js/searchModule.js").categoryLength;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home'});
});

//login routes---------------------------------------------------------------------
router.get('/sfsuLogin', function(req, res, next) {
  res.render('login/sfsuLogin', { 
    title: 'SFSU User Login',
    action:"/sfsuUser/sfsuLogin",
    registrationLink: "/sfsuRegistration"

  });
});

router.get('/driverLogin', function(req, res, next) {
  res.render('login/driverLogin', {
    title: 'Driver Login',
    action:"/drivers/driverLogin",
    registrationLink:"/driverRegistration"
  });
});

router.get('/restaurantOwnerLogin', function(req, res, next) {
  res.render('login/restaurantOwnerLogin', {
    title: 'Restaurant Login',
    action:"/restaurants/restaurantOwnerLogin",
    registrationLink: "/restaurantOwnerRegistration"
  });
});


//registration routes--------------------------------------------------------------------
router.get('/sfsuRegistration', function(req, res, next) {
  res.render('registration/sfsuRegistration', {
    title: 'SFSU User Registration',
    sfsuUser: true,
    action: "/sfsuUser/sfsuRegistration",
    loginLink: "/SFSULogin"
  });
});

router.get('/driverRegistration', function(req, res, next) {
  res.render('registration/driverRegistration', {
    title: 'Driver Registration',
    driver: true,
    action: "/drivers/driverRegistration",
    loginLink:"/driverLogin"
  });
});

router.get('/restaurantOwnerRegistration', function(req, res, next) {
  res.render('registration/restaurantOwnerRegistration', {
    title: 'Restaurant Registration',
    action: "/restaurants/restaurantOwnerRegistration",
    loginLink:"/restaurantOwnerLogin"
  });
});

//sfsu user pages---------------------------------------------------------------------------------------------------------
router.get('/searchResult', executeSearch, categoryLength, function(req, res, next) {

  res.render('sfsu-user-pages/searchResult', {
      results: req.searchResult.length,
      cResultsLength : req.categoryResults.length,
      searchTerm: req.searchTerm,
      searchResult: req.searchResult,
      category: req.category,
      images: req.images,
      latitude: req.latitude,
      longitude: req.longitude,
      restaurant_name: req.restaurant_name,
  });

});

router.get('/restaurantMenuCart', function(req, res, next) {
  // res.send('respond with a resource');
  let restaurantIdentifier = req.query.restaurant;
  // console.log("Restaurant name: %s", restaurantName);
  var sql = "SELECT * FROM restaurant WHERE restaurant_id = ?;";
  db.query(sql, [restaurantIdentifier], function(err, result, fields){
    let restaurantName = result.restaurant_name;
    var menuQuery = "SELECT * FROM menu WHERE restaurant = ?";
    db.query(menuQuery, [restaurantIdentifier], function(err, result, fields){
      let menuResults = result;

      let usersCart;
      // console.log(menuResults);
      //getting the user's cart from this restaurant if they're logged in
      if(res.locals.logged){
        let currentUser = res.locals.userId;
        var cartItems = "SELECT cartID, menu.menuID, menu.name, menu.images, menu.price, menu.restaurant, cartItem, quantity, cartItemTotal FROM cart JOIN menu ON cart.cartItem = menu.menuID WHERE userCart = ? AND menu.restaurant = ?;";
        db.query(cartItems, [currentUser, restaurantIdentifier], function(err, result){
          if(err) throw err; 
          usersCart = result;
          // console.log(usersCart);
          res.render('sfsu-user-pages/restaurantMenuCart', {title: restaurantName, menu: menuResults, userCart: usersCart, restaurantID : restaurantIdentifier});

        })
      }else{
        usersCart = "";
        res.render('sfsu-user-pages/restaurantMenuCart', {title: restaurantName, menu: menuResults, userCart: usersCart, restaurantID : restaurantIdentifier});
      }
    })
  });
});

router.get('/checkOut', function(req, res, next) {
  //Rendering the cart in the orders page
  if(res.locals.logged){

    let currentOwner = res.locals.userId;
    
    var displayCart = "SELECT menu.menuID, menu.name, menu.images, menu.price, cart.quantity, cart.cartItemTotal FROM cart JOIN menu ON cart.cartItem = menu.menuID WHERE cart.userCart = ?";
    db.query(displayCart, [currentOwner], function(err, result, fields){
      if(err) throw err;
      checkoutCartResults = result;
      console.log(checkoutCartResults);
      res.render('sfsu-user-pages/checkOut', {usersCart : checkoutCartResults, title: "Check Out"});
    });
  }else{
    res.render('login/sfsuLogin', { message: "You must be logged in to view your cart.", error: true});
  }
});

router.get('/orderCompleted', function(req, res, next) {
  res.render('sfsu-user-pages/orderCompleted', { title: 'Order Completed'});
});


//restaurant pages -------------------------------------------------------------------------------------------------
router.get('/restaurantApplication',function(req, res, next) {
  if(!req.session.restaurantOwner){
    res.render('login/restaurantOwnerLogin', {
      title: 'Restaurant Login',
      action:"/restaurants/restaurantOwnerLogin",
      registrationLink: "/restaurantOwnerRegistration",
      message: "Please log in as a restaurant owner first before registering a restaurant", 
      error: true
    });
  }else{
    var getCategories = "SELECT categoryName FROM categories;";
    db.query(getCategories, (err, categoriesResult)=>{
      if(err) throw err;
      res.render('registration/restaurantApplication', {title: 'Restaurant Application', applicationCategories: categoriesResult});
    })
  }
});

var restaurantResults = [];

router.get('/myRestaurants', function(req, res, next) {
  if(!req.session.restaurantOwner){
    res.render('login/restaurantOwnerLogin', {
      title: 'Restaurant Login',
      action:"/restaurants/restaurantOwnerLogin",
      registrationLink: "/restaurantOwnerRegistration",
      message: "Please log in as a restaurant owner to view your restaurants", 
      error: true
    });
  }else{
    //Getting all the restaurants from this owner
    let currentOwner = res.locals.userId;
    var statusSQL = "SELECT restaurant_name, description, images, restaurantStatus.status FROM restaurant JOIN restaurantStatus ON restaurant.approved = restaurantStatus.approvedID WHERE restaurant.restaurantOwner = ?;";
    db.query(statusSQL, [currentOwner], function(err, result, fields){
      if(err) throw err;
      restaurantResults = result;
      // console.log(result);
      res.render('restaurant-pages/myRestaurants', {restaurantName : restaurantResults, title: "My Restaurants"});
   });
  }
});

//driver routes ------------------------------------------------------------------------------------------------------------------------

router.get('/driverOrderList', function(req, res, next) {
  if(!req.session.driver){
    res.render('login/driverLogin', {
      title: 'Driver Login',
      action:"/drivers/driverLogin",
      registrationLink:"/driverRegistration",
      message: "Please log in as a driver first before viewing orders", 
      error: true
    });
  }else{
    var getOrders = `SELECT orderID, total, restaurant.images, restaurant.restaurant_name, restaurant.deliveryTime, dropoffPoints.name, roomNumber, deliveryType FROM team7.order
    JOIN restaurant ON restaurant.restaurant_id = order.restaurantName 
    JOIN dropoffPoints ON dropoffPoints.pointID = order.dropoff
    WHERE driver IS NULL;`;
    db.query(getOrders, (err, result)=>{
      if (err) throw err;
      console.log(result);
      res.render('driver-pages/driverOrderList', { title: 'Orders', orderList: result});
    })
  }
});

router.get('/driverOrderDetails', function(req, res, next) {
  if(!req.session.driver){
    res.render('login/driverLogin', {
      title: 'Driver Login',
      action:"/drivers/driverLogin",
      registrationLink:"/driverRegistration",
      message: "Please log in as a driver first before viewing order details", 
      error: true
    });
  }else{
    let orderIdentifier = req.query.order;
    // console.log(orderIdentifier);
    var getOrder = `SELECT order.orderID, total, restaurant.restaurant_name, restaurant.address, dropoffPoints.name AS "building", roomNumber, restaurant.deliveryTime,
    restaurant.latitude, restaurant.longitude
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
  }
  
});

router.get('/driverDeliveryMap', function(req, res, next) {

  if(!req.session.driver){
    res.render('login/driverLogin', {
      title: 'Driver Login',
      action:"/drivers/driverLogin",
      registrationLink:"/driverRegistration",
      message: "Please log in as a driver first before viewing the delivery map", 
      error: true
    });

  }else{
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
  }
  
  
});



module.exports = router;

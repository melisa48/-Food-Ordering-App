var express = require('express');
var router = express.Router();
const db = require('../conf/database');
var executeSearch = require("../public/js/searchModule.js").executeSearch;
var categoryLength = require("../public/js/searchModule.js").categoryLength;

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

//sfsu user pages
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
        var cartItems = "SELECT cartID, menu.menuID, menu.name, menu.images, menu.price, menu.restaurant, quantity, cartItemTotal FROM cart JOIN menu ON cart.cartItem = menu.menuID WHERE userCart = ? AND menu.restaurant = ?;";
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


//restaurant pages
router.get('/restaurantApplication',function(req, res, next) {
  if(!req.session.restaurantOwner){
    res.render('login/restaurantOwnerLogin', { message: "Please log in as a restaurant owner first before registering a restaurant", error: true});
  }else{
    res.render('registration/restaurantApplication', {title: 'Restaurant Application'});
  }
});




module.exports = router;

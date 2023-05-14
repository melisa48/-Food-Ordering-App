var express = require('express');
var router = express.Router();
var db = require("../../conf/database");
var cartResults = [];
//Author: Eunice
/*
  Description: Used to make nested queries to display a menu from a specific restaurant
*/
/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  let restaurantIdentifier = req.query.restaurant;
  // console.log("Restaurant name: %s", restaurantName);
  var sql = "SELECT * FROM restaurant WHERE restaurant_id = ?;";
  db.query(sql, [restaurantIdentifier], function(err, result, fields){
    let restaurantName = result[0].restaurant_name;
    var menuQuery = "SELECT * FROM menu WHERE restaurant = ?";
    db.query(menuQuery, [restaurantIdentifier], function(err, result, fields){
      let menuResults = result;
      res.render('sfsu-user-pages/restaurantMenuCart', {title: restaurantName, menu: menuResults});
    })
  });
});


router.post('/addToCart', function(req, res, next){
  //Validate that it is a sfsu user
  var validLogin = true;
  if(!req.session.email){
    validLogin = false;
    res.render('login/sfsuLogin', { message: "Please login as a SFSU user first.", error: true});
  }else{
    if(req.session.driver || req.session.restaurantOwner){
      validLogin = false;
      res.render('login/sfsuLogin', { message: "Please login as a SFSU user first. ", error: true});
    }
  }
  if(validLogin){
    var cartItems = [];
    let numCartItems = Object.keys(req.body.cart).length;
    let currentOwner = res.locals.userId;

    for(var i = 0; i < numCartItems; i++){
      var itemInformation = [];
      itemInformation.push(currentOwner);
      itemInformation.push(parseInt(req.body.cart[i].menuid));
      itemInformation.push(parseInt(req.body.cart[i].quantity));
      cartItems.push(itemInformation);
    }
    // console.log(cartItems);
    //Inserting into the cart table
    var sql = "INSERT INTO cart(userCart, cartItem, quantity) VALUES ?";
    db.query(sql, [cartItems], function(err, result, fields){
      if(err) throw err;
    })

    //Rendering the cart in the orders page
    var displayCart = "SELECT menu.name, menu.images, menu.price FROM cart JOIN menu ON cart.cartItem = menu.menuID WHERE cart.userCart = ?";
    db.query(displayCart, [currentOwner], function(err, result, fields){
      if(err) throw err;
      cartResults = result;
      console.log(cartResults);
      res.render('sfsu-user-pages/checkOut', {usersCart : cartResults});
    });
   
  }
})

module.exports = router;

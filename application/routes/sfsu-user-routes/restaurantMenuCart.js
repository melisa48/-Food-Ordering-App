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
    let restaurantName = result.restaurant_name;
    var menuQuery = "SELECT * FROM menu WHERE restaurant = ?";
    db.query(menuQuery, [restaurantIdentifier], function(err, result, fields){
      let menuResults = result;

      let usersCart;
      console.log(menuResults);
      //getting the user's cart from this restaurant if they're logged in
      if(res.locals.logged){
        let currentUser = res.locals.userId;
        var cartItems = "SELECT cartID, menu.menuID, menu.name, menu.images, menu.price, menu.restaurant, quantity, cartItemTotal FROM cart JOIN menu ON cart.cartItem = menu.menuID WHERE userCart = ? AND menu.restaurant = ?;";
        db.query(cartItems, [currentUser, restaurantIdentifier], function(err, result){
          if(err) throw err; 
          usersCart = result;
          console.log(usersCart);
          res.render('sfsu-user-pages/restaurantMenuCart', {title: restaurantName, menu: menuResults, userCart: usersCart});

        })
      }else{
        usersCart = "";
        res.render('sfsu-user-pages/restaurantMenuCart', {title: restaurantName, menu: menuResults, userCart: usersCart});
      }
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
  let numCartItems = Object.keys(req.body.cart).length;
  // console.log(numCartItems);
  if(validLogin){
    if(numCartItems >= 1){
      var cartItems = [];
      let currentOwner = res.locals.userId;    
      var newItems = 0;  
      console.log(req.body.cart);



      for(var i = 0; i < numCartItems; i++){
        if(!req.body.cart[i].cartID){
          var itemInformation = [];
          itemInformation.push(currentOwner);
          itemInformation.push(parseInt(req.body.cart[i].menuid));
          itemInformation.push(parseInt(req.body.cart[i].quantity));
          itemTotalPrice = parseFloat(req.body.cart[i].quantity) * req.body.cart[i].price;
          itemInformation.push(itemTotalPrice);
          itemInformation.push(parseInt(req.body.cart[i].restaurant));
          console.log(req.body.cart[i].restaurant);
          cartItems.push(itemInformation);
          newItems++;
        }else{
          var updateCartItem = "UPDATE cart SET quantity = ?, cartItemTotal = ? WHERE cartID = ?;";
          var newQuantity = req.body.cart[i].quantity;
          var newPrice = newQuantity * req.body.cart[i].price;
          var updateCardID = req.body.cart[i].cartID;
          db.query(updateCartItem, [newQuantity, newPrice, updateCardID], function(err, result,fields){
            if(err) throw err;
          })
        }
        

      }
      if(newItems >= 1){
        //Inserting into the cart table
        var sql = "INSERT INTO cart(userCart, cartItem, quantity, cartItemTotal, restaurantIDMenu) VALUES ?";
        db.query(sql, [cartItems], function(err, result, fields){
          if(err) throw err;
        })
      }


    } 
    res.redirect('/checkOut');
    
  }
})

module.exports = router;

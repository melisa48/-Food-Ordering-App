var express = require('express');
var router = express.Router();
var db = require("../../conf/database");

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  //Rendering the cart in the orders page
  let currentOwner = res.locals.userId;

  var displayCart = "SELECT menu.name, menu.images, menu.price, cart.quantity FROM cart JOIN menu ON cart.cartItem = menu.menuID WHERE cart.userCart = ?";
  db.query(displayCart, [currentOwner], function(err, result, fields){
    if(err) throw err;
    cartResults = result;
    console.log(cartResults);
    res.render('sfsu-user-pages/checkOut', {usersCart : cartResults});
  });
});

//Tutorial used: https://www.webslesson.info/2022/07/nodejs-autocomplete-search-with-mysql-database.html 
router.get('/getBuildings', function(req, res, next){
  var search_query = req.query.search_query;
  var sql = "SELECT name FROM dropoffPoints WHERE name LIKE ? LIMIT 3;";
  db.query(sql, ['%' + search_query + '%'], (err, result)=>{
    console.log(result);
    res.json(result);
  }) 
})
module.exports = router;

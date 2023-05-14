var express = require('express');
var router = express.Router();
var db = require("../../conf/database");
var restaurantResults = [];

router.get('/', function(req, res, next) {
  if(!req.session.restaurantOwner){
    res.render('login/restaurantLogin', { message: "Please log in as a restaurant owner to view your restaurants", error: true});
  }else{
    //Getting all the restaurants from this owner
    let currentOwner = res.locals.userId;
    var statusSQL = "SELECT restaurant_name, description, images, restaurantStatus.status FROM restaurant JOIN restaurantStatus ON restaurant.approved = restaurantStatus.approvedID WHERE restaurant.restaurantOwner = ?;";
    db.query(statusSQL, [currentOwner], function(err, result, fields){
      if(err) throw err;
      restaurantResults = result;
      // console.log(result);
      res.render('restaurant-pages/myRestaurants', {restaurantName : restaurantResults});
   });
  }
});


module.exports = router;
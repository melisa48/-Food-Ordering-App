// restaurantApplication.js
var express = require('express');
var router = express.Router();
var db = require("../../conf/database");
const bodyParser = require('body-parser');
const multer = require('multer'); 
// var sharp = require('sharp');
var crypto = require('crypto');

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "public/images/uploads");
  },
  filename: function(req, file, cb){
    let fileExt = file.mimetype.split('/')[1];
    let randomName = crypto.randomBytes(22).toString("hex");
    cb(null, `${randomName}.${fileExt}`);
  }
})

var uploader = multer({storage: storage});


router.get('/',function(req, res, next) {
  res.render('registration/restaurantApplication', {title: 'Restaurant Application'});
});
router.post('/application', uploader.single("restaurant-image"),function(req, res, next) {
  console.log(req);
  let restaurantName = req.body.restaurantName;
  let foodCategory = req.body.category;
  let deliveryTime = req.body.deliveryTime;
  let description = req.body.description;
  let address = req.body.address;
  let menu = req.body.menu;
  let currentOwner = res.locals.userId;
  var sql = "INSERT restaurant_name, category, description, address, restaurantOwner FROM restaurant VALUES(?,?,?,?,?);";
  // console.log(req.body);
  // db.query(sql, [restaurantName, foodCategory, description, address, currentOwner], function(err, result, fields){
    // let restaurantID = result[0].restaurant_id;
    // var menuQuery = "INSERT name, description, price, restaurant FROM menu VALUES (?,?,?,?);";
    // db.query(menuQuery, [])
  // })
  res.render('restaurant-pages/myRestaurants', {
  //   title: 'Restaurant Application',
  //   restaurantName,
  //   foodCategory,
  //   deliveryTime,
  //   description,
  //   menu
  });
});
module.exports = router;

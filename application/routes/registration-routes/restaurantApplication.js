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
  let restaurantName = req.body.restaurantName;
  let foodCategory = req.body.category;
  let deliveryTime = req.body.deliveryTime;
  let description = req.body.description;
  let address = req.body.address;
  let menu = req.body.menu;
  let currentOwner = res.locals.userId;
  var restaurantcategoryID;
  var restaurantImagePath = "/images/uploads/" + req.file.filename;
  // console.log(req.file.path);
  //TODO: throw an error if there is duplicate name
  //Joining the tables
  var categoryIDQuery = "SELECT categories.categoryID FROM restaurant JOIN categories ON restaurant.category = categories.categoryName WHERE restaurant.category = ?;";
  //First outer query call is for getting the category id foreign key
  db.query(categoryIDQuery,[foodCategory], function(err, result, fields){
    if(err) throw err;
    restaurantcategoryID = result[0].categoryID;
    //Second query call is for inserting the restaurant application into the restaurant table
    var sql = "INSERT INTO restaurant(restaurant_name, category, description, images, categoryID, address, restaurantOwner) VALUES(?,?,?,?,?,?,?);";
    db.query(sql, [restaurantName, foodCategory, description, restaurantImagePath, restaurantcategoryID, address, currentOwner], function(err, secondresult, fields){
      if(err) throw err;
      let restaurantID = secondresult.insertId;
    });
  });

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

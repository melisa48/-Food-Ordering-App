// restaurantApplication.js
var express = require('express');
var router = express.Router();
var db = require("../../conf/database");
const bodyParser = require('body-parser');
const multer = require('multer'); 
// var sharp = require('sharp');
var crypto = require('crypto');
var restaurantResults = [];
const https = require('https');
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
  if(!req.session.restaurantOwner){
    res.render('login/restaurantLogin', { message: "Please log in as a restaurant owner first before registering a restaurant", error: true});
  }else{
    res.render('registration/restaurantApplication', {title: 'Restaurant Application'});
  }
});
router.post('/application', uploader.single("restaurant-image"), function(req, res, next) {
  let restaurantName = req.body.restaurantName;
  let foodCategory = req.body.category;
  let deliveryTime = req.body.deliveryTime;
  let description = req.body.description;
  let address = req.body.address;
  let geocoding = "https://geocode.maps.co/search?q="+address;
  
  let currentOwner = res.locals.userId;
  var restaurantcategoryID;
  var restaurantImagePath = "/images/uploads/" + req.file.filename;
  // TODO: throw an error if there is duplicate name
  // Joining the tables
  var categoryIDQuery = "SELECT categories.categoryID FROM restaurant JOIN categories ON restaurant.category = categories.categoryName WHERE restaurant.category = ?;";
  //First outer query call is for getting the category id foreign key
  db.query(categoryIDQuery,[foodCategory], function(err, result, fields){
    if(err) throw err;
    restaurantcategoryID = result[0].categoryID;
    //Second query call is for inserting the restaurant application into the restaurant table
    var sql = "INSERT INTO restaurant(restaurant_name, category, description, images, latitude, longitude, categoryID, address, restaurantOwner) VALUES(?,?,?,?,?,?,?,?,?);";
    getValueFromUrl(geocoding, (err, result)=>{
      if (err) return console.error(err);
      
      db.query(sql, [restaurantName, foodCategory, description,restaurantImagePath, result[0].lat, result[0].lon, restaurantcategoryID, address, currentOwner], function(err, secondresult, fields){
        if(err) throw err;
        // let restaurantID = secondresult.insertId;
        //insert into menu table

        //redirecting to the pending pages
      });
    // console.log(result);
    });
  });

  //Not working, I think its because the async call for the geocoding causes it to be stored after
  // Getting all the restaurants from this owner
  var statusSQL = "SELECT * FROM restaurant JOIN restaurantStatus ON restaurant.approved = restaurantStatus.approvedID WHERE restaurant.restaurantOwner = ?;";
  db.query(statusSQL, [currentOwner], function(err, result, fields){
    if(err) throw err;
    restaurantResults = result;
    console.log(result);  
    res.render('restaurant-pages/myRestaurants', {restaurantName : restaurantResults});
  });
});

//From: https://stackoverflow.com/questions/49634012/return-result-of-https-get-in-js 
function getValueFromUrl(url, cb) {
  https.get(url, (resp) => {
    let data = ''

    let value = ''

    resp.on('data',(chunk) => {
          data = data + chunk.toString();
    });

    resp.on('end', () => {
      value = JSON.parse(data);
      // console.log(value);
      cb(null, value);
    });
  }).on('error', (err) => {
    cb(err);
  }).end();
  
}
module.exports = router;


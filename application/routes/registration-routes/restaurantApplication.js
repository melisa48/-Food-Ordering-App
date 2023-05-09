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


router.post('/application', uploader.any(),function(req, res, next) {
  let restaurantName = req.body.restaurantName;
  let foodCategory = req.body.category;
  let deliveryTime = req.body.deliveryTime;
  let description = req.body.description;
  var address = req.body.address;
  console.log(address);
  var geocodeAddress = address.replace(/ |,/g, "+");
  geocodeAddress = geocodeAddress + "+US";
  // console.log(geocodeAddress);
  let geocoding = "https://geocode.maps.co/search?q="+geocodeAddress;
  let numMenu = Object.keys(req.body.menu).length;
  // console.log(numMenu);
  let currentOwner = res.locals.userId;
  var restaurantcategoryID;

  //Getting the image path if the user uploaded a restaurant image
  var restaurantImageName;
  for(var i = 0; i < req.files.length; i++){
    if(req.files[i].fieldname == "restaurant-image"){
      restaurantImageName = req.files[i].filename;
      // console.log(req.files[i].originalname);
      break;
    }
  }
  var restaurantImagePath;
  if(restaurantImageName){
    restaurantImagePath = "/images/uploads/" + restaurantImageName;
  }else{
    restaurantImagePath = "";
  }
  // console.log("Restaurant Image: %s", restaurantImagePath);

  var menu =  req.body.menu;
  var menuImageExist = false;
  var menuImages = [];
  var uploadedImages = req.files.length;
  for (var i = 0; i < numMenu; i++) {
    // console.log("Menu image at %d:", (i));
    var imageName = "menu["+i+"][image]";
    for(var j = 0; j < uploadedImages; j++){
      if(req.files[j].fieldname == imageName){
        menuImages.push("/images/uploads/"+req.files[j].filename);
        menuImageExist = true;
        break;
      }
    }
    if(menuImageExist == false){
      menuImages.push("");
    }
    menuImageExist = false;
  }
  // console.log(menuImages);

  //Pushing the menu items into an array
  var menuArray = [];

 
  // console.log(menuArray);

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
        let restaurantID = secondresult.insertId;
        for(var i = 0; i < numMenu; i++){
          var menuItems = [];
          menuItems.push(req.body.menu[i].name);
          menuItems.push(req.body.menu[i].description);
          menuItems.push(menuImages[i]);
          menuItems.push(req.body.menu[i].price);
          menuItems.push(restaurantID);
          menuArray.push(menuItems);
        }
        //insert into menu table
        var insertMenuItems = "INSERT INTO menu(name, description, images, price, restaurant) VALUES ?;";
        db.query(insertMenuItems, [menuArray], function(err, result, fields){
          if(err) throw err;
        })
       
        //redirecting to the pending pages including the submitted restaurant
        var statusSQL = "SELECT * FROM restaurant JOIN restaurantStatus ON restaurant.approved = restaurantStatus.approvedID WHERE restaurant.restaurantOwner = ?;";
        db.query(statusSQL, [currentOwner], function(err, result, fields){
          if(err) throw err;
          restaurantResults = result;
          // console.log(result);  
          res.render('restaurant-pages/myRestaurants', {restaurantName : restaurantResults});
        });
      });
    });
  });
  //Temp
  // res.redirect('/');
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


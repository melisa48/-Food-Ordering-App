//Post Methods for all restaurant owner and restaurant related pages
//Author(s): Eunice
var express = require('express');
var router = express.Router();
var db = require("../conf/database");
var bcrypt = require('bcryptjs');


//RESTAURANT OWNER LOGIN----------------------------------------------------------------------------------
router.post('/restaurantOwnerLogin',(req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  var sql = "SELECT restaurantID,firstname,lastname,password,email FROM restaurantAccount where email = ?;";
  let userid;
  let firstname;
  let lastname;
  db.query(sql,[email], function(err,result, fields){
    if(err) throw err;

    if(result.length == 1 && bcrypt.compareSync(password, result[0].password)){
        userid = result[0].restaurantID;
        firstname = result[0].firstname;
        lastname = result[0].lastname;
        //login user
        req.session.userid = userid;  
        req.session.email = email;   
        req.session.firstName = firstname;
        req.session.lastName = lastname;
        res.locals.logged = true;
        res.locals.restaurantOwner = true;
        res.locals.driver = false;
        req.session.restaurantOwner = "restaurant Owner logged in";
        // console.log("user id: %s",  req.session.userid);
        res.render('index', {email : req.session.email});
      }else{
        res.render('login/restaurantOwnerLogin', {
          title: 'Restaurant Login',
          action:"/restaurants/restaurantOwnerLogin",
          registrationLink: "/restaurantOwnerRegistration",
          message: "Invalid Login",
          error: true
        });
        
      }
  });
});

//RESTAURANT OWNER LOGOUT----------------------------------------
router.post('/logout', (req,res,next)=>{
  if(req.session.email){
    console.log("Logging out: %s", req.session.email);
    req.session.destroy();
    res.redirect('/');
  }
});

//RESTAURANT APPLICATION-----------------------------------------------------------------------
const bodyParser = require('body-parser');
const multer = require('multer'); 
// var sharp = require('sharp');
var crypto = require('crypto');
var restaurantApplicationResults = [];
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

router.post('/restaurantApplication', uploader.any(),function(req, res, next) {
  let restaurantName = req.body.restaurantName;
  let foodCategory = req.body.category;
  let deliveryTime = parseInt(req.body.deliveryTime) || 0;
  let description = req.body.description;
  var address = req.body.address;

  //Server side input validations
  if(!restaurantName || !address){
    res.redirect('/restaurantApplication');
  }



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
    restaurantImagePath = restaurantImageName;
  }else{
    restaurantImagePath = "restaurant.png";
  }
  // console.log("Restaurant Image: %s", restaurantImagePath);

  var menu =  req.body.menu;  
  if(!menu[0].name){
    res.redirect('/restaurantApplication');
  }
  //Server side validation for menu

  var menuImageExist = false;
  var menuImages = [];
  var uploadedImages = req.files.length;
  for (var i = 0; i < numMenu; i++) {
    // console.log("Menu image at %d:", (i));
    var imageName = "menu["+i+"][image]";
    for(var j = 0; j < uploadedImages; j++){
      if(req.files[j].fieldname == imageName){
        menuImages.push(req.files[j].filename);
        menuImageExist = true;
        break;
      }
    }
    if(menuImageExist == false){
      menuImages.push("dinner.png");
    }
    menuImageExist = false;
  }
  // console.log(menuImages);

  //Pushing the menu items into an array
  var menuArray = [];

 
  // console.log(menuArray);

  // Joining the tables
  var categoryIDQuery = "SELECT categories.categoryID FROM restaurant JOIN categories ON restaurant.category = categories.categoryName WHERE restaurant.category = ?;";
  //First outer query call is for getting the category id foreign key
  db.query(categoryIDQuery,[foodCategory], function(err, result, fields){
    if(err) throw err;
    restaurantcategoryID = result[0].categoryID;
    //Second query call is for inserting the restaurant application into the restaurant table
    var sql = "INSERT INTO restaurant(restaurant_name, category, description, images, latitude, longitude, categoryID, address, restaurantOwner, deliveryTime) VALUES(?,?,?,?,?,?,?,?,?,?);";
    getValueFromUrl(geocoding, (err, result)=>{
      if (err) return console.error(err);
      var latitude;
      var longitude;
      console.log(result);
      if(result.length > 0){
        latitude = result[0].lat;
        longitude = result[0].lon;
      }
      db.query(sql, [restaurantName, foodCategory, description,restaurantImagePath, latitude, longitude, restaurantcategoryID, address, currentOwner,deliveryTime], function(err, secondresult, fields){
        if(err) throw err;
        let restaurantID = secondresult.insertId;
        for(var i = 0; i < numMenu; i++){
          var menuItems = [];
          menuItems.push(req.body.menu[i].name);
          menuItems.push(req.body.menu[i].description);
          menuItems.push(menuImages[i]);
          menuItems.push(parseFloat(req.body.menu[i].price) || 0);
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
          restaurantApplicationResults = result;
          // console.log(result);  
          res.render('restaurant-pages/myRestaurants', {restaurantName : restaurantApplicationResults});
        });
      });
    });
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

//RESTAURANT OWNER REGISTRATION

//Author: Eunice
router.post('/restaurantOwnerRegistration',(req, res, next) => {
  // console.log('registration router reached.');
  // Getting the input values from the registration form 
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;
  let confirmpassword = req.body.confirmpassword;
  //Tutorial Used: https://www.youtube.com/watch?v=auEkP8ZKWOE 
  //Checking to make sure that the confirm password and password is the same
  if(confirmpassword == password){
    if(isValid(email)){
      //Querying the database to check if the email already exists
      db.query("SELECT * FROM restaurantAccount WHERE email = ?",[email],function(err,result,fields){

        if(err) throw err;
  
          if(result.length > 0 ){
            console.log("Email is already registered.");
          }else{
            //Hashing the password before storing into the database
            var hashedpassword = bcrypt.hashSync(password, 8);

            //Inserting the values from the form into the database
            let baseSQL = "INSERT INTO restaurantAccount(firstname,lastname, password, email) VALUES (?,?,?,?)";

            db.query(baseSQL, [firstname, lastname, hashedpassword, email], function(err, result, fields){
              if(err) throw err;
              res.redirect('/restaurantOwnerLogin');
            })
          }
          
      })
    }else{
      console.log("Not a valid email address.\n");
      res.render('registration/restaurantOwnerRegistration', {
        title: 'Restaurant Registration',
        action: "/restaurants/restaurantOwnerRegistration",
        loginLink:"/restaurantOwnerLogin",
        message: "Not a valid email address", 
        error: true
      });

    }
    
  }else{
    console.log("Passwords do not match\n");
    res.render('registration/restaurantOwnerRegistration', {
      title: 'Restaurant Registration',
      action: "/restaurants/restaurantOwnerRegistration",
      loginLink:"/restaurantOwnerLogin",
      message: "Passwords does not match", 
      error: true
    });

  }

});


//Function to check if the user is registering with a valid email pattern
//From: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript 
function isValid(email){
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}





module.exports = router;

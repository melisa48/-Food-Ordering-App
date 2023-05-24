//Post Methods for all driver related pages
//Author(s): Eunice
var express = require('express');
var router = express.Router();
var db = require("../conf/database");
var bcrypt = require('bcryptjs');


//DRIVER LOGIN ---------------------------------------------------------------------------------
router.post('/driverLogin',(req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  var sql = "SELECT driverID,firstname,lastname,password,email FROM driver where email = ?;";
  let userid;
  let firstname;
  let lastname;
  db.query(sql,[email], function(err,result, fields){
    if(err) throw err;

    if(result.length == 1 && bcrypt.compareSync(password, result[0].password)){
        userid = result[0].driverID;
        firstname = result[0].firstname;
        lastname = result[0].lastname;
        //login user
        req.session.userid = userid;  
        req.session.email = email;   
        req.session.firstName = firstname;
        req.session.lastName = lastname;
        res.locals.logged = true;
        res.locals.driver = true;
        res.locals.restaurantOwner = false;

        req.session.driver = "driver logged in";
        // console.log("fn: %s",  req.session.firstName);
        res.render('index', {email : req.session.email});
      }else{
        res.render('login/driverLogin', {
          title: 'Driver Login',
          action:"/drivers/driverLogin",
          registrationLink:"/driverRegistration",
          message: "Invalid Login",
          error: true
        });
        
      }
  });
});

//-----------------------------------------------------------------------------------------------------

// DRIVER REGISTRATION
//Author: Eunice
router.post('/driverRegistration',(req, res, next) => {
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
      //Checking for password strength
      if(isValidPassword(password)){

        //Querying the database to check if the email already exists
        db.query("SELECT * FROM driver WHERE email = ?",[email],function(err,result,fields){

          if(err) throw err;
    
            if(result.length > 0 ){
              console.log("Email is already registered.");
            }else{
              //Hashing the password before storing into the database
              var hashedpassword = bcrypt.hashSync(password, 8);

              //Inserting the values from the form into the database
              let baseSQL = "INSERT INTO driver(firstname,lastname, password, email) VALUES (?,?,?,?)";

              db.query(baseSQL, [firstname, lastname, hashedpassword, email], function(err, result, fields){
                if(err) throw err;
                res.redirect('/driverLogin');
              })
            }
            
        })
      }else{
        res.render('registration/driverRegistration', {
          title: 'Driver Registration',
          driver: true,
          action: "/drivers/driverRegistration",
          loginLink:"/driverLogin",
          message: "Password must have a minimum of 8 characters, at least one upper case, one number, and one special character", 
          error: true
        });
      }

    }else{
      console.log("Not a valid email address.\n");
      res.render('registration/driverRegistration', {
        title: 'Driver Registration',
        driver: true,
        action: "/drivers/driverRegistration",
        loginLink:"/driverLogin",
        message: "Not a valid email address", 
        error: true
      });
      
    }
    
  }else{
    console.log("Passwords do not match\n");
    res.render('registration/driverRegistration', {
      title: 'Driver Registration',
      driver: true,
      action: "/drivers/driverRegistration",
      loginLink:"/driverLogin",
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

//Function used for password verification
//From: https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength 
function isValidPassword(password){
  return String(password)
  .match(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  );
}

//DRIVER LOGOUT
router.post('/logout', (req,res,next)=>{
  if(req.session.email){
    console.log("Logging out: %s", req.session.email);
    req.session.destroy();
    res.redirect('/');
  }
});

//DriverOrderDetails-------------------------------------------------------------------
router.post('/deliveryMap', function(req, res, next){
  let currentDriver = res.locals.userId;
  let updateOrder = parseInt(req.body.orderID);
 
  var updateDriver = "UPDATE team7.order SET driver = ? WHERE orderID = ?;";
  var getOrder = `SELECT order.orderID, dropoffPoints.name AS "building", roomNumber 
  FROM team7.order 
  JOIN dropoffPoints ON dropoffPoints.pointID = order.dropoff
  WHERE order.orderID = ?;`;
  let getTickets = `SELECT menu.name, menu.images, quantity FROM ticket 
  JOIN menu ON menu.menuID = ticket.menuItem
  WHERE orderID = ?;`;
  db.query(updateDriver, [currentDriver, updateOrder], (err, updatedDriver)=>{
    if(err) throw err;
        db.query(getOrder, [updateOrder], (err, orderResult)=>{
          if(err) throw err;
          db.query(getTickets, [updateOrder], (err, ticketResult)=>{
            if(err) throw err;
            
            res.render('driver-pages/driverDeliveryMap', {title: "Delivery Map", orders: orderResult, tickets: ticketResult });
          })
        })
  })

})

//DRIVER DELIVERY MAP --------------------------------------------------------------------------------------------------------------

router.post('/deliveryStatus', function(req, res, next){
  let deliveryStatus = req.body.status;
  let orderID = parseInt(req.body.orderID);
  let deliveryProgress;
  let orderStatus = `UPDATE team7.order SET progress = ? WHERE order.orderID = ?;`;
  let orderAndDriverStatus = `UPDATE team7.order SET progress = ?, driver = ? WHERE order.orderID = ?;`;
  if(deliveryStatus == "cancel"){
    console.log("delivery cancelled");
    deliveryProgress = 1;
    db.query(orderAndDriverStatus, [deliveryProgress, null, orderID], (err, cancelledOrder)=>{
      if(err) throw err;
    });
  }
  if(deliveryStatus == "complete"){
    console.log("delivery completed");
    deliveryProgress = 2;
    db.query(orderStatus, [deliveryProgress, orderID], (err, completedOrder)=>{
      if(err) throw err;
    });
  }
  res.redirect('/driverOrderList');
})

module.exports = router;

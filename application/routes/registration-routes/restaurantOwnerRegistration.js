var express = require('express');
var router = express.Router();
var db = require("../../conf/database");
var bcrypt = require('bcryptjs');
router.get('/', function(req, res, next) {
  res.render('registration/restaurantOwnerRegistration', {title: 'Restaurant Registration'});
});

//Author: Eunice
router.post('/restaurantOwnerRegister',(req, res, next) => {
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
      res.render('registration/restaurantOwnerRegistration',  { message: "Not a valid email address", error: true});
    }
    
  }else{
    console.log("Passwords do not match\n");
    res.render('registration/restaurantOwnerRegistration', { message: "Passwords does not match", error: true});
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

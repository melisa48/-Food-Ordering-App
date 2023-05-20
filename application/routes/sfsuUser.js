var express = require('express');
var router = express.Router();
var db = require("../conf/database");
var bcrypt = require('bcryptjs');

//SFSU LOGIN
router.post('/sfsuLogin',(req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  var sql = "SELECT userID,firstname,lastname,verifiedEmail,password FROM registeredUsers where verifiedEmail = ?;";
  let userid;
  let firstname;
  let lastname;
  db.query(sql,[email], function(err,result, fields){
    if(err) throw err;

    // if(result.length && (password == encryption.decryptData(result[0].password))){
    if(result.length == 1 && bcrypt.compareSync(password, result[0].password)){
        userid = result[0].userID;
        firstname = result[0].firstname;
        lastname = result[0].lastname;
        //login user
        req.session.userid = userid;  
        req.session.email = email;   
        req.session.firstName = firstname;
        req.session.lastName = lastname;
        res.locals.logged = true;
        req.session.driver = false;
        req.session.restaurantOwner = false;

        // console.log("fn: %s",  req.session.firstName);
        res.render('index', {email : req.session.email});
      }else{
        res.render('login/sfsuLogin', { message: "Invalid login", error: true });
      }
  });
});

//SFSU USER LOGOUT
router.post('/logout', (req,res,next)=>{
  if(req.session.email){
    console.log("Logging out: %s", req.session.email);
    req.session.destroy();
    res.redirect('/');
  }
});

//SFSU USER REGISTRATION


//Author: Eunice
router.post('/sfsuRegistration',(req, res, next) => {
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
      db.query("SELECT * FROM registeredUsers WHERE verifiedEmail = ?",[email],function(err,result,fields){

        if(err) throw err;
  
          if(result.length > 0 ){
            console.log("Email is already registered.");
          }else{
            //Hashing the password before storing into the database
            // const hashedpassword = encryption.encryptData(password);
            var hashedpassword = bcrypt.hashSync(password, 8);

            //Inserting the values from the form into the database
            let baseSQL = "INSERT INTO registeredUsers(firstname, lastname, password, verifiedEmail) VALUES (?,?,?,?)";
            db.query(baseSQL, [firstname, lastname, hashedpassword, email], function(err, result, fields){
              if(err) throw err;
              // console.log("Supposed to be redirecting to login\n");
              res.redirect('/sfsuLogin');
            })
          }
          
      })
    }else{
      // console.log("Not a valid email address.\n");
      res.render('registration/sfsuRegistration', { message: "Not a valid email address", error: true});
    }
    
  }else{
    console.log("Passwords do not match\n");
    res.render('registration/sfsuRegistration', { message: "Passwords does not match", error: true});
  }

});


//Function to check if the user trying to register is a SFSU email
function isValid(email){
  var parts = email.split("@");
  if(parts[1] === "sfsu.edu" || parts[1] === "mail.sfsu.edu"){
    return true;
  }
  return false;
}


module.exports = router;

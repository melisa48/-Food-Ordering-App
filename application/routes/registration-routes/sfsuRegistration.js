var express = require('express');
var router = express.Router();
var db = require("../../conf/database");
var bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  res.render('registration/sfsuRegistration', {title: 'SFSU Registration'});
});
//Author: Eunice
router.post('/sfsuRegister',(req, res, next) => {
  // console.log('registration router reached.');
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;
  let confirmpassword = req.body.confirmpassword;
  //Tutorial Used: https://www.youtube.com/watch?v=auEkP8ZKWOE 
  if(confirmpassword == password){
    if(isValid(email)){
      db.query("SELECT * FROM registeredUsers WHERE verifiedEmail = ?",[email],function(err,result,fields){

        if(err) throw err;
        //verifying that the passwords are the same
  
          if(result.length > 0 ){
            console.log("Email is already registered.");
          }else{
            var hashpassword = bcrypt.hashSync(password,10);
            console.log(hashpassword);
            let baseSQL = "INSERT INTO registeredUsers(firstname, lastname, password, verifiedEmail) VALUES (?,?,?,?)";
            db.query(baseSQL, [firstname, lastname, hashpassword, email], function(err, result, fields){
              if(err) throw err;
              console.log("Supposed to be redirecting to login\n");
              res.redirect('/sfsuLogin');
            })
          }
          
      })
    }else{
      console.log("Not a valid email address.\n");
      res.redirect('/sfsuRegistration');
    }
    
  }else{
    console.log("Passwords do not match\n");
    res.redirect('/sfsuRegistration');
  }

});

function isValid(email){
  var parts = email.split("@");
  if(parts[1] === "sfsu.edu" || parts[1] === "mail.sfsu.edu"){
    return true;
  }
  return false;
}
  
module.exports = router;

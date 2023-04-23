var express = require('express');
var router = express.Router();
var db = require("../../conf/database");
router.get('/', function(req, res, next) {
  res.render('registration/sfsuRegistration', {title: 'SFSU Registration'});
});

router.post('/sfsuLogin',(req, res, next) => {
  // console.log('registration router reached.');
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;
  //Tutorial Used: https://www.youtube.com/watch?v=auEkP8ZKWOE 
  db.query("SELECT * FROM registeredUsers WHERE verifiedEmail = ?",[email],function(err,result,fields){
    if(err) throw err;

    if(result.length > 0 ){
      console.log("Email is already registered.");
    }else{
      let baseSQL = "INSERT INTO registeredUsers(firstname, lastname, password, verifiedEmail) VALUES (?,?,?,?)";
      db.query(baseSQL, [firstname, lastname, password, email], function(err, result, fields){
        if(err) throw err;
        console.log("Supposed to be redirecting to login\n");
        // res.redirect('/');
      })
    }
  })
  res.redirect('/sfsuLogin');

});
  
  
module.exports = router;

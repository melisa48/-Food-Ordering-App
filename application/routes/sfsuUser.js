var express = require('express');
var router = express.Router();
var db = require("../conf/database");
var bcrypt = require('bcryptjs');


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

router.post('/logout', (req,res,next)=>{
  if(req.session.email){
    console.log("Logging out: %s", req.session.email);
    req.session.destroy();
    res.redirect('/');
  }
});
module.exports = router;

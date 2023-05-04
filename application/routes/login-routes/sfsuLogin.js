var express = require('express');
var router = express.Router();
var db = require("../../conf/database");
var bcrypt = require('bcryptjs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login/sfsuLogin', { title: 'SFSU Login'});
});
router.post('/sfsulogin',(req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  var sql = "SELECT userID,firstName,lastName,verifiedEmail,password FROM registeredUsers where verifiedEmail = ?;";
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
        res.locals.logged = true;
        req.session.userid = userid;  
        req.session.email = result[0].email;   
        req.session.firstName = firstname;
        req.session.lastName = lastname;
        // console.log("userid: %d",  req.session.userid);
        res.render('index');
      }else{
        res.render('sfsuLogin', { message: "Invalid login" });
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

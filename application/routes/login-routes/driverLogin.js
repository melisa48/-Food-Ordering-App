var express = require('express');
var router = express.Router();
var db = require("../../conf/database");
var bcrypt = require('bcryptjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('login/driverLogin', {title: 'Driver Login'});
});

router.post('/driverlogin',(req, res, next) => {
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
        req.session.driver = "driver logged in";
        // console.log("fn: %s",  req.session.firstName);
        res.render('index', {email : req.session.email});
      }else{
        res.render('login/driverLogin', { message: "Invalid login", error:true });
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

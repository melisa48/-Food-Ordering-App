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
  var sql = "SELECT * FROM registeredUsers where verifiedEmail = ?;";
  db.query(sql,[email], function(err,result, fields){
    if(err) throw err;

    // if(result.length && (password == encryption.decryptData(result[0].password))){
    if(result.length && bcrypt.compareSync(password, result[0].password)){
      res.locals.logged = true;
      res.locals.email = email;
      req.session.email = email;
      console.log("logged in as %s", email);
      res.render('index', { email : req.session.email });
    }else{
      res.redirect('/');
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

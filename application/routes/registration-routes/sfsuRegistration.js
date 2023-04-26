var express = require('express');
var router = express.Router();
var db = require("../../conf/database");

router.get('/', function(req, res, next) {
  res.render('registration/sfsuRegistration', {title: 'SFSU Registration'});
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

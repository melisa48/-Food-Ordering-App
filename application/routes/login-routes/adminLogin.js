var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('login/adminLogin', {title: 'Admin Login'});
});

module.exports = router;

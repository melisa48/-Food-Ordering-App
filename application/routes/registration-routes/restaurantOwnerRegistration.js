var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('registration/restaurantOwnerRegistration', {title: 'Restaurant Registration'});
});

module.exports = router;

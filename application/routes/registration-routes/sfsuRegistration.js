var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('registration/sfsuRegistration', {title: 'SFSU Registration'});
});

module.exports = router;

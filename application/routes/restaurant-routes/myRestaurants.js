var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('restaurant-pages/myRestaurants', {title: 'restaurants'});
});


module.exports = router;
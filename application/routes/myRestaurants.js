var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('restaurants', {title: 'restaurants'});
});

<button class="register-btn" onclick="location.href='/registration/restaurantRegistration'">Register Another Restaurant</button>

module.exports = router;
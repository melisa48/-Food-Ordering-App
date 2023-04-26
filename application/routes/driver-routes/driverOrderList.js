var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('driver-pages/driverOrderList', { title: 'Orders'});
});



module.exports = router;

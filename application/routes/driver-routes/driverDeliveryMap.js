var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('driver-pages/driverDeliveryMap', { title: 'Delivery Map'});
});



module.exports = router;

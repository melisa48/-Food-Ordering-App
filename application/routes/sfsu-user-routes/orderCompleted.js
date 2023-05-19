var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('sfsu-user-pages/orderCompleted', { title: 'Order Completed'});
});
module.exports = router;

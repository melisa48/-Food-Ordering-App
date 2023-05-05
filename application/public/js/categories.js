var express = require('express');
var router = express.Router();
var db = require("../../conf/database");

router.use('/',(req, res, next) => {
    var sql = "SELECT * FROM categories";
    db.query(sql, function(err, result, fields){
        console.log(result);
        res.render('/partials/navbar',{
            category: result
        });
    });
});

module.exports = router;
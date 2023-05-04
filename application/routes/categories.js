var express = require('express');
var router = express.Router();
var db = require("../conf/database");

//Tutorial used:https://www.youtube.com/watch?v=UmLsPEC0_V4 

router.get('/',(req,res,next)=>{
    db.query('SELECT DISTINCT category FROM team7.restaurant',
    function(error, data){
        res.render('partials/navbar', { title: 'Category List', categoryData: data });
    });
    // console.log
});

module.exports = router;

var express = require('express');
var router = express.Router();
const db = require('../conf/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home'});

  // db.query("SELECT * FROM team7.team WHERE name=?;", ['Emily'], function(err, results, fields){
  //   if(err){
  //     console.log(err);
  //   }
  //   else{
  //     console.log(results);
  //     // console.log("test");
  //     // results.forEach(row => console.log(row));
  //     // console.log("test2");
  //   }
  // });
});



module.exports = router;

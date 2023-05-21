var express = require('express');
var router = express.Router();
var hbs = require('hbs');


/* GET about page */
router.get('/', function(req, res, next) {
  res.render('about-hbs/about', { title: 'About'});
});

router.get('/andy', function(req, res, next) {
  res.render('about-hbs/andy', {title: 'Andy'});
});

router.get('/emily', function(req, res, next) {
  res.render('about-hbs/emily', {title: 'Emily'});
});

router.get('/eunice', function(req, res, next) {
  res.render('about-hbs/eunice', {title: 'Eunice'});
});

router.get('/juandavid', function(req, res, next) {
  res.render('about-hbs/juandavid', {title: 'Juan David'});
});

router.get('/melisa', function(req, res, next) {
  res.render('about-hbs/melisa', {title: 'Melisa'});
});

module.exports = router;
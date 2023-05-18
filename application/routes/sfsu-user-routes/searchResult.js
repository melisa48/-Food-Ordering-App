var express = require('express');
var router = express.Router();
var executeSearch = require("../../public/js/searchModule.js").executeSearch;
var categoryLength = require("../../public/js/searchModule.js").categoryLength;
var db = require("../../conf/database");

//
//Authors(s): Eunice and Emily
router.get('/', executeSearch, categoryLength, function(req, res, next) {

    res.render('sfsu-user-pages/searchResult', {
        results: req.searchResult.length,
        cResultsLength : req.categoryResults.length,
        searchTerm: req.searchTerm,
        searchResult: req.searchResult,
        category: req.category,
        images: req.images,
        latitude: req.latitude,
        longitude: req.longitude,
        restaurant_name: req.restaurant_name,
    });
    // console.log(name);
    // console.log(categoryResultsLength);

});

module.exports = router;

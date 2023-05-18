var express = require('express');
var router = express.Router();
var executeSearch = require("../../public/js/searchModule.js").executeSearch;

//
//Authors(s): Eunice and Emily
router.get('/', executeSearch, function(req, res, next) {
    res.render('sfsu-user-pages/searchResult', {
        results: req.searchResult.length,
        searchTerm: req.searchTerm,
        searchResult: req.searchResult,
        category: req.category,
        images: req.images,
        latitude: req.latitude,
        longitude: req.longitude,
        restaurant_name: req.restaurant_name,
        categoryResultsLength: req.categoryResults.length
    });
    // console.log(name);

});

module.exports = router;

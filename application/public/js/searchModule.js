var db = require("../../conf/database");
const { search } = require("../../routes/searchResult");
const searchModule = {};


// based on server side search by nicholas stepanov
// https://medium.com/@nicholasstepanov/search-your-server-side-mysql-database-from-node-js-website-400cd68049fa
searchModule.executeSearch = function(req, res, next){

    var searchTerm = req.query.search;
    var category = req.query.category;

    let query = "SELECT * FROM team7.restaurant";

    // show all restaurants
    if(category =='all' && searchTerm ==''){
        console.log('situation 0');
    }
    // returns all restaurants that have the searchTerm either category/name/description
    else if(category == 'all' && searchTerm !=""){
        console.log("1");
        query = "SELECT * FROM team7.restaurant WHERE name LIKE '%" + searchTerm + "%'\
        OR  category ='"+  category+"' OR description LIKE'%" + searchTerm + "%' OR category = '" + searchTerm +"';";
    }
    //returns restaurants in the chosen category and have the searchTerm in either name/description
    else if(category != '' && searchTerm !=''){
        query = "SELECT * FROM team7.restaurant WHERE category ='"+  category+"' AND (name LIKE '%" + searchTerm + "%'\
        OR description LIKE'%" + searchTerm + "%');";
        console.log("situation 2");
    }
    // returns all restaurants in the chosen category
    else if(category != '' && searchTerm == '' ){
        query = "SELECT * FROM team7.restaurant WHERE category ='" + category + "';";
        console.log("situation 3");
    }



    db.query(query, (err, results)=>{
        if(err){
            req.searchResult = results;
            req.searchTerm = searchTerm;
            req.category = "";
            next();
        }
        console.log(searchTerm);
        console.log(category);
        console.log(results);
        req.searchResult = results;
        req.searchTerm = searchTerm;
        req.category = category;
        req.latitude = [];
        req.longitude = [];
        req.name = [];
        // req.latitude = results.latitude;
        for(x in results){
            // console.log([results[x].latitude]);
            req.latitude.push(results[x].latitude);
            req.longitude.push(results[x].longitude);
            // req.name.push(results[x].name.toString());
        }

        console.log(req.latitude);
        console.log(req.longitude);
        // console.log(req.name)
        // console.log(results[0].latitude);
        next();
    })

}


module.exports = searchModule;
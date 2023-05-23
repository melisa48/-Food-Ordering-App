// Code to submit search form (search bar in navbar or home page find food button) 
// Author(s): Emily
var searchButton = document.getElementById('search-button');
var searchForm = document.getElementById("search-form");
var searchButton2 = document.getElementById('find-food-button');


searchButton.addEventListener("click", function(e){
    e.preventDefault();
    searchForm.submit();
    
});

searchButton2.addEventListener("click", function(e){
    e.preventDefault();
    searchForm.submit();
    
});




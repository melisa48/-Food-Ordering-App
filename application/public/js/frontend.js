// Code to submit search form (search bar in navbar)
// Author(s): Emily
var searchButton = document.getElementById('search-button');
var searchForm = document.getElementById("search-form");

searchButton.addEventListener("click", function(e){
    e.preventDefault();
    searchForm.submit();
    
});


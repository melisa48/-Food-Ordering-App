var express = require('express');
var router = express.Router();

var restaurants=[];

var executeSearch = require("../public/js/searchModule.js").executeSearch;

function initMap() {
    const myLatLng = { lat: 37.72578004921761, lng: -122.47941959317956 };

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      
      center: myLatLng,
      disableDefaultUI: true,
    });
  
    new google.maps.Marker({
      position: myLatLng,
      map,
      title: "Hello World!",
    });
  }
  
  window.initMap = initMap;
function initMap() {
    const sfsu = { lat: 37.725068952219125, lng: -122.47997290793536 };

    //Olive Garden Map
    const oliveGardenLatLng = { lat: 37.72743797411058, lng: -122.47637796816656 };
    var oliveGarden = document.getElementById("oliveGarden");
    if(oliveGarden){
      var oliveGardenMap = new google.maps.Map(oliveGarden, {
        zoom: 14,
        center: sfsu,
        disableDefaultUI: true,
      });
    
      new google.maps.Marker({
        position: oliveGardenLatLng,
        map: oliveGardenMap,
        title: "Olive Garden",
      });
    }
    
    //Tasty Pot
    const tastyPotLatLng = { lat: 37.700073135547306, lng: -122.48391086004652 };
    var tastyPot = document.getElementById("tastyPot");
    if(tastyPot){
      var tastyPotMap = new google.maps.Map(tastyPot, {
        zoom: 11.75,
        center: sfsu,
        disableDefaultUI: true,
      });
      
      new google.maps.Marker({
        position: tastyPotLatLng,
        map: tastyPotMap,
        title: "Tasty Pot",
      });
    }
      
    //Dominos
    const dominosLatLng = { lat: 37.7326226931648, lng: -122.47436962347614 };
    var dominos = document.getElementById("dominos");
    if(dominos){
      var dominosMap = new google.maps.Map(dominos, {
        zoom: 13,
        center: sfsu,
        disableDefaultUI: true,
      });
      
      new google.maps.Marker({
        position: dominosLatLng,
        map: dominosMap,
        title: "Dominos",
      });
    }
      
    //Marugame Udon
    const marugameUdonLatLng = { lat: 37.72750210214373, lng: -122.476491494761 };
    var marugameUdon = document.getElementById("marugameUdon");
    if(marugameUdon){
      var marugameUdonMap = new google.maps.Map(marugameUdon, {
        zoom: 13,
        center: sfsu,
        disableDefaultUI: true,
      });
      
      new google.maps.Marker({
        position: marugameUdonLatLng,
        map: marugameUdonMap,
        title: "Marugame Udon",
      });
    }
    //Mcdonalds 
    const mcdonladsLatLng = { lat: 37.726630316086094, lng: -122.47652286663997 };
    var mconalds = document.getElementById("mcDonalds");
    if(mconalds){
      var mcdonaldsMap = new google.maps.Map(mconalds, {
        zoom: 13,
        center: sfsu,
        disableDefaultUI: true,
      });
      
      new google.maps.Marker({
        position: mcdonladsLatLng,
        map: mcdonaldsMap,
        title: "McDonalds",
      }); 
    }
    //KFC 
    const kfcLatLng = { lat: 37.718130486826084, lng: -122.47432791417131 };
    var kfc = document.getElementById("kfc");
    if(kfc){
      var kfcMap = new google.maps.Map(kfc, {
        zoom: 13,
        center: sfsu,
        disableDefaultUI: true,
      });
  
    new google.maps.Marker({
      position: kfcLatLng,
      map: kfcMap,
      title: "KFC",
    });
  }
}
  
  window.initMap = initMap;
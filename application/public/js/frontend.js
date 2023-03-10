
// js code to swap building and room selects to an address input if the
//user clicks on the "I'm off campus link"
var locationChange = document.getElementById("on-campus-off-campus");
var locationInput = document.getElementById("location-bar-wrapper");
const temp = locationInput.innerHTML;

locationChange.addEventListener("click", function(){
    console.log('test1:')
    console.log(temp)
    if(locationChange.text=="I'm off campus"){
        
        locationChange.text = "I'm on campus";
        locationInput.innerHTML = "<input id='on-campus-input' placeholder=' Address'>";
        // console.log(locationChange.text);
    }
    else{
        console.log("test2");
        console.log(temp);
        locationChange.text = "I'm off campus";

        locationInput.innerHTML = temp;
        // console.log(locationInput.innerHTML);
        console.log("test3");
        console.log(temp);
    }
});


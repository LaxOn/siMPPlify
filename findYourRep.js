var coordinates;
var representativeName = "";
var representativeEmail = "";
var representativePic = "";
var representativeDistrict = "";

function initMap() {
    if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }
    else {
   		console.log('Geolocation is not supported')
   	}
}

function errorCallback() {}

// Note: The API returns an error stating the request quota has been exceeded for the API 
// but the latitude and logitude coordinates still get returned
function successCallback(myloc) {
    var MyLatlng = {lat: myloc.coords.latitude, lng: myloc.coords.longitude};
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 50, center: MyLatlng})
    coordinates = MyLatlng;
    findYourRepresentative();
}

// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Make the actual CORS request.
function findYourRepresentative() {
	var url = "https://represent.opennorth.ca/representatives/";
	var latitude = coordinates.lat;
	var longitude = coordinates.lng;
	var xhr = createCORSRequest('GET', url+"?point="+latitude+","+longitude);
	if (!xhr) {
		alert('CORS not supported');
		return;
  	}

  // Response handlers.
  xhr.onload = function() {
  	// Begin accessing JSON data here
 	var data = JSON.parse(this.response);
 	// Check that http request is successful
	if (xhr.status >= 200 && xhr.status < 400) {
		data.objects.forEach(rep => {
			if (rep.elected_office == "MPP"){
		  		representativeEmail = rep.email;
		  		representativePic = rep.photo_url;
		  		representativeName = rep.name;
          representativeDistrict = rep.district_name;           
          var name = document.getElementById("mppName");
          name.innerHTML = representativeName+", MPP "+representativeDistrict;          
          document.getElementById("imageid").src = representativePic.toString();
          //var email = document.getElementById("p2");
          //email.innerHTML = "Representative Email: " + representativeEmail;
			}
		});
	} else {
	  console.log('error');
	}
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}
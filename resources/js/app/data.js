/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global ProjectSettings, User */

var Globals = {};
//Globals.myUser = new User();        //Global variable that contains current loggedIn user
//Globals.myDB = new IndexedDB();     //Global variable containing IndexedDB access
Globals.isLoggedIn = false;         //Global variable that indicates if user is loggedIn or not
Globals.data = new Data();

function Data() {
    this.isLoggedIn = false;            //Used to check if user is loggedIn
    this.country;                       //Current user country
    this.latitude;                      //Current user latitude
    this.longitude;                     //Current user longitude
    
    this.myself = new User();           //Used to store current user
    this.notifications = new Array();   //Used to store user notifications
    this.users = new Array();           //Used to store users downloaded
}

//For debug
Data.prototype.print = function() {
    console.log("Content of data:");
    console.log(this);
};    

//Will go to the server and download all required info and init the table
//We first check if we have valid session
//On response we get user current location
//On current location we download the user
Data.prototype.init = function() {
    var myObject = this;
    myObject.getLocation();   //Start the localization
    //Check if we have valid loggedIn session
    var serializedData = "";
    var url = ProjectSettings.serverUrl + "/api/user.hassession.php";
    console.log("Running ajax with request: " + url );
    var request = $.ajax({
            url: url,
            type: "POST",
            data: serializedData
        });   
    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        console.log("done, sending success event !");
        console.log("-------------------------");
        console.log(response);
        console.log("-------------------------");
        //Pop-up session expired
        if (response.result === "error.session.invalid") {
            myObject.isLoggedIn = false;
   
            //jQuery(window).trigger("Global.User.sessionExpired");
        } else {
            myObject.isLoggedIn = true;
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        console.log(jqXHR);
        myObject.isLoggedIn = false;
        console.log("I´m in the user and triggering fail with message : " + new AjaxHelper().getStatusMessage(errorThrown, jqXHR.status));
    });
    request.always(function() {

        //Restore all data later required by the app
        myObject.restore();
    });
    
    
};

//Restores from server all data required
Data.prototype.restore = function() {
    var myObject = this;
    //User data is restored only if we are loggedIn
    if (myObject.isLoggedIn) {
        var myUser = new User();
        myUser.callingObject = $(document);
        myUser.restore();
    }
    $(document).on('User.restore.ajaxRequestSuccess', function(event,response) {
        console.log("Restored user succesfully ");
        var myResponse = JSON.parse(response.account);
        myObject.myself.reload(myResponse);
        console.log("Triggering : Global.User.ready");
        $(window).trigger('Global.User.ready');
    });
};





//Gets the location based on the IP address to avoid requests as fallback and then asks for fine position
//Once position is available we trigger Global.User.localized
Data.prototype.getLocation = function() {
    var myObject = this;
    console.log("getLocation !!!");
    var myLocation = {
        country:"",
        latitude:"",
        longitude:"",
        accuracy:""
    };
    var locationConfig = {
       enableHighAccuracy: true,
       timeout:10000,
       maximumAge:60000
    };
    var location_timeout;
    jQuery.ajax( {
        url: '//freegeoip.net/json/',
        type: 'POST',
        crossDomain:true,
        xhrFields: {
            withCredentials: true
        },
        dataType: 'jsonp',
        success: function(location, textStatus, jqXHR) {
            myLocation = {
                country:location.country_code,
                latitude:location.latitude,
                longitude:location.longitude,
                accuracy:10000
            };
            //We store coords based on IP in case user denies geoloc
            myObject.latitude = myLocation.latitude;
            myObject.longitude = myLocation.longitude;
            myObject.country = myLocation.country;

            //Now try to get fine location
            if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(locationHandler, locationErrorHandler, locationConfig);
               location_timeout = setTimeout(locationErrorHandler, 10000);
            } else {
               //NoGeoloc available so we are done... 
               console.log("Triggering: Global.User.localized fine");
               jQuery(window).trigger("Global.User.localized");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Could not get coordinates !");
            return "";
        }
    });
    
    function locationHandler(location) {
      console.log("located !");
      console.log(location);
      $.ajax({ url:'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.coords.latitude + ',' + location.coords.longitude + '&sensor=true',
         success: function(data){
             console.log(data.results[0].formatted_address);
             for (var i = 0; i < data.results[4].address_components.length; i++) { 
                 for (var j = 0; j < data.results[4].address_components[i].types.length; j++) { 
                     if(data.results[4].address_components[i].types[j] === 'country') { 
                        var country_code = data.results[4].address_components[i].short_name; 
                            myLocation = {
                                country:country_code,
                                latitude:location.coords.latitude,
                                longitude:location.coords.longitude,
                                accuracy:location.coords.accuracy
                            };
                        //We got new fine coordinates, so we store them
                        myObject.latitude = myLocation.latitude;
                        myObject.longitude = myLocation.longitude;
                        myObject.country = myLocation.country;
                        console.log("Triggering: Global.User.localized fine");    
                        jQuery(window).trigger("Global.User.localized");
                     } 
                 } 
             }
         }
      });
    }
    function locationErrorHandler() {
        jQuery(window).trigger("Global.User.localized");
        console.log("User did not give access to fine location");
    }    
};


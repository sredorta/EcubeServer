/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//To be moved to global settings!


var ProjectSettings = {};
ProjectSettings.defaultCountry = "ES";
ProjectSettings.defaultLanguage = "en";
ProjectSettings.useLocalServer = true;

ProjectSettings.sessionDurationMinutes = 20; //This should be set to 60 but for debug 10, server is set to 60

if (ProjectSettings.useLocalServer) {
    ProjectSettings.domain = "http://127.0.0.1/eCubeServer";
    ProjectSettings.serverUrl = "http://localhost/eCubeServer/php";
} else {
    ProjectSettings.domain = "http://www.ecube-solutions.com/"
    ProjectSettings.serverUrl = "http://www.ecube-solutions.com/php";
}
console.log("Using server: " + ProjectSettings.serverUrl);
// -----------------------------------------------------------------------------
// Ajax Request helper 
// -----------------------------------------------------------------------------
function AjaxHelper() {
    this.getStatusMessage = function(exception,status) {
            if (status === 0) {
                return('Not connected.\nPlease verify your network connection.');
            } else if (status == 404) {
                return('The requested page not found. [404]');
            } else if (status == 500) {
                return('Internal Server Error [500].');
            } else if (status === 200) {
                console.log('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                console.log('Time out error.');
            } else if (exception === 'abort') {
                console.log('Ajax request aborted.');
            } else {
                console.log('Uncaught Error.\n');
            }
    };
    //Transforms result code from PHP request into string
    this.getServerMessage = function(result_code) {
            if (result_code === "error.unknown") {
                return('Sorry, something went wrong when accessing the server');
            } else if (result_code === "error.database") {
                return('Sorry, the server database could not be accessed');
            } else if (result_code === "error.user.exists") {
                return('The user already exists, if you already have an account go to sign in');
            } else if (result_code === "error.user.not_created") {
                return('Sorry, something went wrong and the account was not created');         
            } else if (result_code === 'error.user.not_exists') {
                return ('Invalid user');
            } else if (result_code === 'error.password.invalid') {
                return ('Invalid password');
            } else if (result_code === 'error.update.field') {
                return('Impossible to update the field');
            } else if (result_code === 'error.user.email_used') {
                return('This email is already in use');
            } else if (result_code === 'error.user.phone_used') {
                return('This phone number is already in use');
            } else if (result_code === 'error.session.invalid') {
                return('Your session has expired');                                
            } else {
                return(result_code);
            }
    };
    
}

console.log("Loaded user.js");
function User(object) {
    this.callingObject = object; //Used to trigger
    this.id ="";
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.phone = "";
    this.password = "";
    this.avatar="";
    this.avatar_timestamp="";
    this.validated_email = 0;
    this.validated_phone = 0;
    this.creation_timestamp="";
    this.login_timestamp="";
    this.country = ""; 
    this.language = "";
    this.latitude = "";
    this.longitude = "";
    this.password = "";
    this.keep=false;
    this.Pref_useHome=true;
    this.Pref_sendNotifEmail=true;
    this.Pref_zoomValue=12;
    this.timestamp;
}

//For debug
User.prototype.print = function() {
    console.log("first name : " + this.firstName);
    console.log("last name : " + this.lastName);
    console.log("email : " + this.email);
    console.log("phone : " + this.phone);
    console.log("password : " + this.password);
    console.log("language : " + this.language);
    console.log("country : " + this.country);
    console.log("lat : " + this.latitude);
    console.log("lon : " + this.longitude);
    console.log("avatar length : " + this.avatar.length);
    console.log("use home: " + this.Pref_useHome);
    console.log("zoom : " + this.Pref_zoomValue);
  
};

//Gets the location based on the IP address to avoid requests as fallback and then asks for fine position
User.getLocation = function() {
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
            console.log("Triggering: Global.User.localized coarse");
            jQuery(window).trigger("Global.User.localized",[myLocation,"coarse"]);
            //Now try to get fine location
            if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(locationHandler, locationErrorHandler, locationConfig);
               location_timeout = setTimeout(locationErrorHandler, 10000);
            } else {
               console.log("Triggering: Global.User.localized fine");
               jQuery(window).trigger("Global.User.localized",[myLocation,"fine"]);
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
                        console.log("Triggering: Global.User.localized fine");    
                        jQuery(window).trigger("Global.User.localized",[myLocation,"fine"]);
                     } 
                 } 
             }
         }
      });
    }
    function locationErrorHandler() {
        jQuery(window).trigger("Global.User.localized",[myLocation,"fine"]);
        console.log("User did not give access to fine location");
    }    
};

//Reloads object containing user into current object
User.prototype.reload = function(myObject) {
    if (myObject.id!== "") this.id = myObject.id;
    if (myObject.firstName!== "") this.firstName = myObject.firstName;
    if (myObject.lastName!== "") this.lastName = myObject.lastName;
    if (myObject.email!== "") this.email = myObject.email;
    if (myObject.phone!== "") this.phone = myObject.phone;    
    if (myObject.language!== "") this.language = myObject.language; 
    if (myObject.country!== "") this.country = myObject.country; 
    if (myObject.creation_timestamp!== "") this.creation_timestamp = myObject.creation_timestamp; 
    if (myObject.validated_email!== "") this.validated_email = myObject.validated_email; 
    if (myObject.validated_phone!== "") this.validated_phone = myObject.validated_phone; 
    if (myObject.avatar!== "") this.avatar = myObject.avatar;
    if (myObject.avatar_timestamp!== "") this.avatar_timestamp = myObject.avatar_timestamp;
    if (myObject.latitude!== "") this.latitude = myObject.latitude;
    if (myObject.longitude!== "") this.longitude = myObject.longitude;
    if (myObject.Pref_useHome!=="") this.Pref_useHome = myObject.Pref_useHome;
    if (myObject.Pref_sendNotifEmail!=="") this.Pref_sendNotifEmail = myObject.Pref_sendNotifEmail;
    if (myObject.Pref_zoomValue!=="") this.Pref_zoomValue = myObject.Pref_zoomValue;
    if (myObject.timestamp!=="") this.timestamp = myObject.timestamp;
};


User.prototype.ajaxCall = function(serializedData, url, eventName) {
        var request;
        var myObject = this.callingObject;
        console.log(this.callingObject);


        $(window).trigger("Global.AjaxCallStart");
        // Abort any pending request
        if (request) {
            request.abort();
        }  
       console.log("POST data : " + serializedData);
       console.log(url);
       // Fire off the request to /form.php
       request = $.ajax({
            url: url,
            type: "POST",
            data: serializedData
        });

        // Callback handler that will be called on success
        request.done(function (response, textStatus, jqXHR){
            console.log("done, sending success event !");
            console.log("-------------------------");
            console.log("Server says :" + response);
            console.log("-------------------------");
            console.log(response);
            //Now check if the answer is success and if not provide the error message from the server
            if (response.result === "success") {
                console.log("Triggering success ! :: " + eventName);
                jQuery(myObject).trigger("User." + eventName + ".ajaxRequestSuccess", [response]);
            } else {
                jQuery(myObject).trigger("User." + eventName + ".ajaxRequestFail", [new AjaxHelper().getServerMessage(response.result)]);
            }
            //Pop-up session expired
            if (response.result === "error.session.invalid") {
                jQuery(window).trigger("Global.User.sessionExpired");
            }
        });

        // Callback handler that will be called on failure
        request.fail(function (jqXHR, textStatus, errorThrown){
            console.log(jqXHR);
            //Triger the event to do the necessary things at the caller with the formated answer
            console.log("I´m in the user and triggering fail with message : " + new AjaxHelper().getStatusMessage(errorThrown, jqXHR.status));
            jQuery(myObject).trigger("User." + eventName + ".ajaxRequestFail", [new AjaxHelper().getStatusMessage(errorThrown, jqXHR.status)]);
        });

        // Callback handler that will be called regardless
        // if the request failed or succeeded
        request.always(function () {
            $('.body-default').removeClass('waiting');
            jQuery(myObject).trigger("User." + eventName + ".ajaxRequestAlways");
            $(window).trigger("Global.AjaxCallEnd");
        });       
};

//Login : We provide email + password and we get the session id via cookie PHPSESSID
User.prototype.logIn = function() {
        var serializedData = jQuery.param({ "email": this.email, 
                                            "password":this.password,
                                            "keep": this.keep
                                        });
        this.ajaxCall(serializedData,ProjectSettings.serverUrl + "/api/user.login.php", "login");
};

//Login : We provide email + password and we get the session id
User.prototype.logOut = function() {
        var serializedData = "";
        this.ajaxCall(serializedData,ProjectSettings.serverUrl + "/api/user.logout.php", "logout");
};

//We provide the session_id and we do an ajax request to get data from server
// and we save the data in the localStorage
User.prototype.restore = function() {
    console.log("Restoring user !");
        var serializedData = "";
        this.ajaxCall(serializedData,ProjectSettings.serverUrl + "/api/user.restore.php", "restore");
};


//Re-send validation email
User.prototype.resendValidationEmail = function() {
        var serializedData = "";
        this.ajaxCall(serializedData,ProjectSettings.serverUrl + "/api/user.resend_validation_email.php", "resend_validation_email");
};

//Find if registered user exists
User.prototype.find = function() {
        if (this.email !== "") {
           var serializedData = jQuery.param({ "email": this.email});
        } else {
           var serializedData = jQuery.param({ "phone": this.phone}); 
        }
        console.log("POST data : " + serializedData);
        this.ajaxCall(serializedData,ProjectSettings.serverUrl + "/api/user.find.php", "find");
};

//Reset password and send new one by email
User.prototype.resetPassword = function() {
        var serializedData = jQuery.param({ "email": this.email});
        this.ajaxCall(serializedData,ProjectSettings.serverUrl + "/api/user.reset_password.php", "reset_password");
};

//Signup new user
User.prototype.signUp = function() {
        var serializedData = jQuery.param({"first_name": this.firstName, 
                                            "last_name":this.lastName, 
                                            "email": this.email, 
                                            "phone": this.phone, 
                                            "password":this.password,
                                            "avatar":this.avatar,
                                            "language":this.language,
                                            "country":this.country,
                                            "latitude": this.latitude,
                                            "longitude": this.longitude,
                                            "keep": this.keep
                                        });
        this.ajaxCall(serializedData,ProjectSettings.serverUrl + "/api/user.create.php", "signup");
};

//Re-send validation email
User.prototype.changePassword = function(new_password) {
        var serializedData = jQuery.param({ "password": this.password,
                                            "new_password" : new_password});
        this.ajaxCall(serializedData,ProjectSettings.serverUrl + "/api/user.update.php", "change_password");
};

//Remove account and data associated
User.prototype.removeAccount = function() {
        var serializedData = "";
        this.ajaxCall(serializedData,ProjectSettings.serverUrl + "/api/user.remove.php", "remove");
};


//Update one field
User.prototype.update = function(field,value,now) {
        eval("var myObject = \{timestamp:" + now + "," + field + ":\"" + value +"\"\}");
        var serializedData = jQuery.param(myObject);
        this.ajaxCall(serializedData,ProjectSettings.serverUrl + "/api/user.update.php", "update");
};

//Update one field
User.prototype.updatePrefs = function(now) {
        var myObject = {Pref_useHome:this.Pref_useHome, Pref_sendNotifEmail:this.Pref_sendNotifEmail, Pref_zoomValue:this.Pref_zoomValue ,timestamp:now};
        console.log("updating prefs");
        console.log(myObject);
        var serializedData = jQuery.param(myObject);
        this.ajaxCall(serializedData,ProjectSettings.serverUrl + "/api/user.update.php", "update");
};


//Update one field
User.prototype.updateHomeLocation = function(latitude,longitude, now) {
        var myObject = {latitude:latitude, longitude:longitude, timestamp:now};
        var serializedData = jQuery.param(myObject);
        this.ajaxCall(serializedData,ProjectSettings.serverUrl + "/api/user.update.php", "update");
};

//Update one field
User.prototype.notificationsGet = function() {
        var serializedData = "";
        this.ajaxCall(serializedData,ProjectSettings.serverUrl + "/api/user.notifications.get.php", "notifications_get");
};
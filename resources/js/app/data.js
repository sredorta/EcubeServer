/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global ProjectSettings, User */
console.log("Loaded data.js");
var Globals = {};
//Globals.myUser = new User();        //Global variable that contains current loggedIn user
//Globals.myDB = new IndexedDB();     //Global variable containing IndexedDB access
Globals.isLoggedIn = false;         //Global variable that indicates if user is loggedIn or not
Globals.data = new Data();
Globals.mainMap;



function Data() {
    this.isLoggedIn = false;            //Used to check if user is loggedIn
    this.country;                       //Current user country
    this.latitude;                      //Current user latitude
    this.longitude;                     //Current user longitude
    this.interval;                      //Variable used to start sync
    this._debug=true;
    this._name="DATA";
    this.myself = new User();           //Used to store current user
    this.notifications = new Array();   //Used to store user notifications
    this.stations = new Array();        //Used to store stations
    this.users = new Array();           //Used to store users downloaded
}
//Prints logging if debug enabled
Data.prototype._log = function(txt) {
    if (this._debug) console.log(this._name + ":: " + txt);
};

//For debug
Data.prototype.print = function() {
    this._log("Content of data:");
    this._log(this);
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
    this._log("Running ajax with request: " + url );
    var request = $.ajax({
            url: url,
            type: "POST",
            data: serializedData
        });   
    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        //Pop-up session expired
        if (response.result === "error.session.invalid") {
            myObject.isLoggedIn = false;
        } else {
            myObject.isLoggedIn = true;
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        myObject._log(jqXHR);
        myObject.isLoggedIn = false;
        myObject._log("I´m in the user and triggering fail with message : " + new AjaxHelper().getStatusMessage(errorThrown, jqXHR.status));
    });
    request.always(function() {
        myObject._log("Triggering : Global.User.isLoggedIn");
        $(window).trigger('Global.User.isLoggedIn');
        //Restore all data later required by the app
        myObject.restore();
    });
    
    $(window).on('Global.Sync.start', function () {
        myObject.syncStart();
    });
    
};

//Restores user from server and triggers Global.User.ready
Data.prototype.restore_user = function () {
        var myObject = this;
        var url = ProjectSettings.serverUrl + "/api/user.restore.php";
        serializedData = "";
        $.ajax({
            url: url,
            type: "POST",
            data: serializedData,
            success: function(response) {
                if (response.result === "success") {
                    myObject._log("Restored user succesfully ");
                    var myResponse = JSON.parse(response.account);
                    myObject.myself.reload(myResponse);
                    myObject._log("Triggering : Global.User.ready");
                    $(window).trigger('Global.User.ready');                    
                }
            }
        });
};

//Restores user notifications from server and triggers Global.User.notifications_ready
Data.prototype.restore_notifications = function () {
        var myObject = this;
        var url = ProjectSettings.serverUrl + "/api/user.notifications.get.php";
        serializedData = "";
        $.ajax({
            url: url,
            type: "POST",
            data: serializedData,
            success: function(response) {
                if (response.result === "success") {
                    myObject._log("Restored user notifications succesfully ");
                    myObject.notifications = JSON.parse(response.notifications); //'['+response.notifications.join(',')+']');
                    myObject._log("Triggering : Global.User.notifications_ready");
                    $(window).trigger('Global.User.notifications_ready');     
                }
            }
        });
};

//Restores all stations
Data.prototype.restore_stations = function () {
        this._log("restore_stations");
        var myObject = this;
        var url = ProjectSettings.serverUrl + "/api/stations.get.php";
        serializedData = "";
        $.ajax({
            url: url,
            type: "POST",
            data: serializedData,
            success: function(response) {
                if (response.result === "success") {
                    myObject._log("Restored user notifications succesfully ");
                    myObject.stations = JSON.parse(response.stations); //'['+response.notifications.join(',')+']');
                    myObject._log("Triggering : Global.Stations.ready");
                    $(window).trigger('Global.Stations.ready');     
                    $(window).trigger('Global.Sync.start'); //This needs to be done at the end of all restore
                }
            }
        });
};



//Restores from server all data required
Data.prototype.restore = function() {
    var myObject = this;
    //User data is restored only if we are loggedIn
    if (myObject.isLoggedIn) {
        myObject.restore_user();
        myObject.restore_notifications();
    }
    myObject.restore_stations();

    //Here we need to restore stations close to user location or homeLocation
    //We need to start downloading products...
};

//Starts the sync process
Data.prototype.syncStart = function() {
  var myObject = this;
  console.log("Called syncStart");
  this.interval = setInterval(function() {
      myObject.sync();
  },ProjectSettings.syncIntervalMinutes * 60000);  //This should be 60000
};
//Starts the sync process
Data.prototype.syncStop = function() {
  var myObject = this;
  clearInterval(myObject.interval);  
};

//Saves to server any new data
Data.prototype.sync = function() {
    var myObject = this;
    myObject._log("Sync...");
    var shadowData = new Data();
    shadowData = jQuery.extend(true, {}, Globals.data); //Copy the object without copying reference
    var myObject = this;
    if (myObject.isLoggedIn) {
        //STEP1: Check if user needs update
        myObject._log("Checking if user needs update...");
        var url = ProjectSettings.serverUrl + "/api/user.timestamp.php";
        serializedData = "";
        $.ajax({
            url: url,
            type: "POST",
            data: serializedData,
            success: function(response) {
                if (response.result === "success") {
                    if (JSON.parse(response.account).timestamp > Globals.data.myself.timestamp) {
                        myObject._log("User needs update !");
                        Globals.data.restore_user();
                    }
                  
                }
            }
        });
        //STEP2: Check if notifications needs update
        myObject.sync_notifications();

        //STEP3: Get again stations
        myObject.restore_stations();
        
    }
};

Data.prototype.sync_notifications = function () {
        var myObject = this;
        myObject._log("Checking if user notifications needs update...");
        var url = ProjectSettings.serverUrl + "/api/user.notifications.get.php";
        serializedData = "";
        $.ajax({
            url: url,
            type: "POST",
            data: serializedData,
            success: function(response) {
                if (response.result === "success") {
                    var serverNotifications = JSON.parse(response.notifications);
                    Data.syncNotifications(serverNotifications, myObject.notifications);                  
                }
            }
        });        
};

Data.syncNotifications = function(serverNotifications, currentNotifications) {
    var myObject = this;
    var updateNeeded = false;
    
    //Add any new notifications from server into iDB
    for (var i= 0; i< serverNotifications.length; i++) {
        var found = 0;
        var copyToCurrent = 0;
        var copyToServer = 0;
        for (var j= 0; j< currentNotifications.length; j++) {
            if (serverNotifications[i].notification_id == currentNotifications[j].notification_id) {
                if (serverNotifications[i].timestamp > currentNotifications[j].timestamp) {
                    copyToCurrent = 1;
                }
                if (serverNotifications[i].timestamp < currentNotifications[j].timestamp) {
                    copyToServer = 1;
                }
                found = 1;
                break;
            }
        }
        if (!found) {
            //There is a server notification not in local if not visited, then add into local
            if (serverNotifications[i].visited == 0) {
                console.log("Found new notification : " + serverNotifications[i].notification_id);
                Globals.data.notifications.push(serverNotifications[i]);
            } else {
                //Notification was visited, so we remove from server
                console.log("Removing server notification : " + serverNotifications[i].notification_id);
                var url = ProjectSettings.serverUrl + "/api/user.notifications.remove.php";
                var serializedData = jQuery.param(serverNotifications[i]);
                console.log(serializedData);
                $.ajax({
                    url: url,
                    type: "POST",
                    data: serializedData,
                    success: function(response) {
                        if (response.result === "success") {
                            console.log("Notification removed !");                 
                        }
                    }
                });        
            }
            updateNeeded = true;
        } else if (copyToCurrent) {
            currentNotifications[j] = serverNotifications[i];
            updateNeeded = true;
        } else if (copyToServer) {
            console.log("Need to update from local to server : " + serverNotifications[i].notification_id);
            var url = ProjectSettings.serverUrl + "/api/user.notifications.update.php";
            var serializedData = jQuery.param(currentNotifications[j]);
            console.log(serializedData);
            $.ajax({
                url: url,
                type: "POST",
                data: serializedData,
                success: function(response) {
                    if (response.result === "success") {
                        console.log("Updated server notification succesfully");           
                    }
                },
                fail:function() {
                    console.log("Could not update server notification !");
                }
                        
            });
        }
    }
    //Now check if we have removed any notifications locally and remove them in the server
    for (var i= 0; i< currentNotifications.length; i++) {
        var found = 0;
        var copyToCurrent = 0;
        var copyToServer = 0;
        for (var j= 0; j< serverNotifications.length; j++) {
            if (serverNotifications[j].notification_id == currentNotifications[i].notification_id) {
                found = 1;
                break;
            }
        }
        if (!found) {
            console.log("Need to remove on local : " + currentNotifications[i].notification_id);
            currentNotifications.splice(i,1);
            updateNeeded = true;
        }
    }
    //We have updated our local notifications, so we need to tell system
    if (updateNeeded) {
        console.log("Updated notifications, triggering : Global.User.notifications_ready")
        $(window).trigger('Global.User.notifications_ready'); 
    }
    console.log(Globals.data);
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


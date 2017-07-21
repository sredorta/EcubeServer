/* global ProjectSettings, User, Globals */


$(document).ready(function(){
    //----------------------------------------------------------------------
    // INIT
    //----------------------------------------------------------------------
    //Set the correct height of the map
    var myHeight = $(".body-container-default").outerHeight();
    $("main-map-canvas").css({
        height:myHeight
    });
        
    //Global variables !
    var mapMainGlobal;
    var mapMarkerCurrentPosition;
    var mapMarkerHomePosition = null;
        
    Globals.myUser.callingObject = this;
        
        
    $.createCookie("presence", true,ProjectSettings.sessionDurationMinutes);            //We are present
    $("#id-header-navbar-profile-plugin").pluginProfilePicture({inputDisabled:true});
    $("#id-header-navbar-profile-plugin").pluginProfilePicture("setLoggedOut");        
    $("#id-header-navbar-button-user").css({visibility:"hidden"});
    $("#id-login-modal").pluginModalFormLogin();
    $("#id-signup-modal").pluginModalFormSignup();
    $("#id-forgot-password-modal").pluginModalFormForgotPassword();    
    
    
    //------------------- iDB initialization
    console.log("here!");
    Globals.myDB.init(); //Reset the database
    $(window).on('Global.iDB.ready', function () {
        console.log("here!!!");
        if ($.readCookie("PHPSESSID")== null) {
            $("#id-header-navbar-button-login").css({visibility:"visible"});
            $("#id-header-navbar-button-signup").css({visibility:"visible"});
            $("#id-header-navbar-profile-plugin").css({visibility:"visible"});
        }
        Globals.myDB.clone();    
    });
    $(window).on('Global.iDB.clone.completed', function () {
        Globals.myDB.syncStart();
    });    
    
    $(window).on('Global.iDB.user.ready', function() {
        console.log("Got event : Global.iDB.user.ready");
        User.getLocation();   //Start the localization
    });
    
    
    
    //----------------------------------------------------------------------
    // Localize user and setup map
    //----------------------------------------------------------------------
    //Get the coordinates of the user     
//    User.getLocation();   //Start the localization

    //When location is available update cookies
    $(window).on('Global.User.localized', function(event,location,type) {
        //When it's coarse we zoom the map and wait for the fine event           
        if (type === "coarse") {
            var uluru = {lat: location.latitude, lng: location.longitude};
            mapMainGlobal = new google.maps.Map(document.getElementById('main-map-canvas'), {
                zoom: 12,
                center: uluru
            });
        } else {
            //We get here with fine coordinates or coarse if the user has denied fine
            //Unbind the event as we only want to get here once
            jQuery(window).unbind('Global.User.localized');
            //Create location cookies
            $.createCookie("country", location.country, ProjectSettings.sessionDurationMinutes);
            $.createCookie("latitude", location.latitude, ProjectSettings.sessionDurationMinutes);
            $.createCookie("longitude", location.longitude, ProjectSettings.sessionDurationMinutes);
            //Expand all plugins with country as we have now located user
            $("#id-login-modal").pluginModalFormLogin();
            $("#id-signup-modal").pluginModalFormSignup();
            $("#id-forgot-password-modal").pluginModalFormForgotPassword();
            //Zoom map to new coords and add a marker with our position
            var uluru = {lat: location.latitude, lng: location.longitude};
            mapMainGlobal.panTo(uluru);
            mapMarkerCurrentPosition = new google.maps.Marker({
                position: uluru,
                animation: google.maps.Animation.DROP,
                map: mapMainGlobal
            });
            Globals.myDB.clone();
//            jQuery(window).trigger("Global.User.restore"); //Trigger auto restore if PHPSESSID exists and valid
        }
    });
        
        
    //----------------------------------------------------------------------
    // Check if user is logged in
    // ---------------------------------------------------------------------
    $(window).on('Global.User.restore', function(event,location,type) {
        //Check if we have a valid cookie with a session and if so restore the user
        if ($.readCookie("PHPSESSID")!== null) {
            Globals.myUser.restore();  //Restore from server the current user         
        } else {
            $("#id-header-navbar-button-login").css({visibility:"visible"});
            $("#id-header-navbar-button-signup").css({visibility:"visible"});
            $("#id-header-navbar-profile-plugin").css({visibility:"visible"});
            
        }
        $(this).on("User.restore.ajaxRequestSuccess", function(event, response) {
            var myResponse = JSON.parse(response.account);
            Globals.myUser.reload(myResponse);
            Globals.myDB.saveMe();  //Save downloaded user into db for later usage
            Globals.myDB.getMe();
            //Now trigger the window
            jQuery(window).trigger("Global.User.loggedIn");           
           $(this).unbind("User.restore.ajaxRequestSuccess");
        });
        
        $(this).on("User.restore.ajaxRequestFail", function(event, response) {
            $("#id-header-navbar-button-login").css({visibility:"visible"});
            $("#id-header-navbar-button-signup").css({visibility:"visible"});
            $("#id-header-navbar-profile-plugin").css({visibility:"visible"});
            console.log("We got fail !");         
           $(this).unbind("User.restore.ajaxRequestFail");
        });
    });

    //----------------------------------------------------------------------
    //When user is available or has been updated we update all related objects
    $(window).on('Global.User.available', function () {
        console.log("Got event user available !");
        $("#id-header-navbar-profile-plugin").pluginProfilePicture("setImage", localStorage.getItem("avatar_0"));
        $("#id-header-navbar-profile-plugin").pluginProfilePicture("setLoggedIn");
        $("#id-header-navbar-button-login").css({visibility:"hidden"});
        $("#id-header-navbar-button-signup").css({visibility:"hidden"});
        $("#id-header-navbar-button-user").css({visibility:"visible"});
        $("#id-header-navbar-profile-plugin").css({visibility:"visible"});
        //Enable disable home displacement depending on Pref_useHome
        if (Globals.myUser.Pref_useHome == 0) {
            $("#id-header-navbar-edit-home").css({visibility:"hidden"});
        } else {
            $("#id-header-navbar-edit-home").css({visibility:"visible"});
        }
        //Add marker with home location
        if (Globals.myUser.Pref_useHome == 1) {
            var uluru = {lat: parseFloat(Globals.myUser.latitude), lng: parseFloat(Globals.myUser.longitude)};
            mapMainGlobal.setZoom(parseInt(Globals.myUser.Pref_zoomValue));
            mapMainGlobal.panTo(uluru);
            //We only create the marker once !
            if (mapMarkerHomePosition !== null) mapMarkerHomePosition.setMap(null);
            mapMarkerHomePosition = null;
            mapMarkerHomePosition = new google.maps.Marker({
                position: uluru,
                animation: google.maps.Animation.DROP,
                icon: "./resources/img/icon-marker-home.png",
                map: mapMainGlobal
            });
        } else {
            if (mapMarkerHomePosition !== null) mapMarkerHomePosition.setMap(null);
            mapMarkerHomePosition = null;
            mapMainGlobal.setZoom(parseInt(Globals.myUser.Pref_zoomValue));
            mapMainGlobal.panTo(mapMarkerCurrentPosition.getPosition());
        }

    });
      
    //----------------------------------------------------------------------
    //LOGIN
    //----------------------------------------------------------------------
    //Expand the plugin of Login modal Form
    $("#id-header-navbar-button-login").on('click', function() {
        $("#id-login-modal").pluginModalFormLogin("show");
    });
    //Act on loggedIn event
    $(window).on('Global.User.loggedIn', function() {
        console.log("Got event user loggedIn");
        Globals.myDB.clone_user();
        //Show email not validated if required
        if (Globals.myUser.validated_email === "0") {
            $("#id-login-validated-email").pluginModalFormValidateEmail();
            $("#id-login-validated-email").pluginModalFormValidateEmail("show");
        }
            
    });
               
    //----------------------------------------------------------------------
    //LOGOUT
    //----------------------------------------------------------------------
    $("#id-header-navbar-logout").on('click', function() {
        Globals.myUser.logOut(); //Remove the session
        Globals.myDB.init();
        //Globals.myUser.clear(); //Change to remove the IndexedDB !!!
        jQuery(window).trigger("Global.User.loggedOut");   //Trigger the global event loggedOut
    });
        
    //Do all LogginOut tasks
    $(window).on('Global.User.loggedOut', function() {
        console.log("Got event user loggedOut");
        $(".plugin-profile-picture").pluginProfilePicture("setDefaultImage");
        $(".plugin-profile-picture").pluginProfilePicture("setLoggedOut");
        $("#id-header-navbar-button-login").css({visibility:"visible"});
        $("#id-header-navbar-button-signup").css({visibility:"visible"});
        $("#id-header-navbar-button-user").css({visibility:"hidden"});
        $("#id-login-validated-email").pluginModalFormValidateEmail("hide");
        //Pan back to user location
        mapMarkerHomePosition.setMap(null);        //Remove home position marker
        mapMarkerHomePosition = null;
        mapMainGlobal.setZoom(12);
        mapMainGlobal.panTo(mapMarkerCurrentPosition.getPosition());
    });   
        
    //----------------------------------------------------------------------
    // SIGNUP
    //----------------------------------------------------------------------
    //Expand the plugin of Signup modal Form
    $("#id-header-navbar-button-signup").on('click', function() {
        $("#id-signup-modal").pluginModalFormSignup("show");
    });
  
    //----------------------------------------------------------------------
    // FORGOT PASSWORD
    //----------------------------------------------------------------------
    $(window).on('Global.User.forgotPassword', function() {
        console.log("Got event user forgotPassword");
        $("#id-forgot-password-modal").pluginModalFormForgotPassword("show");
    });
    
    //----------------------------------------------------------------------
    // CHANGE PASSWORD
    //----------------------------------------------------------------------
    $("#id-header-navbar-change-password").on('click', function() {
        $("#id-change-password-modal").pluginModalFormChangePassword();
        $("#id-change-password-modal").pluginModalFormChangePassword("show");
    });
    
    //----------------------------------------------------------------------
    // REMOVE ACCOUNT
    //----------------------------------------------------------------------       
    $("#id-header-navbar-remove-account").on('click',function() {
        $("#id-remove-account-modal").pluginModalFormRemoveAccount();
        $("#id-remove-account-modal").pluginModalFormRemoveAccount("show");
    });
    
    //----------------------------------------------------------------------
    // PROFILE EDIT
    //----------------------------------------------------------------------               
    $("#id-header-navbar-profile-edit").on('click',function() {
        $("#id-profile-edit-modal").pluginModalFormProfileEdit();
        $("#id-profile-edit-modal").pluginModalFormProfileEdit("show");
    });
    
    //----------------------------------------------------------------------
    // CHANGE HOME LOCATION
    //----------------------------------------------------------------------  
    $("#id-header-navbar-edit-home").on('click', function() {        
        //Zoom map to home location marker
        mapMainGlobal.setZoom(parseInt(Globals.myUser.Pref_zoomValue));
        mapMainGlobal.panTo(mapMarkerHomePosition.getPosition());
        
        //Emable the marker to be draggable and set bounce anymation
        mapMarkerHomePosition.setDraggable(true);
        if (mapMarkerHomePosition.getAnimation() !== null) {
          mapMarkerHomePosition.setAnimation(null);
        } else {
          mapMarkerHomePosition.setAnimation(google.maps.Animation.BOUNCE);
        }
        //Remove bounce animation on drag start
        google.maps.event.addListener(mapMarkerHomePosition, 'drag', function() {
             mapMarkerHomePosition.setAnimation(null);
        });
        
        //Show infoWindow on dragEnd
        var contentString =
            '<div id="id-profile-edit-home-marker-content">'+
            '<p>Click on the marker to set this position</p>'+ 
            '<p>as your home position</p>' + 
            '</div>';
        var infowindow = new google.maps.InfoWindow({content: contentString});
        google.maps.event.addListener(mapMarkerHomePosition, 'dragend', function() {
            infowindow.open(mapMainGlobal, mapMarkerHomePosition);
        });
        
        google.maps.event.addListener(mapMarkerHomePosition, 'click', function() {
          infowindow.close();  //Close the infoWindow
          mapMarkerHomePosition.setDraggable(false);
          //Do the ajax call to update new coordinates
          var latitude = mapMarkerHomePosition.getPosition().lat();
          var longitude = mapMarkerHomePosition.getPosition().lng();
          var myUser = new User();
          myUser.updateHomeLocation(latitude,longitude);
          Globals.myUser.latitude = latitude;
          Globals.myUser.longitude = longitude;
          Globals.myDB.saveMe();
          console.log(latitude);
          console.log(longitude);         
        });        
    });

    //----------------------------------------------------------------------
    // PREFERENCES EDIT
    //----------------------------------------------------------------------               
    $("#id-header-navbar-edit-preferences").on('click',function() {
        console.log("Editing prefs");
        $("#id-profile-preferences-modal").pluginModalFormPreferences();
        $("#id-profile-preferences-modal").pluginModalFormPreferences("show");
    });





        //----------------------------------------------------------------------
        // SESSION EXPIRE
        //----------------------------------------------------------------------               
        $("#id-session-expired-modal").pluginModalFormSessionExpired();
        var sessionInterval = setInterval(function () {
            console.log("Checked if session expired ! " + $.readCookie("PHPSESSID"));
            if ($.readCookie("presence") == null) {
                clearInterval(sessionInterval);
                $("#id-session-expired-modal").pluginModalFormSessionExpired("show");
            }
        }, ProjectSettings.sessionDurationMinutes * 60000); //Check every x minutes if we still have the cookie
        //If we get a session expired in one of the ajax Calls we come here
        $(window).on('Global.User.sessionExpired', function() {
                $("#id-session-expired-modal").pluginModalFormSessionExpired("show");
        });    
        
        //----------------------------------------------------------------------
        // Handle waiting during Ajax
        //---------------------------------------------------------------------- 
        var myRoot = $(this);
        $(window).on('Global.AjaxCallStart', function () {
            myRoot.find("button").prop('disabled',true);
            myRoot.find("button").css({cursor:"not-allowed"});
        });
        $(window).on('Global.AjaxCallEnd', function () {
            myRoot.find("button").prop('disabled',false);
            myRoot.find("button").css({cursor:"pointer"});
        });

    });

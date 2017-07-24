/* global ProjectSettings, User, Globals, google */


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
    
    Globals.data.print();
    Globals.data.init();
    
    $.createCookie("presence", true,ProjectSettings.sessionDurationMinutes);            //We are present
    $("#id-header-navbar-profile-plugin").pluginProfilePicture({inputDisabled:true});
    $("#id-header-navbar-profile-plugin").pluginProfilePicture("setLoggedOut");        
    $("#id-header-navbar-button-user").css({visibility:"hidden"});
    $("#id-login-modal").pluginModalFormLogin();
    $("#id-signup-modal").pluginModalFormSignup();
    $("#id-forgot-password-modal").pluginModalFormForgotPassword(); 


    //----------------------------------------------------------------------
    // Localize user and setup map
    //----------------------------------------------------------------------
    //When location is available update cookies
    $(window).on('Global.User.localized', function(event) {
        console.log("Got event Global.User.localized ! : ");
        Globals.data.print();
        var uluru = {lat: Globals.data.latitude, lng: Globals.data.longitude};
        if (mapMainGlobal == null) {
                mapMainGlobal = new google.maps.Map(document.getElementById('main-map-canvas'), {
                    zoom: 12,
                    center: uluru
                });
        }
        //Unbind the event as we only want to get here once
        jQuery(window).unbind('Global.User.localized');
        //Create location cookies
        $.createCookie("country", Globals.data.country, ProjectSettings.sessionDurationMinutes);
        $.createCookie("latitude", Globals.data.latitude, ProjectSettings.sessionDurationMinutes);
        $.createCookie("longitude", Globals.data.longitude, ProjectSettings.sessionDurationMinutes);
        //Expand all plugins with country as we have now located user
        $("#id-login-modal").pluginModalFormLogin();
        $("#id-signup-modal").pluginModalFormSignup();
        $("#id-forgot-password-modal").pluginModalFormForgotPassword();
        //Zoom map to new coords and add a marker with our position
        var uluru = {lat: Globals.data.latitude, lng: Globals.data.longitude};
        if (Globals.data.isLoggedIn == false) {
            mapMainGlobal.panTo(uluru);
        }
        mapMarkerCurrentPosition = new google.maps.Marker({
            position: uluru,
            animation: google.maps.Animation.DROP,
            map: mapMainGlobal
        });
    });
    
    //----------------------------------------------------------------------
    // When user has been downloaded
    //----------------------------------------------------------------------
    //We need to show home location and zoom to it depending on prefs...
    $(window).on('Global.User.ready', function(event) {  
      console.log("Got event Global.User.ready !");
      console.log(Globals.data);
      if (Globals.data.isLoggedIn) {  
        $("#id-header-navbar-profile-plugin").pluginProfilePicture("setImage", Globals.data.avatar);
        $("#id-header-navbar-profile-plugin").pluginProfilePicture("setLoggedIn");
        $("#id-header-navbar-button-login").css({visibility:"hidden"});
        $("#id-header-navbar-button-signup").css({visibility:"hidden"});
        $("#id-header-navbar-button-user").css({visibility:"visible"});
        $("#id-header-navbar-profile-plugin").css({visibility:"visible"});
        //Show email not validated if required
        if (Globals.data.myself.validated_email === "0") {
            $("#id-login-validated-email").pluginModalFormValidateEmail();
            $("#id-login-validated-email").pluginModalFormValidateEmail("show");
        }
        //Enable disable home displacement depending on Pref_useHome
        if (Globals.data.myself.Pref_useHome == 0) {
            $("#id-header-navbar-edit-home").css({visibility:"hidden"});
        } else {
            $("#id-header-navbar-edit-home").css({visibility:"visible"});
        }
        
      } else {
        $(".plugin-profile-picture").pluginProfilePicture("setDefaultImage");
        $(".plugin-profile-picture").pluginProfilePicture("setLoggedOut");
        $("#id-header-navbar-button-login").css({visibility:"visible"});
        $("#id-header-navbar-button-signup").css({visibility:"visible"});
        $("#id-header-navbar-button-user").css({visibility:"hidden"});
        $("#id-login-validated-email").pluginModalFormValidateEmail("hide");
      }    
      if (Globals.data.isLoggedIn) {
        //Add marker with home location
        if (Globals.data.myself.Pref_useHome == 1) {
            var uluru = {lat: parseFloat(Globals.data.myself.latitude), lng: parseFloat(Globals.data.myself.longitude)};
            console.log(uluru);
            //We only create the marker once !
            if (mapMarkerHomePosition !== null) mapMarkerHomePosition.setMap(null);
            mapMarkerHomePosition = null;
            if (mapMainGlobal == null) {
                mapMainGlobal = new google.maps.Map(document.getElementById('main-map-canvas'), {
                zoom: 12,
                center: uluru
                });
            }
            mapMainGlobal.setZoom(parseInt(Globals.data.myself.Pref_zoomValue));
            mapMainGlobal.panTo(uluru);
 
            mapMarkerHomePosition = new google.maps.Marker({
                position: uluru,
                animation: google.maps.Animation.DROP,
                icon: "./resources/img/icon-marker-home.png",
                map: mapMainGlobal
            });
        } else {
            //We are not using home location...           
            if (mapMarkerHomePosition !== null) mapMarkerHomePosition.setMap(null);
            var uluru = {lat: Globals.data.latitude, lng: Globals.data.longitude};
            if (Globals.data.latitude && Globals.data.longitude) {
            console.log(uluru);
            if (mapMainGlobal == null) {
                mapMainGlobal = new google.maps.Map(document.getElementById('main-map-canvas'), {
                    zoom: 12,
                    center: uluru
                });
            }
            mapMarkerHomePosition = null;
            mapMainGlobal.setZoom(parseInt(Globals.data.myself.Pref_zoomValue));
            mapMainGlobal.panTo(mapMarkerCurrentPosition.getPosition());
            }
        }
      } else {
        //Pan back to user location
        if (mapMarkerHomePosition!== null) {
            mapMarkerHomePosition.setMap(null);        //Remove home position marker
            mapMarkerHomePosition = null;
        }
        var uluru = {lat: Globals.data.latitude, lng: Globals.data.longitude};
        if (mapMainGlobal == null) {
                mapMainGlobal = new google.maps.Map(document.getElementById('main-map-canvas'), {
                    zoom: 12,
                    center: uluru
                });
        }
        mapMainGlobal.setZoom(12);
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
        Globals.isLoggedIn = true;
        Globals.myDB.clone_user();            
    });
               
    //----------------------------------------------------------------------
    //LOGOUT
    //----------------------------------------------------------------------
    $("#id-header-navbar-logout").on('click', function() {
        var myUser = new User();
        myUser.callingObject = $(document);
        myUser.logOut(); //Remove the session
        $(document).on("User.logout.ajaxRequestAlways", function () {
            console.log("logged out request completed !!!!!!!!!!");
            Globals.isLoggedIn = false; //Cookie has expired
            $.eraseCookie("PHPSESSID");
            Globals.myDB.syncStop();
            Globals.myDB.close();
            location.reload();
        });
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
          Globals.myUser.timestamp = parseInt(new Date().getTime() / 1000); //Update timestamp so that sync updates server
          Globals.myDB.save_user();
          /*
          Globals.myDB.saveMe();
          console.log(latitude);
          console.log(longitude);    */     
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
/*        var sessionInterval = setInterval(function () {
            console.log("Checked if session expired ! " + $.readCookie("PHPSESSID"));
            if ($.readCookie("presence") == null) {
                clearInterval(sessionInterval);
                $("#id-session-expired-modal").pluginModalFormSessionExpired("show");
            }
        }, ProjectSettings.sessionDurationMinutes * 60000); //Check every x minutes if we still have the cookie*/
        //If we get a session expired in one of the ajax Calls we come here
        $(window).on('Global.User.sessionExpired', function() {
            if (Globals.isLoggedIn) {
                $("#id-session-expired-modal").pluginModalFormSessionExpired("show");
                $.eraseCookie("PHPSESSID");
                $.eraseCookie("presence");
            }
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

/* global ProjectSettings, User, Globals, google, Data */



$(document).ready(function(){
  //----------------------------------------------------------------------
  // INIT
  //----------------------------------------------------------------------
  //Set the correct height of the map
  var myHeight = $(".body-container-default").outerHeight();
  $("main-map-canvas").css({
        height:myHeight
  });
        
  Globals.mainMap = new Map(document.getElementById('main-map-canvas'));    
  Globals.mainMap.wait();  //Wait that API is ready and trigger Global.Maps.api_ready  
    
  $(window).on('Global.Maps.api_ready', function() {
    Globals.mainMap.init();  
    
       
    //Global variables !
//    var mapMainGlobal;
//    var mapMarkerCurrentPosition;
//    var mapMarkerHomePosition = null;
    
    Globals.data.print();
    Globals.data.init();
    
    $.createCookie("presence", true,ProjectSettings.sessionDurationMinutes);            //We are present
    $("#id-header-navbar-profile-plugin").pluginProfilePicture({inputDisabled:true});
    $("#id-header-navbar-profile-plugin").pluginProfilePicture("setLoggedOut");        
    $("#id-header-navbar-button-user").css({visibility:"hidden"});
    $("#id-login-modal").pluginModalFormLogin();
    $("#id-signup-modal").pluginModalFormSignup();
    $("#id-forgot-password-modal").pluginModalFormForgotPassword(); 
    $("#id-header-navbar-button-notification span").css({visibility:"hidden"});

 
    //----------------------------------------------------------------------
    // Do the correct things depending on if we are logged or not
    // At this point we only know if user is loggedIn or not
    //----------------------------------------------------------------------
    $(window).on('Global.User.isLoggedIn', function(event) {
         if (Globals.data.isLoggedIn == true) {
            $("#id-header-navbar-profile-plugin").pluginProfilePicture("setDefaultImage");
            $("#id-header-navbar-profile-plugin").pluginProfilePicture("setLoggedIn");
            $("#id-header-navbar-button-login").css({visibility:"hidden"});
            $("#id-header-navbar-button-signup").css({visibility:"hidden"});
            $("#id-header-navbar-button-user").css({visibility:"visible"});
            $("#id-header-navbar-profile-plugin").css({visibility:"visible"});
            $("#id-header-navbar-button-notification").css({visibility:"visible"});
         } else {
            $(".plugin-profile-picture").pluginProfilePicture("setDefaultImage");
            $(".plugin-profile-picture").pluginProfilePicture("setLoggedOut");
            $("#id-header-navbar-button-login").css({visibility:"visible"});
            $("#id-header-navbar-button-signup").css({visibility:"visible"});
            $("#id-header-navbar-profile-plugin").css({visibility:"visible"});
            $("#id-header-navbar-button-user").css({visibility:"hidden"});
            $("#id-header-navbar-button-notification").css({visibility:"hidden"});
            $("#id-login-validated-email").pluginModalFormValidateEmail("hide");    
            
         }
    });

    //----------------------------------------------------------------------
    // Localize user and setup map
    //----------------------------------------------------------------------
    //When location is available update cookies
    $(window).on('Global.User.localized', function(event) {
        console.log("Got event Global.User.localized ! : ");
        Globals.data.print();
        Globals.mainMap.addUserLocationMarker();
        
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
        if (Globals.data.isLoggedIn == false) {
            Globals.mainMap.zoomToUserLocationMarker();
        }
    });
    
    //----------------------------------------------------------------------
    // When user has been downloaded
    //----------------------------------------------------------------------
    //We need to show home location and zoom to it depending on prefs...
    $(window).on('Global.User.ready', function(event) {  
      console.log("Got event Global.User.ready !");
      console.log(Globals.data);
      if (Globals.data.isLoggedIn) {  
        //Update avatar  
        $("#id-header-navbar-profile-plugin").pluginProfilePicture("setImage", Globals.data.myself.avatar);
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
      } 
      
      if (Globals.data.isLoggedIn) {
        //Add marker with home location
        if (Globals.data.myself.Pref_useHome == 1) {
            Globals.mainMap.addUserHomeLocationMarker();
            Globals.mainMap.zoomToUserHomeLocationMarker();           
        } else {
            //We are not using home location...   
            Globals.mainMap.removeUserHomeLocationMarker();
        }
      } else {
        Globals.mainMap.removeUserHomeLocationMarker();
      }
    });
    
    //----------------------------------------------------------------------
    // When user notifications are downloaded
    //----------------------------------------------------------------------
    $(window).on('Global.User.notifications_ready', function() {
       console.log("Got event : Global.User.notifications_ready");
       console.log("Found a total of notifications : " + Globals.data.notifications.length );
       //Get unread notifications count
       var unreadNotif = 0;
       for (var i= 0; i< Globals.data.notifications.length; i++) {
           if (Globals.data.notifications[i].visited == 0) unreadNotif = unreadNotif + 1;
       }
       
       
       if (Globals.data.notifications.length == 0) {
           $("#id-header-navbar-button-notification span").css({visibility:"hidden"});
           $("#id-header-navbar-button-notification-list").html('<li><a href="#">No notifications</a></li>').css({textAlign:"center"});
       } else {
           if (unreadNotif > 0) $("#id-header-navbar-button-notification span").css({visibility:"visible"});
           var myHtml = "";
           var visited = '<i class="notification-visited mdi mdi-18px mdi-email-open"></i> ';
           var not_visited =  '<i class="notification-visited mdi mdi-18px mdi-email"></i> ';
           for (var i= 0; i< Globals.data.notifications.length; i++) {
               if (Globals.data.notifications[i].visited == 0) {
                    myHtml = myHtml + '<li class="notification-element-display" data-index=' + i + '><a style="color:black">' + '<div class="div-need-wrap">' + not_visited  + Globals.data.notifications[i].message + '<i class="notification-remove mdi mdi-18px mdi-close" style="float:right"></i></div></a></li>';
               } else {
                    myHtml = myHtml + '<li class="notification-element-display" data-index=' + i + '><a style="color:grey">' + '<div class="div-need-wrap">' + visited  + Globals.data.notifications[i].message + '<i class="notification-remove mdi mdi-18px mdi-close" style="float:right"></i></div></a></li>';
               }
           }
           $("#id-header-navbar-button-notification-list").html(myHtml).css({textAlign:"left"});
           $("#id-header-navbar-button-notification-list").find(".mdi-email").parent().find(".notification-remove").css({visibility:"hidden"});
            //$("#id-header-navbar-button-notification-list").find("span").css({wrap)
           $(".div-need-wrap").css({wordWrap:"break-word", whiteSpace:"normal"}); //Allow text wrapping
           //Handle read notification
           $(".notification-visited").on("mouseenter", function() { $(this).css({cursor:"pointer"});});
           $(".notification-remove").on("mouseenter", function() { $(this).css({cursor:"pointer"});});
           $(".notification-visited").on('click', function() {
              var index = $(this).parent().parent().parent().data("index");
              if ($(this).hasClass("mdi-email")) {
                  $(this).removeClass("mdi-email").addClass("mdi-email-open");
                  $(this).parent().css({color:"grey"}).find(".notification-remove").css({visibility:"visible"});
                  unreadNotif = unreadNotif - 1;
                  $("#id-header-navbar-button-notification span").html(unreadNotif);
                  if (unreadNotif == 0) $("#id-header-navbar-button-notification span").css({visibility:"hidden"});
                  Globals.data.notifications[index].visited = 1;
                  Globals.data.notifications[index].timestamp = parseInt(new Date().getTime() / 1000);
                  Globals.data.sync_notifications();
              }
           });
           //Handle remove notification
           $(".notification-remove").on('click', function() {
                var index =  $(this).parent().parent().parent().data("index");
                Globals.data.notifications.splice(index,1);
                Globals.data.sync_notifications();
           });
       }
                  
         
       var oldCount = parseInt($("#id-header-navbar-button-notification span").html());
       $("#id-header-navbar-button-notification span").html(unreadNotif);
       if (unreadNotif > oldCount) {
           if (Globals.data.myself.Pref_soundOnNotif == 1) $.playSound('./resources/sounds/notification.mp3'); //Make notification sound          
           $("#id-header-navbar-button-notification span").animate(
                    {fontSize:"22px", lineHeight:"28px"},
                    {duration:300,
                     complete: function() {
                           $("#id-header-navbar-button-notification span").animate({fontSize:"11px",lineHeight:"14px"},200);
                     }
                    });
       }
    });

    //Avoid closing dropdown on click
    $(document).on('click', '.notifications-dropdown-menu', function (e) {
        e.stopPropagation();
    });
      
      
    //----------------------------------------------------------------------
    // When stations are downloaded
    //----------------------------------------------------------------------
      $(window).on('Global.Stations.ready', function () {
         console.log("Stations downloaded !");
         console.log(Globals.data.stations);
         Globals.mainMap.addStationMarkers();
         /*
         var marker,i;
         var markersStations = new Array();
         for (i=0; i<Globals.data.stations.length; i++) {
            var coords = {lat: parseFloat(Globals.data.stations[i].latitude), lng: parseFloat(Globals.data.stations[i].longitude)}; 
            console.log(coords);
            marker = new google.maps.Marker({
                position: coords,
                animation: google.maps.Animation.DROP,
                icon: "./resources/img/cube-green.png",
                map: mapMainGlobal
            });
            markersStations.push(marker);
 
         }*/
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
        Globals.data.isLoggedIn = true;
        $(window).trigger('Global.User.isLoggedIn');
        Globals.data.restore();                    
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
            Globals.data.isLoggedIn = false; //Cookie has expired
            $.eraseCookie("PHPSESSID");            
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
        mapMainGlobal.setZoom(parseInt(Globals.data.myself.Pref_zoomValue));
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
          var now = parseInt(new Date().getTime() / 1000);
          myUser.updateHomeLocation(latitude,longitude,now);
          Globals.data.myself.latitude = latitude;
          Globals.data.myself.longitude = longitude;
          Globals.data.myself.timestamp = now; //Update timestamp so that sync updates server   
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

    }); //End of Global.Maps.api_ready
}); //End of document load

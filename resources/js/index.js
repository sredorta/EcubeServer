/* global ProjectSettings, User, Globals, google, Data */



$(document).ready(function(){
  //----------------------------------------------------------------------
  // INIT
  //----------------------------------------------------------------------
  //Set the correct height of the map and make it responsive
  function responsiveMap() {
    
    //Check for horizontal scroll bar
    if (Globals.mainMap == null) {
        var scroll = 17;    //This is the height of the scrollBar
    } else { 
        scroll = 0; 
    }
    var myHeight = $(".main-container-default").outerHeight() - scroll;
    var myWidth = $(".main-container-default").outerWidth()/2;
    $("#main-map-canvas").css({
        height:myHeight,
        width:myWidth
    });
    $("#main-products").css({
        height:myHeight,
        width:myWidth
    });
    if (Globals.mainMap != null) {
        if (Globals.mainMap.map!= null) {
        var center = Globals.mainMap.map.getCenter();
        google.maps.event.trigger(Globals.mainMap.map, "resize");
        }
    }
  }
  responsiveMap();
  setTimeout(function() {responsiveMap();},500); //Make sure that right size is taken
  $(window).resize( function() {responsiveMap();});
       
  Globals.mainMap = new Map(document.getElementById('main-map-canvas'));  
  Globals.mainMap.mapType = "main"; //Specify global map so that Global events are triggered !
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
        var dragged = false;
        //Zoom map to home location marker
        Globals.mainMap.zoomToUserHomeLocationMarker();
               
        //Emable the marker to be draggable and set bounce anymation
        Globals.mainMap.markerHomePosition.setDraggable(true);
        Globals.mainMap.markerHomePosition.setClickable(true);
        if (Globals.mainMap.markerHomePosition.getAnimation() !== null) {
          Globals.mainMap.markerHomePosition.setAnimation(null);
        } else {
          Globals.mainMap.markerHomePosition.setAnimation(google.maps.Animation.BOUNCE);
        }
        //Remove bounce animation on drag start
        google.maps.event.addListener(Globals.mainMap.markerHomePosition, 'drag', function() {
             Globals.mainMap.markerHomePosition.setAnimation(null);
        });
        
        //Show infoWindow on dragEnd
        var contentString =
            '<div id="id-profile-edit-home-marker-content">'+
            '<p>Click on the marker to set this position</p>'+ 
            '<p>as your home position</p>' + 
            '</div>';
        var infowindow = new google.maps.InfoWindow({content: contentString});
        google.maps.event.addListener(Globals.mainMap.markerHomePosition, 'dragend', function() {
            infowindow.open(Globals.mainMap.map, Globals.mainMap.markerHomePosition);
            dragged = true;
        });
        
        google.maps.event.addListener(Globals.mainMap.markerHomePosition, 'click', function() {
          if (dragged) {
            infowindow.close();  //Close the infoWindow
            Globals.mainMap.markerHomePosition.setDraggable(false);
            Globals.mainMap.markerHomePosition.setClickable(false);
            //Do the ajax call to update new coordinates
            var latitude = Globals.mainMap.markerHomePosition.getPosition().lat();
            var longitude = Globals.mainMap.markerHomePosition.getPosition().lng();
            var myUser = new User();
            var now = parseInt(new Date().getTime() / 1000);
            myUser.updateHomeLocation(latitude,longitude,now);
            Globals.data.myself.latitude = latitude;
            Globals.data.myself.longitude = longitude;
            Globals.data.myself.timestamp = now; //Update timestamp so that sync updates server   
          }
        });        
    });

    $("#id-product-list").pluginProductList();
    //----------------------------------------------------------------------
    // On stationMarker Click handling
    //----------------------------------------------------------------------   
    $(window).on('Global.stations.selection_change', function() {
        console.log("Got event: Global.stations.selection_change");
        //New station selected so all selected items are zero and we hide cart button
        $("#id-add-to-cart").css({visibility:"hidden"}); 
        console.log(Globals.mainMap.markerStationsSelected);
        //Download all the products with the stations selected
        if (Globals.mainMap.markerStationsSelected == null) {
            $("#id-product-list").pluginProductList("reset");
        } else {
            if (Globals.mainMap.markerStationsSelected.length == 0) {
                $("#id-product-list").pluginProductList("reset");
            } else {
                var i;
                var myStations = null;
                for(i=0; i<Globals.mainMap.markerStationsSelected.length; i++) {
                    console.log("Station selected : " + Globals.mainMap.getStationIdFromMarker(Globals.mainMap.markerStationsSelected[i]));
                    if (myStations == null) myStations = Globals.mainMap.getStationIdFromMarker(Globals.mainMap.markerStationsSelected[i]);
                    else myStations = myStations + " " + Globals.mainMap.getStationIdFromMarker(Globals.mainMap.markerStationsSelected[i]);
                }
                var myProductFind = {
                    keywords: $("#id-products-filter").val(),
                    selectedStations: myStations
                };
                console.log(myProductFind);
                //Now do ajax call and create the product !!!!
                var url = ProjectSettings.serverUrl + "/api/product.get.php";
                var serializedData = jQuery.param(myProductFind);
                console.log("Asking for products : "+ serializedData);
                $.ajax({
                    url: url,
                    type: "POST",
                    data: serializedData,
                    success: function(response) {
                        if (response.result === "success") {
                            console.log("Products downloaded !!!!");
                            Globals.data.products = JSON.parse(response.products);
                            $("#id-product-list").pluginProductList("reset");
                            var i;
                            for(i=0; i<Globals.data.products.length; i++) {
                                $("#id-product-list").pluginProductList("addItem", Globals.data.products[i]);
                            }
                            //Now just need to add a product item
                        }
                    },
                    fail: function() {
                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Got fail !");
                    }
                });    
            }
            
        }
    });

    //----------------------------------------------------------------------
    // PRODUCT REMOVE
    //----------------------------------------------------------------------               
    $("#id-header-navbar-product-remove").on('click', function() {
        console.log("clicked product remove");
       $('#id-premium-product-remove-modal').pluginProductRemove();
       $('#id-premium-product-remove-modal').pluginProductRemove("show");        
    });

    //----------------------------------------------------------------------
    // ADD TO CART BUTTON
    //----------------------------------------------------------------------               
    $("#id-add-to-cart").on('click', function() {
        console.log("IsLoggedIn " + Globals.data.isLoggedIn);
        if (Globals.data.isLoggedIn == true) {
            console.log("add to cart");
            //Now get the order and place order in cart
            //Identify from which station we have selected for order
            console.log("Selected station id: " + Globals.mainMap.getStationIdFromMarker(Globals.mainMap.markerStationsSelected[0]));
            var total = 0;
            $("#id-product-list").find(".product-item").each(function () {
                if (parseInt($(this).find(".list-element-value").html()) > 0 ) {
                    var quantity = parseInt($(this).find(".list-element-value").html());
                    var price = parseInt($(this).data("product_price"));
                    console.log("product_id: " + $(this).data("product_id"));
                    console.log("product_price: " + price);
                    console.log("quantity : " + quantity);
                    console.log("station_id : " +  Globals.mainMap.getStationIdFromMarker(Globals.mainMap.markerStationsSelected[0]));
                    total = total + (quantity * price);
                }
            });
            console.log("TOTAL : " + total);
            //Create the new order
            var myNewOrder = {
                    station_id: Globals.mainMap.getStationIdFromMarker(Globals.mainMap.markerStationsSelected[0]),
                    user_id: Globals.data.myself.id,
                    total: total,
                    status: "pending"
            };
            console.log("Creating order :");
            console.log(myNewOrder);
            //Now do ajax call and create the order !!!!
            var url = ProjectSettings.serverUrl + "/api/order.add.php";
            var serializedData = jQuery.param(myNewOrder);
            $.ajax({
                url: url,
                type: "POST",
                data: serializedData,
                success: function(response) {
                    if (response.result === "success") {
                        console.log("Order created !!!! with Id : " + response.message);
                        //Create the new order details            
                        $("#id-product-list").find(".product-item").each(function () {
                        if (parseInt($(this).find(".list-element-value").html()) > 0 ) {
                            var myNewOrderDetail = {
                                order_id : response.message,
                                product_id: $(this).data("product_id"),
                                product_count : parseInt($(this).find(".list-element-value").html())                       
                            };
                            console.log(myNewOrderDetail);
                            var url = ProjectSettings.serverUrl + "/api/order_details.add.php";
                            var serializedData = jQuery.param(myNewOrderDetail);
                            $.ajax({
                                url: url,
                                type: "POST",
                                data: serializedData,
                                success: function(response) {
                                    if (response.result === "success") {
                                        console.log("added detail");
                                    }   
                                }
                            });
                }
            });

                        
                        
                        
                        //Here we need to update the cart with new message
                    }
                },
                fail: function() {
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Got fail !");
                }
            });                            
            
        } else {
            //Expand the plugin of Login modal Form
            console.log("need login !!!");
            $("#id-login-modal").pluginModalFormLogin();
            $("#id-login-modal").pluginModalFormLogin("show");
        }
    });
    
    // -------------------------------------------------------------------------
    //  CART CLICK
    // -------------------------------------------------------------------------
    $('#id-header-navbar-button-cart').on('click', function() {
       console.log('clicked');
       //Get all orders from server and update list
       if ($('#id-header-navbar-button-cart-list').css('display') === "none") {
            console.log("Updating cart...");
            var myOrders = {
                user_id : Globals.data.myself.id
                };
            var url = ProjectSettings.serverUrl + "/api/order.get.php";
            var serializedData = jQuery.param(myOrders);
            $.ajax({
                url: url,
                type: "POST",
                data: serializedData,
                success: function(response) {
                    if (response.result === "success") {
                        console.log("added detail");
                        var allMyOrders = JSON.parse(response.orders);
                        var myHtml = "";
                        for (var i= 0; i< allMyOrders.length; i++) {
                            console.log(allMyOrders[i]);

                            myHtml = myHtml + '<li class="order-element-display" data-orderid=' + allMyOrders[i].order_id + '><a style="color:black">' + '<div class="div-need-wrap">' + '<p class="text-big"><i class="notification-visited mdi mdi-18px mdi-file-document"></i>  ORDER#'  + allMyOrders[i].order_id +'</p><p class="text-small">Total: ' + allMyOrders[i].total + '&euro;</p><p class="text-small">' + "Status : " + allMyOrders[i].status + '</p></div></a></li>';

                        }
                        $("#id-header-navbar-button-cart-list").html(myHtml).css({textAlign:"left"});
                        $("#id-header-navbar-button-cart-list").find(".text-small").css({margin:"0"});
                        $("#id-header-navbar-button-cart-list").find(".text-big").css({margin:"0",fontWeight:"bold"});
                        $('.order-element-display').on('click', function() {
                           console.log("Clicked order : " + $(this).data("orderid")); 
                        });
                    }   
                }
            });
       }
       
    });


    //----------------------------------------------------------------------
    // PREFERENCES EDIT
    //----------------------------------------------------------------------               
    $("#id-header-navbar-edit-preferences").on('click',function() {
        console.log("Editing prefs");
        $("#id-profile-preferences-modal").pluginModalFormPreferences();
        $("#id-profile-preferences-modal").pluginModalFormPreferences("show");
    });

    $("#id-header-navbar-product-add").on('click',function() {
        console.log("Adding new product");
        $("#id-premium-product-add-modal").pluginModalFormAddProduct();
        $("#id-premium-product-add-modal").pluginModalFormAddProduct("show");
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

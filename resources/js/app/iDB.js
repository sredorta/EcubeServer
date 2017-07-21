/* 
 * Handles indexed dB
 */

/* global Globals */

function IndexedDB() {
    this._name = "IndexedDB";
    this._debug=true;
    this.db;
    this.interval;
}

//Prints logging if debug enabled
IndexedDB.prototype._log = function(txt) {
    if (this._debug) console.log(this._name + ":: " + txt);
};


//Opens the database and recreates the schema if required
IndexedDB.prototype.init = function() {
    var myObject = this;
    this._log("Opening database");
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    var openRequest = indexedDB.open('myDb',2);
  
    //Create the schema
    openRequest.onupgradeneeded = function() {
       myObject.db = openRequest.result; 
       myObject._log("Upgrade needed");
       myObject.create(myObject.db);
    };
   
   openRequest.onsuccess = function(e) {
       myObject._log("Database open !");
       myObject.db = openRequest.result;
       $(window).trigger('Global.iDB.ready');
   };
   
   openRequest.onerror = function(e) {
       myObject._log("Database open error !");
       myObject._log("Error: " + e.code + " " + e.message);
   };

};
//Create the schema
IndexedDB.prototype.create = function(db) {
    var myObject = this;
    myObject._log("Create db");
    db.deleteObjectStore('users');
    db.deleteObjectStore('myself');
    db.deleteObjectStore('notifications');
    var store = db.createObjectStore('users', {keyPath: 'id'}); //Users table
    store.createIndex('email', 'email',  {unique:false});
    store = db.createObjectStore('myself', {keyPath: 'id'}); //myself table
    store = db.createObjectStore('notifications', {keyPath: 'notification_id'}); //Notifications table
};


IndexedDB.prototype.saveMe = function() {
    var myObject = this;
    var db = myObject.db;
    myObject._log("saveMe");
    var myUser = Globals.myUser;
    myUser.callingObject = "";
    localStorage.setItem("avatar_0", myUser.avatar);
    myUser.avatar= "";
    myUser.id = 0;
    var tx = db.transaction(['myself'], "readwrite");
    var store = tx.objectStore('myself');
    store.put(myUser);  //We only have one entry in this table
};

IndexedDB.prototype.getMe = function() {
    var myObject = this;
    var db = myObject.db;
    myObject._log("getMe");
    var tx = db.transaction(['myself'], "readwrite");
    var store = tx.objectStore('myself');
    var getUser = store.get(0);
    getUser.onsuccess = function() {
        Globals.myUser.reload(getUser.result);  //Reload the user
        Globals.myUser.avatar = localStorage.getItem("avatar_0");
        $(window).trigger("Global.User.available"); // Update profile objects
    };  
};


IndexedDB.prototype.clone_user = function () {
  this._log("Clonning IndexedDB for user...");
  var myObject = this;
  var db = myObject.db;
  var myUser = new User();  
  //Get the user from the server into the iDB
  myObject._log("Clonning user...");
  if ($.readCookie("PHPSESSID")!== null) {
    myUser.callingObject = $(document);  
    myUser.restore();  //Restore from server the current user 
    $(document).on("User.restore.ajaxRequestSuccess", function(event, response) {
        var myResponse = JSON.parse(response.account);
        Globals.myUser.reload(myResponse);
        localStorage.set
        var tx = db.transaction(['myself'], "readwrite");
        var store = tx.objectStore('myself');
        console.log("Before error!!!");
        myUser.reload(Globals.myUser);
        myUser.avatar = "";
        console.log(myResponse);
        store.put(myResponse);
        $(window).trigger('Global.user.available');
        console.log("After error!!!");

    });  
    $(document).on("User.restore.ajaxRequestAlways", function() {
        console.log("User restored in dB:");
        console.log(Globals.myUser);
        console.log("Triggering : Global.iDB.clone.user");
        $(window).trigger('Global.iDB.user.ready');
    });
  } else {
//      Globals.myUser.print();
      console.log("Triggering : Global.iDB.clone.user");
      $(window).trigger('Global.iDB.user.ready');
  }
};

IndexedDB.prototype.clone_notifications = function () {
  this._log("Clonning IndexedDB for notifications...");
  var myObject = this;
  var db = myObject.db;
  
    console.log("Clonning notifications...");  
    //Notifications clonning
    if ($.readCookie("PHPSESSID")!== null) {
        var serverNotifications = [];
        var iDBNotifications = [];
        var myUser = Globals.myUser;
        myUser.callingObject = $(document);
        myUser.notificationsGet();    
        //STEP 2: Get the notifications on the Server and compare
        $(document).on('User.notifications_get.ajaxRequestSuccess', function(event, response) {
            myObject._log("SUCCESS : user.notifications_get");
            var db = myObject.db;
            var tx = db.transaction(['notifications'], "readwrite");
            var store = tx.objectStore('notifications');
                       
            var serverNotifications = JSON.parse(response.notifications); //'['+response.notifications.join(',')+']');
            for (var i= 0; i< serverNotifications.length; i++) {
                console.log(serverNotifications[i]);
            }
            console.log("We have on server object count : " + serverNotifications.length);
            console.log("We have on iDB object count : " + iDBNotifications.length);
            //Add any new notifications from server into iDB
            for (var i= 0; i< serverNotifications.length; i++) {
                    store.put(serverNotifications[i]);
                    console.log("Added into iDB : " + serverNotifications[i].notification_id);
            }
            $(window).trigger('Global.iDB.user.notifications.ready');

        });    
    }
}
//Will copy the server database into indexedDB
IndexedDB.prototype.clone = function() {
  this._log("Clonning IndexedDB...");
  var myObject = this;
  var db = myObject.db;
  
  myObject.clone_user();
  $(window).on('Global.iDB.user.ready', function() {
    myObject.clone_notifications();
  });
  $(window).on('Global.iDB.user.notifications.ready', function() {
     $(window).trigger('Global.iDB.clone.completed'); 
  });
  
};

//Starts the sync process
IndexedDB.prototype.syncStart = function() {
  var myObject = this;
  myObject._log("Called syncStart");
  this.interval = setInterval(function() {
      myObject.sync();
  },60000);  
};
//Starts the sync process
IndexedDB.prototype.syncStop = function() {
  var myObject = this;
  clearInterval(myObject.interval);  
};

//Will sync up the data with the server
IndexedDB.prototype.sync = function() {
  var myObject = this;  
  this._log("IndexedDB sync...");
  if ($.readCookie("PHPSESSID") !== null) {
      myObject.sync_user();
      myObject.sync_notifications();
  }
};

//Syncs the user between indexedDB and SQL server
//For the moment we only get from SQL to indexedDB for debug
IndexedDB.prototype.sync_user = function() {
    this._log("IndexedDB sync user...");
    var serverUser = new User();
    var iDBUser = new User();
    var myObject = this;
    var db = myObject.db;
    //Get iDBUser
    var tx = db.transaction(['myself'], "readwrite");
    var store = tx.objectStore('myself');
    var getUser = store.get(0);
    getUser.onsuccess = function() {
        iDBUser.reload(getUser.result);  //Reload the user
        iDBUser.avatar = localStorage.getItem("avatar_0");
        //Get SQL user
        serverUser.callingObject = $(document);
        serverUser.restore();
    };  

    //When the user has been restored from SQL
    $(document).on('User.restore.ajaxRequestSuccess', function(event, response) { 
            console.log("On restore success !!!!!");
            var myResponse = JSON.parse(response.account);
            Globals.myUser.reload(myResponse);
            localStorage.setItem("avatar_0", myResponse.avatar);
    });
    
};


//Server adds notifications with timestamp via time() (UTC)
//If there are updates during app we will change IdB timestamp with:
// parseInt(new Date().getTime() / 1000)
//When update to server then we compare latests timestamp
IndexedDB.prototype.sync_notifications = function() {
    this._log("IndexedDB sync notifications...");
    var serverNotifications = [];
    var iDBNotifications = [];
    var myUser = Globals.myUser;
    var myObject = this;
    var db = myObject.db;
    myUser.callingObject = $(document);
    //STEP 1: Get the notifications on the IndexedDB
    var tx = db.transaction(['notifications'], "readwrite");
    var store = tx.objectStore('notifications');
    var cursor = store.openCursor();
    var index = 0;
    cursor.onsuccess = function (e) {
       var cursor = e.target.result;
       if (cursor) {
           console.log("Object in cursor !");
           console.log(cursor.value);
           iDBNotifications[index] = cursor.value;
           console.log(iDBNotifications[index]);
           index= index+1;
           cursor.continue();  //Do not continue as we only have one entry
       } else {
           //At this point we already have all the iDB notifications so now we request the server ones
           console.log("end of cursor !!!");
           myUser.notificationsGet();   // Get the notifications on the server
       } 
    }; 
    cursor.onerror = function(e) {
        console.log("error");
    };

    //STEP 2: Get the notifications on the Server and compare
    $(document).on('User.notifications_get.ajaxRequestSuccess', function(event, response) {
            myObject._log("SUCCESS : user.notifications_get");
            var db = myObject.db;
            var tx = db.transaction(['notifications'], "readwrite");
            var store = tx.objectStore('notifications');
            
            
            var serverNotifications = JSON.parse(response.notifications); //'['+response.notifications.join(',')+']');
            for (var i= 0; i< serverNotifications.length; i++) {
                console.log(serverNotifications[i]);
            }
            console.log("We have on server object count : " + serverNotifications.length);
            console.log("We have on iDB object count : " + iDBNotifications.length);
            //Add any new notifications from server into iDB
            for (var i= 0; i< serverNotifications.length; i++) {
                var found = 0;
                var copyToIDB = 0;
                var copyToServer = 0;
                for (var j= 0; j< iDBNotifications.length; j++) {
                    if (serverNotifications[i].notification_id == iDBNotifications[j].notification_id) {
                        console.log("found");
                        if (serverNotifications[i].timestamp > iDBNotifications[j].timestamp) {
                            copyToIDB = 1;
                        }
                        if (serverNotifications[i].timestamp < iDBNotifications[j].timestamp) {
                            copyToServer = 1;
                        }
                        found = 1;
                        break;
                    }
                }
                if (!found) {
                    console.log("Need to create : "+ serverNotifications[i].notification_id);
                    store.put(serverNotifications[i]);
                    console.log("Added into iDB : " + serverNotifications[i].notification_id);
                } else if (copyToIDB) {
                    console.log("Need to update from server to iDB : " + serverNotifications[i].notification_id);
                    console.log("server:");
                    console.log(serverNotifications[i]);
                    console.log("local:");
                    console.log(iDBNotifications[j]);
                    store.put(serverNotifications[i]);
                } else if (copyToServer) {
                    console.log("Need to update from iDB to server : " + serverNotifications[i].notification_id);
                    //Need to do ajax call to update the server row and on complete sync has ended, but we don't need to wait oncomplete as we work with local
                    //myUser.notificationsSet(iDBNotifications[j]); 
                }
            }
    });
    
};



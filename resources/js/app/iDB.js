/* 
 * Handles indexed dB
 */

/* global Globals */

function IndexedDB() {
    this._name = "IndexedDB";
    this._debug=true;
    this.db;
}

//Prints logging if debug enabled
IndexedDB.prototype._log = function(txt) {
    if (this._debug) console.log(this._name + ":: " + txt);
};
//For debug
IndexedDB.prototype.open = function() {
    var myObject = this;
    this._log("Opening database");
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    var openRequest = indexedDB.open('myDb',1);

   
    //Create the schema
    openRequest.onupgradeneeded = function() {
       myObject.db = openRequest.result; 
       myObject._log("Upgrade needed");
       myObject.create(myObject.db);
    };
   
   openRequest.onsuccess = function(e) {
       myObject._log("Database open !");
       myObject.db = openRequest.result;
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
    var store = db.createObjectStore('users', {keyPath: 'id'}); //Users table
    store.createIndex('email', 'email',  {unique:false});
    store = db.createObjectStore('myself', {keyPath: 'id'}); //myself table

};

IndexedDB.prototype.saveMe = function() {
    var myObject = this;
    var db = myObject.db;
    myObject._log("save User");
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
    myObject._log("get User");
    var tx = db.transaction(['myself'], "readwrite");
    var store = tx.objectStore('myself');
    var getUser = store.get(0);
    getUser.onsuccess = function() {
        Globals.myUser.reload(getUser.result);  //Reload the user
        Globals.myUser.avatar = localStorage.getItem("avatar_0");
        $(window).trigger("Global.User.available"); // Update profile objects
    };
/*    var cursor = store.openCursor();
    cursor.onsuccess = function (e) {
       var cursor = e.target.result;
       if (cursor) {
           console.log("Object in cursor !");
           console.log(cursor.value);
           myUser.firstName = cursor.value.firstName;
           //cursor.continue();  //Do not continue as we only have one entry
       }   
 //      return myList;
    };
    
    //store.get(myUser);*/
 
};
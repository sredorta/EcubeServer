/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




/* global Globals */

function Map(object) {
    this._name = "googleMap";
    this._debug = true;
    this._element = object; //Element of the map 
    this.map = null;
    this.markerCurrentPosition = null;  //Current user position marker
    this.markerHomePosition = null;     //Marker of home position
    this.markerStations = null;
}

//Prints logging if debug enabled
Map.prototype._log = function(txt) {
    if (this._debug) console.log(this._name + ":: " + txt);
};

//For debug
Map.prototype.print = function() {
    this._log("Content of Map:");
    this._log(this);
};  


//Wait that google api is ready and then trigger Global.Maps.api_ready
Map.prototype.wait = function() {
    var myObject = this;
    //Wait that google maps API is ready
    var myInterval = setInterval(function() {
        try {
        if (typeof google === 'object' && typeof google.maps === 'object') {
            clearInterval(myInterval);
            myObject._log("Triggering : Global.Maps.api_ready");
            $(window).trigger('Global.Maps.api_ready');
        }
        } catch(e) {
            console.log(e);
        }
        console.log("Not loaded");
    },100);
};

//Initializes the map showing world (no coords)
Map.prototype.init = function() {
    this._log("Initializing map:");
    var mapOptions = {
	center: new google.maps.LatLng(0, 0),
	zoom: 1,
	minZoom: 1
    };
    console.log(this._element);
    this.map = new google.maps.Map(this._element,mapOptions );

        var allowedBounds = new google.maps.LatLngBounds(
	new google.maps.LatLng(85, -180),	// top left corner of map
	new google.maps.LatLng(-85, 180)	// bottom right corner
    );

    var k = 5.0; 
    var n = allowedBounds .getNorthEast().lat() - k;
    var e = allowedBounds .getNorthEast().lng() - k;
    var s = allowedBounds .getSouthWest().lat() + k;
    var w = allowedBounds .getSouthWest().lng() + k;
    var neNew = new google.maps.LatLng( n, e );
    var swNew = new google.maps.LatLng( s, w );
    var boundsNew = new google.maps.LatLngBounds( swNew, neNew );
    this.map.fitBounds(boundsNew);   
};  

//Adds user location marker
Map.prototype.addUserLocationMarker = function() {
    var myObject = this;
    //If marker already exists we remove it first
    if (this.markerCurrentPosition !== null) this.markerCurrentPosition.setMap(null);
    this.markerCurrentPosition = null;
    var coords = {lat: parseFloat(Globals.data.latitude), lng: parseFloat(Globals.data.longitude)};
    this.markerCurrentPosition = new google.maps.Marker({
            position: coords,
            animation: google.maps.Animation.DROP,
            map: myObject.map
        });
};
//Adds user location marker
Map.prototype.zoomToUserLocationMarker = function() {
   this.map.panTo(this.markerCurrentPosition.getPosition());
   this.map.setZoom(12);
};

//Adds user home location marker
Map.prototype.addUserHomeLocationMarker = function() {
    var myObject = this;
    myObject._log("addUserHomeLocationMarker");

    //If marker already exists we remove it first
    if (this.markerHomePosition !== null) this.markerHomePosition.setMap(null);
    this.markerHomePosition = null;
    var coords = {lat: parseFloat(Globals.data.myself.latitude), lng: parseFloat(Globals.data.myself.longitude)};
    this.markerHomePosition = new google.maps.Marker({
            position: coords,
            animation: google.maps.Animation.DROP,
            icon: "./resources/img/icon-marker-home.png",
            map: myObject.map
        });
};
//Zooms to user home location marker
Map.prototype.zoomToUserHomeLocationMarker = function() {
   var coords = {lat: parseFloat(Globals.data.myself.latitude), lng: parseFloat(Globals.data.myself.longitude)};
   this.map.panTo(coords);
   this.map.setZoom(parseInt(Globals.data.myself.Pref_zoomValue));
};

//Removes user home location marker
Map.prototype.removeUserHomeLocationMarker = function() {
    if (this.markerHomePosition !== null) this.markerHomePosition.setMap(null);
    this.markerHomePosition = null;
    //Pan back to user current position
    this.map.panTo(this.markerCurrentPosition.getPosition());
    this.map.setZoom(parseInt(Globals.data.myself.Pref_zoomValue));
};

Map.prototype.addStationMarkers = function() {
    var myObject = this;
    this.markerStations = new Array();
    var marker,i;
    for (i=0; i<Globals.data.stations.length; i++) {
        var coords = {lat: parseFloat(Globals.data.stations[i].latitude), lng: parseFloat(Globals.data.stations[i].longitude)}; 
        marker = new google.maps.Marker({
            position: coords,
            animation: google.maps.Animation.DROP,
            icon: "./resources/img/cube-green.png",
            map: myObject.map
        });
        this.markerStations.push(marker);
 
    }
    
    
};
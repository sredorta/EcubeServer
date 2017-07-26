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

//Add all station markers during initialization
Map.prototype.addStationMarkers = function() {
    var myObject = this;
    if (this.markerStations === null) {    //Only do this first time
        this.markerStations = new Array();
        var i;
        window.setTimeout(function() {
          for (i=0; i<Globals.data.stations.length; i++) {     
            myObject.addStationMarker(Globals.data.stations[i]);               
          }
        },1000);
    } else {
        this._log("Updating stations...");
        this.updateStationMarkers();    //We have already markers, so we check for diffs and act
    }
};

//Add marker to corresponding station
Map.prototype.addStationMarker = function(station) {
    var myObject = this;
    var coords = {lat: parseFloat(station.latitude), lng: parseFloat(station.longitude)}; 
    //Determine if station is active or not
    var timeThreshold = parseInt(new Date().getTime() / 1000) - ProjectSettings.syncIntervalMinutes*60000;
    var icon = "./resources/img/cube-blue.png";
    var clickable = true;
    if (station.timestamp < timeThreshold ){
        icon = "./resources/img/cube-grey.png";
        clickable = false;
    }
    myObject.markerStations.push(new google.maps.Marker({
                position: coords,
                icon: icon,
                labelContent:station.station_id,           //We use the labelContent in order to identify the markers with the stations
                map: myObject.map,
                clickable:clickable,
                animation: google.maps.Animation.DROP
    }));                 
};



//We provide one station_id and return the marker that corresponds
Map.prototype.getMarkerFromStation = function(station_id) {
    var i;
    for (i=0; i<this.markerStations.length; i++) { 
        if (this.markerStations[i].labelContent === station_id) {
            return this.markerStations[i];
        }
    }
    return null;
};


//We provide a station and a color and set the color
Map.prototype.setStationMarkerColor = function(station_id,color) {
    var myMarker = this.getMarkerFromStation(station_id);
    switch (color) {
        case "yellow" :
            myMarker.setIcon("./resources/img/cube-yellow.png");
            break; 
        case "green" :
            myMarker.setIcon("./resources/img/cube-green.png");
            break;         
        case "grey" :
            myMarker.setIcon("./resources/img/cube-grey.png");
            break;  
        case "blue" :
            myMarker.setIcon("./resources/img/cube-blue.png");
            break;  
        default :
            myMarker.setIcon("./resources/img/cube-grey.png");
    }   
};

Map.prototype.updateStationMarkers = function() {
    var myObject = this;
    //Check if a marker exists but station doesn't exist anymore
    var i;
    for (i=0; i<this.markerStations.length; i++) { 
        var found = false;
        for(j=0; j<Globals.data.stations.length; j++) {
            if (myObject.markerStations[i].labelContent === Globals.data.stations[j].station_id) {
                found = true;
            }
        }
        if (!found) {
            myObject._log("Marker for station " + myObject.markerStations[i].labelContent + " will be removed !");
            myObject.removeStationMarker(parseInt(myObject.markerStations[i].labelContent));
        }
    }
    //Check if a station exists but no marker and if so recreate marker
    for(i=0; i<Globals.data.stations.length; i++) {
        var timeThreshold = parseInt(new Date().getTime() / 1000) - ProjectSettings.syncIntervalMinutes*60000;
        var icon = "./resources/img/cube-blue.png";
        var clickable = true;
        if (Globals.data.stations[i].timestamp < timeThreshold ) {
            icon = "./resources/img/cube-grey.png";
            clickable = false;
        }
        
        var found = false;
        for (j=0; j<this.markerStations.length; j++) {
            if (myObject.markerStations[j].labelContent === Globals.data.stations[i].station_id) {
                found = true;
                //Update icon color and clickable
                myObject.markerStations[j].setIcon(icon);
                myObject.markerStations[j].setClickable(clickable);
            }
        }
        if (!found) {
            myObject._log("Marker for station " + Globals.data.stations[i].station_id + " will be created !");
            myObject.addStationMarker(Globals.data.stations[i]);
        }
    }
};


//Removes  marker of the station_id specified
Map.prototype.removeStationMarker = function(station_id) {
    this._log("removeStationMarker");
    var i;
    for (i=0; i<this.markerStations.length; i++) { 
        if (parseInt(this.markerStations[i].labelContent) === parseInt(station_id)) {
            console.log("Removing marker !");
            if (this.markerStations[i] !== null) this.markerStations[i].setMap(null);
            this.markerStations.splice(i,1);
            break
        }
    }
};



Map.prototype.getLabel = function() {
   // Globals.data.stations.splice(1,1);

    //this.removeStationMarker(2);
    //myStation.station_id = 2;
    this.updateStationMarkers();
    

};




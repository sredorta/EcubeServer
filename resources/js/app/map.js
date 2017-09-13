/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */





function Map(object) {
    this._name = "googleMap";
    this._debug = true;
    this._element = object; //Element of the map 
    this.mapType;           //When mapType is main triggers global events if not no
    this.map = null;
    this.markerCurrentPosition = null;  //Current user position marker
    this.markerHomePosition = null;     //Marker of home position
    this.markerStations = null;
    this.markerStationsSelected = null;
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
            console.log("here");
            clearInterval(myInterval);
            if (myObject.mapType == "main") {
                myObject._log("Triggering : Global.Maps.api_ready");
                $(window).trigger('Global.Maps.api_ready');
            }
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
	center: {lat:0, lng:0},
	zoom: 1,
	minZoom: 1
    };
    console.log(this._element);
    this.map = new google.maps.Map(this._element,mapOptions );
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
            clickable:false,
            map: myObject.map
        });
    this.zoomToUserLocationMarker();  
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
            clickable:false,
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
          if (myObject.mapType == "main") {
            console.log("Triggering: Global.Stations.markers_available");
            $(window).trigger("Global.Stations.markers_available");
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
    var marker = new google.maps.Marker({
                position: coords,
                icon: icon,
                labelContent:station.station_id,           //We use the labelContent in order to identify the markers with the stations
                map: myObject.map,
                clickable:clickable,
                animation: google.maps.Animation.DROP
    });
    myObject.markerStations.push(marker);                   //Add on click event
    myObject.onStationMarkerClick(marker);
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


//We provide one station_id and return the marker that corresponds
Map.prototype.getStationIdFromMarker = function(marker) {
    return marker.labelContent;
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
        if (this.stationIsSelected(Globals.data.stations[i].station_id)) icon = "./resources/img/cube-yellow.png";
        if (Globals.data.stations[i].timestamp < timeThreshold ) {
            icon = "./resources/img/cube-grey.png";
            clickable = false;
            //Remove from selected if it was selected
            if (this.stationIsSelected(Globals.data.stations[i].station_id)) {
                var j;
                var index;
                for (j=0; j<this.markerStationsSelected.length; j++) {
                    if (this.getStationIdFromMarker(this.markerStationsSelected[j]) == Globals.data.stations[i].station_id) {
                        this.markerStationsSelected.splice(j, 1);
                        if (this.mapType == "main") {
                            console.log("Triggering: Global.stations.selection_change");
                            $(window).trigger("Global.stations.selection_change");
                        }
                    }
                }
            }
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
    if (this.mapType == "main") {
        console.log("Triggering: Global.Stations.markers_available");
        $(window).trigger("Global.Stations.markers_available");
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
Map.prototype.onStationMarkerClick = function(marker) {
                var myObject = this;
                var station_id = marker.labelContent;
                marker.addListener('click', (function(station_id) {
                        return function () {
                        myObject.markerStationOnClick(station_id);
                        };
                })(station_id));
};    

 
Map.prototype.getLabel = function() {
   // Globals.data.stations.splice(1,1);

    //this.removeStationMarker(2);
    //myStation.station_id = 2;
    this.updateStationMarkers();
    

};

//Updates the markerStationsSelected array at each click
Map.prototype.markerStationOnClick = function(station_id) {
    this._log("Clicked on station : " + station_id);
    var myObject = this;
    if (this.mapType != "main") {
    if (this.stationIsSelected(station_id)) {
        if (this.markerStationsSelected != null) {
            this.setStationMarkerColor(station_id,"blue");
            var i,index;
            var found = false;
            for (i=0; i<this.markerStationsSelected.length; i++) {
                if (this.getStationIdFromMarker(this.markerStationsSelected[i])== station_id) found = true; index = i;
            }           
            if (found) {
                this.markerStationsSelected.splice(index,1);                
            }    
        }
    } else {   
        var myMarker = this.getMarkerFromStation(station_id);
        if (this.markerStationsSelected == null) {
            this.markerStationsSelected = new Array();
            this.markerStationsSelected.push(myMarker);
        } else {
            var i;
            var found = false;
            for (i=0; i<this.markerStationsSelected.length; i++) {
                if (this.getStationIdFromMarker(this.markerStationsSelected[i]) == station_id) found = true;
            }
            if (!found) {
                this.markerStationsSelected.push(this.getMarkerFromStation(station_id));
            }
        } 
        this.setStationMarkerColor(station_id,"yellow");
    }
    } else {
        //In the case of the main map we only allow one station selected
        for (i=0; i<this.markerStations.length; i++) {
            this.setStationMarkerColor(this.getStationIdFromMarker(this.markerStations[i]), "blue");
        }
        this.setStationMarkerColor(station_id, "yellow");
        var myMarker = this.getMarkerFromStation(station_id);
        this.markerStationsSelected = new Array();
        this.markerStationsSelected.push(myMarker);
    }
    if (this.mapType == "main") {
        console.log("Triggering: Global.stations.selection_change");
        $(window).trigger("Global.stations.selection_change");
    }
};

Map.prototype.stationIsSelected = function(station_id) {
        var i;
        var found = false;
        if (this.markerStationsSelected != null) {
            for (i=0; i<this.markerStationsSelected.length; i++) {
                if (this.getStationIdFromMarker(this.markerStationsSelected[i]) == station_id) found = true;
            }
        }
        return found;   
    
};


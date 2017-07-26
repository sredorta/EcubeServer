<?php

Log::i(basename(__FILE__), "Loading include file..."); //Show that we have loaded the file

class Station {
    public $station_id;               
    public $name;
    public $latitude;
    public $longitude;
    public $timestamp;
    				
    function __construct() {}
    
    //Dump to array User the elements set
    public function toArray() {
        $records = array();
        foreach( $this as $key => $value ) {
                if (isset($value)) {
                  $records[$key] = $value;
                }
        }
        
        return $records;
    }
    //Dump to array User the elements defined in the class
    public function toArrayAll() {
        $records = array();
        foreach( $this as $key => $value ) {
                  $records[$key] =  $value;
        }        
        return $records;
    }
    
    //Gets all the values from the array and updates the user with contents
    public function fromArray($row_array) {
        foreach( $row_array as $key => $value ) {
                  Log::i("fromArray", "Setting " . $key . " to " . strval($value));
                  $this->$key = $value;
        }  
    }
    
    //Gets all the fields in a SQL format, we need notifications.user_id...
    function getFieldsAll() {
        return Database::convertArrayToFields($this->toArrayAll());
    }
    
    
    
    //Gets all the fields in a SQL format
    function getFields() {
        return Database::convertArrayToFields($this->toArray());
    }
    
    //Gets all the fields in a SQL format
    function getValues() {
        return Database::convertArrayToValues($this->toArray());
    }
    
    
    //Print current user content for debug
    function printMe($msg) {
        $records = $this->toArray();
        Log::i("USER::printMe", "--------------------");
        Log::i("USER::printMe", "--" . $msg);
        Log::i("USER::printMe", "--------------------");
        foreach ($records as $key => $value) {
                Log::i("USER::printMe", "$key : $value");
        }
        Log::i("USER::printMe", "--------------------");
    }
    
    //Encodes the notification in a JsonResponseNotifications
    function getJson() {
        $this->printMe("Before dumping json");
        $json = new JsonResponseStations();
        //We encode the object as a string and we remove any nulls !
	$myJsonString = json_encode($this,JSON_UNESCAPED_UNICODE);
	$myJsonString = preg_replace('/,\s*"[^"]+":null|"[^"]+":null,?/', '', $myJsonString);
	$json->stations = $myJsonString;
        return $json;
    }
}
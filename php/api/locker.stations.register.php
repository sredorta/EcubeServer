<?php

include ("../constants/constants.general.php");

$myStation = new Station();
/*    public $station_id;               
    public $name;
    public $latitude;
    public $longitude;
    public $timestamp;*/


if (isset($_POST['name'])) {
   $myStation->name = $_POST['name'];
}  
if (isset($_POST['longitude'])) {
   $myStation->longitude = $_POST['longitude'];
}   
if (isset($_POST['latitude'])) {
   $myStation->latitude = $_POST['latitude'];
}   

$myStation->timestamp = time();

if (isset($_POST['table_stations'])) {
   $myTable = $_POST['table_stations'];
}   



$myStation->name = "station88";
$myStation->longitude = "7.1";
$myStation->latitude = "43.6";
        
$myTable = "stations";


//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

if ($myDb->existsElement($myTable, "name = '" . $myStation->name . "'") == true) {
    //Station already registered so only update location/timestamp
    //$myStation->station_id = $myDb->getRow($myTable, "station_id", "name = '" . $myStation->name . "'")['station_id'];
    //Log::i("TEST","Station id is : " . $myStation->station_id);
    $myDb->updateField($myTable, "longitude", $myStation->longitude, "name = '" . $myStation->name . "'");
    $myDb->updateField($myTable, "latitude", $myStation->latitude, "name = '" . $myStation->name . "'");
    $myDb->updateField($myTable, "timestamp", time(), "name = '" . $myStation->name . "'");
    $json = new JsonResponse();
    $json->result = KEY_CODE_SUCCESS;
    $json->message = "Station registered";
    $json->output();
} else {
    $myStation->timestamp = time();
    $myDb->addElement($myTable,'(' . $myStation->getFields() . ')', $myStation->getvalues());
    //New station so it needs to be registered
    $json = new JsonResponse();
    $json->result = KEY_CODE_SUCCESS;
    $json->message = "Station registered";
    $json->output();
}



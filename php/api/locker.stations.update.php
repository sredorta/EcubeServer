
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

$myStation->timestamp = time();

if (isset($_POST['table_stations'])) {
   $myTable = $_POST['table_stations'];
}   

        
$myTable = "stations";


//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

if ($myDb->existsElement($myTable, "name = '" . $myStation->name . "'") == true) {
    $myDb->updateField($myTable, "timestamp", time(), "name = '" . $myStation->name . "'");
    $json = new JsonResponse();
    $json->result = KEY_CODE_SUCCESS;
    $json->message = "TimeStamp updated";
    $json->output();
} else {
   //New station so it needs to be registered
    $json = new JsonResponse();
    $json->result = KEY_CODE_ERROR_UNKNOWN;
    $json->message = "Station not found !";
    $json->output();
}



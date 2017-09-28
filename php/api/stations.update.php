<?php
include ("../constants/constants.general.php");

 
//Get the fields from the notification object
$myStation = new Station();

if (isset($_POST['station_id'])) {
   $myStation->station_id = $_POST['station_id'];
}  
if (isset($_POST['action'])) {
   $myStation->action = $_POST['action'];
}  

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myDb->updateField(DB_TABLE_STATIONS, "action", $myStation->action, "station_id='$myStation->station_id'");


$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS;
$json->message = "updated";
$json->output();


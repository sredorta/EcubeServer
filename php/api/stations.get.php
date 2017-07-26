<?php
include ("../constants/constants.general.php");

$myUser = new User(); 


//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message


//Get the fields from the notification object
$myStation = new Station();

//Now that we have the id of the user we find the notifications of the user
$sql = "SELECT " . $myStation->getFieldsAll() ." FROM " . DB_TABLE_STATIONS . " WHERE 1 ";
$result = $myDb->get($sql);
$myStationsList = array();
foreach ($result as $row) {
    $station = new Station();   
    $station->fromArray($row);
    array_push($myStationsList,$station); //Add each station object into the List
}
$json = new JsonResponseStations();
$myJsonString = json_encode($myStationsList,JSON_UNESCAPED_UNICODE);
$myJsonString = preg_replace('/,\s*"[^"]+":null|"[^"]+":null,?/', '', $myJsonString);
$json->stations = $myJsonString;
$json->result = KEY_CODE_SUCCESS; 
$json->output();



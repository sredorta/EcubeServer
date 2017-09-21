<?php
include ("../constants/constants.general.php");


$myNotif = new Notification();
 
if (isset($_POST['message'])) {
    $myNotif->message = $_POST['message'];
} 

if (isset($_POST['visited'])) {
    $myNotif->visited = $_POST['visited'];
} 
if (isset($_POST['timestamp'])) {
    $myNotif->timestamp = $_POST['timestamp'];
} 

//Debug
//$myNotif->user_id = 177;
//$myNotif->visited = 0;
//$myNotif->message = "test test test";
//$myNotif->timestamp = 5000;

//Check if we have a session as required
session_start();

//Get the userID from the session if available
if (!isset($_SESSION['user_id'])) {
    $json = new JsonResponse();
    $json->result = KEY_CODE_ERROR_SESSION_INVALID;
    $json->output();
    exit();
}
$myNotif->user_id = $_SESSION['user_id'];
//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message


$myDb->addElement(DB_TABLE_NOTIFICATIONS, '(' . $myNotif->getFields() . ')', $myNotif->getvalues());

$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS; 
$json->message = "id: " . $myNotif->user_id . " visited: " . $myNotif->visited . " message: " . $myNotif->message . " timestamp: " . $myNotif->timestamp . " from: " . $myNotif->from  ;
$json->output();


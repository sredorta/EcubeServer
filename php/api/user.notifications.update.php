<?php
include ("../constants/constants.general.php");



$myNotif = new Notification();
if (isset($_POST['notification_id'])) {
    $myNotif->notification_id = $_POST['notification_id'];
}     
if (isset($_POST['user_id'])) {
    $myNotif->user_id = $_POST['user_id'];
} 
if (isset($_POST['message'])) {
    $myNotif->message = $_POST['message'];
} 
if (isset($_POST['from'])) {
    $myNotif->from = $_POST['from'];
} 
if (isset($_POST['visited'])) {
    $myNotif->visited = $_POST['visited'];
} 
if (isset($_POST['timestamp'])) {
    $myNotif->timestamp = $_POST['timestamp'];
} 

//Debug
/*$myNotif->user_id = 177;
$myNotif->notification_id = 1;
$myNotif->visited = 1;
$myNotif->timestamp = 5000;*/

//Check if we have a session as required
session_start();

//Get the userID from the session if available
if (!isset($_SESSION['user_id'])) {
    $json = new JsonResponse();
    $json->result = KEY_CODE_ERROR_SESSION_INVALID;
    $json->output();
}

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myDb->updateField(DB_TABLE_NOTIFICATIONS, "visited", $myNotif->visited, "notification_id='$myNotif->notification_id' AND user_id='$myNotif->user_id'");
$myDb->updateField(DB_TABLE_NOTIFICATIONS, "timestamp", $myNotif->timestamp, "notification_id='$myNotif->notification_id' AND user_id='$myNotif->user_id'");

$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS; 
$json->message = "Updated visisted to : " . $myNotif->visited . " and timestamp to : " . $myNotif->timestamp ;
$json->output();




<?php
include ("../constants/constants.general.php");

$myUser = new User(); 

//Check if we have a session as required
session_start();

//Get the userID from the session if available
if (!isset($_SESSION['user_id'])) {
    $json = new JsonResponseAccount();
    $json->result = KEY_CODE_ERROR_SESSION_INVALID;
    $json->output();
}

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myUser->id = $_SESSION['user_id'];
if (!$myUser->dB_exists()) {      
        $json = new JsonResponse();
        $json->result = KEY_CODE_ERROR_USER_NOT_EXISTS;
        $json->output();
        exit();
}
$myUser->timestamp = $myUser->dB_getField("timestamp");
$myUser->id = "";
$json = $myUser->getJson();
$json->result = KEY_CODE_SUCCESS; 
$json->output();
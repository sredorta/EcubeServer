<?php
include ("../constants/constants.general.php");

$myUser = new User(); 
//Get all values from POST arguments
$myUser->initFromPOST();
//For debug


//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myUser->login_timestamp = time();
$myUser->printMe("After restoring from post:"); //Only for debug


if (!$myUser->dB_exists()) {
    $json = new JsonResponse();
    $json->result = KEY_CODE_ERROR_USER_NOT_EXISTS;
    $json->output();
}
//Get the userID from the Email of the login
$myUser->id = $myUser->dB_getId();

//Check if entered password matches with db
if ($myUser->password != $myUser->dB_getField("password")) {
    $json = new JsonResponse();
    $json->result = KEY_CODE_ERROR_INVALID_PASSWORD;
    $json->output();
}


//Set the session duration depending on the keep
if (isset($_POST['keep'])) {
    $keepSession = filter_var($_POST['keep'], FILTER_VALIDATE_BOOLEAN);
} else {
    $keepSession = false;
}
if ($keepSession == "1") {
    $sessionDuration = SESSION_DURATION_LONG; //Set 1 year of duration
} else {
    $sessionDuration = SESSION_DURATION_SHORT;    //Set 1 hour of duration of the session
}
// server should keep session data for AT LEAST 1 hour
ini_set('session.gc_maxlifetime', $sessionDuration);
// each client should remember their session id for EXACTLY 1 hour
session_set_cookie_params($sessionDuration);


//We start a new session
session_start();
$_SESSION['user_id'] = $myUser->id; //Store user in the session

//The sessionID is sent through cookie automatically
$resultUser = new User();
$resultUser->session_id = "";
$json = $resultUser->getJson();
$json->result = KEY_CODE_SUCCESS; 
$json->message = "User in session is: " . $_SESSION['user_id'];
$json->output();


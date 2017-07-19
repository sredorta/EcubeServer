<?php
include ("../constants/constants.general.php");


//Reload the session
session_start();

//Log::i("SESSION", "Restored session for id: " . $_SESSION['user_id']);

//Get the userID from the session if available
if (!isset($_SESSION['user_id'])) {
    $json = new JsonResponseAccount();
    $json->result = KEY_CODE_ERROR_SESSION_INVALID;
    $json->output();
    exit();
}

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myUser = new User(); 
$myUser->id = $_SESSION['user_id'];
$myUser->dB_get();
//$myUser->printMe("test");
Log::i("USER_RESTORE::", "Restored user with email: " . $myUser->email);
if ($myUser->avatar!= "default") {
    $myUser->avatar = file_get_contents("../data/profile_img/profile_picture_" . $myUser->id);
} else {
    $img_file = "../data/app_img/profile_user_default.png";
    $imgData = base64_encode(file_get_contents($img_file));
    $myUser->avatar = 'data: ' . mime_content_type($img_file) . ';base64,'. $imgData;
    
}


//Now we just need to hide the elements that we don't want to give to client
$myUser->id="";
$myUser->password="";
$myUser->session_id="";
$json = $myUser->getJson();
$json->result = KEY_CODE_SUCCESS; 
$json->output();

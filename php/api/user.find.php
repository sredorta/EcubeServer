<?php
include ("../constants/constants.general.php");

$myUser = new User(); 
$myUser->initFromPOST();

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

if ($myUser->dB_exists() == false) {
    $json = new JsonResponseAccount();
    $json->result = KEY_CODE_ERROR_USER_NOT_EXISTS;
    $json->output();
    exit;
}
$myUser->id = $myUser->dB_getId();
$myUser->dB_get();
Log::i("USER_RESTORE::", "Restored user with email: " . $myUser->email);
if ($myUser->avatar!= "default") {
    $myUser->avatar = file_get_contents("../data/profile_img/profile_picture_" . $myUser->id);
} else {
    $img_file = "../data/app_img/profile_user_default.png";
    $imgData = base64_encode(file_get_contents($img_file));
    $myUser->avatar = 'data: ' . mime_content_type($img_file) . ';base64,'. $imgData;
}

$myTmpUser = new User();
$myTmpUser->firstName = $myUser->firstName;
$myTmpUser->lastName = $myUser->lastName;
$myTmpUser->email = $myUser->email;
$myTmpUser->avatar = $myUser->avatar;
$myTmpUser->creation_timestamp = $myUser->creation_timestamp;

$json = $myTmpUser->getJson();
$json->result = KEY_CODE_SUCCESS; 
$json->output();

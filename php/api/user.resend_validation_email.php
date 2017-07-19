<?php
include ("../constants/constants.general.php");

$myUser = new User(); 

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

session_start();

Log::i("SESSION", "Restored session for id: " . $_SESSION['user_id']);

//Get the userID from the session if available
if (!isset($_SESSION['user_id'])) {
    $json = new JsonResponseAccount();
    $json->result = KEY_CODE_ERROR_SESSION_INVALID;
    $json->output();
}

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myUser = new User(); 
$myUser->id = $_SESSION['user_id'];
$myUser->dB_get();
new i18n($myUser->language);
$url = URL_BASE . "user.validate.php?id=" . $myUser->id . "&validation_key=" . $myUser->dB_getField("email_validation_key");
$linkRequest = "<a href='" . $url . "'>" . STRING_EMAIL_CLICK . "</a>";
//Send email with validation key
$email = new Email();
$email->to = $myUser->email;
$email->subject = STRING_EMAIL_VALIDATION_SUBJECT;
$email->body = sprintf(STRING_EMAIL_VALIDATION_BODY, $linkRequest);
$email->title = STRING_EMAIL_VALIDATION_TITLE;

$email->send();    //Only send email if we are not on localhost    
$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS;
$json->output();

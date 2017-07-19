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
$myUser->language =$myUser->dB_getField("language");
new i18n($myUser->language);
//Generate random password
$pwd = Encryption::random_str(8);
$myUser->new_password = sha1($pwd); //We need to save it encrypted
$json = new JsonResponseAccount();
//Do the update of the password in the db
if ($myUser->dB_updateField('password', $myUser->new_password) == true) {
    $json = new JsonResponse(); 
    $json->result = KEY_CODE_SUCCESS;  
    //Send the email with new password (not encrypted !)        
    $email = new Email();
    $email->to = $myUser->email;
    $email->subject = STRING_EMAIL_RESET_PASSWORD_SUBJECT;
    $email->body = sprintf(STRING_EMAIL_RESET_PASSWORD_BODY, $pwd);
    $email->title = STRING_EMAIL_RESET_PASSWORD_TITLE;
    $email->send();    //Only send email if we are not on localhost
} else {
       $json->result = KEY_CODE_ERROR_UPDATE_FIELD;   
}
$json->output();

<?php
include ("../constants/constants.general.php");

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myUser = new User(); 
$myUser->id = "116";

$myUser->dB_get();

$email_validation_key = $myUser->dB_getField("email_validation_key");


new i18n($myUser->language); // Load language strings
$url = URL_BASE . "user.validate.php?id=" . $myUser->id . "&validation_key=" . $email_validation_key;
$linkRequest = "<a href='" . $url . "'>" . STRING_EMAIL_CLICK . "</a>";
//Send email with validation key
$email = new Email();
$email->to = $myUser->email;
$email->subject = STRING_EMAIL_VALIDATION_SUBJECT;
$email->body = sprintf(STRING_EMAIL_VALIDATION_BODY, $linkRequest);
$email->title = STRING_EMAIL_VALIDATION_TITLE;

$email->send();   //Only send email if we are not on localhost    


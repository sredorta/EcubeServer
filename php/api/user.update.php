<?php
include ("../constants/constants.general.php");

$myUser = new User(); 
$myUser->initFromPOST();
if (isset($_POST['new_password'])) {    
   $passwordToUpdate = $_POST['new_password'];
   if ($passwordToUpdate != "") {$passwordToUpdate = sha1($passwordToUpdate);}
} else {
    $passwordToUpdate = "";
}

$myCurrentUser = new User(); // it stores what we have on the dB now


//Check if we have a session as required
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

$myCurrentUser->id = $_SESSION['user_id'];
if (!$myCurrentUser->dB_exists()) {      
        $json = new JsonResponse();
        $json->result = KEY_CODE_ERROR_USER_NOT_EXISTS;
        $json->output();
        exit();
}
$myCurrentUser->dB_get();


//Update non empty fields of the current user with the inputs
if ($myUser->firstName!= "") {
    $myCurrentUser->dB_updateField("firstName", $myUser->firstName);
}
if ($myUser->lastName!= "") {
    $myCurrentUser->dB_updateField("lastName", $myUser->lastName);
}
if ($myUser->email!= "") {
    if ($myUser->dB_exists()) {

        $json = new JsonResponse();
        $json->result = KEY_CODE_ERROR_USER_EMAIL_USED; 
        $json->output();
        exit();
    }
    $myCurrentUser->dB_updateField("email", $myUser->email);
    //Now we need to set isValidated to false and resend validation email
    
    //Generate a validation key and store in dB
    $email_validation_key = Encryption::random_str(15);
    $myCurrentUser->dB_updateField("email_validation_key", $email_validation_key);
    
    $myCurrentUser->dB_updateField("validated_email", 0);
    new i18n($myCurrentUser->language);
    $url = URL_BASE . "user.validate.php?id=" . $myCurrentUser->id . "&validation_key=" . $email_validation_key;
    $linkRequest = "<a href='" . $url . "'>" . STRING_EMAIL_CLICK . "</a>";
    //Send email with validation key
    $email = new Email();
    $email->to = $myUser->email;
    $email->subject = STRING_EMAIL_VALIDATION_SUBJECT;
    $email->body = sprintf(STRING_EMAIL_VALIDATION_BODY, $linkRequest);
    $email->title = STRING_EMAIL_VALIDATION_TITLE;
    $email->send(); 
    $json = new JsonResponse();
    $json->result = KEY_CODE_SUCCESS;     
    $json->output();

}
if ($myUser->avatar!= "") {
    $myCurrentUser->dB_addAvatar($myUser->avatar);
    $userSend = new User();
    $userSend->avatar_timestamp = $myCurrentUser->dB_getField("avatar_timestamp");            
    $json = $userSend->getJson();
    $json->result = KEY_CODE_SUCCESS;     
    $json->output();
    exit();
}

if ($myUser->phone!= "") {
    if ($myUser->dB_exists()) {
        $json = new JsonResponse();
        $json->result = KEY_CODE_ERROR_USER_PHONE_USED; 
        $json->output();
        exit();
    }
    $myCurrentUser->dB_updateField("phone", $myUser->phone);
    $json = new JsonResponse();
    $json->result = KEY_CODE_SUCCESS;     
    $json->output();
}

if ($myUser->latitude!= "") {
    if ($myUser->dB_exists()) {
        $json = new JsonResponse();
        $json->result = KEY_CODE_ERROR_USER_PHONE_USED; 
        $json->output();
        exit();
    }
    $myCurrentUser->dB_updateField("latitude", $myUser->latitude);
    $myCurrentUser->dB_updateField("longitude", $myUser->longitude);
    $json = new JsonResponse();
    $json->result = KEY_CODE_SUCCESS;     
    $json->output();
}
//Handle prefs update
if ($myUser->Pref_useHome!= "") {
    $myCurrentUser->dB_updateField("Pref_useHome", $myUser->Pref_useHome);
}

if ($myUser->Pref_sendNotifEmail!= "") {
    $myCurrentUser->dB_updateField("Pref_sendNotifEmail", $myUser->Pref_sendNotifEmail);
}

if ($myUser->Pref_zoomValue!= "") {
    $myCurrentUser->dB_updateField("Pref_zoomValue", $myUser->Pref_zoomValue);
}
if ($myUser->Pref_sendNotifEmail != "" || $myUser->Pref_useHome != "" || $myUser->Pref_zoomValue != "") {
    $json = new JsonResponse();
    $json->result = KEY_CODE_SUCCESS;     
    $json->output();
}



if ($passwordToUpdate != "") {
    if ($myUser->password != $myCurrentUser->dB_getField("password")) {
        $json = new JsonResponse();
        $json->result = KEY_CODE_ERROR_INVALID_PASSWORD; 
        $json->message = "USER PASS: " . $myUser->password . " TO UPDATE : " . $passwordToUpdate;
        $json->output();
        exit();
    } else {
        $myCurrentUser->dB_updateField("password", $passwordToUpdate);
        $json = new JsonResponse();
        $json->result = KEY_CODE_SUCCESS;     
        $json->output();
        exit();
    }    
}
//If we reach this point nothing has been updated
$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS;     
$json->output();

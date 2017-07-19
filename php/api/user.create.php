<?php
include ("../constants/constants.general.php");

$myUser = new User(); 
//Get all values from POST arguments
$myUser->initFromPOST();
//For debug
/*
$myUser->firstName= "Sergi";
$myUser->lastName= "Redorta";
$myUser->email= "ser.red@hot.com";
$myUser->phone= "+33623133212";
$myUser->password= "Secure=;";
$myUser->language= "eng";
$myUser->country= "FR";
$myUser->latitude= "40.33";
$myUser->longitude= "50.33";
$myUser->avatar="base64:this is a test";
$myUser->printMe("Restored from post user:");
*/

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message


$myUser->creation_timestamp = time();
$myUser->login_timestamp = time();
$myUser->validated_email = "0";
$myUser->validated_phone = "0";
$myUser->printMe("After restoring from post:"); //Only for debug
$avatar = $myUser->avatar;
$myUser->avatar="";
$myUser->dB_add();
$myUser->db_addAvatar($avatar);

//Generate a validation key and store in dB
$email_validation_key = $pwd = Encryption::random_str(15);
$myUser->dB_updateField("email_validation_key", $email_validation_key);

$phone_validation_key = $pwd = Encryption::random_int(4);
$myUser->dB_updateField("phone_validation_key", $phone_validation_key);

$myUser->id = $myUser->dB_getId();

//close any existing session before

//Set the session duration depending on the user.keep
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

session_start();
$sid = session_id();

//Create a session and store the token
//session_id($sid);
//session_start();
//$sid = session_id();
$_SESSION['user_id'] = $myUser->id;
$myUser->dB_updateField("session_id", $sid);
//Now get the ID of the new user and output a json with it as result
$resultUser = new User();

//$resultUser->session_id = "";
$json = $resultUser->getJson();
$json->result = KEY_CODE_SUCCESS; 

//Generate the PHP request of the validation
new i18n($myUser->language); // Load language strings
$url = URL_BASE . "user.validate.php?id=" . $myUser->id . "&validation_key=" . $email_validation_key;
$linkRequest = "<a href='" . $url . "'>" . STRING_EMAIL_CLICK . "</a>";
//Send email with validation key
$email = new Email();
$email->to = $myUser->email;
$email->subject = STRING_EMAIL_VALIDATION_SUBJECT;
$email->body = sprintf(STRING_EMAIL_VALIDATION_BODY, $linkRequest);
$email->title = STRING_EMAIL_VALIDATION_TITLE;

$email->send();     

$json->output();

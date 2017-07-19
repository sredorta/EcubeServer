<?php
include ("../constants/constants.general.php");


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

$myUser = new User(); 
$myUser->id = $_SESSION['user_id'];
if (!$myUser->dB_exists()) {
    $json = new JsonResponse();
    $json->result = KEY_CODE_ERROR_USER_NOT_EXISTS; 
    $json->output();
}
//Now remove all data associated with the user
if (file_exists("../data/profile_img/profile_picture_" . $myUser->id)) {
    unlink("../data/profile_img/profile_picture_" . $myUser->id);
}

//Remove all cookies
if (isset($_SERVER['HTTP_COOKIE'])) {
    $cookies = explode(';', $_SERVER['HTTP_COOKIE']);
    foreach($cookies as $cookie) {
        $parts = explode('=', $cookie);
        $name = trim($parts[0]);
        $params = session_get_cookie_params();
        setcookie($name, '', 0, $params['path'], $params['domain'], $params['secure'], isset($params['httponly']));
    }
}
session_destroy();
$myUser->dB_remove();

$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS;
$json->output();
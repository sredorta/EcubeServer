<?php
include ("../constants/constants.general.php");

//Reload the session
session_start();

//Log::i("SESSION", "Restored session for id: " . $_SESSION['user_id']);

//Get the userID from the session if available
if (!isset($_SESSION['user_id'])) {
    if (isset($_SERVER['HTTP_COOKIE'])) {
    $cookies = explode(';', $_SERVER['HTTP_COOKIE']);
    foreach($cookies as $cookie) {
//        echo $cookie .'\n';
        $parts = explode('=', $cookie);
        $name = trim($parts[0]);
//        echo 'Erased cookie: ' . $name;
        $params = session_get_cookie_params();
        if ($name === "PHPSESSID") {
            setcookie($name, '', 0, $params['path'], $params['domain'], $params['secure'], isset($params['httponly']));
        }
    }
    }
    //Destroy the session
    if (isset($_SESSION)) {
    session_destroy();
    }    
    $json = new JsonResponseAccount();
    $json->result = KEY_CODE_ERROR_SESSION_INVALID;
    $json->output();
    exit();
} else  {
    $json = new JsonResponseAccount();
    $json->result = KEY_CODE_SUCCESS;
    $json->output();
    exit();
}

<?php
// Destroy the session by removing all cookies
include ("../constants/constants.general.php");

// Expire all of the user's cookies for this domain:
// give them a blank value and set them to expire
// in the past
session_start();
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

$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS;
$json->output();
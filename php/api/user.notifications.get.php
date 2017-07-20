<?php
include ("../constants/constants.general.php");

$myUser = new User(); 
$myUser->initFromPOST();

$myUser->email = "sergi.redorta@hotmail.com";
//We need to get id from session !!!!!!!!!!!!!!!!!!!!!!!!!!!!! this is only for debug !!!!!!!!!!!!!!!!

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

//Get the fields from the notification object
$myNotif = new Notification();

//Now that we have the id of the user we find the notifications of the user
$sql = "SELECT " . $myNotif->getFieldsAll() ." FROM users JOIN notifications ON users.id = notifications.user_id WHERE users.id = 177";
$result = $myDb->get($sql);
$myNotificationsList = array();
foreach ($result as $row) {
    $notif = new Notification();   
    $notif->fromArray($row);
    array_push($myNotificationsList,$notif); //Add each notification object into the List
}
$json = new JsonResponseNotifications();
$myJsonString = json_encode($myNotificationsList,JSON_UNESCAPED_UNICODE);
$myJsonString = preg_replace('/,\s*"[^"]+":null|"[^"]+":null,?/', '', $myJsonString);
$json->notifications = $myJsonString;
$json->result = KEY_CODE_SUCCESS; 
$json->output();


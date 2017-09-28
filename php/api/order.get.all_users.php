<?php
include ("../constants/constants.general.php");

$myUser = new User(); 

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message


//Get the fields from the notification object
$myOrder = new Order();

//Now that we have the id of the user we find the notifications of the user
$sql = "SELECT " . $myOrder->getFieldsAll() ." FROM orders WHERE 1";
$result = $myDb->get($sql);
$myOrderList = array();
foreach ($result as $row) {
    $order = new Order();   
    $order->fromArray($row);
    array_push($myOrderList,$order); //Add each notification object into the List
}
$json = new JsonResponseOrders();
$myJsonString = json_encode($myOrderList,JSON_UNESCAPED_UNICODE);
$myJsonString = preg_replace('/,\s*"[^"]+":null|"[^"]+":null,?/', '', $myJsonString);
$json->orders = $myJsonString;
$json->result = KEY_CODE_SUCCESS; 
$json->output();


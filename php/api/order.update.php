<?php
include ("../constants/constants.general.php");

$myOrder = new Order();
if (isset($_POST['order_id'])) {
   $myOrder->order_id = $_POST['order_id'];
}     
if (isset($_POST['locker'])) {
   $myOrder->locker = $_POST['locker'];
}    
if (isset($_POST['status'])) {
   $myOrder->status = $_POST['status'];
} 


/*
$myOrder->order_id= 40;
$myOrder->status = test;
$myOrder->locker = 5;
*/

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myDb->updateField(DB_TABLE_ORDERS, "status", $myOrder->status, "order_id='$myOrder->order_id'");
$myDb->updateField(DB_TABLE_ORDERS, "locker", $myOrder->locker, "order_id='$myOrder->order_id'");


$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS;
$json->message = "updated";
$json->output();
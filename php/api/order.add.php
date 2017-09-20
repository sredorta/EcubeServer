<?php
include ("../constants/constants.general.php");

$myOrder = new Order();
if (isset($_POST['station_id'])) {
   $myOrder->station_id = $_POST['station_id'];
}     
if (isset($_POST['user_id'])) {
   $myOrder->user_id = $_POST['user_id'];
}    
if (isset($_POST['total'])) {
   $myOrder->total = $_POST['total'];
}
if (isset($_POST['status'])) {
   $myOrder->status = $_POST['status'];
} 


/*
$myOrder->station_id = 8;
$myOrder->user_id = 177;
$myOrder->total = 10;
$myOrder->status = "test";
*/

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myId = $myDb->addElement(DB_TABLE_ORDERS, '(' . $myOrder->getFields() . ')', $myOrder->getvalues()); 
//Need to get product Id we have inserted
Log::i("ORDER ADD", "Inserted id is : " . $myId);


$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS;
$json->message = $myId;
$json->output();
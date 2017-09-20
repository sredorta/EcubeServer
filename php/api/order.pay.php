<?php
include ("../constants/constants.general.php");

$myOrder = new Order();
if (isset($_POST['order_id'])) {
   $myOrderId = $_POST['order_id'];
}     

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myId = $myDb->updateField(DB_TABLE_ORDERS, "status", "payed", "order_id =" . $myOrderId);
//Need to get product Id we have inserted
Log::i("ORDER Remove", "Removed id is : " . $myOrderId);

$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS;
$json->message = "removed";
$json->output();
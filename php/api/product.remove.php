<?php
include ("../constants/constants.general.php");

$myProduct = new Product();
if (isset($_POST['product_id'])) {
   $myProductId = $_POST['product_id'];
}     

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myId = $myDb->removeRow(DB_TABLE_PRODUCTS, "product_id =" . $myProductId);
//Need to get product Id we have inserted
Log::i("PRODUCT Remove", "Removed id is : " . $myProductId);

$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS;
$json->message = "removed";
$json->output();
<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include ("../constants/constants.general.php");
$myOrder = new OrderDetails();
if (isset($_POST['order_id'])) {
   $myOrder->order_id = $_POST['order_id'];
}     
if (isset($_POST['product_id'])) {
   $myOrder->product_id = $_POST['product_id'];
}    
if (isset($_POST['product_count'])) {
   $myOrder->product_count = $_POST['product_count'];
}


/*
$myOrder->order_id = 6;
$myOrder->product_id = 36;
$myOrder->product_count = 10;
*/

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myId = $myDb->addElement(DB_TABLE_ORDER_DETAILS, '(' . $myOrder->getFields() . ')', $myOrder->getvalues()); 
//Need to get product Id we have inserted
Log::i("ORDER ADD", "Inserted id is : " . $myId);


$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS;
$json->message = $myId;
$json->output();
<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include ("../constants/constants.general.php");
//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message


$myOrder = new OrderDetails();
if (isset($_POST['order_id'])) {
   $myOrder->order_id = $_POST['order_id'];
}     

//$myOrder->order_id = 12;
$myDetails = new OrderDetails();


$sql = "SELECT order_details.product_count,products.description, products.price, products.picture FROM order_details JOIN products ON order_details.product_id = products.product_id  WHERE order_details.order_id = " . $myOrder->order_id;
//        . "JOIN products ON order_details.product_id = products.product_id WHERE orders.order_id = " . $myOrder->order_id;
$result = $myDb->get($sql);
$myOrderDetailsList = array();
foreach ($result as $row) {
    /*Log::i("ORDER DETAILS", "Row is : " . $row);*/
    $myRow = new OrderResult();   
    $myRow->fromArray($row);
    array_push($myOrderDetailsList,$myRow); //Add each notification object into the List*/
}
$json = new JsonResponseOrderDetails();
$myJsonString = json_encode($myOrderDetailsList,JSON_UNESCAPED_UNICODE);
$myJsonString = preg_replace('/,\s*"[^"]+":null|"[^"]+":null,?/', '', $myJsonString);
$json->orderDetails = $myJsonString;
$json->result = KEY_CODE_SUCCESS; 
$json->output();
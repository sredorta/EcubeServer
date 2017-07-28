<?php
include ("../constants/constants.general.php");

$myProduct = new Product();
if (isset($_POST['description'])) {
   $myProduct->description = $_POST['description'];
}     
if (isset($_POST['picture'])) {
   $myProduct->picture = $_POST['picture'];
}    
if (isset($_POST['price'])) {
   $myProduct->price = $_POST['price'];
}    
if (isset($_POST['keywords'])) {
   $myProduct->keywords = $_POST['keywords'];
} 
if (isset($_POST['selectedStations'])) {
   $selectedStations = $_POST['selectedStations'];
} 

/*
$myProduct->description = "toto";
$myProduct->picture = "my picture";
$myProduct->price = 10;
$myProduct->keywords = "aa";
$selectedStations = "1 2 3";
*/

$myStations = explode(" ", $selectedStations);

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myId = $myDb->addElement(DB_TABLE_PRODUCTS, '(' . $myProduct->getFields() . ')', $myProduct->getvalues());
//Need to get product Id we have inserted
Log::i("PRODUCT ADD", "Inserted id is : " . $myId);

//Now insert into table product_station_map the selected stations
foreach( $myStations as $key => $value ) {
     Log::i("PRODUCT ADD", "Adding following element: product_id=" . $myId . " station_id=" . $value);
     $myDb->addElement(DB_TABLE_PRODUCT_STATION_MAP, '(product_id,station_id)', '("' . $myId . '","' . $value .'")');
}  


$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS;
$json->message = $myProduct->description;
$json->output();
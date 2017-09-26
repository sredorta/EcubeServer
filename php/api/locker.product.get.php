<?php
include ("../constants/constants.general.php");

if (isset($_POST['name'])) {
   $myStationName = $_POST['name'];
} 


$myProduct = new Product(); 
$myTable = "stations";
//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message


//Get the station id from the name and then dump all images of products
$station_id = $myDb->getRow($myTable, "station_id", "name = '" . $myStationName . "'")['station_id'];
Log::i("TEST","Station id is : " . $station_id);
$where = "station_id = '" . $station_id . "'";

$sql = "SELECT products.product_id, products.description, products.picture, products.price, products.keywords FROM products JOIN product_station_map ON products.product_id = product_station_map.product_id WHERE " . $where . " GROUP BY product_station_map.product_id";
//Now that we have the id of the user we find the notifications of the user
//$sql = "SELECT ( . $my FROM users JOIN notifications ON users.id = notifications.user_id WHERE users.id = " . $myUser->id;
$result = $myDb->get($sql);
$myProductsList = array();
foreach ($result as $row) {
    $prod = new Product();   
    $prod->fromArray($row);
    array_push($myProductsList,$prod); //Add each notification object into the List
}
$json = new JsonResponseProducts();
$myJsonString = json_encode($myProductsList,JSON_UNESCAPED_UNICODE);
$myJsonString = preg_replace('/,\s*"[^"]+":null|"[^"]+":null,?/', '', $myJsonString);
$json->products = $myJsonString;
$json->result = KEY_CODE_SUCCESS;
$json->output();



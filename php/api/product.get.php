<?php
include ("../constants/constants.general.php");

if (isset($_POST['selectedStations'])) {
   $selectedStations = $_POST['selectedStations'];
} else {
    $selectedStations = "";
}
if (isset($_POST['keywords'])) {
   $keywords = $_POST['keywords'];
}  else {
    $keywords = "";
}

//Debug
//$selectedStations = "2";
//$keywords = "kk";


$myProduct = new Product(); 

//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message

$myKeywords = explode(" ", $keywords);
$myStations = explode(" ", $selectedStations);

//Now insert into table product_station_map the selected stations
$where = "";
foreach( $myStations as $key => $value ) {
     if ($where == "") {
         $where = " station_id=". $value;
     } else {    
        $where = $where . " OR station_id=". $value;
     }
}  

if ($where == " station_id=") {
    $where = "1";
} else {
    $where = "(" . $where . ")";
}    

$like = "";
foreach( $myKeywords as $key => $value ) {
    if ($like == "") {
        $like = 'products.keywords LIKE "%'. $value . '%"';
    } else {
        $like = $like . ' OR products.keywords LIKE "%'. $value . '%"';
    }
}  
if ($like != "") {
    $where = $where . ' AND (' . $like . ')';
} 


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



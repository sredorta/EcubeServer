<?php
////////////////////////////////////////////////////////////////////////////////
//  File: class.json.php
//  Description:
//      Json classes for serialization/desserialization
////////////////////////////////////////////////////////////////////////////////


Log::i(basename(__FILE__), "Loading include file..."); //Show that we have loaded the file
class JsonResponse {

    public $result = KEY_CODE_ERROR_UNKNOWN;
    public $message = "";
    
    function __construct() {}
    
    function setResult($con) {
        if (mysqli_errno($con)) {
            $this->result = KEY_CODE_ERROR_DATABASE;
	} elseif (mysqli_connect_errno($con)) {
            $this->result = KEY_CODE_ERROR_CONNECTION_ERROR;
	} else {
            $this->result = KEY_CODE_SUCCESS;
	}
    }
    
    
    //Outputs the object in json format encrypted or not
    function output() {
	if (!DEBUG_ENABLED) header('Content-Type: application/json');
 /*       if (ENCRYPT_ENABLED) {
            Log::i("ENCRYPT", "Output json encrypted:");
            $data = json_encode($this,JSON_UNESCAPED_UNICODE);
            $data = preg_replace('/,\s*"[^"]+":null|"[^"]+":null,?/', '', $data);
            $myCipher = new Encryption();
            $data_encr = $myCipher->encrypt($data);
            echo ($data_encr);
        } else {*/
            $data = json_encode($this,JSON_UNESCAPED_UNICODE);
            $data = preg_replace('/,\s*"[^"]+":null|"[^"]+":null,?/', '', $data);
            $data = json_encode($this, JSON_PRETTY_PRINT);
            echo($data);
            exit();
//        }
    }
}

class JsonResponseAccount extends JsonResponse {
    //We add account that is an object with all the fileds of a user class
    public $account;

}
class JsonResponseNotifications extends JsonResponse {
    //We add account that is an object with all the fileds of a user class
    public $notifications;
}
class JsonResponseOrders extends JsonResponse {
    //We add account that is an object with all the fileds of a user class
    public $orders;
}
class JsonResponseOrderDetails extends JsonResponse {
    //We add account that is an object with all the fileds of a user class
    public $orderDetails;
}


class JsonResponseStations extends JsonResponse {
    //We add account that is an object with all the fileds of a user class
    public $stations;
}

class JsonResponseStationStatus extends JsonResponse {
    //We add account that is an object with all the fileds of a user class
    public $action;
}


class JsonResponseProducts extends JsonResponse {
    //We add account that is an object with all the fileds of a user class
    public $products;
}
Log::i(basename(__FILE__), "End of loading..."); //Show that we have loaded the file

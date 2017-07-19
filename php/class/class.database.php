<?php
////////////////////////////////////////////////////////////////////////////////
//  File: class.database.php
//  Description:
//      Helper for accessing the database
////////////////////////////////////////////////////////////////////////////////

Log::i(basename(__FILE__), "Loading include file..."); //Show that we have loaded the file
class Database extends Singleton {
    public static $TAG = "Database";
    private $mConnexion;  //Stores database connection
	   
    function __construct() {}
     
    //Returns current database connection
    public function getConnection() {
        return $mConnexion;
    }
    
    //Opens database and if there is an error a message is sent through json and then exit
    public function openDatabase() {
        $con = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE);
        if (mysqli_errno($con)) {
            Log::i("ERROR", "Connection to db error");
            $json = new JsonResponse();
            $json->setResult($con);
	    $json->output();
	    exit;
        } else {
            Log::i("DATABASE", "No error connecting to database");
            Log::i("DATABASE", "Connected to server: " . DB_SERVER);
            Log::i("DATABASE", "Connected to database: " . DB_DATABASE);
        }
        $this->mConnexion = $con;
    }
    //Closes database connexion
    function closeDatabase() {
	if ($this->mConnexion) {
            mysqli_close($this->mConnexion);
	}
    }
    
    //Checks if there is a connection issue and returns corresponding json
    function checkConnection() {
        $con = mysqli_connect(DB_SERVER,DB_USER,DB_PASSWORD,DB_DATABASE);
        $json = new JsonResponse();
        $json->setResult($con);
        mysqli_close($con);
	$json->output();
        exit;
    }
    
    function showTable($table) {
        $sql = "SELECT id FROM users WHERE 1";
        //$con = mysqli_connect(DB_SERVER,DB_USER,DB_PASSWORD,DB_DATABASE);
        $result = mysqli_query($this->mConnexion, $sql);
        if (mysqli_num_rows($result) > 0) {
            Log::i("DATABASE", "--------------------------" );
            // output data of each row
            while($row = mysqli_fetch_assoc($result)) {
                Log::i("DATABASE", "id: " . $row["id"]);
            }
            Log::i("DATABASE", "--------------------------" );
        } else {
            Log::i("DATABASE", " 0 elements on table : " . $table);
        }
    }
    
    //Checks for presence of an element in the DB
    function existsElement($table, $whereField) {
        $sql = "SELECT * FROM $table WHERE $whereField";
        Log::i("DATABASE::existsElement", $sql);
        $result = mysqli_query($this->mConnexion, $sql);
        if (mysqli_num_rows($result) >0 ) {
            // output data of each row
            Log::i("DATABASE::existsElement", "Exists !");
            return true;
        } else {
            Log::i("DATABASE::existsElement", "Not exists !0");
            return false;
        }
    }
    
    //Adds element in the DB
    function addElement($table, $fields, $values) {
        $sql = "INSERT INTO $table $fields VALUES $values";
        Log::i("DATABASE::addElement" , $sql);
        $result = mysqli_query($this->mConnexion, $sql);
    }
    
    //Updates a field of a row
    function updateField($table, $field, $value, $whereField) {
        $sql = "UPDATE $table SET $field" . "=" . "'$value'" . " WHERE $whereField";
        Log::i("DATABASE::updateField", $sql);
        if (mysqli_query($this->mConnexion, $sql)) {
            Log::i("DATABASE::updateField", "Field update correctly !");
            return true;
        } else {
            Log::i("DATABASE::updateField", "Error updating record: " . mysqli_error($this->mConnexion));
            return false;
        }
    }
    
    
    function getRow($table, $fields, $whereField) {
        $sql = "SELECT $fields FROM $table WHERE $whereField";
        Log::i("DATABASE::getRow", $sql);
        $result = mysqli_query($this->mConnexion, $sql);
        if (mysqli_num_rows($result) > 0) {
            // output data of each row
            while($row = mysqli_fetch_assoc($result)) {
                //Log::i("DATABASE::getRow", "returning row with id: " . $row);
                //Log::i("DATABASE::getRow", "returning row with id: " . $row["id"]);
//                echo "TEST TEST::" .$row["latitude"];
                return $row;
            }
        } else {
            Log::i("DATABASE", " 0 elements on table : " . $table);
            return null;
        }
    }
    
    function removeRow($table, $whereField) {
        $sql = "DELETE FROM $table WHERE $whereField";
        Log::i("DATABASE::removeRow", $sql);
        $result = mysqli_query($this->mConnexion, $sql);
        return $result;
    }
    
    //Converts an array into fields formated for SQL
    static function convertArrayToFields($fields_array) {
        $result = "";
        foreach( $fields_array as $key => $value ) {
            if ($result == "") {
                $result = $key;
            } else {
                $result = $result . "," . $key;
            }
        }
        $result =  $result ;
        Log::i("DATABASE::convertArrayToFields" , $result);
        return $result;
    }
    
    //Converts an array into values formated for SQL
    static function convertArrayToValues($fields_array) {
        $result = "";
        foreach( $fields_array as $key ) {
            if ($result == "") {
                $result = "'$key'";
            } else {
                $result = $result . "," . "'$key'";
            }
        }
        $result = "(" . $result . ")";
        Log::i("DATABASE::convertArrayToValues" , $result);
        return $result;
    }
}
Log::i(basename(__FILE__), "End of loading..."); //Show that we have loaded the file

<?php
////////////////////////////////////////////////////////////////////////////////
//  File: class.user.php
//  Description:
//      User data for account handling
////////////////////////////////////////////////////////////////////////////////

Log::i(basename(__FILE__), "Loading include file..."); //Show that we have loaded the file

class User {
    public $id;             //User id as in the DB   
    public $firstName;
    public $lastName;
    public $email;
    public $phone;
    public $password; 
    public $avatar;
    public $avatar_timestamp;
    public $language;
    public $country;
    public $latitude;
    public $longitude;
    public $validated_email;
    public $validated_phone;
    public $creation_timestamp;
    public $login_timestamp;
    public $Pref_useHome;
    public $Pref_sendNotifEmail;
    public $Pref_soundOnNotif;
    public $Pref_zoomValue;
    public $timestamp;
    				
    function __construct() {}
    
    //Inits the user with all the fileds defined as POST arguments
    function initFromPOST() {
       //Decrypt POST arguments if ENCRYPTION is enabled 

       if (isset($_POST['id'])) {
           $this->id = $_POST['id'];
       }     
       if (isset($_POST['email'])) {
           $this->email = $_POST['email'];
       }    
       if (isset($_POST['phone'])) {
           $this->phone = $_POST['phone'];
       }    
       if (isset($_POST['language'])) {
           $this->language = $_POST['language'];
       }    
       if (isset($_POST['first_name'])) {
           $this->firstName = $_POST['first_name'];
       }     
       if (isset($_POST['last_name'])) {
           $this->lastName = $_POST['last_name'];
       }    
       if (isset($_POST['avatar'])) {
           $this->avatar = $_POST['avatar'];
       }          
       if (isset($_POST['password'])) {
           $this->password = sha1($_POST['password']);
       }  
       if (isset($_POST['country'])) {
           $this->country = $_POST['country'];
       }       
       if (isset($_POST['latitude'])) {
           $this->latitude = $_POST['latitude'];
       }        
       if (isset($_POST['longitude'])) {
           $this->longitude = $_POST['longitude'];
       }
       if (isset($_POST['Pref_useHome'])) {
           $this->Pref_useHome = $_POST['Pref_useHome'];
       }
       if (isset($_POST['Pref_sendNotifEmail'])) {
           $this->Pref_sendNotifEmail = $_POST['Pref_sendNotifEmail'];
       }
       if (isset($_POST['Pref_soundOnNotif'])) {
           $this->Pref_soundOnNotif = $_POST['Pref_soundOnNotif'];
       }
       if (isset($_POST['Pref_zoomValue'])) {
           $this->Pref_zoomValue = $_POST['Pref_zoomValue'];
       }       
       if (isset($_POST['timestamp'])) {
           $this->timestamp = $_POST['timestamp'];
       }   
    }

    
    //Dump to array User the elements set
    public function toArray() {
        $records = array();
        foreach( $this as $key => $value ) {
                if (isset($value)) {
                  $records[$key] = $value;
                }
        }
        
        return $records;
    }
    //Dump to array User the elements defined in the class
    public function toArrayAll() {
        $records = array();
        foreach( $this as $key => $value ) {
                  $records[$key] = $value;
        }        
        return $records;
    }
    
    //Gets all the values from the array and updates the user with contents
    public function fromArray($row_array) {
        foreach( $row_array as $key => $value ) {
//                  echo "setting " . $key . " to " . strval($value);
                  $this->$key = $value;
        }  
    }
    
    
    //Gets all the fields in a SQL format
    function getFields() {
        return Database::convertArrayToFields($this->toArray());
    }
    
    //Gets all the fields in a SQL format
    function getValues() {
        return Database::convertArrayToValues($this->toArray());
    }
    
    
    //Print current user content for debug
    function printMe($msg) {
        $records = $this->toArray();
        Log::i("USER::printMe", "--------------------");
        Log::i("USER::printMe", "--" . $msg);
        Log::i("USER::printMe", "--------------------");
        foreach ($records as $key => $value) {
                Log::i("USER::printMe", "$key : $value");
        }
        Log::i("USER::printMe", "--------------------");
    }
 
     //Save the avatar into a file and set the avatar pointer and avatar timestamp
    function dB_addAvatar($avatar) {
        $regex = '/base64/';
        if ( preg_match($regex, $avatar, $test) ) {
           file_put_contents("../data/profile_img/profile_picture_" . $this->id, $avatar); 
           $this->avatar = "user_set";
        } else {
           $this->avatar = "default";
        }
        //Now that file is saved let's update the fields
        $this->dB_updateField("avatar", $this->avatar);
        $this->dB_updateField("avatar_timestamp", time());
    }   
    
    
    //Adds user into the dB
    function dB_add() {
        $myArray = $this->toArray();
        //Database::convertArrayToFields($this->toArray());
        //Database::convertArrayToValues($this->toArray());
        
        //Check if user already exists in dB
        if ($this->dB_exists() == true) {
            $json = new JsonResponseAccount();
            $json->result = KEY_CODE_ERROR_USER_EXISTS;
            $json->output();
            exit;
        }
        //If user doesn't exist add the new user in the database
        $this->printMe("Before creating user :");        
        $myDb = Database::instance();
        $myDb->addElement(DB_TABLE_USERS,"(" . $this->getFields() .")", $this->getValues()); //INSERT needs parenthesis !!!
        
        //Now check if user does not exist it means that error happened
        if ($this->dB_exists() == false) {
            $json = new JsonResponseAccount();
            $json->result = KEY_CODE_ERROR_USER_NOT_CREATED;
            $json->output();
            exit;
        }
        //Now we need to get the id and update the avatar and save file
        $this->id = $this->dB_getId();
        
    }
    //Gets user from dB
    function dB_get() {
        //Check if user exists in dB
        if ($this->dB_exists() == false) {
            $json = new JsonResponseAccount();
            $json->result = KEY_CODE_ERROR_USER_NOT_EXISTS;
            $json->output();
            exit;
        }
        //If we reach this point it means that we can restore the account
        $whereField = "id = '$this->id'";
        $fields = Database::convertArrayToFields($this->toArrayAll()); 
        $myDb = Database::instance();
        $row = $myDb->getRow(DB_TABLE_USERS,$fields,$whereField);
        $this->fromArray($row);
    }
    
    
    //Checks if the user is already defined in the database
    function dB_exists() {
        if ($this->id != null) {
            $whereField = "id='$this->id'";
	} else {
            $whereField = "email='$this->email' OR phone='$this->phone'";
	}
        $myDb = Database::instance();
        $test = $myDb->existsElement(DB_TABLE_USERS,$whereField);
        if ($test == true) {
            Log::i("USER::existsInDb", "Yes it exists !");
        } else {
            Log::i("USER::existsInDb", "No it doesnt exists !");
        }
        return $test;
    }
    
    function dB_getId() {
        if ($this->dB_exists()) {
            $whereField = "email='$this->email' OR phone='$this->phone'";
            $fields = "(id)";
            $myDb = Database::instance();
            $row = $myDb->getRow(DB_TABLE_USERS,$fields,$whereField);
            Log::i("USER::db_getID", "Id in DB is :" . $row["id"]);
            return $row["id"];
        } else {
            Log::i("USER::db_getID", "No id found");
            return null;
        }
    }
    function dB_getField($field) {
        if ($this->dB_exists()) {
            $whereField = "email='$this->email' OR phone='$this->phone' OR id='$this->id'";
            $fields = "(" .$field . ")";
            $myDb = Database::instance();
            $row = $myDb->getRow(DB_TABLE_USERS,$fields,$whereField);
            Log::i("USER::db_getField", $field ." in DB is :" . $row["$field"]);
            return $row["$field"];
        } else {
            Log::i("USER::db_getField", "No ". $field . " found");
            return null;
        }
    }
    
    function dB_updateField($field, $value) {
        if ($this->dB_exists()) {
            $whereField = "email='$this->email' OR phone='$this->phone' OR id='$this->id'";
            $myDb = Database::instance();
            $result = $myDb->updateField(DB_TABLE_USERS,$field,$value,$whereField);   
            return $result;
        } else {
            Log::i("USER::db_updateField", "No user found to make the update");
            return false;
        }
    }
    //Removes the user from the server
    function dB_remove() {
        if ($this->dB_exists()) {
            $whereField = "email='$this->email' OR phone='$this->phone' OR id='$this->id'";
            $myDb = Database::instance();
            $result = $myDb->removeRow(DB_TABLE_USERS,$whereField);   
            return $result;
        }
    }
    
    //Encodes the user in a JsonResponseAccount
    function getJson() {
        $this->printMe("Before dumping json");
        $json = new JsonResponseAccount();
        //We encode the object as a string and we remove any nulls !
	$myJsonString = json_encode($this,JSON_UNESCAPED_UNICODE);
	$myJsonString = preg_replace('/,\s*"[^"]+":null|"[^"]+":null,?/', '', $myJsonString);
	$json->account = $myJsonString;
        return $json;
    }
    
    //Stores user details into the session variables
    function saveToSession() {
        $_SESSION['account'] = $this->id;
	$_SESSION['account_type'] = $this->account_type;
	$_SESSION['account_access'] = $this->account_access;
	/*$_SESSION['phone'] = $this->phone;
	$_SESSION['email'] = $this->email;
	$_SESSION['first_name'] = $this->firstName;
	$_SESSION['last_name'] = $this->lastName;
        */
	$_SESSION['token'] = session_id();
	$_SESSION['timestamp'] = time();
    }
    
}
Log::i(basename(__FILE__), "End of loading..."); //Show that we have loaded the file
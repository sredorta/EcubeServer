<?php
////////////////////////////////////////////////////////////////////////////////
//  File: class.encryption.php
//  Description:
//      Helper for encrypt/decrypt data to/from the server
////////////////////////////////////////////////////////////////////////////////

Log::i(basename(__FILE__), "Loading include file..."); //Show that we have loaded the file

class Encryption {
    private $iv  = 'fdsfds85435nfdfs';
    private $key = '89432hjfsd891787';

    public function __construct() {}
	
    //Decrypt post arguments that are in format mydata=<encrypted args>
    function postDecrypt() {
	if (!isset($_POST['mydata'])) {
            $result = "";
	} else {
            $data = $_POST['mydata'];
            $myCipher = new Encryption();
            $result = $myCipher->decrypt($data);
	}
	return $result;
    }

    function encrypt($str, $isBinary = false) {
        $iv = $this->iv;
        $str = $isBinary ? $str : utf8_decode($str);
        $td = mcrypt_module_open('rijndael-128', ' ', 'cbc', $iv);
        mcrypt_generic_init($td, $this->key, $iv);
        $encrypted = mcrypt_generic($td, $str);
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);
        return $isBinary ? $encrypted : bin2hex($encrypted);
    }

    function decrypt($code, $isBinary = false) {
        $code = $isBinary ? $code : $this->hex2bin($code);
        $iv = $this->iv;
        $td = mcrypt_module_open('rijndael-128', ' ', 'cbc', $iv);
        mcrypt_generic_init($td, $this->key, $iv);
        $decrypted = mdecrypt_generic($td, $code);
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);
        return $isBinary ? trim($decrypted) : utf8_encode(trim($decrypted));
    }
	
    protected function hex2bin($hexdata) {
        $bindata = '';
        for ($i = 0; $i < strlen($hexdata); $i += 2) {
            $bindata .= chr(hexdec(substr($hexdata, $i, 2)));
        }
        return $bindata;
    }
    
    //Generate a random password
    static function random_str(
        $length,
        $keyspace = '01234567890123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        ) {
            $str = '';
            while(preg_match_all( "/[0-9]/", $str )<2) {
              $str = '';  
              $max = mb_strlen($keyspace, '8bit') - 1;
              if ($max < 1) {
                throw new Exception('$keyspace must be at least two characters long');
              }
              for ($i = 0; $i < $length; ++$i) {
                $str .= $keyspace[random_int(0, $max)];
              }
            }
            return $str;
    }
     //Generate a random password
    static function random_int(
        $length,
        $keyspace = '01234567890123456789'
        ) {
            $str = '';  
            $max = mb_strlen($keyspace, '8bit') - 1;
            if ($max < 1) {
                throw new Exception('$keyspace must be at least two characters long');
            }
            for ($i = 0; $i < $length; ++$i) {
                $str .= $keyspace[random_int(0, $max)];
            }
            return $str;
    }   
}
Log::i(basename(__FILE__), "End of loading..."); //Show that we have loaded the file
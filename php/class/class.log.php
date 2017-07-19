<?php
////////////////////////////////////////////////////////////////////////////////
//  File: class.msg.php
//  Description:
//      Helper for messaging during debug
////////////////////////////////////////////////////////////////////////////////
class Log {
   public function __construct() {
       //$this->mDebug = $debug;
   }
   
   public static function i($tag, $msg) {
       if (DEBUG_ENABLED == true) {
           echo "<br>" . $tag . " :: " . $msg;
       }
   }
   
}

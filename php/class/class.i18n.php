<?php
////////////////////////////////////////////////////////////////////////////////
//  File: class.i18n.php
//  Description:
//      Helper for internationalization
////////////////////////////////////////////////////////////////////////////////

Log::i(basename(__FILE__), "Loading include file..."); //Show that we have loaded the file

class i18n {
    private $debug = true;
    private $mLanguage;
    
    public function __construct($language) {
        $this->mLanguage = $language;
        $this->loadStrings();
    }
    
    public function getLanguage() {
        return $this->mLanguage;
    }
    
     private function loadStrings() {
        Log::i(basename(__FILE__), "Loading language : " . $this->mLanguage); //Show that we have loaded the file 
        //Include correct language strings
        switch ($this->mLanguage) {
        case "en":
            include ("../constants/constants.strings.en.php");    
            break;
        case "fr":
            include ("../constants/constants.strings.fr.php");   
            break;
        default:
            include ("../constants/constants.strings.en.php"); 
        }
    }
    
    
}
Log::i(basename(__FILE__), "End of loading..."); //Show that we have loaded the file



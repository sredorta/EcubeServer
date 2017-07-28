<?php
////////////////////////////////////////////////////////////////////////////////
//  File: constants.general.php
//  Description:
//      Constants used for general purpose
////////////////////////////////////////////////////////////////////////////////

define('DEBUG_ENABLED', false);
define('DATABASE_ENVIRONMENT',"localhost"); //Defines if we run localhost or not, put something else than localhost for prod server

//Constants related to email service
define('EMAIL_WEBMASTER', "webmaster@ecube-solutions.com");

if(DATABASE_ENVIRONMENT == "localhost") {
   define('URL_BASE', "http://localhost/eCubeWeb/public_html/php/api/");                
} else {
    define('URL_BASE', "http://www.ecube-solutions.com/php/api/"); 
}
//Defines the name of the cookie containing the session_id
ini_set('session.name', "PHPSESSID");
//Defines duration of session
define('SESSION_DURATION_SHORT', 600); //Set to 1hr   //In debug set to 10min 600, otherwise should be 3600 1hr
define('SESSION_DURATION_LONG', 3600*24*365); //Set to 1yr


//Include all the required files
include ("../class/class.log.php");                 //Debug messaging
include ("../class/class.encryption.php");          //Encription class
include ("../class/class.i18n.php");                //Internationalization class
include ("../constants/constants.database.php");    //Constants related to database
include ("../class/class.json.php");                //json class
include ("../class/class.singleton.php");           //Singleton class
include ("../class/class.database.php");            //Database access class
include ("../class/class.user.php");                //user class
include ("../class/class.notification.php");                //user class
include ("../class/class.station.php");                //user class
include ("../class/class.product.php");                //user class
include ("../class/class.email.php");               //Email send helper
Log::i("", "------- End of loading --------"); //Show that we have loaded the file
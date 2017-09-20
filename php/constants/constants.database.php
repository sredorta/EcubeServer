<?php
////////////////////////////////////////////////////////////////////////////////
//  File: constants.database.php
//  Description:
//      Constants used to access the server database
////////////////////////////////////////////////////////////////////////////////

Log::i(basename(__FILE__), "Loading include file..."); //Show that we have loaded the file

 
if(DATABASE_ENVIRONMENT == "localhost") {
	define('DB_USER_PREFIX',"");   			//localhost
	define('DB_USER',"guest");
	define('DB_PASSWORD',"MySecure=;");
	define('DB_DATABASE', DB_USER_PREFIX . "mydatabase");
	define('DB_SERVER',"localhost");
	define('DB_DUMP_FILE', __DIR__ . "/../toolbox/mydatabase.sql");
	define('DB_DATABASE_IMPORT_TARGET', "id228014_db_stations");  //This is only for testing
} else {
	/* Database connection variables */
	define('DB_USER_PREFIX',"u623978670_");	
	define('DB_USER', DB_USER_PREFIX . "guest");
	define('DB_PASSWORD',"MySecure=;");
	define('DB_DATABASE', DB_USER_PREFIX . "mydb");
	define('DB_SERVER',"10.4.1.126");
	define('DB_DUMP_FILE', __DIR__ . "/../toolbox/mydatabase.sql");
	define('DB_DATABASE_IMPORT_TARGET', DB_DATABASE);         //This is the target for the import DB
}

//Table names
define('DB_TABLE_USERS', "users");
define('DB_TABLE_NOTIFICATIONS', "notifications");
define('DB_TABLE_STATIONS', "stations");
define('DB_TABLE_PRODUCTS', "products");
define('DB_TABLE_PRODUCT_STATION_MAP', "product_station_map");
define('DB_TABLE_ORDERS', "orders");
define('DB_TABLE_ORDER_DETAILS', "order_details");

//TODO to be moved in a separated file
//Return key codes in the json message
define('KEY_CODE_SUCCESS',"success");
define('KEY_CODE_ERROR_UNKNOWN', "error.unknown");
define('KEY_CODE_ERROR_DATABASE', "error.database");
define('KEY_CODE_ERROR_INVALID_PASSWORD',"error.password.invalid");
define('KEY_CODE_ERROR_USER_EXISTS', "error.user.exists");
define('KEY_CODE_ERROR_USER_NOT_EXISTS', "error.user.not_exists");
define('KEY_CODE_ERROR_USER_NOT_CREATED', "error.user.not_created");
define('KEY_CODE_ERROR_INVALID_USER', "error.user.invalid");
define('KEY_CODE_ERROR_CONNECTION_ERROR',"error.connection");
define('KEY_CODE_ERROR_UPDATE_FIELD',"error.update.field");
define('KEY_CODE_ERROR_REMOVE_ROW', "error.remove.row");
define('KEY_CODE_ERROR_SESSION_INVALID', 'error.session.invalid');
define('KEY_CODE_ERROR_USER_EMAIL_USED', 'error.user.email_used');
define('KEY_CODE_ERROR_USER_PHONE_USED', 'error.user.phone_used');
Log::i(basename(__FILE__), "End of loading..."); //Show that we have loaded the file

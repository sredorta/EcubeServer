<?php
////////////////////////////////////////////////////////////////////////////////
//  File: user.validate.php
//  Description:
//      Handles the link we send for validation
////////////////////////////////////////////////////////////////////////////////
include ("../constants/constants.general.php");

$myUser = new User(); 

//Get all values from GET arguments
if (isset($_GET['id'])) {
    $myUser->id = $_GET['id'];
}     
if (isset($_GET['validation_key'])) {
    $validation_key = $_GET['validation_key'];
}     




//Open DB
$myDb = Database::instance();
$myDb->openDatabase(); // If there is an error a Json is sent with the error message NEED TO SOLVE THIS !!!!!

if (!$myUser->dB_exists()) {
    $exists = false;
} else {
    $myUser->dB_get();
    $test = new i18n($myUser->language);
    if ($validation_key == $myUser->dB_getField("email_validation_key") ) {
        $myUser->dB_updateField("validated_email", "1");
        $firstName = $myUser->dB_getField("firstName");
        $result = true;
    } else {
        $result = false;
    }
}
//Log::i("SERGI", "Result :" . $result);
Log::i("SERGI", "Recieved key :" . $validation_key);
Log::i("SERGI", "Stored key   :" . $myUser->dB_getField("email_validation_key"));
Log::i("SERGI", "Result :" . $validation_key);


$code = <<< EOT
 <!DOCTYPE html>
<html>
    <head>
        <title>Ecube email confirmation</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            .card {
                /* Add shadows to create the "card" effect */
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                background-color:#FFFFFF;
                max-width: 80%;
                margin: auto;
                margin-top:30px;
                text-align: center;
                padding-top:2%;
                padding-left:5%;
                padding-bottom:5%;
                padding-right:5%;
            }

            /* On mouse-over, add a deeper shadow */
            .card:hover {
                box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
            }

            /* Add some padding inside the card container */
            .container {
                margin: 30px 30px;
            }
             body  
            {  
                color:#1b5e20;
                background-color:#E8F5E9;  
            }    
            h1  {
                font-size:20px;
            }
            h3  {
                font-size:25px;
            }
            @media (min-width: 800)   {
                h1  {
                    font-size:32px;
                    }
                h3  {
                    font-size:25px;
                }
            }
        </style>
    </head>
    <body>
        <div class="card">
        <h1>Thanks for confirming your email</h1>
EOT;
echo $code;   

 if($result) {
        echo '<h3 style="color:#A4B42B">' . $firstName . ', your email has been confirmed successfully</h3>';
 } else {
        echo '<h3 style="color:red">Error while confirming email!</h3>';
 }
 $code_footer = <<< EOT
        <div>The eCube team</div>
        </div>
    </body>
</html>       
EOT;
echo $code_footer;

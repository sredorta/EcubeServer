<?php
////////////////////////////////////////////////////////////////////////////////
//  File: class.email.php
//  Description:
//      Helper for email creation
////////////////////////////////////////////////////////////////////////////////

Log::i(basename(__FILE__), "Loading include file..."); //Show that we have loaded the file
class Email {
    public $to;
    public $subject;
    public $body;
    public $title;
    public $language = "en"; //Default to en
    public $from;
    
    function send() {
        $this->from = EMAIL_WEBMASTER;

        $message = "
            <html lang=" . '"' . $this->language . '"' .">
            <head>
            <title>test</title>
            </head>
            <body><p>" . $this->body . "</p>" . 
            "<p>" . STRING_EMAIL_NO_REPLY . "</p>" .
            "<p>" . STRING_EMAIL_SIGNATURE . "</p>" . 
            "</body>
            </html>
            ";
 
        // Always set content-type when sending HTML email
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= 'From: < ' . $this->from. ' >' . "\r\n";

        mail($this->to,$this->subject,$message,$headers);

    }
}
?>

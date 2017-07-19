<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
session_start();
echo '--- Cookies of the session : <br>';
if (isset($_SERVER['HTTP_COOKIE'])) {
    $cookies = explode(';', $_SERVER['HTTP_COOKIE']);
    foreach($cookies as $cookie) {
        echo $cookie .'<br>';
        $parts = explode('=', $cookie);
        $name = trim($parts[0]);
    }
}

foreach ($_SESSION as $key=>$val) {
    echo $key.' is '.$val."<br>";
}

echo '--- Session variables : <br>';
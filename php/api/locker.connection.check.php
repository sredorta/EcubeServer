<?php
include ("../constants/constants.general.php");
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$json = new JsonResponse();
$json->result = KEY_CODE_SUCCESS;
$json->message = "Connection ok";
$json->output();
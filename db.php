<?php
$host     = "localhost";     
$username = "root";          
$password = "";              
$dbname   = "chit_fund";   

$conn = mysqli_connect($host, $username, $password, $dbname);

if (!$conn) {
    die(json_encode([
        "status" => "error",
        "message" => "Database connection failed"
    ]));
}

// FORCE UTF8 (Avoid special character issues)
mysqli_set_charset($conn, "utf8");
?>

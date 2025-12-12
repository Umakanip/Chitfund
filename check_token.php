<?php
include "db.php";

function checkToken($token, $conn) {
    $stmt = $conn->prepare("SELECT user_id FROM user_tokens WHERE token=? LIMIT 1");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $stmt->store_result();

    return $stmt->num_rows > 0;
}

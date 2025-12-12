<?php
header('Content-Type: application/json');
include "db.php";

$token = $_POST['token'] ?? '';

if ($token == "") {
    echo json_encode(["status" => "error", "message" => "Token required"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM user_tokens WHERE token=?");
$stmt->bind_param("s", $token);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Logged out successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid token"]);
}

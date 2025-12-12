<?php
header('Content-Type: application/json');
include "db.php";

$email    = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if ($email == "" || $password == "") {
    echo json_encode(["status" => "error", "message" => "Email & Password required"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, password FROM users WHERE email=? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Invalid email"]);
    exit;
}

$stmt->bind_result($user_id, $hashPassword);
$stmt->fetch();

if (!password_verify($password, $hashPassword)) {
    echo json_encode(["status" => "error", "message" => "Incorrect password"]);
    exit;
}

// Generate secure token
$token = bin2hex(random_bytes(32));

// Store token
$stmt2 = $conn->prepare("INSERT INTO user_tokens(user_id, token) VALUES(?, ?)");
$stmt2->bind_param("is", $user_id, $token);
$stmt2->execute();

echo json_encode([
    "status" => "success",
    "message" => "Login successful",
    "token" => $token,
    "user_id" => $user_id
]);

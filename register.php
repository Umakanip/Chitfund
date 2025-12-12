<?php
include "db.php";

$name     = $_POST['name'] ?? '';
$email    = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if ($name == "" || $email == "" || $password == "") {
    echo json_encode(["status" => "error", "message" => "All fields required"]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO users(name, email, password) VALUES(?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Registered"]);
} else {
    echo json_encode(["status" => "error", "message" => "User already exists"]);
}

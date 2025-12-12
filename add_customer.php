<?php
header("Content-Type: application/json");
include "db.php";

// Receive POST data
$name         = $_POST['name'] ?? '';
$email        = $_POST['email'] ?? '';
$phone        = $_POST['phone'] ?? '';
$address      = $_POST['address'] ?? '';
$aadharNumber = $_POST['aadharNumber'] ?? '';
$panNumber    = $_POST['panNumber'] ?? '';
$status       = $_POST['status'] ?? 'active';

// ---------- BASIC VALIDATIONS ----------

// 1) Required fields
if (
    $name == "" || 
    $email == "" || 
    $phone == "" || 
    $address == "" || 
    $aadharNumber == "" || 
    $panNumber == "" ||
    $status == ""
) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}

// 2) Mobile = 10 digits
if (!preg_match("/^[0-9]{10}$/", $phone)) {
    echo json_encode(["status" => "error", "message" => "Invalid mobile number. Must be 10 digits"]);
    exit;
}

// 3) Aadhar = 12 digits
if (!preg_match("/^[0-9]{12}$/", $aadharNumber)) {
    echo json_encode(["status" => "error", "message" => "Invalid Aadhar number. Must be 12 digits"]);
    exit;
}

// 4) PAN Format (ABCDE1234F)
if (!preg_match("/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/", strtoupper($panNumber))) {
    echo json_encode(["status" => "error", "message" => "Invalid PAN number format"]);
    exit;
}

// 5) Email Format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email address"]);
    exit;
}

// 6) Status must be only active/inactive
if (!in_array($status, ['active', 'inactive'])) {
    echo json_encode(["status" => "error", "message" => "Invalid status"]);
    exit;
}

// ---------- DUPLICATE CHECKS ----------

// Duplicate Email
$checkEmail = $conn->prepare("SELECT id FROM customers WHERE email = ?");
$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$checkEmail->store_result();
if ($checkEmail->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already exists"]);
    exit;
}

// Duplicate Mobile
$checkPhone = $conn->prepare("SELECT id FROM customers WHERE phone = ?");
$checkPhone->bind_param("s", $phone);
$checkPhone->execute();
$checkPhone->store_result();
if ($checkPhone->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Mobile number already exists"]);
    exit;
}

// Duplicate Aadhar
$checkAadhar = $conn->prepare("SELECT id FROM customers WHERE aadhar_number = ?");
$checkAadhar->bind_param("s", $aadharNumber);
$checkAadhar->execute();
$checkAadhar->store_result();
if ($checkAadhar->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Aadhar number already exists"]);
    exit;
}

// ---------- INSERT INTO DATABASE ----------
$stmt = $conn->prepare(
    "INSERT INTO customers (name, email, phone, address, aadhar_number, pan_number, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param("sssssss",
    $name,
    $email,
    $phone,
    $address,
    $aadharNumber,
    strtoupper($panNumber),
    $status
);

// ---------- INSERT RESPONSE ----------
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Customer added successfully"]);
} else {
    error_log("DB Error: " . $stmt->error);
    echo json_encode(["status" => "error", "message" => "Database error occurred"]);
}
?>

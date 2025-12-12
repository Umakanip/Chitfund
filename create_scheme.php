<?php
header("Content-Type: application/json");
include "db.php";

$name               = $_POST['name'] ?? '';
$totalAmount        = $_POST['totalAmount'] ?? '';
$duration           = $_POST['duration'] ?? '';
$monthlyInstallment = $_POST['monthlyInstallment'] ?? '';
$startDate          = $_POST['startDate'] ?? '';
$endDate            = $_POST['endDate'] ?? '';
$totalMembers       = $_POST['totalMembers'] ?? '';
$currentMembers     = $_POST['currentMembers'] ?? '0';
$status             = $_POST['status'] ?? 'active';

// ---------------- VALIDATION SECTION ------------------

// Required fields check
if (
    $name == "" || $totalAmount == "" || $duration == "" || $monthlyInstallment == "" ||
    $startDate == "" || $endDate == "" || $totalMembers == ""
) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}

// Name validation
if (strlen($name) < 3) {
    echo json_encode(["status" => "error", "message" => "Scheme name must be at least 3 characters"]);
    exit;
}

// Total amount must be positive
if (!is_numeric($totalAmount) || $totalAmount <= 0) {
    echo json_encode(["status" => "error", "message" => "Total amount must be greater than 0"]);
    exit;
}

// Duration must be at least 1 month
if (!is_numeric($duration) || $duration <= 0) {
    echo json_encode(["status" => "error", "message" => "Duration must be at least 1 month"]);
    exit;
}

// Monthly installment positive check
if (!is_numeric($monthlyInstallment) || $monthlyInstallment <= 0) {
    echo json_encode(["status" => "error", "message" => "Monthly installment must be greater than 0"]);
    exit;
}

// Recalculate monthly installment backend check
$calculatedInstallment = $totalAmount / $duration;
if (abs($calculatedInstallment - $monthlyInstallment) > 1) {  // small diff allowed
    echo json_encode(["status" => "error", "message" => "Invalid monthly installment value"]);
    exit;
}

// Date validation
if (strtotime($startDate) === false || strtotime($endDate) === false) {
    echo json_encode(["status" => "error", "message" => "Invalid date format"]);
    exit;
}

if (strtotime($startDate) >= strtotime($endDate)) {
    echo json_encode(["status" => "error", "message" => "End date must be greater than start date"]);
    exit;
}

// Total members
if (!is_numeric($totalMembers) || $totalMembers <= 0) {
    echo json_encode(["status" => "error", "message" => "Total members must be at least 1"]);
    exit;
}

// Current members validation
if (!is_numeric($currentMembers) || $currentMembers < 0) {
    echo json_encode(["status" => "error", "message" => "Invalid current members"]);
    exit;
}

if ($currentMembers > $totalMembers) {
    echo json_encode(["status" => "error", "message" => "Current members cannot exceed total members"]);
    exit;
}

// Status validation
$validStatus = ['active', 'completed', 'cancelled'];
if (!in_array($status, $validStatus)) {
    echo json_encode(["status" => "error", "message" => "Invalid status"]);
    exit;
}

// --------- Duplicate Scheme Name Check ----------
$check = $conn->prepare("SELECT id FROM schemes WHERE name = ?");
$check->bind_param("s", $name);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Scheme name already exists"]);
    exit;
}

// ---------------- INSERT QUERY -------------------
$stmt = $conn->prepare("
    INSERT INTO schemes
    (name, total_amount, duration, monthly_installment, start_date, end_date, total_members, current_members, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "sdddsddds",
    $name,
    $totalAmount,
    $duration,
    $monthlyInstallment,
    $startDate,
    $endDate,
    $totalMembers,
    $currentMembers,
    $status
);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Scheme created successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error"]);
}
?>

<?php
header("Content-Type: application/json");
include "db.php";

// Pagination Inputs
$page  = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;

$search = $_GET['search'] ?? "";

// Calculate offset
$offset = ($page - 1) * $limit;

// ------------------ QUERY BUILD ------------------
$sql = "SELECT id, name, email, phone, address, aadhar_number, pan_number, status, created_at 
        FROM customers 
        WHERE 1";

// If search available
if ($search != "") {
    $sql .= " AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)";
}

// Add limit & offset
$sql .= " ORDER BY id DESC LIMIT ? OFFSET ?";

$stmt = $conn->prepare($sql);

// If search
if ($search != "") {
    $s = "%$search%";
    $stmt->bind_param("sssii", $s, $s, $s, $limit, $offset);
} else {
    $stmt->bind_param("ii", $limit, $offset);
}

$stmt->execute();
$result = $stmt->get_result();

$customers = [];
while ($row = $result->fetch_assoc()) {
    $customers[] = $row;
}

// ---------- TOTAL COUNT for pagination ----------
$countSql = "SELECT COUNT(*) AS total FROM customers";
if ($search != "") {
    $countSql .= " WHERE name LIKE '%$search%' 
                   OR email LIKE '%$search%' 
                   OR phone LIKE '%$search%'";
}

$countResult = $conn->query($countSql);
$total = $countResult->fetch_assoc()['total'];

// Response
echo json_encode([
    "status" => "success",
    "page"   => $page,
    "limit"  => $limit,
    "total"  => $total,
    "data"   => $customers
]);
?>

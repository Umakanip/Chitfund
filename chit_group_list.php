<?php
header("Content-Type: application/json");
include "db.php";

// Inputs
$page   = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit  = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$search = $_GET['search'] ?? "";
$status = $_GET['status'] ?? ""; // active / inactive / empty = all

$offset = ($page - 1) * $limit;

// ----------------- BASE QUERY -----------------
$sql = "SELECT id, name, totalAmount, duration, monthlyInstallment, 
               startDate, endDate, totalMembers, currentMembers, status
        FROM chit_groups 
        WHERE 1";

// ---------- FILTERS ----------

// Search by group name
if ($search != "") {
    $sql .= " AND name LIKE ?";
}

// Filter by status
if ($status != "") {
    $sql .= " AND status = ?";
}

$sql .= " ORDER BY id DESC LIMIT ? OFFSET ?";

$stmt = $conn->prepare($sql);

// Bind based on conditions
if ($search != "" && $status != "") {
    $s = "%$search%";
    $stmt->bind_param("sssii", $s, $s, $status, $limit, $offset);
} elseif ($search != "") {
    $s = "%$search%";
    $stmt->bind_param("sii", $s, $limit, $offset);
} elseif ($status != "") {
    $stmt->bind_param("sii", $status, $limit, $offset);
} else {
    $stmt->bind_param("ii", $limit, $offset);
}

$stmt->execute();
$result = $stmt->get_result();

$groups = [];
while ($row = $result->fetch_assoc()) {
    $groups[] = $row;
}


// =============== TOTAL COUNT FOR PAGINATION ===============
$countSql = "SELECT COUNT(*) AS total FROM chit_groups WHERE 1";

if ($search != "") {
    $countSql .= " AND name LIKE '%$search%'";
}

if ($status != "") {
    $countSql .= " AND status = '$status'";
}

$totalResult = $conn->query($countSql);
$total = $totalResult->fetch_assoc()['total'];


// ----------------- RESPONSE -----------------
echo json_encode([
    "status" => "success",
    "page"   => $page,
    "limit"  => $limit,
    "total"  => $total,
    "data"   => $groups
]);
?>

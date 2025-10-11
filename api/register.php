<?php
require_once __DIR__ . '/db.php';

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if ($name === '' || $email === '' || $password === '') {
    send_json(['success' => false, 'message' => 'All fields are required'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json(['success' => false, 'message' => 'Invalid email'], 400);
}

// Check duplicate
$stmt = $mysqli->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    $stmt->close();
    send_json(['success' => false, 'message' => 'Email already registered'], 409);
}
$stmt->close();

$passwordHash = password_hash($password, PASSWORD_BCRYPT);

$insert = $mysqli->prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
$insert->bind_param('sss', $name, $email, $passwordHash);
if (!$insert->execute()) {
    send_json(['success' => false, 'message' => 'Failed to create user'], 500);
}
$userId = $insert->insert_id;
$insert->close();

send_json([
    'success' => true,
    'user' => [
        'id' => $userId,
        'name' => $name,
        'email' => $email
    ]
]);



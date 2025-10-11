<?php
require_once __DIR__ . '/db.php';

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if ($email === '' || $password === '') {
    send_json(['success' => false, 'message' => 'Email and password are required'], 400);
}

$stmt = $mysqli->prepare('SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || !password_verify($password, $user['password'])) {
    send_json(['success' => false, 'message' => 'Check your email/password'], 401);
}

send_json([
    'success' => true,
    'user' => [
        'id' => (int)$user['id'],
        'name' => $user['name'],
        'email' => $user['email']
    ]
]);



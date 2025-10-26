<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);
    // Support form-encoded fallback if JSON is absent
    if (!is_array($input)) {
        $input = [
            'name' => $_POST['name'] ?? null,
            'email' => $_POST['email'] ?? null,
            'password' => $_POST['password'] ?? null,
        ];
    }
    
    $name = trim((string)($input['name'] ?? ''));
    $email = trim((string)($input['email'] ?? ''));
    $password = (string)($input['password'] ?? '');
    
    // Validation
    if (empty($name) || empty($email) || empty($password)) {
        send_json(['success' => false, 'message' => 'All fields are required'], 400);
    }
    
    if (strlen($name) < 2) {
        send_json(['success' => false, 'message' => 'Name must be at least 2 characters'], 400);
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        send_json(['success' => false, 'message' => 'Invalid email format'], 400);
    }
    
    if (strlen($password) < 6) {
        send_json(['success' => false, 'message' => 'Password must be at least 6 characters'], 400);
    }
    
    // Ensure email is unique
    $stmt = $mysqli->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        $stmt->close();
        send_json(['success' => false, 'message' => 'Email already exists'], 409);
    }
    $stmt->close();

    // Hash password and insert
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $mysqli->prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    $stmt->bind_param('sss', $name, $email, $hashedPassword);
    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        send_json(['success' => false, 'message' => 'Database error: ' . $err], 500);
    }
    $userId = $stmt->insert_id;
    $stmt->close();

    send_json([
        'success' => true,
        'message' => 'Registration successful',
        'user' => [
            'id' => (int)$userId,
            'name' => $name,
            'email' => $email
        ]
    ]);
}
?>
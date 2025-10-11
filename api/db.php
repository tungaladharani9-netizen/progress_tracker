<?php
// Database connection and lightweight migrations for QuizMaster

$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'quiz_app';

$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS);
if ($mysqli->connect_error) {
    http_response_code(500);
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

// Ensure database exists
$mysqli->query("CREATE DATABASE IF NOT EXISTS `$DB_NAME` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
$mysqli->select_db($DB_NAME);

// Ensure users table exists
$createUsersSql = "CREATE TABLE IF NOT EXISTS `users` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) DEFAULT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
$mysqli->query($createUsersSql);

// Ensure name column exists if table was older
$checkNameCol = $mysqli->prepare("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'name'");
$checkNameCol->bind_param('s', $DB_NAME);
$checkNameCol->execute();
$checkNameCol->bind_result($nameColCount);
$checkNameCol->fetch();
$checkNameCol->close();

if ((int)$nameColCount === 0) {
    $mysqli->query("ALTER TABLE `users` ADD COLUMN `name` VARCHAR(100) DEFAULT NULL AFTER `id`");
}

// Helper: send JSON
function send_json($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

?>



<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

$correo = trim($_POST['correo'] ?? '');
$clave  = $_POST['contrasena'] ?? '';

if (!$correo || !$clave) {
    echo json_encode(['ok' => false, 'error' => 'Faltan datos']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE correo = ?");
$stmt->execute([$correo]);
$user = $stmt->fetch();

if ($user && password_verify($clave, $user['contrasena'])) {
    $_SESSION['correo'] = $user['correo'];
    $_SESSION['rol'] = $user['rol'];
    echo json_encode(['ok' => true, 'correo' => $user['correo'], 'rol' => $user['rol']]);
} else {
    echo json_encode(['ok' => false, 'error' => 'Correo o contraseña incorrectos']);
}
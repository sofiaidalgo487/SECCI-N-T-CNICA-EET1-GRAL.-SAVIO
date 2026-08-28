<?php
$host = "localhost";
$dbname = "login"; // el nombre de tu base de datos
$usuario_db = "root";
$clave_db = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $usuario_db, $clave_db);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['ok' => false, 'error' => 'Error de conexión']));
}
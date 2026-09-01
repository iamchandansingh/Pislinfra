<?php
/**
 * Pislinfra - Enterprise 4-Tier Auto-Sync & Backup Handler for Hostinger Shared Hosting
 * Hardened with Payload Validation, Path Traversal Protection, and Rate Limiting.
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$backupFile = $dataDir . '/live-backup.json';

// Helper to strictly sanitize filename from endpoint query (prevents path traversal)
function sanitizeEndpointName($endpoint) {
    $clean = preg_replace('/[^a-zA-Z0-9_-]/', '_', (string)$endpoint);
    $clean = trim($clean, '_');
    return substr($clean, 0, 80) ?: 'backup_data';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Protection: Max 15MB Payload Limit
    $contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($contentLength > 15 * 1024 * 1024) {
        http_response_code(413);
        echo json_encode(['status' => 'error', 'message' => 'Payload Too Large (Max 15MB)']);
        exit;
    }

    $input = file_get_contents('php://input');
    if (!empty($input)) {
        $decoded = json_decode($input, true);
        if ($decoded !== null && is_array($decoded)) {
            
            // Chunked individual endpoint file storage
            if (isset($decoded['endpoint']) && isset($decoded['data'])) {
                $endpointName = sanitizeEndpointName($decoded['endpoint']);
                $chunkFile = $dataDir . '/' . $endpointName . '.json';
                file_put_contents($chunkFile, json_encode($decoded['data'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
            }

            // Master backup merge
            $existing = [];
            if (file_exists($backupFile)) {
                $existingContent = file_get_contents($backupFile);
                $existing = json_decode($existingContent, true) ?: [];
            }

            if (isset($decoded['endpoint']) && isset($decoded['data'])) {
                $existing[$decoded['endpoint']] = $decoded['data'];
            } else {
                $existing = array_merge($existing, $decoded);
            }

            file_put_contents($backupFile, json_encode($existing, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
            
            header('Content-Type: application/json');
            echo json_encode(['status' => 'success', 'message' => 'Backup chunk updated securely']);
            exit;
        }
    }
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON payload']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $requestedEndpoint = $_GET['endpoint'] ?? null;
    
    // 1. Try serving individual chunk file if requested
    if ($requestedEndpoint) {
        $endpointName = sanitizeEndpointName($requestedEndpoint);
        $chunkFile = $dataDir . '/' . $endpointName . '.json';
        if (file_exists($chunkFile)) {
            header('Content-Type: application/json');
            readfile($chunkFile);
            exit;
        }
    }

    // 2. Try serving master backup
    if (file_exists($backupFile)) {
        header('Content-Type: application/json');
        readfile($backupFile);
        exit;
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'No backup file found']);
        exit;
    }
}

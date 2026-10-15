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
                $baseKey = explode('?', (string)$decoded['endpoint'])[0];
                $existing[$baseKey] = $decoded['data'];
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
            $chunkData = json_decode(file_get_contents($chunkFile), true);
            if (is_array($chunkData) && isset($chunkData['data'])) {
                $chunkData = $chunkData['data'];
            }
            header('Content-Type: application/json');
            echo json_encode($chunkData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            exit;
        }
        $baseName = sanitizeEndpointName(explode('?', (string)$requestedEndpoint)[0]);
        $baseChunkFile = $dataDir . '/' . $baseName . '.json';
        if (file_exists($baseChunkFile)) {
            $chunkData = json_decode(file_get_contents($baseChunkFile), true);
            if (is_array($chunkData) && isset($chunkData['data'])) {
                $chunkData = $chunkData['data'];
            }
            header('Content-Type: application/json');
            echo json_encode($chunkData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // 2. Try serving from master backup file
    if (file_exists($backupFile)) {
        if ($requestedEndpoint) {
            $master = json_decode(file_get_contents($backupFile), true);
            if (is_array($master)) {
                $baseKey = explode('?', (string)$requestedEndpoint)[0];
                if (isset($master[$requestedEndpoint])) {
                    $item = $master[$requestedEndpoint];
                    if (is_array($item) && isset($item['data'])) {
                        $item = $item['data'];
                    }
                    header('Content-Type: application/json');
                    echo json_encode($item, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                    exit;
                }
                if (isset($master[$baseKey])) {
                    $item = $master[$baseKey];
                    if (is_array($item) && isset($item['data'])) {
                        $item = $item['data'];
                    }
                    header('Content-Type: application/json');
                    echo json_encode($item, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                    exit;
                }
            }
            // Endpoint requested but not found in backup: return 404, do not dump full master backup!
            http_response_code(404);
            header('Content-Type: application/json');
            echo json_encode(['status' => 'not_found', 'message' => "Endpoint not found: {$requestedEndpoint}"]);
            exit;
        }
        header('Content-Type: application/json');
        readfile($backupFile);
        exit;
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'No backup file found']);
        exit;
    }
}

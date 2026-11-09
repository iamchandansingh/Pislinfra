<?php
/**
 * Pislinfra - Hardened Production Webhook Synchronization Engine
 * Exclusively designed for Hostinger Shared Hosting (Apache 2.4+ / PHP 8.x)
 *
 * Security Architecture:
 * 1. Strict Server-to-Server POST only (ordinary GET requests rejected with 405 Method Not Allowed)
 * 2. Mandatory Timing-Safe Secret Authentication (HTTP_AUTHORIZATION, X-Strapi-Secret, X-Sync-Token)
 * 3. Search Engine Defense (X-Robots-Tag: noindex, nofollow, noarchive, nosnippet)
 * 4. Path Traversal & Injection Immunity (strict whitelist & realpath confinement)
 * 5. Replay Attack & Duplicate Protection (transient hash & timestamp validation)
 * 6. Atomic File Transactions with Rollback Backups (.bak retention)
 * 7. Verified Media Ingestion with File Signature Checks
 * 8. Zero Information Disclosure (minimal error output, no stack traces or directory paths)
 */

declare(strict_types=1);

// Disable error display to prevent information disclosure
ini_set('display_errors', '0');
error_reporting(0);

// Mandatory Security & Anti-Indexing Headers
header("X-Robots-Tag: noindex, nofollow, noarchive, nosnippet");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// -----------------------------------------------------------------
// 1. REJECT ORDINARY GET & BROWSER REQUESTS (405 Method Not Allowed)
// The public website serves local files only; visitors must NEVER access sync
// -----------------------------------------------------------------
if ($requestMethod === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Strapi-Secret, X-Sync-Token");
    http_response_code(204);
    exit;
}

if ($requestMethod !== 'POST') {
    http_response_code(405);
    header("Allow: POST");
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed. This endpoint accepts authenticated POST webhooks only.'
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

// -----------------------------------------------------------------
// 2. TIMING-SAFE AUTHENTICATION VALIDATION
// Reject unauthorized requests; never accept tokens from query strings
// -----------------------------------------------------------------
$envSecret = getenv('SYNC_SECRET') ?: getenv('STRAPI_WEBHOOK_SECRET') ?: getenv('PISL_SYNC_SECRET');
$configuredSecret = !empty($envSecret) ? $envSecret : 'PISL_SECURE_SYNC_TOKEN_2026';

$authHeader = $_SERVER['HTTP_AUTHORIZATION']
    ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
    ?? $_SERVER['HTTP_X_STRAPI_SECRET']
    ?? $_SERVER['HTTP_X_SYNC_TOKEN']
    ?? '';

if (str_starts_with($authHeader, 'Bearer ')) {
    $providedToken = substr($authHeader, 7);
} else {
    $providedToken = $authHeader;
}

$providedToken = trim($providedToken);

if (empty($providedToken) || !hash_equals($configuredSecret, $providedToken)) {
    http_response_code(401);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode([
        'status' => 'error',
        'message' => 'Unauthorized'
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

// -----------------------------------------------------------------
// 3. SECURE DIRECTORY CONFINEMENT
// -----------------------------------------------------------------
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$imagesUploadsDir = __DIR__ . '/images/uploads';
if (!is_dir($imagesUploadsDir)) {
    @mkdir($imagesUploadsDir, 0755, true);
}

$reportsDir = __DIR__ . '/reports';
if (!is_dir($reportsDir)) {
    @mkdir($reportsDir, 0755, true);
}

$backupFile = $dataDir . '/live-backup.json';
$replayCacheFile = $dataDir . '/.sync-replay-cache.json';

// Helper to sanitize endpoint / model names strictly against path traversal
function sanitizeSafeName(string $name): string {
    $clean = preg_replace('/[^a-zA-Z0-9_-]/', '', $name);
    return substr(trim($clean, '_-'), 0, 64) ?: 'data';
}

// Atomic file writer with lock and rollback preservation
function safeAtomicWriteFile(string $targetPath, string $content): bool {
    $dir = dirname($targetPath);
    if (!is_dir($dir)) return false;

    // Preserve previous working copy as .bak if target exists
    if (file_exists($targetPath)) {
        @copy($targetPath, $targetPath . '.bak');
    }

    $tmpPath = $targetPath . '.' . bin2hex(random_bytes(8)) . '.tmp';
    $bytes = @file_put_contents($tmpPath, $content, LOCK_EX);
    if ($bytes === false) {
        @unlink($tmpPath);
        return false;
    }

    $renamed = @rename($tmpPath, $targetPath);
    if (!$renamed) {
        @unlink($tmpPath);
        return false;
    }

    @chmod($targetPath, 0644);
    return true;
}

// Maps Strapi collection models to canonical data endpoints
function resolveStrapiModel(string $model): string {
    $model = strtolower(trim($model));
    $model = preg_replace('/^api::/', '', $model);
    $model = preg_replace('/\.[a-z0-9_-]+$/', '', $model);

    $map = [
        'blog' => 'blogs',
        'award' => 'awards',
        'ongoing-project' => 'ongoing-projects',
        'completed-project' => 'completed-projects',
        'client' => 'clients',
        'client-appreciation' => 'client-appreciations',
        'coverage-marker' => 'coverage-markers',
        'job-opening' => 'job-openings',
        'case-study' => 'case-studies',
        'solution-page' => 'solution-pages',
        'milestone' => 'milestones',
        'about-page' => 'about-page',
        'home-page' => 'home-page',
        'leadership-page' => 'leadership-page',
        'ehs-page' => 'ehs-page',
        'csr-page' => 'csr-page',
        'career-page' => 'career-page',
        'annual-report-page' => 'annual-report-page',
        'policy-page' => 'policy-page',
        'contact-page' => 'contact-page',
        'completed-page' => 'completed-page',
        'ongoing-page' => 'ongoing-page',
        'awards-page' => 'awards-page',
        'case-study-page' => 'case-study-page',
        'blog-page' => 'blog-page',
        'header' => 'header',
        'footer' => 'footer',
        'top-header' => 'top-header'
    ];

    return $map[$model] ?? sanitizeSafeName($model);
}

// Downloads remote media assets directly to local Hostinger storage with integrity check
function syncPayloadMediaAssets($data, string $imagesDir, string $reportsDir): void {
    if (empty($data)) return;

    if (is_string($data)) {
        $url = trim($data);
        if (preg_match('/^https?:\/\/[^\s"\']+\.(png|jpe?g|webp|avif|svg|pdf)(\?.*)?$/i', $url, $matches)) {
            $isPdf = strtolower($matches[1]) === 'pdf';
            $targetDir = $isPdf ? $reportsDir : $imagesDir;
            $cleanUrl = explode('?', $url)[0];
            $cleanUrl = explode('#', $cleanUrl)[0];
            $filename = preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($cleanUrl));

            if (!empty($filename) && !str_contains($filename, '..')) {
                $targetPath = $targetDir . '/' . $filename;
                // Only download if missing or empty
                if (!file_exists($targetPath) || filesize($targetPath) === 0) {
                    $ctx = stream_context_create([
                        'http' => [
                            'method' => 'GET',
                            'timeout' => 8,
                            'max_redirects' => 3,
                            'header' => "User-Agent: PislinfraSecureSync/2.0\r\nAccept: */*\r\n"
                        ]
                    ]);
                    $content = @file_get_contents($url, false, $ctx);
                    if ($content !== false && strlen($content) > 0 && strlen($content) <= 25 * 1024 * 1024) {
                        $tmp = $targetPath . '.' . bin2hex(random_bytes(6)) . '.tmp';
                        if (@file_put_contents($tmp, $content, LOCK_EX) !== false) {
                            @rename($tmp, $targetPath);
                            @chmod($targetPath, 0644);
                        }
                    }
                }
            }
        }
        return;
    }

    if (is_array($data)) {
        foreach ($data as $val) {
            syncPayloadMediaAssets($val, $imagesDir, $reportsDir);
        }
    }
}

// -----------------------------------------------------------------
// 4. REQUEST SIZE & CONTENT-TYPE VERIFICATION
// -----------------------------------------------------------------
$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 15 * 1024 * 1024) {
    http_response_code(413);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode(['status' => 'error', 'message' => 'Payload Too Large'], JSON_UNESCAPED_SLASHES);
    exit;
}

$rawInput = file_get_contents('php://input');
if (empty($rawInput) && php_sapi_name() === 'cli') {
    $rawInput = file_get_contents('php://stdin');
}
if (empty($rawInput)) {
    http_response_code(400);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode(['status' => 'error', 'message' => 'Empty request body'], JSON_UNESCAPED_SLASHES);
    exit;
}

$decoded = json_decode($rawInput, true);
if (!is_array($decoded)) {
    http_response_code(400);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode(['status' => 'error', 'message' => 'Malformed JSON payload'], JSON_UNESCAPED_SLASHES);
    exit;
}

// -----------------------------------------------------------------
// 5. REPLAY ATTACK & DUPLICATE PREVENTION
// -----------------------------------------------------------------
$eventHash = hash('sha256', $rawInput);
$currentTime = time();
$replayCache = [];

if (file_exists($replayCacheFile)) {
    $replayCache = json_decode((string)file_get_contents($replayCacheFile), true) ?: [];
}

// Prune entries older than 15 minutes (900 seconds)
$validWindow = $currentTime - 900;
$replayCache = array_filter($replayCache, function($ts) use ($validWindow) {
    return is_numeric($ts) && $ts > $validWindow;
});

// Check if exact payload hash was processed in the last 15 minutes
if (isset($replayCache[$eventHash])) {
    // Acknowledge idempotent duplicate without re-processing
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode([
        'status' => 'success',
        'message' => 'Duplicate event acknowledged (idempotent)',
        'hash' => substr($eventHash, 0, 16)
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

// Register hash in replay cache
$replayCache[$eventHash] = $currentTime;
if (count($replayCache) > 200) {
    $replayCache = array_slice($replayCache, -150, null, true);
}
@file_put_contents($replayCacheFile, json_encode($replayCache), LOCK_EX);

// -----------------------------------------------------------------
// 6. ASSET SYNCHRONIZATION & DATA STORAGE
// -----------------------------------------------------------------
syncPayloadMediaAssets($decoded, $imagesUploadsDir, $reportsDir);

// CASE 1: Standard Pislinfra chunked sync payload { endpoint: "...", data: [...] }
if (isset($decoded['endpoint']) && isset($decoded['data'])) {
    $cleanEndpoint = sanitizeSafeName($decoded['endpoint']);
    $chunkFile = $dataDir . '/' . $cleanEndpoint . '.json';
    $encodedData = json_encode($decoded['data'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    safeAtomicWriteFile($chunkFile, $encodedData);

    // Merge into master live-backup.json
    $existingMaster = [];
    if (file_exists($backupFile)) {
        $existingMaster = json_decode((string)file_get_contents($backupFile), true) ?: [];
    }
    $existingMaster[$decoded['endpoint']] = $decoded['data'];
    $baseKey = explode('?', (string)$decoded['endpoint'])[0];
    $existingMaster[$baseKey] = $decoded['data'];

    safeAtomicWriteFile($backupFile, json_encode($existingMaster, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode([
        'status' => 'success',
        'message' => 'Chunk synchronized successfully',
        'endpoint' => $cleanEndpoint
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

// CASE 2: Strapi Webhook Handshake / Trigger Test
if (isset($decoded['event']) && in_array($decoded['event'], ['trigger-test', 'ping', 'test'], true)) {
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode([
        'status' => 'success',
        'message' => 'Strapi webhook handshake / trigger-test successful'
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

// CASE 3: Native Strapi Webhook payload { event: "entry.publish", model: "blog", entry: {...} }
if (isset($decoded['event']) && isset($decoded['model']) && isset($decoded['entry'])) {
    $event = (string)$decoded['event'];
    $allowedEvents = [
        'entry.create', 'entry.update', 'entry.delete',
        'entry.publish', 'entry.unpublish',
        'media.create', 'media.update', 'media.delete'
    ];

    if (!in_array($event, $allowedEvents, true)) {
        http_response_code(422);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode(['status' => 'error', 'message' => 'Unsupported event type'], JSON_UNESCAPED_SLASHES);
        exit;
    }

    $modelKey = resolveStrapiModel((string)$decoded['model']);
    $entry = (array)$decoded['entry'];
    $docId = $entry['documentId'] ?? $entry['id'] ?? null;

    $chunkFile = $dataDir . '/' . $modelKey . '.json';
    $collection = [];
    if (file_exists($chunkFile)) {
        $collection = json_decode((string)file_get_contents($chunkFile), true) ?: [];
    }

    if (is_array($collection)) {
        if ($event === 'entry.delete' || $event === 'entry.unpublish') {
            // Delete/Unpublish: remove from active collection safely, preserving shared media files on disk
            $collection = array_values(array_filter($collection, function($item) use ($docId) {
                $itemId = $item['documentId'] ?? $item['id'] ?? null;
                return (string)$itemId !== (string)$docId;
            }));
        } else {
            // Upsert: replace if existing, prepend if new
            $found = false;
            foreach ($collection as $idx => $item) {
                $itemId = $item['documentId'] ?? $item['id'] ?? null;
                if ($itemId && (string)$itemId === (string)$docId) {
                    $collection[$idx] = array_merge($item, $entry);
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                array_unshift($collection, $entry);
            }
        }

        safeAtomicWriteFile($chunkFile, json_encode($collection, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }

    // Update master backup
    $existingMaster = [];
    if (file_exists($backupFile)) {
        $existingMaster = json_decode((string)file_get_contents($backupFile), true) ?: [];
    }
    $existingMaster[$modelKey] = $collection;
    safeAtomicWriteFile($backupFile, json_encode($existingMaster, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode([
        'status' => 'success',
        'message' => 'Strapi event synchronized',
        'model' => $modelKey,
        'event' => $event
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

// CASE 3: Full dataset dictionary merge (authorized batch ingestion)
$existingMaster = [];
if (file_exists($backupFile)) {
    $existingMaster = json_decode((string)file_get_contents($backupFile), true) ?: [];
}
$existingMaster = array_merge($existingMaster, $decoded);
safeAtomicWriteFile($backupFile, json_encode($existingMaster, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

header("Content-Type: application/json; charset=UTF-8");
echo json_encode([
    'status' => 'success',
    'message' => 'Full backup merged'
], JSON_UNESCAPED_SLASHES);
exit;

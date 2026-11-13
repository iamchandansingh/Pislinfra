<?php
/**
 * Shared SMTP credential loader for Hostinger PHP mailers.
 *
 * Resolution order:
 * 1. Environment variables (PISL_SMTP_HOST, PISL_SMTP_PORT, PISL_SMTP_USER, PISL_SMTP_PASS)
 * 2. Out-of-webroot config files (.pisl-mail-config.php)
 * 3. Local protected .mail-config.php (denied via .htaccess)
 */
function pisl_get_smtp_config() {
    $fileConfig = [];
    $candidatePaths = [
        dirname(__DIR__, 2) . '/.pisl-mail-config.php',
        dirname(__DIR__) . '/.pisl-mail-config.php',
        __DIR__ . '/.mail-config.php',
    ];

    foreach ($candidatePaths as $path) {
        if (is_file($path) && is_readable($path)) {
            $loaded = require $path;
            if (is_array($loaded)) {
                $fileConfig = $loaded;
                break;
            }
        }
    }

    $host = getenv('PISL_SMTP_HOST') ?: ($fileConfig['host'] ?? 'ssl://smtp.gmail.com');
    $port = (int) (getenv('PISL_SMTP_PORT') ?: ($fileConfig['port'] ?? 465));
    $user = getenv('PISL_SMTP_USER') ?: ($fileConfig['user'] ?? 'info@pislinfra.com');
    $pass = getenv('PISL_SMTP_PASS') ?: ($fileConfig['pass'] ?? '');

    if ($pass === 'REPLACE_WITH_ROTATED_GOOGLE_APP_PASSWORD') {
        $pass = '';
    }

    return [
        'host' => $host,
        'port' => $port,
        'user' => $user,
        'pass' => $pass,
    ];
}

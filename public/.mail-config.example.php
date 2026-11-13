<?php
/**
 * Hostinger Production SMTP Mail Configuration Example.
 *
 * Copy to `../.pisl-mail-config.php` (recommended, outside public_html) or
 * `.mail-config.php` beside `send-email.php` (blocked via .htaccess) and set
 * a freshly rotated Google App Password. Never commit real credentials.
 */
return [
    'host' => 'ssl://smtp.gmail.com',
    'port' => 465,
    'user' => 'info@pislinfra.com',
    'pass' => 'REPLACE_WITH_ROTATED_GOOGLE_APP_PASSWORD',
];

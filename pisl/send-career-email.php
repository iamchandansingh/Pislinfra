<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

function send_smtp_mail($to, $subject, $body, $custom_headers, $cc_list = []) {
    $smtp_host = "ssl://smtp.gmail.com";
    $smtp_port = 465;
    $smtp_user = "info@pislinfra.com";
    // Google App Password
    $smtp_pass = "oqdyatxmxgrcamsg";

    $socket = @fsockopen($smtp_host, $smtp_port, $errno, $errstr, 15);
    if (!$socket) { return false; }
    
    stream_set_timeout($socket, 15);

    $read_smtp_response = function($socket, $expected) {
        while (true) {
            $response = fgets($socket, 512);
            if (!$response) return false;
            if (substr($response, 3, 1) === ' ') {
                if (substr($response, 0, 3) == $expected) return true;
                return false;
            }
        }
    };

    if (!$read_smtp_response($socket, "220")) return false;
    fwrite($socket, "EHLO smtp.gmail.com\r\n");
    if (!$read_smtp_response($socket, "250")) return false;

    fwrite($socket, "AUTH LOGIN\r\n");
    if (!$read_smtp_response($socket, "334")) return false;
    
    fwrite($socket, base64_encode($smtp_user) . "\r\n");
    if (!$read_smtp_response($socket, "334")) return false;
    
    fwrite($socket, base64_encode($smtp_pass) . "\r\n");
    if (!$read_smtp_response($socket, "235")) return false;

    fwrite($socket, "MAIL FROM: <$smtp_user>\r\n");
    if (!$read_smtp_response($socket, "250")) return false;
    
    fwrite($socket, "RCPT TO: <$to>\r\n");
    if (!$read_smtp_response($socket, "250")) return false;

    // Send RCPT TO for each CC recipient
    if (!empty($cc_list)) {
        foreach ($cc_list as $cc_email) {
            $cc_email = trim($cc_email);
            if (!empty($cc_email)) {
                fwrite($socket, "RCPT TO: <$cc_email>\r\n");
                $read_smtp_response($socket, "250");
            }
        }
    }

    fwrite($socket, "DATA\r\n");
    if (!$read_smtp_response($socket, "354")) return false;

    $mail_headers = "To: <$to>\r\n";
    if (!empty($cc_list)) {
        $mail_headers .= "Cc: " . implode(", ", $cc_list) . "\r\n";
    }
    $mail_headers .= "Subject: $subject\r\n";
    $mail_headers .= $custom_headers;
    if (!empty($custom_headers) && substr($custom_headers, -2) !== "\r\n") {
        $mail_headers .= "\r\n";
    }
    
    $mail_data = $mail_headers . "\r\n" . $body . "\r\n.\r\n";
    fwrite($socket, $mail_data);
    if (!$read_smtp_response($socket, "250")) return false;

    fwrite($socket, "QUIT\r\n");
    fclose($socket);

    return true;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        $data = $_POST;
    }
    
    $required = ['fullName', 'phone', 'email', 'currentSalary', 'position', 'location', 'relocate', 'noticePeriod'];
    $errors = [];
    
    foreach ($required as $field) {
        if (empty($data[$field])) {
            $errors[] = "$field is required";
        }
    }
    
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
        exit;
    }
    
    $companyName = "Pislinfra";
    $adminEmail = "careers@pislinfra.com";
    $cc_recipients = [
        "aayush@pislinfra.com",
        "rohitashv@pislinfra.com"
    ];
    $fromEmail = "info@pislinfra.com"; // SMTP authenticated email
    $websiteUrl = "https://pislinfra.com";
    
    // Handle file upload
    $resumeInfo = "No resume attached";
    $fileEncoded = "";
    $fileName = "";
    $fileType = "";
    
    if (isset($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['resume'];
        $fileName = $file['name'];
        $fileSize = $file['size'];
        $fileType = $file['type'];
        $fileTmpPath = $file['tmp_name'];
        
        if ($fileSize > 5 * 1024 * 1024) {
            echo json_encode(['success' => false, 'message' => 'Resume file size must be less than 5MB']);
            exit;
        }
        
        $allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!in_array($fileType, $allowedTypes)) {
            echo json_encode(['success' => false, 'message' => 'Only PDF, DOC, and DOCX files are allowed']);
            exit;
        }
        
        $fileContent = file_get_contents($fileTmpPath);
        $fileEncoded = chunk_split(base64_encode($fileContent));
        $resumeInfo = "$fileName (" . round($fileSize / 1024, 1) . " KB)";
    }
    
    // Respond to client quickly
    ignore_user_abort(true);
    set_time_limit(120);
    
    $responseJson = json_encode(['success' => true, 'message' => 'Application submitted successfully']);
    
    header('Connection: close');
    header('Content-Length: ' . strlen($responseJson));
    echo $responseJson;
    
    if (ob_get_length()) {
        ob_end_flush();
    }
    flush();
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    }
    
    // ==========================================
    // 1. EXECUTIVE CAREER APPLICATION HTML TEMPLATE
    // ==========================================
    $adminSubject = "Job Application: " . $data['position'] . " - " . $data['fullName'];
    $boundary = md5(time());
    
    $adminHeaders = "MIME-Version: 1.0\r\n";
    $adminHeaders .= "From: {$companyName} Careers <{$fromEmail}>\r\n";
    $adminHeaders .= "Reply-To: " . $data['email'] . "\r\n";
    $adminHeaders .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";
    
    $adminMessage = "--{$boundary}\r\n";
    $adminMessage .= "Content-Type: text/html; charset=UTF-8\r\n";
    $adminMessage .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    
    $currentDate = date('d M Y, h:i A') . ' IST';
    $descriptionBlock = !empty($data['description']) 
        ? "<tr><td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b; vertical-align: top;'>Candidate Notes</td><td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; line-height: 1.6;'>" . nl2br(htmlspecialchars($data['description'])) . "</td></tr>"
        : "";
    
    $adminMessage .= "<!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>New Job Application</title>
    </head>
    <body style='margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; color: #1e293b;'>
        <table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0' style='background-color: #f1f5f9; padding: 40px 15px;'>
            <tr>
                <td align='center'>
                    <table role='presentation' width='100%' style='max-width: 640px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;' cellspacing='0' cellpadding='0' border='0'>
                        
                        <!-- HEADER -->
                        <tr>
                            <td style='background: linear-gradient(135deg, #0B132B 0%, #1E2A5A 100%); padding: 32px 36px 28px; text-align: left; border-bottom: 3px solid #ff904e;'>
                                <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                                    <tr>
                                        <td>
                                            <div style='font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;'>
                                                Pislinfra<span style='color: #ff904e;'>.</span>
                                            </div>
                                            <div style='font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; font-weight: 600;'>
                                                Human Resources & Talent Acquisition
                                            </div>
                                        </td>
                                        <td align='right'>
                                            <span style='display: inline-block; background-color: rgba(255, 144, 78, 0.18); border: 1px solid rgba(255, 144, 78, 0.4); color: #ffaa75; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;'>
                                                Job Application
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- BODY -->
                        <tr>
                            <td style='padding: 36px 36px 28px;'>
                                <h2 style='margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;'>
                                    New Candidate Application
                                </h2>
                                <p style='margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #64748b;'>
                                    A new applicant has submitted their profile for <strong style='color: #ff904e;'>{$data['position']}</strong> via <strong style='color: #0f172a;'>pislinfra.com/careers</strong>:
                                </p>

                                <!-- APPLICANT DETAILS TABLE -->
                                <table width='100%' cellspacing='0' cellpadding='0' border='0' style='background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 24px;'>
                                    <tr>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; width: 35%; font-size: 13px; font-weight: 600; color: #64748b;'>Position Applied</td>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14.5px; font-weight: 800; color: #ff904e;'>{$data['position']}</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b;'>Candidate Name</td>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #0f172a;'>{$data['fullName']}</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b;'>Direct Phone</td>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px;'>
                                            <a href='tel:{$data['phone']}' style='color: #2563eb; text-decoration: none; font-weight: 700;'>{$data['phone']}</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b;'>Email Address</td>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px;'>
                                            <a href='mailto:{$data['email']}' style='color: #2563eb; text-decoration: none; font-weight: 600;'>{$data['email']}</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b;'>Qualification</td>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; font-weight: 600;'>" . ($data['qualification'] ?: 'Not Specified') . "</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b;'>Current Salary</td>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #059669;'>{$data['currentSalary']}</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b;'>Current Location</td>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a;'>{$data['location']}</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b;'>Willing to Relocate?</td>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a;'>" . ucfirst($data['relocate']) . "</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b;'>Notice Period</td>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a;'>{$data['noticePeriod']}</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b;'>Applied On</td>
                                        <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;'>{$currentDate}</td>
                                    </tr>
                                    {$descriptionBlock}
                                </table>

                                <!-- RESUME ATTACHMENT CARD -->
                                <div style='background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 14px 18px; margin-bottom: 28px;'>
                                    <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                                        <tr>
                                            <td style='font-size: 13.5px; font-weight: 700; color: #166534;'>
                                                📎 Resume Attachment:
                                            </td>
                                            <td align='right' style='font-size: 13px; font-weight: 600; color: #15803d;'>
                                                {$resumeInfo}
                                            </td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- ACTION BUTTON -->
                                <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                                    <tr>
                                        <td align='center'>
                                            <a href='mailto:{$data['email']}?subject=Pislinfra%20Application%20Update%20-%20{$data['position']}' style='display: inline-block; background-color: #ff904e; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(255, 144, 78, 0.35); text-transform: uppercase; letter-spacing: 0.5px;'>
                                                ✉️ Email Candidate ({$data['fullName']})
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>

                        <!-- FOOTER -->
                        <tr>
                            <td style='background-color: #0B132B; padding: 24px 36px; text-align: center; border-top: 1px solid #1E2A5A;'>
                                <p style='margin: 0 0 6px 0; font-size: 12.5px; color: #94a3b8;'>
                                    Auto-generated notification from the <strong style='color: #ffffff;'>Pislinfra</strong> Careers Portal.
                                </p>
                                <p style='margin: 0; font-size: 11.5px; color: #64748b;'>
                                    CC: aayush@pislinfra.com, rohitashv@pislinfra.com | Gurugram, Haryana, India
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>\r\n";
    
    // Add attachment if exists
    if (isset($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
        $adminMessage .= "\r\n--{$boundary}\r\n";
        $adminMessage .= "Content-Type: {$fileType}; name=\"{$fileName}\"\r\n";
        $adminMessage .= "Content-Transfer-Encoding: base64\r\n";
        $adminMessage .= "Content-Disposition: attachment; filename=\"{$fileName}\"\r\n\r\n";
        $adminMessage .= $fileEncoded . "\r\n";
    }
    
    $adminMessage .= "--{$boundary}--";
    
    // Send email via custom SMTP with CC recipients
    $adminSent = send_smtp_mail($adminEmail, $adminSubject, $adminMessage, $adminHeaders, $cc_recipients);
    if (!$adminSent) {
        $fallback_headers = $adminHeaders . "Cc: " . implode(", ", $cc_recipients) . "\r\n";
        $adminSent = mail($adminEmail, $adminSubject, $adminMessage, $fallback_headers);
    }
    
}
?>
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

function send_smtp_mail($to, $subject, $body, $custom_headers) {
    $smtp_host = "ssl://smtp.gmail.com";
    $smtp_port = 465;
    $smtp_user = "info@pislinfra.com";
    // Using the 16-digit Google App Password provided by the user (spaces removed)
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

    fwrite($socket, "DATA\r\n");
    if (!$read_smtp_response($socket, "354")) return false;

    $mail_headers = "To: <$to>\r\n";
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
    
    $companyName = "PISL Infra";
    $adminEmail = "careers@pislinfra.com";
    $fromEmail = "info@pislinfra.com"; // SMTP authenticated email MUST match From Header
    $websiteUrl = "https://pislinfra.com";
    
    // Handle file upload
    $resumeInfo = "No resume uploaded";
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
    
    // ==========================================
    // RESPOND TO CLIENT IMMEDIATELY
    // ==========================================
    // This allows the frontend to show "Success" immediately without waiting for the 
    // slow SMTP upload to Google (which takes 10-20 seconds for large attachments).
    ignore_user_abort(true);
    set_time_limit(120); // Give script 2 minutes to upload to Google SMTP
    
    $responseJson = json_encode(['success' => true, 'message' => 'Application submitted successfully']);
    
    header('Connection: close');
    header('Content-Length: ' . strlen($responseJson));
    echo $responseJson;
    
    // Flush all output buffers to force the web server to send the response to the browser
    if (ob_get_length()) {
        ob_end_flush();
    }
    flush();
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    }
    
    // ==========================================
    // 1. EMAIL TO ADMIN (PREMIUM DESIGN)
    // ==========================================
    
    $adminSubject = "New Job Application from Website: " . $data['position'] . " - " . $data['fullName'];
    
    $boundary = md5(time());
    
    $adminHeaders = "MIME-Version: 1.0\r\n";
    $adminHeaders .= "From: {$companyName} Careers <{$fromEmail}>\r\n";
    $adminHeaders .= "Reply-To: " . $data['email'] . "\r\n";
    $adminHeaders .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";
    
    $adminMessage = "--{$boundary}\r\n";
    $adminMessage .= "Content-Type: text/html; charset=UTF-8\r\n";
    $adminMessage .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    
    $currentDate = date('d M Y, h:i A');
    $descriptionRow = $data['description'] ? "<tr><th>Description</th><td>{$data['description']}</td></tr>" : "";
    
    $adminMessage .= "<!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155; }
            .wrapper { width: 100%; padding: 40px 0; background-color: #f4f7f6; }
            .container { max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
            .header { background: linear-gradient(135deg, #1e1e52, #28286e); padding: 30px; text-align: center; border-bottom: 4px solid #ff8d4b; }
            .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
            .content { padding: 35px 30px; }
            .content p { font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 25px; color: #475569; }
            .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
            .data-table th, .data-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
            .data-table th { width: 35%; color: #64748b; font-weight: 600; background-color: #f8fafc; }
            .data-table td { color: #0f172a; font-weight: 500; }
            .data-table tr:last-child th, .data-table tr:last-child td { border-bottom: none; }
            .resume-box { margin-top: 25px; padding: 15px 20px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; display: inline-block; font-size: 14px; color: #166534; font-weight: 500; }
            .footer { background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer p { margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5; }
        </style>
    </head>
    <body>
        <div class='wrapper'>
            <div class='container'>
                <div class='header'>
                    <h1>New Career Application</h1>
                </div>
                <div class='content'>
                    <p>Hello HR Team,<br><br>A new job application has been submitted via the <strong>Careers</strong> page. Please review the candidate details below:</p>
                    
                    <table class='data-table'>
                        <tr><th>Date</th><td>{$currentDate}</td></tr>
                        <tr><th>Position Applied</th><td><strong style='color:#ff8d4b;'>{$data['position']}</strong></td></tr>
                        <tr><th>Full Name</th><td>{$data['fullName']}</td></tr>
                        <tr><th>Phone Number</th><td>{$data['phone']}</td></tr>
                        <tr><th>Email Address</th><td>{$data['email']}</td></tr>
                        <tr><th>Highest Qualification</th><td>" . ($data['qualification'] ?: 'N/A') . "</td></tr>
                        <tr><th>Current Salary</th><td>{$data['currentSalary']}</td></tr>
                        <tr><th>Current Location</th><td>{$data['location']}</td></tr>
                        <tr><th>Willing to Relocate</th><td>" . ucfirst($data['relocate']) . "</td></tr>
                        <tr><th>Notice Period</th><td>{$data['noticePeriod']}</td></tr>
                        {$descriptionRow}
                    </table>
                    
                    <div class='resume-box'>
                        📎 Attached Resume: {$resumeInfo}
                    </div>
                </div>
                <div class='footer'>
                    <p>This is an automated notification from the <strong>{$companyName}</strong> website.<br>Please do not reply to this system email directly.</p>
                </div>
            </div>
        </div>
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
    
    // Send email via custom SMTP
    $adminSent = send_smtp_mail($adminEmail, $adminSubject, $adminMessage, $adminHeaders);
    
    // ==========================================
    // 2. AUTO-REPLY TO CANDIDATE (PREMIUM DESIGN)
    // ==========================================
    
    $userSubject = "Application Received - {$companyName}";
    
    $userMessage = "<!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155; }
            .wrapper { width: 100%; padding: 40px 0; background-color: #f4f7f6; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
            .header { background: linear-gradient(135deg, #1e1e52, #28286e); padding: 30px; text-align: center; border-bottom: 4px solid #ff8d4b; }
            .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px; }
            .content { padding: 35px 30px; }
            .content p { font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 20px; color: #475569; }
            .highlight-box { background-color: #f8fafc; padding: 20px; border-left: 4px solid #ff8d4b; border-radius: 0 8px 8px 0; margin: 30px 0; }
            .highlight-box p { margin: 0; font-size: 14px; }
            .footer { background-color: #1e1e52; padding: 30px; text-align: center; }
            .footer p { margin: 0 0 5px 0; font-size: 13px; color: #94a3b8; }
            .footer .contact-info { color: #ffffff; font-weight: 500; font-size: 14px; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class='wrapper'>
            <div class='container'>
                <div class='header'>
                    <h1>Application Received</h1>
                </div>
                <div class='content'>
                    <p>Dear <strong>{$data['fullName']}</strong>,</p>
                    <p>Thank you for expressing your interest in joining <strong>{$companyName}</strong>. We have successfully received your application and resume for the position of <strong>{$data['position']}</strong>.</p>
                    <p>Our Talent Acquisition team is currently reviewing your profile to see if your experience and skills align with our current requirements.</p>
                    
                    <div class='highlight-box'>
                        <p><strong>What's Next?</strong><br>If your profile is shortlisted, our HR team will reach out to you directly to schedule an interview. Due to the high volume of applications, we only contact shortlisted candidates.</p>
                    </div>
                    
                    <p>We appreciate your interest in our company and wish you the best in your career endeavors.</p>
                    <br>
                    <p>Best Regards,<br><strong style='color: #1e1e52; font-size: 16px;'>HR Department, {$companyName}</strong></p>
                </div>
                <div class='footer'>
                    <p>31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122018</p>
                    <p>careers@pislinfra.com | pislinfra.com</p>
                    <p class='contact-info'>📞 085270 40411 | 070328 02501</p>
                </div>
            </div>
        </div>
    </body>
    </html>";
    
    $userHeaders = "MIME-Version: 1.0\r\n";
    $userHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
    $userHeaders .= "From: {$companyName} Careers <{$fromEmail}>\r\n";
    $userHeaders .= "Reply-To: {$adminEmail}\r\n";
    
    // Send email via custom SMTP
    if($adminSent) {
        send_smtp_mail($data['email'], $userSubject, $userMessage, $userHeaders);
    }
}
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

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

// Check if it's a POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get the JSON data sent from the React app
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Verify if data exists
    if ($data) {
        $fullName = htmlspecialchars($data['fullName'] ?? '');
        $companyName = htmlspecialchars($data['companyName'] ?? 'Not provided');
        $email = htmlspecialchars($data['email'] ?? '');
        $phone = htmlspecialchars($data['phone'] ?? '');
        $serviceRequired = htmlspecialchars($data['serviceRequired'] ?? '');
        $subject = htmlspecialchars($data['subject'] ?? 'New Inquiry from Website');
        $projectDetails = htmlspecialchars($data['projectDetails'] ?? '');

        // Validations
        if (empty($fullName) || empty($email) || empty($phone) || empty($projectDetails)) {
            echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
            exit;
        }

        $company = "PISL Infra";
        $to = "info@pislinfra.com"; // The email where inquiries will be received
        $fromEmail = "info@pislinfra.com"; 
        
        // ==========================================
        // 1. EMAIL TO ADMIN (PREMIUM DESIGN)
        // ==========================================
        $email_subject = "Website Inquiry: " . $subject . " - " . $fullName;
        $currentDate = date('d M Y, h:i A');
        
        $email_body = "<!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155; }
                .wrapper { width: 100%; padding: 40px 0; background-color: #f4f7f6; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
                .header { background: linear-gradient(135deg, #1e1e52, #28286e); padding: 30px; text-align: center; border-bottom: 4px solid #ff8d4b; }
                .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
                .content { padding: 35px 30px; }
                .content p { font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 25px; color: #475569; }
                .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
                .data-table th, .data-table td { padding: 16px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
                .data-table th { width: 35%; color: #64748b; font-weight: 600; background-color: #f8fafc; }
                .data-table td { color: #0f172a; font-weight: 500; }
                .data-table tr:last-child th, .data-table tr:last-child td { border-bottom: none; }
                .footer { background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0; }
                .footer p { margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5; }
            </style>
        </head>
        <body>
            <div class='wrapper'>
                <div class='container'>
                    <div class='header'>
                        <h1>New Website Inquiry</h1>
                    </div>
                    <div class='content'>
                        <p>Hello Team,<br><br>A new inquiry has been submitted via the <strong>Contact Us</strong> page. Please find the details below:</p>
                        
                        <table class='data-table'>
                            <tr><th>Date</th><td>{$currentDate}</td></tr>
                            <tr><th>Full Name</th><td>{$fullName}</td></tr>
                            <tr><th>Company Name</th><td>{$companyName}</td></tr>
                            <tr><th>Email Address</th><td>{$email}</td></tr>
                            <tr><th>Phone Number</th><td>{$phone}</td></tr>
                            <tr><th>Service Required</th><td>{$serviceRequired}</td></tr>
                            <tr><th>Subject</th><td>{$subject}</td></tr>
                            <tr><th>Project Details</th><td>" . nl2br($projectDetails) . "</td></tr>
                        </table>
                    </div>
                    <div class='footer'>
                        <p>This is an automated notification from the <strong>PISL Infra</strong> website.<br>Please do not reply to this system email directly.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>";

        // Headers for Admin Email
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: {$company} Website <{$fromEmail}>\r\n";
        $headers .= "Reply-To: $email\r\n";

        // Send the email to Admin via SMTP
        $adminSent = send_smtp_mail($to, $email_subject, $email_body, $headers);
        if (!$adminSent) {
            $adminSent = mail($to, $email_subject, $email_body, $headers);
        }

        if ($adminSent) {
            echo json_encode(["success" => true, "message" => "Email sent successfully!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to send email."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid data received."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

function send_smtp_mail($to, $subject, $body, $custom_headers, $cc_list = []) {
    $smtp_host = "ssl://smtp.gmail.com";
    $smtp_port = 465;
    $smtp_user = "info@pislinfra.com";
    // Using Google App Password
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

// Check if it's a POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get the JSON data sent from the React app
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Verify if data exists
    if ($data) {
        $fullName = htmlspecialchars($data['fullName'] ?? '');
        $companyName = htmlspecialchars($data['companyName'] ?? 'Not specified');
        $email = htmlspecialchars($data['email'] ?? '');
        $phone = htmlspecialchars($data['phone'] ?? '');
        $serviceRequired = htmlspecialchars($data['serviceRequired'] ?? 'General Inquiry');
        $subject = htmlspecialchars($data['subject'] ?? 'New Project Inquiry');
        $projectDetails = htmlspecialchars($data['projectDetails'] ?? '');

        // Validations
        if (empty($fullName) || empty($email) || empty($phone) || empty($projectDetails)) {
            echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
            exit;
        }

        $company = "Pislinfra";
        $to = "info@pislinfra.com"; // Primary recipient
        $cc_recipients = [
            "aayush@pislinfra.com",
            "rohitashv@pislinfra.com"
        ];
        $fromEmail = "info@pislinfra.com"; 
        
        // ==========================================
        // 1. PREMIUM EXECUTIVE HTML EMAIL TEMPLATE
        // ==========================================
        $email_subject = "New Inquiry: {$subject} - {$fullName} [{$companyName}]";
        $currentDate = date('d M Y, h:i A') . ' IST';
        
        $email_body = "<!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>New Website Inquiry</title>
        </head>
        <body style='margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;'>
            <table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0' style='background-color: #f1f5f9; padding: 40px 15px;'>
                <tr>
                    <td align='center'>
                        <table role='presentation' width='100%' style='max-width: 620px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;' cellspacing='0' cellpadding='0' border='0'>
                            
                            <!-- BRAND HEADER -->
                            <tr>
                                <td style='background: linear-gradient(135deg, #0B132B 0%, #1E2A5A 100%); padding: 32px 36px 28px; text-align: left; border-bottom: 3px solid #ff904e;'>
                                    <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                                        <tr>
                                            <td>
                                                <div style='font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;'>
                                                    <img src='https://pislinfra.com/White%20Logo.png' alt='Pislinfra' style='height: 35px; width: auto; display: block;' />
                                                </div>
                                                <div style='font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; font-weight: 600;'>
                                                    Industrial & Infrastructure EPC
                                                </div>
                                            </td>
                                            <td align='right'>
                                                <span style='display: inline-block; background-color: rgba(255, 144, 78, 0.18); border: 1px solid rgba(255, 144, 78, 0.4); color: #ffaa75; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;'>
                                                    Website Lead
                                                </span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- MAIN CONTENT AREA -->
                            <tr>
                                <td style='padding: 36px 36px 28px;'>
                                    <h2 style='margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;'>
                                        New Client Inquiry Received
                                    </h2>
                                    <p style='margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #64748b;'>
                                        A potential client has submitted a contact inquiry on <strong style='color: #0f172a;'>pislinfra.com</strong>. Quick details and requirements are summarized below:
                                    </p>

                                    <!-- CLIENT OVERVIEW CARD -->
                                    <table width='100%' cellspacing='0' cellpadding='0' border='0' style='background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 24px;'>
                                        <tr>
                                            <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; width: 35%; font-size: 13px; font-weight: 600; color: #64748b;'>Client Name</td>
                                            <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #0f172a;'>{$fullName}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b;'>Company / Org</td>
                                            <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a;'>{$companyName}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b;'>Direct Phone</td>
                                            <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600;'>
                                                <a href='tel:{$phone}' style='color: #2563eb; text-decoration: none; font-weight: 700;'>{$phone}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b;'>Email Address</td>
                                            <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px;'>
                                                <a href='mailto:{$email}' style='color: #2563eb; text-decoration: none; font-weight: 600;'>{$email}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #64748b;'>Solution Required</td>
                                            <td style='padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13.5px; font-weight: 700; color: #0284c7;'>{$serviceRequired}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 14px 18px; font-size: 13px; font-weight: 600; color: #64748b;'>Submission Time</td>
                                            <td style='padding: 14px 18px; font-size: 13px; color: #64748b;'>{$currentDate}</td>
                                        </tr>
                                    </table>

                                    <!-- PROJECT DETAILS MESSAGE BOX -->
                                    <div style='margin-bottom: 28px;'>
                                        <div style='font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #475569; margin-bottom: 10px;'>
                                            📋 Project Scope & Details:
                                        </div>
                                        <div style='background-color: #ffffff; border-left: 4px solid #ff904e; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 18px 20px; border-radius: 0 8px 8px 0; font-size: 14.5px; line-height: 1.7; color: #1e293b;'>
                                            " . nl2br($projectDetails) . "
                                        </div>
                                    </div>

                                    <!-- ACTION BUTTON -->
                                    <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                                        <tr>
                                            <td align='center'>
                                                <a href='mailto:{$email}?subject=Re:%20Pislinfra%20Inquiry%20-%20{$subject}' style='display: inline-block; background-color: #ff904e; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(255, 144, 78, 0.35); text-transform: uppercase; letter-spacing: 0.5px;'>
                                                    ✉️ Reply Directly to {$fullName}
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
                                        Auto-generated notification from the <strong style='color: #ffffff;'>Pislinfra</strong> website contact system.
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
        </html>";

        // Headers for Admin Email
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: {$company} Website <{$fromEmail}>\r\n";
        $headers .= "Reply-To: {$email}\r\n";

        // Send the email to Admin via SMTP with CC recipients
        $adminSent = send_smtp_mail($to, $email_subject, $email_body, $headers, $cc_recipients);
        if (!$adminSent) {
            $fallback_headers = $headers . "Cc: " . implode(", ", $cc_recipients) . "\r\n";
            $adminSent = mail($to, $email_subject, $email_body, $fallback_headers);
        }

        if ($adminSent) {
            echo json_encode(["success" => true, "message" => "Inquiry sent successfully!"]);
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
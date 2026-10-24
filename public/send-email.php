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
        ];
        $fromEmail = "info@pislinfra.com"; 
        
        // ==========================================
        // 1. PREMIUM BRANDED HTML EMAIL TEMPLATE (MATCHING EXACT PISL DESIGN)
        // ==========================================
        $email_subject = "New Contact Enquiry Received - {$fullName} [{$companyName}]";
        $currentDate = date('d M Y, h:i A');
        
        $email_body = "<!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>New Contact Enquiry Received</title>
            <style>
                body { margin: 0; padding: 30px 15px; background-color: #E2E8F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
                table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                img { border: 0; outline: none; text-decoration: none; }
            </style>
        </head>
        <body style='margin: 0; padding: 30px 15px; background-color: #E2E8F0; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;'>
            <table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0'>
                <tr>
                    <td align='center'>
                        <!-- CONTAINER (Max 660px) -->
                        <table role='presentation' width='100%' style='max-width: 660px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 36px rgba(15, 23, 42, 0.12); border: 1px solid #CBD5E1;' cellspacing='0' cellpadding='0' border='0'>
                            
                            <!-- 1. TOP BRAND HEADER -->
                            <tr>
                                <td style='background-color: #FFFFFF; padding: 26px 36px 22px 36px;'>
                                    <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                                        <tr>
                                            <!-- Left: Logo & Company Name -->
                                            <td valign='middle' align='left'>
                                                <table cellspacing='0' cellpadding='0' border='0'>
                                                    <tr>
                                                        <td>
                                                            <img src='https://pislinfra.com/logo.png' alt='PISL' height='38' style='height: 38px; width: auto; display: block;' />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style='padding-top: 6px;'>
                                                            <div style='font-size: 10px; font-weight: 800; color: #1E2A5A; letter-spacing: 2px; text-transform: uppercase;'>
                                                                PRAGATI INFRA SOLUTIONS
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>

                                            <!-- Right: Slogan with Orange Bar -->
                                            <td valign='middle' align='right'>
                                                <table cellspacing='0' cellpadding='0' border='0'>
                                                    <tr>
                                                        <td style='width: 3px; height: 32px; background-color: #FF6B35; border-radius: 2px;'></td>
                                                        <td style='padding-left: 12px; font-size: 15px; font-weight: 600; color: #1E2A5A; white-space: nowrap;'>
                                                            Building Better Tomorrow
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- 2. HERO BANNER (Navy with Construction Image) -->
                            <tr>
                                <td style='background-color: #0A1C3E; padding: 0;'>
                                    <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                                        <tr>
                                            <!-- Left Content -->
                                            <td valign='middle' style='padding: 34px 24px 34px 36px; width: 56%;'>
                                                <div style='font-size: 11px; font-weight: 800; color: #8FA6CD; letter-spacing: 2.2px; text-transform: uppercase; margin-bottom: 8px;'>
                                                    CONTACT US
                                                </div>
                                                <div style='font-size: 27px; line-height: 1.15; font-weight: 800; color: #FFFFFF; margin: 0;'>
                                                    New Contact Enquiry
                                                </div>
                                                <div style='font-size: 27px; line-height: 1.15; font-weight: 800; color: #FF6B35; margin-top: 2px;'>
                                                    Received
                                                </div>
                                                <!-- Orange Underline -->
                                                <div style='width: 44px; height: 3.5px; background-color: #FF6B35; border-radius: 2px; margin: 10px 0 16px 0;'></div>
                                                <div style='font-size: 13px; line-height: 1.55; color: #C5D4EC;'>
                                                    A new project enquiry has been submitted through the PISL website contact form.
                                                </div>
                                            </td>

                                            <!-- Right Image -->
                                            <td valign='middle' align='right' style='width: 44%; padding: 0; line-height: 0;'>
                                                <img src='https://pislinfra.com/images/email-hero-construction.jpg' alt='PISL Warehouse Construction' style='width: 100%; max-width: 290px; height: 100%; min-height: 220px; display: block; object-fit: cover;' />
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- 3. ENQUIRY DETAILS CARD AREA -->
                            <tr>
                                <td style='background-color: #F8FAFC; padding: 28px 28px 30px 28px;'>
                                    
                                    <!-- White Inner Card -->
                                    <table width='100%' cellspacing='0' cellpadding='0' border='0' style='background-color: #FFFFFF; border-radius: 14px; border: 1px solid #E2E8F0; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04); overflow: hidden;'>
                                        
                                        <!-- Card Header -->
                                        <tr>
                                            <td style='padding: 22px 24px 18px 24px; border-bottom: 1px solid #EDF2F7;'>
                                                <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                                                    <tr>
                                                        <td valign='middle' style='width: 46px;'>
                                                            <table cellspacing='0' cellpadding='0' border='0' style='width: 44px; height: 44px; background-color: #FF6B35; border-radius: 10px; text-align: center;'>
                                                                <tr>
                                                                    <td align='center' valign='middle'>
                                                                        <img src='https://pislinfra.com/images/email-icons/enquiry-mail.png' width='22' height='22' alt='Mail' style='display: block;' />
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                        <td valign='middle' style='padding-left: 14px;'>
                                                            <div style='font-size: 20px; font-weight: 800; color: #0F1E3D; line-height: 1.2;'>
                                                                Enquiry Details
                                                            </div>
                                                            <div style='font-size: 12.5px; color: #64748B; margin-top: 3px; font-weight: 500;'>
                                                                Received on {$currentDate}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>

                                        <!-- 2-Column Grid (6 Fields) -->
                                        <tr>
                                            <td style='padding: 0;'>
                                                <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                                                    
                                                    <!-- Row 1: Full Name & Company Name -->
                                                    <tr>
                                                        <!-- Field 1: Full Name -->
                                                        <td width='50%' valign='top' style='padding: 18px 20px; border-bottom: 1px solid #EDF2F7; border-right: 1px solid #EDF2F7;'>
                                                            <table cellspacing='0' cellpadding='0' border='0' width='100%'>
                                                                <tr>
                                                                    <td valign='middle' style='width: 40px;'>
                                                                        <table cellspacing='0' cellpadding='0' border='0' style='width: 38px; height: 38px; background-color: #EDF4FC; border-radius: 8px; text-align: center;'>
                                                                            <tr>
                                                                                <td align='center' valign='middle'>
                                                                                    <img src='https://pislinfra.com/images/email-icons/user.png' width='18' height='18' alt='User' style='display: block;' />
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                    <td valign='middle' style='padding-left: 12px;'>
                                                                        <div style='font-size: 11.5px; font-weight: 500; color: #64748B; margin-bottom: 3px;'>Full Name</div>
                                                                        <div style='font-size: 14.5px; font-weight: 700; color: #0F1E3D;'>{$fullName}</div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>

                                                        <!-- Field 2: Company Name -->
                                                        <td width='50%' valign='top' style='padding: 18px 20px; border-bottom: 1px solid #EDF2F7;'>
                                                            <table cellspacing='0' cellpadding='0' border='0' width='100%'>
                                                                <tr>
                                                                    <td valign='middle' style='width: 40px;'>
                                                                        <table cellspacing='0' cellpadding='0' border='0' style='width: 38px; height: 38px; background-color: #EDF4FC; border-radius: 8px; text-align: center;'>
                                                                            <tr>
                                                                                <td align='center' valign='middle'>
                                                                                    <img src='https://pislinfra.com/images/email-icons/company.png' width='18' height='18' alt='Company' style='display: block;' />
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                    <td valign='middle' style='padding-left: 12px;'>
                                                                        <div style='font-size: 11.5px; font-weight: 500; color: #64748B; margin-bottom: 3px;'>Company Name</div>
                                                                        <div style='font-size: 14.5px; font-weight: 700; color: #0F1E3D;'>{$companyName}</div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>

                                                    <!-- Row 2: Email & Phone -->
                                                    <tr>
                                                        <!-- Field 3: Email -->
                                                        <td width='50%' valign='top' style='padding: 18px 20px; border-bottom: 1px solid #EDF2F7; border-right: 1px solid #EDF2F7;'>
                                                            <table cellspacing='0' cellpadding='0' border='0' width='100%'>
                                                                <tr>
                                                                    <td valign='middle' style='width: 40px;'>
                                                                        <table cellspacing='0' cellpadding='0' border='0' style='width: 38px; height: 38px; background-color: #EDF4FC; border-radius: 8px; text-align: center;'>
                                                                            <tr>
                                                                                <td align='center' valign='middle'>
                                                                                    <img src='https://pislinfra.com/images/email-icons/email.png' width='18' height='18' alt='Email' style='display: block;' />
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                    <td valign='middle' style='padding-left: 12px;'>
                                                                        <div style='font-size: 11.5px; font-weight: 500; color: #64748B; margin-bottom: 3px;'>Email</div>
                                                                        <div style='font-size: 14px; font-weight: 700; color: #0F1E3D;'>
                                                                            <a href='mailto:{$email}' style='color: #0F1E3D; text-decoration: none;'>{$email}</a>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>

                                                        <!-- Field 4: Phone -->
                                                        <td width='50%' valign='top' style='padding: 18px 20px; border-bottom: 1px solid #EDF2F7;'>
                                                            <table cellspacing='0' cellpadding='0' border='0' width='100%'>
                                                                <tr>
                                                                    <td valign='middle' style='width: 40px;'>
                                                                        <table cellspacing='0' cellpadding='0' border='0' style='width: 38px; height: 38px; background-color: #EDF4FC; border-radius: 8px; text-align: center;'>
                                                                            <tr>
                                                                                <td align='center' valign='middle'>
                                                                                    <img src='https://pislinfra.com/images/email-icons/phone.png' width='18' height='18' alt='Phone' style='display: block;' />
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                    <td valign='middle' style='padding-left: 12px;'>
                                                                        <div style='font-size: 11.5px; font-weight: 500; color: #64748B; margin-bottom: 3px;'>Phone</div>
                                                                        <div style='font-size: 14.5px; font-weight: 700; color: #0F1E3D;'>
                                                                            <a href='tel:{$phone}' style='color: #0F1E3D; text-decoration: none;'>{$phone}</a>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>

                                                    <!-- Row 3: Service Required & Subject -->
                                                    <tr>
                                                        <!-- Field 5: Service Required -->
                                                        <td width='50%' valign='top' style='padding: 18px 20px; border-right: 1px solid #EDF2F7;'>
                                                            <table cellspacing='0' cellpadding='0' border='0' width='100%'>
                                                                <tr>
                                                                    <td valign='middle' style='width: 40px;'>
                                                                        <table cellspacing='0' cellpadding='0' border='0' style='width: 38px; height: 38px; background-color: #EDF4FC; border-radius: 8px; text-align: center;'>
                                                                            <tr>
                                                                                <td align='center' valign='middle'>
                                                                                    <img src='https://pislinfra.com/images/email-icons/service.png' width='18' height='18' alt='Service' style='display: block;' />
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                    <td valign='middle' style='padding-left: 12px;'>
                                                                        <div style='font-size: 11.5px; font-weight: 500; color: #64748B; margin-bottom: 3px;'>Service Required</div>
                                                                        <div style='font-size: 14px; font-weight: 700; color: #0F1E3D;'>{$serviceRequired}</div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>

                                                        <!-- Field 6: Subject -->
                                                        <td width='50%' valign='top' style='padding: 18px 20px;'>
                                                            <table cellspacing='0' cellpadding='0' border='0' width='100%'>
                                                                <tr>
                                                                    <td valign='middle' style='width: 40px;'>
                                                                        <table cellspacing='0' cellpadding='0' border='0' style='width: 38px; height: 38px; background-color: #EDF4FC; border-radius: 8px; text-align: center;'>
                                                                            <tr>
                                                                                <td align='center' valign='middle'>
                                                                                    <img src='https://pislinfra.com/images/email-icons/subject.png' width='18' height='18' alt='Subject' style='display: block;' />
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                    <td valign='middle' style='padding-left: 12px;'>
                                                                        <div style='font-size: 11.5px; font-weight: 500; color: #64748B; margin-bottom: 3px;'>Subject</div>
                                                                        <div style='font-size: 14px; font-weight: 700; color: #0F1E3D;'>{$subject}</div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>

                                                </table>
                                            </td>
                                        </tr>

                                        <!-- Bottom: Project Details Box -->
                                        <tr>
                                            <td style='padding: 0 20px 22px 20px;'>
                                                <table width='100%' cellspacing='0' cellpadding='0' border='0' style='background-color: #F0F5FA; border-radius: 10px; border: 1px solid #E2EEF8;'>
                                                    <tr>
                                                        <td style='padding: 18px 20px;'>
                                                            <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                                                                <tr>
                                                                    <td valign='top' style='width: 40px;'>
                                                                        <table cellspacing='0' cellpadding='0' border='0' style='width: 36px; height: 36px; background-color: #FFFFFF; border-radius: 8px; text-align: center; border: 1px solid #D6E4F5;'>
                                                                            <tr>
                                                                                <td align='center' valign='middle'>
                                                                                    <img src='https://pislinfra.com/images/email-icons/details.png' width='18' height='18' alt='Details' style='display: block;' />
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                    <td valign='top' style='padding-left: 14px;'>
                                                                        <div style='font-size: 13.5px; font-weight: 700; color: #0F1E3D; margin-bottom: 6px;'>
                                                                            Project Details
                                                                        </div>
                                                                        <div style='font-size: 13px; line-height: 1.6; color: #2D3E5E;'>
                                                                            " . nl2br($projectDetails) . "
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>

                                    </table>
                                </td>
                            </tr>

                            <!-- 4. FOOTER (Deep Corporate Navy) -->
                            <tr>
                                <td style='background-color: #06122B; padding: 32px 30px 24px 30px;'>
                                    
                                    <!-- 3 Contact Columns -->
                                    <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                                        <tr>
                                            <!-- Column 1: Call Us -->
                                            <td width='33%' valign='top' style='padding-right: 12px;'>
                                                <table cellspacing='0' cellpadding='0' border='0'>
                                                    <tr>
                                                        <td valign='middle' style='width: 42px;'>
                                                            <table cellspacing='0' cellpadding='0' border='0' style='width: 38px; height: 38px; background-color: #FF6B35; border-radius: 50%; text-align: center;'>
                                                                <tr>
                                                                    <td align='center' valign='middle'>
                                                                        <img src='https://pislinfra.com/images/email-icons/phone-white.png' width='17' height='17' alt='Call' style='display: block;' />
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                        <td valign='middle' style='padding-left: 10px;'>
                                                            <div style='font-size: 11px; font-weight: 600; color: #8FA6CD;'>Call Us</div>
                                                            <a href='tel:08527040411' style='font-size: 13.5px; font-weight: 700; color: #FFFFFF; text-decoration: none; display: block; margin-top: 2px; white-space: nowrap;'>085270 40411</a>
                                                            <div style='font-size: 10px; color: #8FA6CD; margin-top: 3px; line-height: 1.3;'>Mon – Sat: 9:00 AM – 6:00 PM</div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>

                                            <!-- Column 2: Email Us -->
                                            <td width='33%' valign='top' style='padding: 0 10px; border-left: 1px solid rgba(255, 255, 255, 0.08); border-right: 1px solid rgba(255, 255, 255, 0.08);'>
                                                <table cellspacing='0' cellpadding='0' border='0'>
                                                    <tr>
                                                        <td valign='middle' style='width: 42px;'>
                                                            <table cellspacing='0' cellpadding='0' border='0' style='width: 38px; height: 38px; background-color: #FF6B35; border-radius: 50%; text-align: center;'>
                                                                <tr>
                                                                    <td align='center' valign='middle'>
                                                                        <img src='https://pislinfra.com/images/email-icons/mail-white.png' width='17' height='17' alt='Email' style='display: block;' />
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                        <td valign='middle' style='padding-left: 10px;'>
                                                            <div style='font-size: 11px; font-weight: 600; color: #8FA6CD;'>Email Us</div>
                                                            <a href='mailto:info@pislinfra.com' style='font-size: 13.5px; font-weight: 700; color: #FFFFFF; text-decoration: none; display: block; margin-top: 2px;'>info@pislinfra.com</a>
                                                            <div style='font-size: 10px; color: #8FA6CD; margin-top: 3px;'>We reply within 24 hours</div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>

                                            <!-- Column 3: Visit Us -->
                                            <td width='34%' valign='top' style='padding-left: 12px;'>
                                                <table cellspacing='0' cellpadding='0' border='0'>
                                                    <tr>
                                                        <td valign='top' style='width: 42px; padding-top: 2px;'>
                                                            <table cellspacing='0' cellpadding='0' border='0' style='width: 38px; height: 38px; background-color: #FF6B35; border-radius: 50%; text-align: center;'>
                                                                <tr>
                                                                    <td align='center' valign='middle'>
                                                                        <img src='https://pislinfra.com/images/email-icons/pin-white.png' width='18' height='18' alt='Visit' style='display: block;' />
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                        <td valign='top' style='padding-left: 10px;'>
                                                            <div style='font-size: 11px; font-weight: 600; color: #8FA6CD;'>Visit Us</div>
                                                            <div style='font-size: 10.5px; line-height: 1.45; color: #C5D4EC; margin-top: 2px;'>
                                                                31 P, adj. to Medanta, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122018
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Horizontal Divider -->
                                    <div style='height: 1px; background-color: rgba(255, 255, 255, 0.12); margin: 26px 0 18px 0;'></div>

                                    <!-- Footer Automated Message Note -->
                                    <div style='text-align: center; font-size: 11px; line-height: 1.6; color: #8FA6CD;'>
                                        This is an automated email generated from the PISL website contact form.<br>
                                        Please do not reply to this email.
                                    </div>

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
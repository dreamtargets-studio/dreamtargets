<?php
// 1. Settings
$to = "paul@thinkamigo.com";
$subject = "Thinkamigo Professional Inquiry";

// 2. Anti-Spam Honeypot
if (!empty($_POST['honeypot'])) {
    exit; 
}

// 3. Collect and Sanitize Data
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars($_POST['message']);

// 4. Construct the Email Body
$body = "New message from Thinkamigo Contact Form:\n\n";
$body .= "From: $email\n";
$body .= "Message:\n$message";

// 5. Headers (Using your domain to ensure delivery)
$headers = "From: webmaster@thinkamigo.com" . "\r\n" .
           "Reply-To: $email";

// 6. Send and Redirect
if (mail($to, $subject, $body, $headers)) {
    header("Location: thanks.html"); 
    exit;
} else {
    echo "Something went wrong. Please email paul@thinkamigo.com directly.";
}
?>
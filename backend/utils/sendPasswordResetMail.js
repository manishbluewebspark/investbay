import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetPasswordMail = async (to, code) => {
  return transporter.sendMail({
    from: `"Support Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: " Password Reset Code",
    html: generateEmailTemplate(code),
  });
};

const generateEmailTemplate = (code) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 50px 40px;
        }
        
        .code-container {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            text-align: center;
            border: 2px dashed #667eea;
        }
        
        .code {
            font-size: 48px;
            font-weight: 700;
            letter-spacing: 10px;
            color: #333;
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            font-family: 'Courier New', monospace;
        }
        
        .message {
            color: #555;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
        }
        
        .timer {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: #fff5f5;
            padding: 12px 24px;
            border-radius: 50px;
            color: #e53e3e;
            font-weight: 500;
            margin: 20px 0;
        }
        
        .timer svg {
            width: 20px;
            height: 20px;
        }
        
        .warning {
            background: #fff8e1;
            border-left: 4px solid #ffb300;
            padding: 15px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .warning p {
            color: #5d4037;
            font-size: 14px;
        }
        
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 40px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .footer {
            text-align: center;
            padding: 30px;
            color: #888;
            font-size: 14px;
            border-top: 1px solid #eee;
        }
        
        .logo {
            display: inline-block;
            font-size: 24px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 15px;
        }
        
        .icon {
            display: inline-block;
            width: 64px;
            height: 64px;
            background: white;
            border-radius: 50%;
            padding: 15px;
            margin-bottom: 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .code {
                font-size: 36px;
                letter-spacing: 8px;
            }
            
            .button {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="content">
            <p class="message">Hello,</p>
            <p class="message">You requested a password reset for your account. Please use the verification code below:</p>
            
            <div class="code-container">
                <p style="color: #666; margin-bottom: 15px;">Your verification code:</p>
                <div class="code">${code}</div>
                <div class="timer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                        <path d="M13 7h-2v6h6v-2h-4z"/>
                    </svg>
                    Valid for 5 minutes
                </div>
            </div>
            
            <div class="warning">
                <p><strong>⚠️ Security Notice:</strong> This code will expire in 5 minutes. If you didn't request this, please ignore this email or contact our support team immediately.</p>
            </div>
          
        </div>
        
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} InvestBay. All rights reserved.</p>
            <p style="margin-top: 10px; font-size: 12px; color: #aaa;">
                For security reasons, never share this code with anyone.
            </p>
        </div>
    </div>
</body>
</html>
`;
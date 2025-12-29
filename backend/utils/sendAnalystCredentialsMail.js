// import { transporter } from "../config/mailer.js";

// export const sendAnalystCredentialsMail = async ({
//   to,
//   name,
//   userId,
//   password,
// }) => {
//   return transporter.sendMail({
//     to,
//     subject: "Your Research Analyst Login Credentials",
//     html: `
//       <h3>Welcome ${name}</h3>
//       <p>Your account has been created successfully.</p>
//       <p><b>User ID:</b> ${userId}</p>
//       <p><b>Password:</b> ${password}</p>
//       <p>Please change your password after first login.</p>
//     `,
//   });
// };
import { transporter } from "../config/mailer.js";

export const sendAnalystCredentialsMail = async ({
  to,
  name,
  userId,
  password,
}) => {
  return transporter.sendMail({
    to,
    subject: "Your Research Analyst Account Credentials",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Credentials</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          
          .logo {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: 10px;
          }
          
          .logo-subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 400;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .welcome-title {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 20px;
          }
          
          .welcome-message {
            color: #64748b;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.7;
          }
          
          .credentials-box {
            background: #f1f5f9;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            border-left: 4px solid #3b82f6;
          }
          
          .credential-item {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
          }
          
          .credential-item:last-child {
            margin-bottom: 0;
          }
          
          .credential-label {
            font-weight: 600;
            color: #475569;
            min-width: 100px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .credential-value {
            background: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 15px;
            color: #1e293b;
            border: 1px solid #e2e8f0;
            flex: 1;
            word-break: break-all;
          }
          
          .important-note {
            background: #fff7ed;
            border: 1px solid #fed7aa;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
          }
          
          .note-title {
            color: #ea580c;
            font-weight: 600;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .note-title svg {
            width: 20px;
            height: 20px;
          }
          
          .note-text {
            color: #9a3412;
            font-size: 14px;
            line-height: 1.6;
          }
          
          .instructions {
            background: #f0f9ff;
            border-radius: 12px;
            padding: 25px;
            margin-top: 30px;
          }
          
          .instructions-title {
            color: #0369a1;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .instructions-list {
            list-style: none;
          }
          
          .instructions-list li {
            margin-bottom: 10px;
            color: #0c4a6e;
            padding-left: 25px;
            position: relative;
          }
          
          .instructions-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #3b82f6;
            font-weight: bold;
          }
          
          .footer {
            background: #f1f5f9;
            padding: 25px 30px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer-text {
            margin-bottom: 10px;
          }
          
          .support-link {
            color: #3b82f6;
            text-decoration: none;
          }
          
          .support-link:hover {
            text-decoration: underline;
          }
          
          @media (max-width: 600px) {
            .content, .header, .footer {
              padding: 25px 20px;
            }
            
            .credential-item {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .credential-label {
              margin-bottom: 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">Research Analytics</div>
            <div class="logo-subtitle">Data-Driven Insights Platform</div>
          </div>
          
          <div class="content">
            <h1 class="welcome-title">Welcome, ${name}! 👋</h1>
            
            <p class="welcome-message">
              Your Research Analyst account has been successfully created. You now have access to our analytics platform where you can generate insights, analyze data, and create comprehensive reports.
            </p>
            
            <div class="credentials-box">
              <div class="credential-item">
                <span class="credential-label">User ID</span>
                <span class="credential-value">${userId}</span>
              </div>
              <div class="credential-item">
                <span class="credential-label">Password</span>
                <span class="credential-value">${password}</span>
              </div>
            </div>
            
            <div class="important-note">
              <div class="note-title">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"/>
                </svg>
                IMPORTANT SECURITY NOTICE
              </div>
              <p class="note-text">
                For security reasons, please change your password immediately after your first login. Do not share your credentials with anyone.
              </p>
            </div>
            
            <div class="instructions">
              <div class="instructions-title">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd"/>
                </svg>
                Getting Started Guide
              </div>
              <ul class="instructions-list">
                <li>Use the credentials above to log into the Research Analytics Platform</li>
                <li>Navigate to Account Settings to update your password</li>
                <li>Complete your profile information</li>
                <li>Review the platform documentation and tutorials</li>
                <li>Set up your preferred notification preferences</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              If you have any questions or need assistance, please contact our support team.
            </p>
            <p class="footer-text">
              <a href="mailto:support@researchanalytics.com" class="support-link">
                support@researchanalytics.com
              </a>
            </p>
            <p class="footer-text" style="margin-top: 15px; font-size: 12px; color: #94a3b8;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};
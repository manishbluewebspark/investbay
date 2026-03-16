// routes/terms.routes.js
import express from 'express';
import ejs from 'ejs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { transporter } from '../config/mailer.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Generate Terms HTML - YE ENDPOINT UI KE LIYE HAI
// router.post('/generate', async (req, res) => {
//     try {
//         const termsData = req.body;
        
//         console.log('Backend - /generate received:', {
//             hasSignature: !!termsData.signature,
//             signatureLength: termsData.signature ? termsData.signature.length : 0,
//             totalDataSize: JSON.stringify(termsData).length
//         });
        
//         // Agar signature bahut bada hai to compress karo
//         if (termsData.signature && termsData.signature.length > 1000000) {
//             console.log('Signature is very large, consider compressing on frontend');
//         }
        
//         // Validate required fields
//         const requiredFields = ['RA_FullName', 'UserName'];
//         const missingFields = requiredFields.filter(field => !termsData[field]);
        
//         if (missingFields.length > 0) {
//             return res.status(400).send(`Missing required fields: ${missingFields.join(', ')}`);
//         }
        
//         // Render EJS template
//         const templatePath = path.join(__dirname, '../views/terms.ejs');
//         const html = await ejs.renderFile(templatePath, termsData);
        
//         console.log('Backend - HTML generated:', {
//             length: html.length,
//             hasSignatureImg: html.includes('<img src='),
//             hasSignatureClass: html.includes('signature-image')
//         });
        
//         res.send(html);
//     } catch (error) {
//         console.error('Error generating terms:', error);
//         res.status(500).send('Error generating terms: ' + error.message);
//     }
// });


// Generate Terms HTML
router.post('/generate', async (req, res) => {
    try {
        const termsData = req.body;
        
        console.log('Backend - /generate received:', {
            hasRaSignature: !!termsData.RA_Signature,
            raSignatureLength: termsData.RA_Signature ? termsData.RA_Signature.length : 0,
            hasUserSignature: !!termsData.signature,
            userSignatureLength: termsData.signature ? termsData.signature.length : 0,
            totalDataSize: JSON.stringify(termsData).length
        });
        
        // Validate required fields
        const requiredFields = ['RA_FullName', 'UserName'];
        const missingFields = requiredFields.filter(field => !termsData[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).send(`Missing required fields: ${missingFields.join(', ')}`);
        }
        
        // Render EJS template
        const templatePath = path.join(__dirname, '../views/terms.ejs');
        const html = await ejs.renderFile(templatePath, termsData);
        
        console.log('Backend - HTML generated:', {
            length: html.length,
            hasRaSignatureImg: html.includes('RA Signature') || html.includes('signature-image'),
            hasUserSignatureImg: html.includes('User Signature') || (html.match(/<img[^>]*>/g) || []).length
        });
        
        res.send(html);
    } catch (error) {
        console.error('Error generating terms:', error);
        res.status(500).send('Error generating terms: ' + error.message);
    }
});         



// Generate PDF using Puppeteer
async function generatePDF(html) {
    let browser = null;
    try {
        browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            }
        });
        
        return pdfBuffer;
    } finally {
        if (browser) await browser.close();
    }
}

// Send email with PDF attachment
async function sendEmailWithPDF(userEmail, userName, pdfBuffer, isSigned = false) {
    const subject = isSigned 
        ? 'Signed Research Analyst Service Agreement' 
        : 'Research Analyst Service Agreement';
    
    const htmlContent = isSigned ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Signed Service Agreement</h2>
            <p>Dear <strong>${userName}</strong>,</p>
            <p>Please find attached your signed Research Analyst Service Agreement.</p>
            <p>This document is legally binding.</p>
            <p>Best regards,<br><strong>InvestBay Team</strong></p>
        </div>
    ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Research Analyst Service Agreement</h2>
            <p>Dear <strong>${userName}</strong>,</p>
            <p>Thank you for subscribing. Please find attached your Service Agreement.</p>
            <p>Best regards,<br><strong>InvestBay Team</strong></p>
        </div>
    `;

    const mailOptions = {
        from: `"InvestBay" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: subject,
        html: htmlContent,
        attachments: [
            {
                filename: isSigned ? 'Signed-Agreement.pdf' : 'Agreement.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf'
            }
        ]
    };

    return await transporter.sendMail(mailOptions);
}

// Save signed agreement - YE ENDPOINT FINAL SUBMISSION KE LIYE HAI
router.post('/save-signed', async (req, res) => {
    let pdfPath = null;
    
    try {
        const { termsData, userEmail, userName, signatureBase64 } = req.body;
        
        console.log('Backend - /save-signed received:', {
            hasTermsData: !!termsData,
            userEmail,
            userName,
            hasSignature: !!signatureBase64
        });
        
        if (!termsData || !userEmail || !userName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required data'
            });
        }
        
        // Terms data mein signature add karo
        termsData.signature = signatureBase64 || '';
        
        // YE IMPORTANT HAI - terms-agreement.ejs nahi, terms.ejs use karo
        const templatePath = path.join(__dirname, '../views/terms.ejs');
        console.log('Template path:', templatePath);
        
        const html = await ejs.renderFile(templatePath, termsData);
        console.log('HTML generated for PDF, has signature?', html.includes('<img src='));
        
        const pdfBuffer = await generatePDF(html);

        // Create temp directory
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        pdfPath = path.join(tempDir, `agreement-${Date.now()}.pdf`);
        fs.writeFileSync(pdfPath, pdfBuffer);

        // Send email
        await sendEmailWithPDF(userEmail, userName, pdfBuffer, true);

        // Clean up
        if (pdfPath && fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
        }

        res.json({
            success: true,
            message: 'Agreement sent successfully'
        });

    } catch (error) {
        console.error('Error in /save-signed:', error);
        if (pdfPath && fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


router.get('/signature/:analystId', async (req, res) => {
    try {
        const { analystId } = req.params;
        const result = await pool.query(
            'SELECT signature FROM research_analysts WHERE id = $1',
            [analystId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Analyst not found' });
        }
        
        res.json({ 
            success: true, 
            signature: result.rows[0].signature 
        });
    } catch (error) {
        console.error('Error fetching RA signature:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
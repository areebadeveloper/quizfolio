// Quick email test with your credentials
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔧 Testing Gmail Configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'NOT SET');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);

async function quickTest() {
    try {
        // Create transporter with your Gmail settings
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        console.log('\n🔍 Verifying connection...');
        await transporter.verify();
        console.log('✅ Gmail connection successful!');

        console.log('\n📧 Sending test email...');
        const info = await transporter.sendMail({
            from: `QuizFolio <${process.env.EMAIL_USER}>`,
            to: process.env.TEST_EMAIL || 'mailtonooralam@gmail.com',
            subject: '✅ QuizFolio Email Test - Success!',
            text: 'This is a test email from your QuizFolio localhost setup. Email service is working correctly!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
                    <h2 style="color: #4CAF50;">✅ Email Test Successful!</h2>
                    <p>Your QuizFolio email service is working correctly from localhost!</p>
                    <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 0; color: #2196F3;"><strong>Email configuration is ready for production!</strong></p>
                    </div>
                    <p style="color: #666; font-size: 14px;">Sent at: ${new Date().toLocaleString()}</p>
                    <p style="color: #666;">From: QuizFolio Backend</p>
                </div>
            `
        });

        console.log('✅ Email sent successfully!');
        console.log('📋 Message ID:', info.messageId);
        console.log('📧 Sent to:', process.env.TEST_EMAIL || 'mailtonooralam@gmail.com');
        
        console.log('\n🎉 EMAIL SERVICE IS WORKING! 🎉');
        console.log('Your QuizFolio can now send emails from localhost!');

    } catch (error) {
        console.error('❌ Email test failed:', error.message);
        
        if (error.code === 'EAUTH') {
            console.log('\n🔧 Authentication Error - Check these:');
            console.log('1. Make sure 2-Factor Authentication is enabled on Gmail');
            console.log('2. Use App Password, not regular Gmail password');
            console.log('3. Generate new App Password: Google Account → Security → App passwords');
        } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
            console.log('\n🔧 Connection Error - Check these:');
            console.log('1. Internet connection is working');
            console.log('2. Firewall/antivirus not blocking port 587');
            console.log('3. Try different network if on restricted wifi');
        }
    }
}

quickTest(); 
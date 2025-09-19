// Test actual email sending to verify SendGrid configuration
require('dotenv').config();

async function testActualEmailSending() {
    console.log('🚀 Testing ACTUAL Email Delivery to Real User\n');
    
    try {
        // Check if SendGrid is configured
        console.log('📋 SendGrid Configuration:');
        console.log(`API Key: ${process.env.SENDGRID_API_KEY ? 'Configured ✅' : 'Not configured ❌'}`);
        console.log(`From Email: geekasad@gmail.com`);
        console.log(`To Email: mailtonooralam@gmail.com\n`);
        
        if (!process.env.SENDGRID_API_KEY) {
            console.log('❌ SendGrid API key not found in environment variables');
            console.log('📧 Email will be logged instead of sent');
            console.log('');
            console.log('🔧 To enable real sending, add to your .env file:');
            console.log('SENDGRID_API_KEY=your_api_key_here');
            return;
        }
        
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
            to: 'mailtonooralam@gmail.com',
            from: 'geekasad@gmail.com', // Must be verified in SendGrid
            subject: '✅ QuizFolio Real Email Test - SUCCESS!',
            text: 'Hello! This is a REAL email sent from QuizFolio to your actual email address. If you received this, the email system is working perfectly!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 30px; border-radius: 10px;">
                        <h1 style="margin: 0;">✅ REAL EMAIL SUCCESS!</h1>
                        <p style="margin: 10px 0 0 0;">QuizFolio Email System Test</p>
                    </div>
                    <div style="background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #28a745;">🎉 Email Delivery Confirmed!</h2>
                        <p>Hello!</p>
                        <p>This is a <strong>REAL email</strong> sent from QuizFolio to your actual email address.</p>
                        <p>If you received this email, it means:</p>
                        <ul>
                            <li>✅ QuizFolio email system is working</li>
                            <li>✅ SendGrid is properly configured</li>
                            <li>✅ Emails can be sent to real users</li>
                            <li>✅ Your application is ready for production</li>
                        </ul>
                        <p style="color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px;">
                            Sent at: ${new Date().toLocaleString()}<br>
                            From: QuizFolio Email System<br>
                            Server: localhost:5000
                        </p>
                    </div>
                </div>
            `
        };
        
        console.log('📧 Attempting to send REAL email via SendGrid...');
        console.log(`From: ${msg.from}`);
        console.log(`To: ${msg.to}`);
        console.log(`Subject: ${msg.subject}`);
        console.log('');
        
        const result = await sgMail.send(msg);
        
        console.log('🎉 SUCCESS! REAL EMAIL SENT!');
        console.log(`✅ Email delivered to: ${msg.to}`);
        console.log(`📧 Message ID: ${result[0].headers['x-message-id']}`);
        console.log(`📮 Status: ${result[0].statusCode} ${result[0].statusMessage}`);
        console.log('');
        console.log('🚀 Check your email inbox at: mailtonooralam@gmail.com');
        console.log('📧 The email should arrive within a few minutes!');
        
    } catch (error) {
        console.error('❌ Email sending failed:');
        console.error(`Error: ${error.message}`);
        
        if (error.response?.body) {
            console.error('SendGrid Response:', JSON.stringify(error.response.body, null, 2));
        }
        
        console.log('\n🔧 TROUBLESHOOTING:');
        
        if (error.message.includes('verified Sender Identity')) {
            console.log('📧 Sender verification issue:');
            console.log('1. Go to https://app.sendgrid.com/');
            console.log('2. Navigate to Settings → Sender Authentication');
            console.log('3. Verify the email: geekasad@gmail.com');
            console.log('4. Wait for verification email and complete the process');
        } else if (error.message.includes('Forbidden')) {
            console.log('🔑 API key issue:');
            console.log('1. Check if your SendGrid API key is correct');
            console.log('2. Ensure the API key has "Mail Send" permissions');
            console.log('3. Try creating a new API key');
        } else {
            console.log('💡 General troubleshooting:');
            console.log('1. Verify your SendGrid account is active');
            console.log('2. Check if you have remaining email credits');
            console.log('3. Ensure your account is not suspended');
        }
        
        console.log('\n📧 For now, emails will be logged to console instead of sent.');
    }
}

// Run the test
testActualEmailSending(); 
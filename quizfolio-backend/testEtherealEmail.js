// Test email using Ethereal Email (no Gmail required)
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🧪 Testing Ethereal Email (Gmail Alternative)...\n');

async function testEtherealEmail() {
    try {
        console.log('🔄 Creating Ethereal Email test account...');
        
        // Create test account with Ethereal Email
        const testAccount = await nodemailer.createTestAccount();
        
        console.log('✅ Test account created!');
        console.log(`📧 User: ${testAccount.user}`);
        console.log(`🔐 Pass: ${testAccount.pass}`);
        console.log(`🌐 SMTP: ${testAccount.smtp.host}:${testAccount.smtp.port}`);
        
        // Create transporter using Ethereal Email
        const transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        
        console.log('\n🔍 Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection successful!');
        
        console.log('\n📧 Sending test email...');
        const info = await transporter.sendMail({
            from: `QuizFolio Test <${testAccount.user}>`,
            to: 'test@example.com',
            subject: '✅ QuizFolio Email Test - Ethereal Email',
            text: 'This is a test email using Ethereal Email service. Perfect for testing without Gmail restrictions!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
                    <h2 style="color: #4CAF50;">✅ Email Test Successful!</h2>
                    <p>Your QuizFolio email service is working with <strong>Ethereal Email</strong>!</p>
                    <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 0; color: #1976d2;"><strong>Alternative email service working perfectly!</strong></p>
                    </div>
                    <p style="color: #666; font-size: 14px;">Sent at: ${new Date().toLocaleString()}</p>
                    <p style="color: #666;">No Gmail restrictions or network issues!</p>
                </div>
            `
        });
        
        console.log('✅ Email sent successfully!');
        console.log(`📋 Message ID: ${info.messageId}`);
        console.log(`👀 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        
        console.log('\n🎉 ETHEREAL EMAIL WORKING! 🎉');
        console.log('This proves your Node.js and Nodemailer setup is correct.');
        console.log('The Gmail issue is likely network/firewall related.');
        
        console.log('\n💡 SOLUTIONS FOR GMAIL:');
        console.log('1. 🔥 Temporarily disable Windows Firewall');
        console.log('2. 🛡️ Temporarily disable antivirus');
        console.log('3. 📱 Try mobile hotspot instead of current internet');
        console.log('4. 🏢 If on corporate network, ask IT to unblock SMTP ports');
        console.log('5. 🌐 Try different DNS servers (8.8.8.8, 1.1.1.1)');
        
        return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
        
    } catch (error) {
        console.error('❌ Ethereal Email test failed:', error.message);
        console.log('\n🔍 This suggests a deeper Node.js/network issue.');
        return { success: false, error: error.message };
    }
}

async function setupEtherealForQuizFolio() {
    console.log('\n🔧 Setting up Ethereal Email for QuizFolio...');
    
    try {
        const testAccount = await nodemailer.createTestAccount();
        
        console.log('\n📝 Add these to your .env file for testing:');
        console.log('# Ethereal Email (for testing)');
        console.log(`ETHEREAL_USER=${testAccount.user}`);
        console.log(`ETHEREAL_PASS=${testAccount.pass}`);
        console.log(`ETHEREAL_HOST=${testAccount.smtp.host}`);
        console.log(`ETHEREAL_PORT=${testAccount.smtp.port}`);
        console.log(`ETHEREAL_SECURE=${testAccount.smtp.secure}`);
        
        console.log('\n💡 Then update your emailService.js to use Ethereal when Gmail fails.');
        
    } catch (error) {
        console.error('❌ Failed to create Ethereal account:', error.message);
    }
}

// Run tests
testEtherealEmail().then((result) => {
    if (result.success) {
        console.log(`\n🌐 Open this URL to see the sent email: ${result.previewUrl}`);
        setupEtherealForQuizFolio();
    }
}); 
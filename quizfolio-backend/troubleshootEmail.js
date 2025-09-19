// Email troubleshooting script
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔧 QuizFolio Email Troubleshooting...\n');

// Test different Gmail configurations
const configs = [
    {
        name: 'Gmail STARTTLS (Port 587)',
        config: {
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
        }
    },
    {
        name: 'Gmail SSL (Port 465)',
        config: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        }
    },
    {
        name: 'Gmail with Connection Timeout (Port 587)',
        config: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            connectionTimeout: 60000,
            greetingTimeout: 30000,
            socketTimeout: 60000,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        }
    }
];

async function testConfig(configData) {
    console.log(`\n🧪 Testing: ${configData.name}`);
    console.log(`📍 Host: ${configData.config.host}:${configData.config.port}`);
    console.log(`🔒 Secure: ${configData.config.secure}`);
    
    try {
        const transporter = nodemailer.createTransport(configData.config);
        
        console.log('   🔍 Verifying connection...');
        await transporter.verify();
        console.log('   ✅ Connection successful!');
        
        console.log('   📧 Sending test email...');
        const info = await transporter.sendMail({
            from: `QuizFolio Test <${process.env.EMAIL_USER}>`,
            to: process.env.TEST_EMAIL || 'mailtonooralam@gmail.com',
            subject: `✅ QuizFolio Test - ${configData.name}`,
            text: `Test email using ${configData.name} configuration. Sent at: ${new Date().toLocaleString()}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">✅ Email Test Successful!</h2>
                    <p><strong>Configuration:</strong> ${configData.name}</p>
                    <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
                    <p>Your QuizFolio email service is working correctly!</p>
                </div>
            `
        });
        
        console.log('   ✅ Email sent successfully!');
        console.log(`   📋 Message ID: ${info.messageId}`);
        console.log(`   📧 Sent to: ${process.env.TEST_EMAIL || 'mailtonooralam@gmail.com'}`);
        
        return { success: true, config: configData.name, messageId: info.messageId };
        
    } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        console.log(`   🔍 Error Code: ${error.code || 'Unknown'}`);
        
        if (error.code === 'EAUTH') {
            console.log('   💡 This is an authentication error - Gmail credentials issue');
        } else if (error.code === 'ETIMEDOUT') {
            console.log('   💡 This is a timeout error - network/firewall issue');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('   💡 Connection refused - port might be blocked');
        } else if (error.code === 'ENOTFOUND') {
            console.log('   💡 Host not found - DNS issue');
        }
        
        return { success: false, config: configData.name, error: error.message, code: error.code };
    }
}

async function runTroubleshooting() {
    console.log('📋 Configuration Check:');
    console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? 'Set (' + process.env.EMAIL_USER + ')' : 'NOT SET'}`);
    console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? 'Set (****...)' : 'NOT SET'}`);
    console.log(`TEST_EMAIL: ${process.env.TEST_EMAIL || 'mailtonooralam@gmail.com'}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    
    const results = [];
    
    for (const config of configs) {
        const result = await testConfig(config);
        results.push(result);
        
        if (result.success) {
            console.log(`\n🎉 SUCCESS! ${result.config} is working!`);
            break; // Stop on first success
        }
        
        // Wait a bit between attempts
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n📊 TROUBLESHOOTING SUMMARY:');
    console.log('=' .repeat(50));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    if (successful.length > 0) {
        console.log('✅ WORKING CONFIGURATIONS:');
        successful.forEach(r => {
            console.log(`   - ${r.config} (Message ID: ${r.messageId})`);
        });
    }
    
    if (failed.length > 0) {
        console.log('\n❌ FAILED CONFIGURATIONS:');
        failed.forEach(r => {
            console.log(`   - ${r.config}: ${r.error} (${r.code || 'Unknown'})`);
        });
    }
    
    if (successful.length === 0) {
        console.log('\n🔧 TROUBLESHOOTING RECOMMENDATIONS:');
        console.log('1. ✅ Check Gmail App Password:');
        console.log('   - Enable 2-Factor Authentication on Gmail');
        console.log('   - Generate new App Password: Google Account → Security → App passwords');
        console.log('   - Use the App Password, not your regular Gmail password');
        console.log('');
        console.log('2. 🔥 Check Firewall/Antivirus:');
        console.log('   - Temporarily disable firewall/antivirus');
        console.log('   - Allow Node.js through Windows Firewall');
        console.log('   - Check if ports 587 and 465 are blocked');
        console.log('');
        console.log('3. 🌐 Network Issues:');
        console.log('   - Try different internet connection');
        console.log('   - Check if you\'re on corporate/restricted network');
        console.log('   - Try mobile hotspot');
        console.log('');
        console.log('4. 📧 Alternative Email Services:');
        console.log('   - Consider using Ethereal Email for testing');
        console.log('   - Try SendGrid or other SMTP services');
    } else {
        console.log('\n🎉 EMAIL SERVICE IS READY!');
        console.log('Update your .env file to use the working configuration.');
    }
}

runTroubleshooting(); 
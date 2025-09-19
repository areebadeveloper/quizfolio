require('dotenv').config();
const emailService = require('./services/emailService');

async function testEmailService() {
    console.log('🚀 Starting QuizFolio Email Service Tests...\n');

    try {
        // Test 1: Verify Connection
        console.log('1️⃣ Testing email service connection...');
        const isConnected = await emailService.verifyConnection();
        if (!isConnected) {
            throw new Error('Email service connection failed');
        }
        console.log('✅ Connection test passed\n');

        // Test 2: Send Test Email
        console.log('2️⃣ Sending test email...');
        const testResult = await emailService.sendTestEmail();
        console.log(`✅ Test email result:`, testResult.message);
        console.log(`📧 Mode: ${testResult.mode}\n`);

        // Test 3: Send Welcome Email
        console.log('3️⃣ Testing welcome email template...');
        const welcomeResult = await emailService.sendWelcomeEmail(
            'mailtonooralam@gmail.com',
            'Test User',
            'student'
        );
        console.log(`✅ Welcome email result:`, welcomeResult.message);
        console.log(`📧 Mode: ${welcomeResult.mode}\n`);

        // Test 4: Send Password Reset Email
        console.log('4️⃣ Testing password reset email template...');
        const resetResult = await emailService.sendPasswordResetEmail(
            'mailtonooralam@gmail.com',
            'http://localhost:3000/reset-password/test-token-123'
        );
        console.log(`✅ Password reset email result:`, resetResult.message);
        console.log(`📧 Mode: ${resetResult.mode}\n`);

        // Test 5: Send Quiz Notification
        console.log('5️⃣ Testing quiz notification email template...');
        const quizResult = await emailService.sendQuizNotification(
            'mailtonooralam@gmail.com',
            'Test Student',
            {
                title: 'Mathematics Quiz 1',
                teacherName: 'Mr. Smith',
                subject: 'Mathematics',
                duration: '30 minutes',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                url: 'http://localhost:3000/quiz/test-quiz-123'
            }
        );
        console.log(`✅ Quiz notification result:`, quizResult.message);
        console.log(`📧 Mode: ${quizResult.mode}\n`);

        // Test 6: Send Custom Email
        console.log('6️⃣ Testing custom email template...');
        const customResult = await emailService.sendCustomEmail(
            ['mailtonooralam@gmail.com'],
            'Custom Test Email',
            'This is a custom test message from QuizFolio email service.\n\nIt supports multiple lines\nand different formatting!'
        );
        console.log(`✅ Custom email result:`, customResult.message);
        console.log(`📧 Mode: ${customResult.mode}\n`);

        console.log('🎉 All email service tests completed successfully!');
        console.log('\n📋 Summary:');
        console.log('✅ Connection verification');
        console.log('✅ Test email');
        console.log('✅ Welcome email template');
        console.log('✅ Password reset email template');
        console.log('✅ Quiz notification email template');
        console.log('✅ Custom email template');
        
        if (process.env.NODE_ENV === 'development') {
            console.log('\n💡 Note: Running in development mode - emails are logged to console instead of being sent.');
            console.log('💡 Set NODE_ENV=production and provide EMAIL_USER & EMAIL_PASSWORD to actually send emails.');
        }

    } catch (error) {
        console.error('❌ Email service test failed:', error.message);
        console.error('\n🔍 Troubleshooting:');
        console.error('1. Make sure you have a .env file with EMAIL_USER and EMAIL_PASSWORD');
        console.error('2. EMAIL_USER should be your Gmail address');
        console.error('3. EMAIL_PASSWORD should be your Gmail App Password (not your regular password)');
        console.error('4. Enable 2-factor authentication on Gmail and generate an App Password');
        process.exit(1);
    }
}

// Check configuration
console.log('🔧 Email Configuration Check:');
console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Configured' : '❌ Not configured'}`);
console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✅ Configured' : '❌ Not configured'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`TEST_EMAIL: ${process.env.TEST_EMAIL || 'mailtonooralam@gmail.com'}\n`);

// Run tests
testEmailService(); 
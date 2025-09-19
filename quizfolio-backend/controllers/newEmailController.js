const emailService = require('../services/emailService');
const User = require('../models/user');

// Test email endpoint
exports.testEmail = async (req, res) => {
    try {
        const { testEmail } = req.body;
        
        console.log('🧪 Testing email service...');
        const result = await emailService.sendTestEmail(testEmail);
        
        res.status(200).json({
            success: true,
            message: result.message,
            mode: result.mode,
            ...(result.messageId && { messageId: result.messageId })
        });
    } catch (error) {
        console.error('Test email failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error.message
        });
    }
};

// Send custom email to multiple recipients
exports.sendCustomEmail = async (req, res) => {
    try {
        const { recipients, subject, message } = req.body;

        // Validation
        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Recipients array is required and cannot be empty'
            });
        }

        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Subject and message are required'
            });
        }

        console.log(`📧 Sending custom email to ${recipients.length} recipients`);
        const result = await emailService.sendCustomEmail(recipients, subject, message);

        res.status(200).json({
            success: true,
            message: result.message,
            mode: result.mode,
            recipientCount: recipients.length,
            ...(result.messageId && { messageId: result.messageId })
        });
    } catch (error) {
        console.error('Custom email failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send custom email',
            error: error.message
        });
    }
};

// Send email to users by IDs
exports.sendEmailToUsers = async (req, res) => {
    try {
        const { userIds, subject, message } = req.body;

        // Validation
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'User IDs array is required and cannot be empty'
            });
        }

        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Subject and message are required'
            });
        }

        // Find users and get their emails
        const users = await User.find({ _id: { $in: userIds } });
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found with provided IDs'
            });
        }

        const emails = users.map(user => user.email);
        console.log(`📧 Sending email to ${users.length} users`);
        
        const result = await emailService.sendCustomEmail(emails, subject, message);

        res.status(200).json({
            success: true,
            message: result.message,
            mode: result.mode,
            recipientCount: users.length,
            recipients: emails,
            ...(result.messageId && { messageId: result.messageId })
        });
    } catch (error) {
        console.error('Send email to users failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email to users',
            error: error.message
        });
    }
};

// Send welcome email to new user
exports.sendWelcomeEmail = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log(`👋 Sending welcome email to ${user.email}`);
        const result = await emailService.sendWelcomeEmail(user.email, user.name, user.userType);

        res.status(200).json({
            success: true,
            message: result.message,
            mode: result.mode,
            recipient: user.email,
            ...(result.messageId && { messageId: result.messageId })
        });
    } catch (error) {
        console.error('Welcome email failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send welcome email',
            error: error.message
        });
    }
};

// Send quiz notification
exports.sendQuizNotification = async (req, res) => {
    try {
        const { studentIds, quizData } = req.body;

        // Validation
        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Student IDs array is required'
            });
        }

        if (!quizData || !quizData.title || !quizData.teacherName) {
            return res.status(400).json({
                success: false,
                message: 'Quiz data with title and teacher name is required'
            });
        }

        // Find students
        const students = await User.find({ 
            _id: { $in: studentIds },
            userType: 'student'
        });

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No students found with provided IDs'
            });
        }

        console.log(`📝 Sending quiz notification to ${students.length} students`);
        
        // Send notifications to all students
        const results = await Promise.all(
            students.map(student => 
                emailService.sendQuizNotification(student.email, student.name, quizData)
            )
        );

        res.status(200).json({
            success: true,
            message: `Quiz notifications sent to ${students.length} students`,
            mode: results[0]?.mode,
            recipientCount: students.length,
            recipients: students.map(s => ({ name: s.name, email: s.email }))
        });
    } catch (error) {
        console.error('Quiz notification failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send quiz notification',
            error: error.message
        });
    }
};

// Verify email service connection
exports.verifyEmailService = async (req, res) => {
    try {
        console.log('🔍 Verifying email service connection...');
        const isConnected = await emailService.verifyConnection();
        
        res.status(200).json({
            success: isConnected,
            message: isConnected ? 'Email service is ready' : 'Email service connection failed',
            config: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                user: process.env.EMAIL_USER ? 'Configured' : 'Not configured',
                password: process.env.EMAIL_PASSWORD ? 'Configured' : 'Not configured'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to verify email service',
            error: error.message
        });
    }
}; 
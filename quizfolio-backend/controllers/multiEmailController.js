const multiEmailService = require('../services/multiEmailService');
const User = require('../models/user');

// Get email service status
exports.getStatus = async (req, res) => {
    try {
        const status = await multiEmailService.getStatus();
        res.status(200).json({
            success: true,
            ...status
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get email service status',
            error: error.message
        });
    }
};

// Send test email to verify service is working
exports.sendTestEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const testEmail = email || 'mailtonooralam@gmail.com';
        
        console.log(`📧 Sending test email to: ${testEmail}`);
        
        const result = await multiEmailService.sendTestEmail(testEmail);
        
        res.status(200).json({
            success: true,
            message: 'Test email sent successfully!',
            service: result.service,
            messageId: result.messageId,
            recipient: testEmail,
            ...(result.previewUrl && { previewUrl: result.previewUrl }),
            ...(result.note && { note: result.note })
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

// Send welcome email to new user
exports.sendWelcomeEmail = async (req, res) => {
    try {
        const { email, name, userType } = req.body;
        
        if (!email || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email and name are required'
            });
        }
        
        console.log(`👋 Sending welcome email to: ${email}`);
        
        const result = await multiEmailService.sendWelcomeEmail(email, name, userType || 'User');
        
        res.status(200).json({
            success: true,
            message: 'Welcome email sent successfully!',
            service: result.service,
            messageId: result.messageId,
            recipient: email,
            ...(result.previewUrl && { previewUrl: result.previewUrl })
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

// Send notification email
exports.sendNotification = async (req, res) => {
    try {
        const { recipients, subject, message } = req.body;
        
        if (!recipients || !message) {
            return res.status(400).json({
                success: false,
                message: 'Recipients and message are required'
            });
        }
        
        // Convert single recipient to array
        const recipientList = Array.isArray(recipients) ? recipients : [recipients];
        
        console.log(`📢 Sending notification to ${recipientList.length} recipient(s)`);
        
        const results = [];
        
        // Send to each recipient
        for (const recipient of recipientList) {
            try {
                const result = await multiEmailService.sendNotification(
                    recipient,
                    subject || 'Notification from QuizFolio',
                    message
                );
                results.push({
                    recipient,
                    success: true,
                    messageId: result.messageId,
                    service: result.service
                });
            } catch (error) {
                results.push({
                    recipient,
                    success: false,
                    error: error.message
                });
            }
        }
        
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        res.status(200).json({
            success: true,
            message: `Notification sent to ${successful.length}/${recipientList.length} recipients`,
            totalRecipients: recipientList.length,
            successful: successful.length,
            failed: failed.length,
            results: results
        });
    } catch (error) {
        console.error('Notification email failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send notification email',
            error: error.message
        });
    }
};

// Send email to users by their IDs
exports.sendEmailToUsers = async (req, res) => {
    try {
        const { userIds, subject, message } = req.body;
        
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'User IDs array is required'
            });
        }
        
        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }
        
        // Find users
        const users = await User.find({ _id: { $in: userIds } });
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found with provided IDs'
            });
        }
        
        console.log(`📧 Sending emails to ${users.length} users`);
        
        const results = [];
        
        // Send to each user
        for (const user of users) {
            try {
                const result = await multiEmailService.sendNotification(
                    user.email,
                    subject || 'Message from QuizFolio',
                    message
                );
                results.push({
                    userId: user._id,
                    email: user.email,
                    name: user.name,
                    success: true,
                    messageId: result.messageId,
                    service: result.service
                });
            } catch (error) {
                results.push({
                    userId: user._id,
                    email: user.email,
                    name: user.name,
                    success: false,
                    error: error.message
                });
            }
        }
        
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        res.status(200).json({
            success: true,
            message: `Emails sent to ${successful.length}/${users.length} users`,
            totalUsers: users.length,
            successful: successful.length,
            failed: failed.length,
            results: results
        });
    } catch (error) {
        console.error('Send email to users failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send emails to users',
            error: error.message
        });
    }
};

// Send custom email with full control
exports.sendCustomEmail = async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;
        
        if (!to) {
            return res.status(400).json({
                success: false,
                message: 'Recipient email is required'
            });
        }
        
        if (!text && !html) {
            return res.status(400).json({
                success: false,
                message: 'Either text or html content is required'
            });
        }
        
        console.log(`📧 Sending custom email to: ${to}`);
        
        const result = await multiEmailService.sendEmail({
            to,
            subject: subject || 'Message from QuizFolio',
            text,
            html
        });
        
        res.status(200).json({
            success: true,
            message: 'Custom email sent successfully!',
            service: result.service,
            messageId: result.messageId,
            recipient: to,
            ...(result.previewUrl && { previewUrl: result.previewUrl })
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
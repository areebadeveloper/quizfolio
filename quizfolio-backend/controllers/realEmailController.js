const workingEmailService = require('../services/workingEmailService');

// Send test email to real user
exports.sendTestEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const targetEmail = email || 'mailtonooralam@gmail.com';
        
        console.log(`🚀 Preparing email for real user: ${targetEmail}`);
        
        const result = await workingEmailService.sendTestEmail(targetEmail);
        
        res.status(200).json({
            success: true,
            message: 'Email processed for real user delivery!',
            service: result.service,
            messageId: result.messageId,
            recipient: targetEmail,
            mode: result.mode,
            delivered: result.delivered,
            ...(result.previewUrl && { previewUrl: result.previewUrl }),
            ...(result.note && { note: result.note })
        });
    } catch (error) {
        console.error('Email processing failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process email',
            error: error.message
        });
    }
};

// Send welcome email to real user
exports.sendWelcomeEmail = async (req, res) => {
    try {
        const { email, name, userType } = req.body;
        
        if (!email || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email and name are required'
            });
        }
        
        console.log(`👋 Preparing welcome email for real user: ${email}`);
        
        const result = await workingEmailService.sendWelcomeEmail(email, name, userType || 'User');
        
        res.status(200).json({
            success: true,
            message: 'Welcome email processed for real user!',
            service: result.service,
            messageId: result.messageId,
            recipient: email,
            mode: result.mode,
            delivered: result.delivered,
            ...(result.previewUrl && { previewUrl: result.previewUrl })
        });
    } catch (error) {
        console.error('Welcome email processing failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process welcome email',
            error: error.message
        });
    }
};

// Send notification to real user
exports.sendNotification = async (req, res) => {
    try {
        const { email, subject, message } = req.body;
        
        if (!email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Email and message are required'
            });
        }
        
        console.log(`📢 Preparing notification for real user: ${email}`);
        
        const result = await workingEmailService.sendNotification(
            email,
            subject || 'Notification from QuizFolio',
            message
        );
        
        res.status(200).json({
            success: true,
            message: 'Notification processed for real user!',
            service: result.service,
            messageId: result.messageId,
            recipient: email,
            mode: result.mode,
            delivered: result.delivered,
            ...(result.previewUrl && { previewUrl: result.previewUrl })
        });
    } catch (error) {
        console.error('Notification processing failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process notification',
            error: error.message
        });
    }
};

// Send custom real email
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
        
        console.log(`📧 Preparing custom email for real user: ${to}`);
        
        const result = await workingEmailService.sendEmail({
            to,
            subject: subject || 'Message from QuizFolio',
            text,
            html
        });
        
        res.status(200).json({
            success: true,
            message: 'Custom email processed for real user!',
            service: result.service,
            messageId: result.messageId,
            recipient: to,
            mode: result.mode,
            delivered: result.delivered,
            ...(result.previewUrl && { previewUrl: result.previewUrl })
        });
    } catch (error) {
        console.error('Custom email processing failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process custom email',
            error: error.message
        });
    }
};

// Get email service status
exports.getStatus = async (req, res) => {
    try {
        const status = workingEmailService.getStatus();
        
        res.status(200).json({
            success: true,
            ...status,
            note: 'Email service ready for real user delivery'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get email service status',
            error: error.message
        });
    }
}; 
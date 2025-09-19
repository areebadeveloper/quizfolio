// SendGrid email service for sending REAL emails to actual users
// Uses HTTP API instead of SMTP to bypass firewall/network issues
require('dotenv').config();

class SendGridEmailService {
    constructor() {
        this.apiKey = process.env.SENDGRID_API_KEY || 'demo_mode';
        this.fromEmail = process.env.SENDGRID_FROM || 'geekasad@gmail.com'; // Use your Gmail as sender
        // Enable real sending when API key is available
        this.isDemoMode = !process.env.SENDGRID_API_KEY; // Will be false if API key exists
        
        if (this.isDemoMode) {
            console.log('📧 SendGrid in DEMO mode (shows beautiful email previews)');
        } else {
            console.log('📧 SendGrid configured for REAL email delivery');
        }
    }

    async sendEmail({ to, subject, text, html, from }) {
        try {
            if (this.isDemoMode) {
                return this.simulateEmailSending({ to, subject, text, html });
            } else {
                return this.sendRealEmail({ to, subject, text, html, from });
            }
        } catch (error) {
            console.error('❌ SendGrid email failed:', error.message);
            throw error;
        }
    }

    async sendRealEmail({ to, subject, text, html, from }) {
        try {
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(this.apiKey);

            const msg = {
                to: to,
                from: from || this.fromEmail,
                subject: subject,
                text: text,
                html: html || text,
            };

            console.log(`📧 Sending REAL email via SendGrid to: ${to}`);
            const result = await sgMail.send(msg);
            
            return {
                success: true,
                service: 'SendGrid API',
                messageId: result[0].headers['x-message-id'] || 'sg-' + Date.now(),
                recipient: to,
                mode: 'production',
                message: 'Real email sent successfully to actual user!'
            };
        } catch (error) {
            console.error('SendGrid API error:', error.response?.body || error.message);
            throw new Error(`SendGrid API failed: ${error.message}`);
        }
    }

    simulateEmailSending({ to, subject, text, html }) {
        console.log(`📧 SIMULATING email send to: ${to}`);
        console.log(`📧 Subject: ${subject}`);
        console.log('📧 Demo mode - would send to real user if SendGrid configured');
        
        // Create a demo preview URL
        const demoUrl = `data:text/html;charset=utf-8,${encodeURIComponent(html || `<pre>${text}</pre>`)}`;
        
        return {
            success: true,
            service: 'SendGrid Demo Mode',
            messageId: 'demo-' + Date.now(),
            recipient: to,
            mode: 'demo',
            message: 'Email simulated successfully (would send to real user if configured)',
            previewUrl: demoUrl,
            note: 'DEMO MODE: Copy preview URL to browser to see email content'
        };
    }

    // Professional email templates
    getTemplate(templateName, data = {}) {
        const templates = {
            test: {
                subject: '✅ QuizFolio Email Test - REAL DELIVERY!',
                text: `Hello!\n\nThis is a REAL email sent to your actual email address from QuizFolio!\n\nEmail service is working perfectly and ready for production use.\n\nSent at: ${new Date().toLocaleString()}\n\nBest regards,\nQuizFolio Team`,
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>QuizFolio Email Test</title>
                    </head>
                    <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
                        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 40px 20px;">
                                <h1 style="margin: 0; font-size: 28px; font-weight: 600;">✅ REAL EMAIL DELIVERY!</h1>
                                <p style="margin: 15px 0 0 0; font-size: 16px; opacity: 0.9;">QuizFolio Email Service Test</p>
                            </div>
                            <div style="padding: 40px 30px;">
                                <h2 style="color: #28a745; margin: 0 0 20px 0; font-size: 24px;">🎉 Success! This is a REAL email!</h2>
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">Hello!</p>
                                <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">This email was sent to your <strong>actual email address</strong> from QuizFolio!</p>
                                
                                <div style="background: #d4f3d0; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                    <p style="margin: 0 0 10px 0; color: #155724; font-weight: 600;">✅ Email delivery confirmed!</p>
                                    <p style="margin: 0; color: #155724; font-size: 14px;">Our email service is working perfectly and can send emails to any user!</p>
                                </div>
                                
                                <div style="margin: 30px 0;">
                                    <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">What this means:</h3>
                                    <ul style="margin: 0; padding: 0 0 0 20px; color: #666;">
                                        <li style="margin: 8px 0;">✅ Email service is fully functional</li>
                                        <li style="margin: 8px 0;">✅ Can send welcome emails to new users</li>
                                        <li style="margin: 8px 0;">✅ Can send quiz notifications</li>
                                        <li style="margin: 8px 0;">✅ Can send password reset emails</li>
                                        <li style="margin: 8px 0;">✅ Can send any custom messages</li>
                                    </ul>
                                </div>
                                
                                <div style="border-top: 2px solid #eee; padding-top: 25px; margin-top: 35px; text-align: center; color: #666; font-size: 14px;">
                                    <p style="margin: 0;">Sent at: ${new Date().toLocaleString()}</p>
                                    <p style="margin: 10px 0 0 0;">Best regards,<br><strong style="color: #333;">QuizFolio Team</strong></p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            },
            welcome: {
                subject: `Welcome to QuizFolio, ${data.name || 'User'}! 🎉`,
                text: `Hi ${data.name || 'User'},\n\nWelcome to QuizFolio! Your account has been created successfully.\n\nAccount Details:\n- Name: ${data.name || 'N/A'}\n- Email: ${data.email || 'N/A'}\n- User Type: ${data.userType || 'User'}\n\nYou can now start exploring quizzes and enhance your learning experience!\n\nLogin at: http://localhost:8100\n\nBest regards,\nQuizFolio Team`,
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Welcome to QuizFolio</title>
                    </head>
                    <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
                        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; text-align: center; padding: 50px 20px;">
                                <h1 style="margin: 0; font-size: 32px; font-weight: 600;">Welcome to QuizFolio! 🎉</h1>
                                <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">Your learning journey starts here!</p>
                            </div>
                            <div style="padding: 40px 30px;">
                                <h2 style="color: #4CAF50; margin: 0 0 20px 0; font-size: 24px;">Hi ${data.name || 'User'}! 👋</h2>
                                <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">Welcome to QuizFolio! Your account has been created successfully.</p>
                                
                                <div style="background: #f8f9fa; border-left: 4px solid #4CAF50; padding: 25px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                                    <h3 style="margin: 0 0 15px 0; color: #4CAF50; font-size: 18px;">Account Details:</h3>
                                    <p style="margin: 8px 0; font-size: 15px;"><strong>Name:</strong> ${data.name || 'N/A'}</p>
                                    <p style="margin: 8px 0; font-size: 15px;"><strong>Email:</strong> ${data.email || 'N/A'}</p>
                                    <p style="margin: 8px 0; font-size: 15px;"><strong>User Type:</strong> ${data.userType || 'User'}</p>
                                </div>
                                
                                <p style="margin: 25px 0; font-size: 16px; line-height: 1.6;">You can now start exploring quizzes and enhance your learning experience!</p>
                                
                                <div style="text-align: center; margin: 40px 0;">
                                    <a href="http://localhost:8100" style="background: #4CAF50; color: white; padding: 15px 35px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">Start Learning Now!</a>
                                </div>
                                
                                <div style="border-top: 2px solid #eee; padding-top: 25px; margin-top: 35px; text-align: center; color: #666; font-size: 14px;">
                                    <p style="margin: 0;">Best regards,<br><strong style="color: #333;">The QuizFolio Team</strong></p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            },
            notification: {
                subject: data.subject || 'Notification from QuizFolio',
                text: `${data.message || 'You have a new notification from QuizFolio.'}\n\nSent at: ${new Date().toLocaleString()}\n\nBest regards,\nQuizFolio Team`,
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>QuizFolio Notification</title>
                    </head>
                    <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
                        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; text-align: center; padding: 40px 20px;">
                                <h1 style="margin: 0; font-size: 24px; font-weight: 600;">📢 QuizFolio Notification</h1>
                            </div>
                            <div style="padding: 40px 30px;">
                                <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 25px; margin: 20px 0; border-radius: 0 8px 8px 0; font-size: 16px; line-height: 1.6;">
                                    ${(data.message || 'You have a new notification from QuizFolio.').replace(/\n/g, '<br>')}
                                </div>
                                <div style="border-top: 2px solid #eee; padding-top: 25px; margin-top: 35px; text-align: center; color: #666; font-size: 14px;">
                                    <p style="margin: 0;">Sent at: ${new Date().toLocaleString()}</p>
                                    <p style="margin: 10px 0 0 0;">Best regards,<br><strong style="color: #333;">QuizFolio Team</strong></p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            }
        };
        
        return templates[templateName] || templates.notification;
    }

    // Helper methods
    async sendTestEmail(email = 'mailtonooralam@gmail.com') {
        const template = this.getTemplate('test', {});
        return this.sendEmail({
            to: email,
            subject: template.subject,
            text: template.text,
            html: template.html
        });
    }

    async sendWelcomeEmail(email, name, userType) {
        const template = this.getTemplate('welcome', {
            name: name,
            email: email,
            userType: userType
        });
        return this.sendEmail({
            to: email,
            subject: template.subject,
            text: template.text,
            html: template.html
        });
    }

    async sendNotification(email, subject, message) {
        const template = this.getTemplate('notification', {
            subject: subject,
            message: message
        });
        return this.sendEmail({
            to: email,
            subject: template.subject,
            text: template.text,
            html: template.html
        });
    }

    getStatus() {
        return {
            configured: !this.isDemoMode,
            mode: this.isDemoMode ? 'demo' : 'production',
            canSendReal: true,
            apiKey: this.isDemoMode ? 'Not configured' : 'Configured',
            fromEmail: this.fromEmail,
            message: this.isDemoMode ? 
                'Demo mode - simulates email sending (configure SENDGRID_API_KEY for real delivery)' : 
                'Production mode - sends real emails to actual users via SendGrid API'
        };
    }
}

// Export singleton instance
const sendGridEmailService = new SendGridEmailService();
module.exports = sendGridEmailService; 
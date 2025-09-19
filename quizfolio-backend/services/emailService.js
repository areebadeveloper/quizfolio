const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    // Initialize the email transporter
    initializeTransporter() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // STARTTLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    // Verify connection
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email service ready');
            return true;
        } catch (error) {
            console.error('❌ Email service failed:', error.message);
            return false;
        }
    }

    // Log email in development mode
    logEmail(to, subject, content, type = 'text') {
        console.log('\n========== EMAIL LOGGED (DEV MODE) ==========');
        console.log(`To: ${Array.isArray(to) ? to.join(', ') : to}`);
        console.log(`From: ${process.env.EMAIL_USER}`);
        console.log(`Subject: ${subject}`);
        console.log(`Type: ${type}`);
        console.log('Content:');
        console.log(content);
        console.log('============================================\n');
    }

    // Send email with templates
    async sendEmail({ to, subject, text, html, template, templateData }) {
        try {
            const isDev = process.env.NODE_ENV === 'development';
            
            // Prepare email content
            let emailContent = {
                from: `QuizFolio <${process.env.EMAIL_USER}>`,
                to: Array.isArray(to) ? to.join(', ') : to,
                subject: subject,
            };

            // Use template if provided
            if (template && templateData) {
                const templateContent = await this.renderTemplate(template, templateData);
                emailContent.html = templateContent.html;
                emailContent.text = templateContent.text;
            } else {
                if (html) emailContent.html = html;
                if (text) emailContent.text = text;
            }

            // Development mode - just log
            if (isDev) {
                this.logEmail(to, subject, emailContent.text || emailContent.html, html ? 'html' : 'text');
                return {
                    success: true,
                    mode: 'development',
                    message: 'Email logged to console (development mode)'
                };
            }

            // Production mode - actually send
            const info = await this.transporter.sendMail(emailContent);
            console.log('✅ Email sent successfully:', info.messageId);
            
            return {
                success: true,
                mode: 'production',
                messageId: info.messageId,
                message: 'Email sent successfully'
            };

        } catch (error) {
            console.error('❌ Email sending failed:', error);
            throw new Error(`Email sending failed: ${error.message}`);
        }
    }

    // Render email templates
    async renderTemplate(templateName, data) {
        const templates = {
            welcome: {
                subject: 'Welcome to QuizFolio!',
                text: `Hi ${data.name},\n\nWelcome to QuizFolio! Your account has been created successfully.\n\nUser Type: ${data.userType}\nEmail: ${data.email}\n\nStart exploring quizzes and enhance your learning experience!\n\nBest regards,\nQuizFolio Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #4CAF50;">Welcome to QuizFolio! 🎉</h2>
                        <p>Hi <strong>${data.name}</strong>,</p>
                        <p>Welcome to QuizFolio! Your account has been created successfully.</p>
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Account Details:</strong></p>
                            <p>User Type: ${data.userType}</p>
                            <p>Email: ${data.email}</p>
                        </div>
                        <p>Start exploring quizzes and enhance your learning experience!</p>
                        <p style="color: #666;">Best regards,<br>QuizFolio Team</p>
                    </div>
                `
            },
            passwordReset: {
                subject: 'Password Reset Request - QuizFolio',
                text: `Hi,\n\nYou requested a password reset for your QuizFolio account.\n\nClick the link below to reset your password:\n${data.resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nQuizFolio Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #ff6b6b;">Password Reset Request 🔐</h2>
                        <p>Hi,</p>
                        <p>You requested a password reset for your QuizFolio account.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${data.resetUrl}" style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                        </div>
                        <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
                        <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                        <p style="color: #666;">Best regards,<br>QuizFolio Team</p>
                    </div>
                `
            },
            quizNotification: {
                subject: `New Quiz Available: ${data.quizTitle}`,
                text: `Hi ${data.studentName},\n\nA new quiz "${data.quizTitle}" has been assigned to you by ${data.teacherName}.\n\nQuiz Details:\n- Subject: ${data.subject || 'N/A'}\n- Duration: ${data.duration || 'N/A'}\n- Due Date: ${data.dueDate || 'No due date'}\n\nLog in to QuizFolio to start the quiz.\n\nBest regards,\nQuizFolio Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2196F3;">New Quiz Available! 📝</h2>
                        <p>Hi <strong>${data.studentName}</strong>,</p>
                        <p>A new quiz <strong>"${data.quizTitle}"</strong> has been assigned to you by ${data.teacherName}.</p>
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Quiz Details:</strong></p>
                            <p>Subject: ${data.subject || 'N/A'}</p>
                            <p>Duration: ${data.duration || 'N/A'}</p>
                            <p>Due Date: ${data.dueDate || 'No due date'}</p>
                        </div>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${data.quizUrl || '#'}" style="background: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Take Quiz</a>
                        </div>
                        <p style="color: #666;">Best regards,<br>QuizFolio Team</p>
                    </div>
                `
            },
            custom: {
                subject: data.subject || 'Message from QuizFolio',
                text: data.message,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #4CAF50;">QuizFolio Notification</h2>
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            ${data.message.replace(/\n/g, '<br>')}
                        </div>
                        <p style="color: #666;">Best regards,<br>QuizFolio Team</p>
                    </div>
                `
            }
        };

        const template = templates[templateName];
        if (!template) {
            throw new Error(`Template ${templateName} not found`);
        }

        return {
            subject: template.subject,
            text: template.text,
            html: template.html
        };
    }

    // Quick methods for common email types
    async sendWelcomeEmail(userEmail, userName, userType) {
        return this.sendEmail({
            to: userEmail,
            template: 'welcome',
            templateData: {
                name: userName,
                email: userEmail,
                userType: userType
            }
        });
    }

    async sendPasswordResetEmail(userEmail, resetUrl) {
        return this.sendEmail({
            to: userEmail,
            template: 'passwordReset',
            templateData: {
                resetUrl: resetUrl
            }
        });
    }

    async sendQuizNotification(studentEmail, studentName, quizData) {
        return this.sendEmail({
            to: studentEmail,
            template: 'quizNotification',
            templateData: {
                studentName,
                quizTitle: quizData.title,
                teacherName: quizData.teacherName,
                subject: quizData.subject,
                duration: quizData.duration,
                dueDate: quizData.dueDate,
                quizUrl: quizData.url
            }
        });
    }

    async sendCustomEmail(recipients, subject, message) {
        return this.sendEmail({
            to: recipients,
            template: 'custom',
            templateData: {
                subject: subject,
                message: message
            }
        });
    }

    // Send test email
    async sendTestEmail(testEmail = null) {
        const recipient = testEmail || process.env.TEST_EMAIL || 'mailtonooralam@gmail.com';
        
        return this.sendEmail({
            to: recipient,
            subject: 'QuizFolio Email Service Test ✅',
            text: 'This is a test email from QuizFolio email service. If you received this, the email configuration is working correctly!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
                    <h2 style="color: #4CAF50;">✅ Email Service Test</h2>
                    <p>This is a test email from <strong>QuizFolio</strong> email service.</p>
                    <p>If you received this, the email configuration is working correctly! 🎉</p>
                    <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 0; color: #2196F3;"><strong>Email service is ready for production use!</strong></p>
                    </div>
                    <p style="color: #666; font-size: 14px;">Sent at: ${new Date().toLocaleString()}</p>
                </div>
            `
        });
    }
}

// Create and export singleton instance
const emailService = new EmailService();

module.exports = emailService; 
// Multi-approach email service with multiple fallback options
require('dotenv').config();
const nodemailer = require('nodemailer');

class MultiEmailService {
    constructor() {
        this.transporters = [];
        this.currentTransporter = null;
        this.initializeTransporters();
    }

    async initializeTransporters() {
        console.log('🔧 Initializing multi-email service...');
        
        // Approach 1: Gmail with different configurations
        const gmailConfigs = [
            {
                name: 'Gmail-SSL-465',
                config: {
                    service: 'gmail',
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
                name: 'Gmail-STARTTLS-587',
                config: {
                    service: 'gmail',
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
                name: 'Gmail-Extended-Timeout',
                config: {
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    connectionTimeout: 120000,
                    greetingTimeout: 60000,
                    socketTimeout: 120000,
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

        // Only add Gmail if credentials are provided
        if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            this.transporters.push(...gmailConfigs);
        }

        // Approach 2: Outlook/Hotmail (if user provides credentials)
        if (process.env.OUTLOOK_USER && process.env.OUTLOOK_PASSWORD) {
            this.transporters.push({
                name: 'Outlook-SMTP',
                config: {
                    host: 'smtp-mail.outlook.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.OUTLOOK_USER,
                        pass: process.env.OUTLOOK_PASSWORD,
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                }
            });
        }

        // Approach 3: SendGrid (HTTP API - bypasses SMTP issues)
        if (process.env.SENDGRID_API_KEY) {
            this.transporters.push({
                name: 'SendGrid-API',
                config: 'sendgrid' // Special marker for SendGrid
            });
        }

        // Approach 4: Always add Ethereal as fallback for testing
        this.transporters.push({
            name: 'Ethereal-Fallback',
            config: 'ethereal' // Special marker for Ethereal
        });

        console.log(`✅ Initialized ${this.transporters.length} email transporter(s)`);
    }

    async createEtherealTransporter() {
        try {
            const testAccount = await nodemailer.createTestAccount();
            return {
                transporter: nodemailer.createTransport({
                    host: testAccount.smtp.host,
                    port: testAccount.smtp.port,
                    secure: testAccount.smtp.secure,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                }),
                credentials: testAccount
            };
        } catch (error) {
            throw new Error(`Failed to create Ethereal account: ${error.message}`);
        }
    }

    async sendWithSendGrid(mailOptions) {
        try {
            // Dynamic import of SendGrid (install if needed)
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            const msg = {
                to: mailOptions.to,
                from: process.env.SENDGRID_FROM || process.env.EMAIL_USER,
                subject: mailOptions.subject,
                text: mailOptions.text,
                html: mailOptions.html,
            };

            const result = await sgMail.send(msg);
            return {
                success: true,
                messageId: result[0].headers['x-message-id'],
                service: 'SendGrid',
                response: 'Email sent via SendGrid API'
            };
        } catch (error) {
            throw new Error(`SendGrid failed: ${error.message}`);
        }
    }

    async findWorkingTransporter() {
        console.log('🔍 Finding working email transporter...');
        
        for (let i = 0; i < this.transporters.length; i++) {
            const transporterConfig = this.transporters[i];
            console.log(`\n📧 Testing: ${transporterConfig.name}`);
            
            try {
                let transporter;
                let credentials = null;
                
                if (transporterConfig.config === 'ethereal') {
                    // Create Ethereal transporter
                    const etherealData = await this.createEtherealTransporter();
                    transporter = etherealData.transporter;
                    credentials = etherealData.credentials;
                    console.log(`   📧 Ethereal Email: ${credentials.user}`);
                } else if (transporterConfig.config === 'sendgrid') {
                    // SendGrid doesn't need verification
                    console.log('   ✅ SendGrid API ready');
                    this.currentTransporter = { type: 'sendgrid', name: transporterConfig.name };
                    return { success: true, name: transporterConfig.name, service: 'SendGrid API' };
                } else {
                    // Regular SMTP transporter
                    transporter = nodemailer.createTransport(transporterConfig.config);
                }
                
                if (transporter) {
                    console.log('   🔍 Verifying connection...');
                    await transporter.verify();
                    console.log('   ✅ Connection successful!');
                    
                    this.currentTransporter = {
                        type: 'smtp',
                        transporter: transporter,
                        name: transporterConfig.name,
                        credentials: credentials
                    };
                    
                    return {
                        success: true,
                        name: transporterConfig.name,
                        service: credentials ? 'Ethereal Email' : 'SMTP',
                        credentials: credentials
                    };
                }
            } catch (error) {
                console.log(`   ❌ Failed: ${error.message}`);
            }
        }
        
        throw new Error('No working email transporter found');
    }

    async sendEmail({ to, subject, text, html, template, templateData }) {
        try {
            // Find working transporter if not already set
            if (!this.currentTransporter) {
                const result = await this.findWorkingTransporter();
                console.log(`✅ Using: ${result.name} (${result.service})`);
            }

            // Prepare email content
            let emailContent = {
                from: `QuizFolio <${process.env.EMAIL_USER || 'noreply@quizfolio.com'}>`,
                to: Array.isArray(to) ? to.join(', ') : to,
                subject: subject || 'Message from QuizFolio',
                text: text || 'This email requires HTML support to display properly.',
                html: html || `<p>${text || 'Message from QuizFolio'}</p>`
            };

            // Apply template if provided
            if (template && templateData) {
                const templateContent = this.renderTemplate(template, templateData);
                emailContent.subject = templateContent.subject;
                emailContent.text = templateContent.text;
                emailContent.html = templateContent.html;
            }

            let result;

            // Send based on transporter type
            if (this.currentTransporter.type === 'sendgrid') {
                result = await this.sendWithSendGrid(emailContent);
            } else {
                // Regular SMTP sending
                const info = await this.currentTransporter.transporter.sendMail(emailContent);
                result = {
                    success: true,
                    messageId: info.messageId,
                    service: this.currentTransporter.name,
                    response: info.response
                };

                // Add preview URL for Ethereal
                if (this.currentTransporter.credentials) {
                    result.previewUrl = nodemailer.getTestMessageUrl(info);
                    result.note = 'Ethereal Email - Check preview URL to see the email';
                }
            }

            console.log(`✅ Email sent successfully via ${result.service}`);
            console.log(`📧 To: ${emailContent.to}`);
            console.log(`📋 Message ID: ${result.messageId}`);
            
            if (result.previewUrl) {
                console.log(`👀 Preview: ${result.previewUrl}`);
            }

            return result;

        } catch (error) {
            console.error(`❌ Email sending failed: ${error.message}`);
            
            // Reset transporter and try again once
            if (this.currentTransporter) {
                console.log('🔄 Resetting transporter and trying again...');
                this.currentTransporter = null;
                return this.sendEmail({ to, subject, text, html, template, templateData });
            }
            
            throw error;
        }
    }

    renderTemplate(templateName, data) {
        const templates = {
            welcome: {
                subject: 'Welcome to QuizFolio! 🎉',
                text: `Hi ${data.name},\n\nWelcome to QuizFolio! Your account has been created successfully.\n\nUser Type: ${data.userType}\nEmail: ${data.email}\n\nStart exploring quizzes and enhance your learning experience!\n\nBest regards,\nQuizFolio Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; overflow: hidden;">
                        <div style="padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px;">Welcome to QuizFolio! 🎉</h1>
                        </div>
                        <div style="background: white; color: #333; padding: 30px;">
                            <p style="font-size: 16px;">Hi <strong>${data.name}</strong>,</p>
                            <p>Welcome to QuizFolio! Your account has been created successfully.</p>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                                <p style="margin: 0; font-weight: bold; color: #667eea;">Account Details:</p>
                                <p style="margin: 5px 0;">User Type: ${data.userType}</p>
                                <p style="margin: 5px 0;">Email: ${data.email}</p>
                            </div>
                            <p>Start exploring quizzes and enhance your learning experience!</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="#" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">Get Started</a>
                            </div>
                            <p style="color: #666; text-align: center;">Best regards,<br><strong>QuizFolio Team</strong></p>
                        </div>
                    </div>
                `
            },
            test: {
                subject: '✅ QuizFolio Email Test - SUCCESS!',
                text: `This is a test email from QuizFolio.\n\nIf you received this email, the email service is working correctly!\n\nSent at: ${new Date().toLocaleString()}\n\nBest regards,\nQuizFolio Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; background: #f8f9fa; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 40px;">
                            <h1 style="margin: 0; font-size: 32px;">✅ Email Test SUCCESS!</h1>
                        </div>
                        <div style="padding: 30px; background: white;">
                            <p style="font-size: 18px; color: #28a745; font-weight: bold;">🎉 QuizFolio Email Service is Working!</p>
                            <p>If you received this email, the email service is working correctly!</p>
                            <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0; color: #155724;"><strong>✅ Email delivery confirmed!</strong></p>
                                <p style="margin: 10px 0 0 0; color: #155724;">Your QuizFolio application can now send emails to real users.</p>
                            </div>
                            <p style="color: #666; font-size: 14px;">Sent at: ${new Date().toLocaleString()}</p>
                            <p style="color: #666;">Best regards,<br><strong>QuizFolio Team</strong></p>
                        </div>
                    </div>
                `
            },
            notification: {
                subject: data.subject || 'Notification from QuizFolio',
                text: `${data.message}\n\nBest regards,\nQuizFolio Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #007bff 0%, #6610f2 100%); color: white; padding: 30px; text-align: center;">
                            <h2 style="margin: 0;">📢 QuizFolio Notification</h2>
                        </div>
                        <div style="padding: 30px;">
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
                                ${data.message.replace(/\n/g, '<br>')}
                            </div>
                            <p style="color: #666; text-align: center; margin-top: 30px;">Best regards,<br><strong>QuizFolio Team</strong></p>
                        </div>
                    </div>
                `
            }
        };

        return templates[templateName] || templates.notification;
    }

    // Quick helper methods
    async sendTestEmail(testEmail = 'mailtonooralam@gmail.com') {
        return this.sendEmail({
            to: testEmail,
            template: 'test',
            templateData: {}
        });
    }

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

    async sendNotification(recipients, subject, message) {
        return this.sendEmail({
            to: recipients,
            template: 'notification',
            templateData: {
                subject: subject,
                message: message
            }
        });
    }

    async getStatus() {
        if (!this.currentTransporter) {
            try {
                await this.findWorkingTransporter();
            } catch (error) {
                return {
                    status: 'error',
                    message: 'No working email service found',
                    error: error.message
                };
            }
        }

        return {
            status: 'ready',
            service: this.currentTransporter.name,
            type: this.currentTransporter.type,
            message: 'Email service is ready to send emails'
        };
    }
}

// Create and export singleton instance
const multiEmailService = new MultiEmailService();

module.exports = multiEmailService; 
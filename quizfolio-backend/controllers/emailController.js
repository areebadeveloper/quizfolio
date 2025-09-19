const nodemailer = require('nodemailer');

// Email sending function
exports.sendEmail = async (req, res) => {
    const { recipients, subject, message } = req.body; // Expecting recipients as an array of emails

    // Check for required fields
    if (!recipients || !subject || !message) {
        return res.status(400).json({ msg: 'Please provide recipients, subject, and message.' });
    }

    // Check for development mode
    const isDev = process.env.NODE_ENV === 'development';

    try {
        // For development - log emails instead of sending
        if (isDev) {
            console.log('========== EMAIL WOULD BE SENT ==========');
            console.log('To:', recipients.join(', '));
            console.log('Subject:', subject);
            console.log('Message:', message);
            console.log('=======================================');
            
            // Return success response for development
            return res.status(200).json({ 
                msg: 'Development mode: Email logged to console instead of sending',
                recipients,
                subject,
                message 
            });
        }
        
        // For production - actually send emails
        // Create nodemailer transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipients.join(', '),
            subject: subject,
            text: message
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: 'Emails sent successfully!' });
        
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ msg: 'Failed to send emails. ' + error.message });
    }
};

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (req, res) => {
    const { recipients, subject, message } = req.body;
    
    // Format for SendGrid
    const emails = recipients.map(recipient => ({
        to: recipient,
        from: process.env.FROM_EMAIL,
        subject: subject,
        text: message,
    }));
    
    try {
        await sgMail.send(emails);
        res.status(200).json({ msg: 'Emails sent successfully!' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ msg: 'Failed to send emails.' });
    }
};

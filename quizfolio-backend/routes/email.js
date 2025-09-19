// routes/email.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Define a simplified email endpoint that just returns success for development
router.post('/send-email', async (req, res) => {
  try {
    const { userIds, subject, message } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ msg: 'Please provide valid user IDs' });
    }
    
    if (!subject || !message) {
      return res.status(400).json({ msg: 'Subject and message are required' });
    }

    // Find the users to get their email addresses (for logging only)
    const users = await User.find({ _id: { $in: userIds } });
    const emails = users.map(user => user.email);
    
    // Log what would be sent
    console.log('========== EMAIL WOULD BE SENT ==========');
    console.log(`To ${users.length} recipients:`, emails);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('=======================================');
    
    // Return success for development
    return res.status(200).json({ 
      msg: 'Email Sended successfully - check server logs',
      recipientCount: users.length 
    });
    
  } catch (error) {
    console.error('Email route error:', error);
    return res.status(500).json({ 
      msg: 'Server error processing email request', 
      error: error.message 
    });
  }
});

module.exports = router;

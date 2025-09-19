# QuizFolio Email Service 📧

A comprehensive email service for QuizFolio application with Gmail integration, HTML templates, and development/production modes.

## 🚀 Features

- ✅ **Gmail SMTP Integration** - Uses Gmail with proper STARTTLS configuration
- ✅ **HTML & Text Templates** - Beautiful email templates for different purposes
- ✅ **Development Mode** - Logs emails to console instead of sending (for testing)
- ✅ **Production Mode** - Actually sends emails when configured
- ✅ **Multiple Email Types** - Welcome, password reset, quiz notifications, custom emails
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **Validation** - Input validation for all endpoints
- ✅ **Authentication** - Protected routes with JWT middleware

## 📋 Setup Instructions

### 1. Gmail Configuration

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings → Security
   - Under "Signing in to Google", select "App passwords"
   - Generate a new app password for "Mail"
   - Copy the 16-character app password

### 2. Environment Variables

Add these to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
TEST_EMAIL=test_recipient@gmail.com

# Environment (optional)
NODE_ENV=development  # or 'production'
```

### 3. Test the Service

```bash
# Test the email service
node testNewEmail.js

# Or test with original simple test
node testEmail.js
```

## 🔗 API Endpoints

Base URL: `/api/email-service`

### 1. Verify Connection
```http
GET /api/email-service/verify
```
**Response:**
```json
{
  "success": true,
  "message": "Email service is ready",
  "config": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "user": "Configured",
    "password": "Configured"
  }
}
```

### 2. Send Test Email
```http
POST /api/email-service/test
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "testEmail": "recipient@example.com"  // optional
}
```

### 3. Send Custom Email
```http
POST /api/email-service/custom
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "recipients": ["user1@example.com", "user2@example.com"],
  "subject": "Your Subject Here",
  "message": "Your message content here"
}
```

### 4. Send Email to Users by ID
```http
POST /api/email-service/users
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "userIds": ["userId1", "userId2", "userId3"],
  "subject": "Your Subject Here",
  "message": "Your message content here"
}
```

### 5. Send Welcome Email
```http
POST /api/email-service/welcome
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "userId": "user_id_here"
}
```

### 6. Send Quiz Notification
```http
POST /api/email-service/quiz-notification
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "studentIds": ["studentId1", "studentId2"],
  "quizData": {
    "title": "Mathematics Quiz 1",
    "teacherName": "Mr. Smith",
    "subject": "Mathematics",
    "duration": "30 minutes",
    "dueDate": "2024-01-15",
    "url": "http://localhost:3000/quiz/123"
  }
}
```

## 📧 Email Templates

### 1. Welcome Email
- **Trigger**: New user registration
- **Contains**: User details, account type, welcome message
- **Template**: HTML with QuizFolio branding

### 2. Password Reset Email
- **Trigger**: Forgot password request
- **Contains**: Reset link, expiration time, security notice
- **Template**: HTML with reset button

### 3. Quiz Notification Email
- **Trigger**: New quiz assigned to students
- **Contains**: Quiz details, teacher info, due date, quiz link
- **Template**: HTML with quiz information

### 4. Custom Email
- **Trigger**: Manual sending
- **Contains**: Custom subject and message
- **Template**: HTML with QuizFolio branding

## 🛠️ Development vs Production

### Development Mode
- **Behavior**: Emails are logged to console instead of being sent
- **Setting**: `NODE_ENV=development` (default)
- **Use Case**: Testing without sending actual emails

### Production Mode
- **Behavior**: Emails are actually sent via Gmail SMTP
- **Setting**: `NODE_ENV=production`
- **Requires**: Valid `EMAIL_USER` and `EMAIL_PASSWORD`

## 🧪 Testing

### Automated Testing
```bash
# Run comprehensive test suite
node testNewEmail.js
```

### Manual Testing via API
```bash
# Test connection
curl -X GET http://localhost:5000/api/email-service/verify

# Send test email (replace JWT_TOKEN)
curl -X POST http://localhost:5000/api/email-service/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "your_test@gmail.com"}'
```

## 🔧 Integration Examples

### 1. Send Welcome Email After Registration
```javascript
const emailService = require('./services/emailService');

// In your user registration controller
async function registerUser(req, res) {
  try {
    // ... user registration logic ...
    
    // Send welcome email
    await emailService.sendWelcomeEmail(
      user.email, 
      user.name, 
      user.userType
    );
    
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}
```

### 2. Send Quiz Notification to Students
```javascript
// In your quiz assignment controller
async function assignQuiz(req, res) {
  try {
    // ... quiz assignment logic ...
    
    // Send notifications to students
    const students = await User.find({ 
      _id: { $in: studentIds },
      userType: 'student' 
    });
    
    for (const student of students) {
      await emailService.sendQuizNotification(
        student.email,
        student.name,
        {
          title: quiz.title,
          teacherName: teacher.name,
          subject: quiz.subject,
          duration: quiz.duration,
          dueDate: quiz.dueDate,
          url: `${process.env.FRONTEND_URL}/quiz/${quiz._id}`
        }
      );
    }
    
    res.json({ message: 'Quiz assigned and notifications sent' });
  } catch (error) {
    console.error('Quiz assignment error:', error);
    res.status(500).json({ error: 'Failed to assign quiz' });
  }
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Make sure you're using App Password, not regular Gmail password
   - Enable 2-factor authentication on Gmail

2. **"Connection timeout" error**
   - Check your internet connection
   - Verify Gmail SMTP settings (smtp.gmail.com:587)

3. **"Authentication failed" error**
   - Double-check EMAIL_USER and EMAIL_PASSWORD in .env
   - Make sure App Password is correct

4. **Emails not being sent in production**
   - Set NODE_ENV=production
   - Verify all environment variables are set

### Debug Mode
Set `NODE_ENV=development` to see detailed logs without sending emails.

## 📝 Logs

The service provides detailed logging:
- ✅ Successful operations with green checkmarks
- ❌ Errors with red X marks
- 📧 Email details in development mode
- 🔍 Connection verification status

## 🔒 Security

- All email routes (except `/verify`) require JWT authentication
- App passwords are more secure than regular passwords
- Environment variables keep credentials secure
- Input validation prevents malicious content

---

## Quick Start Checklist

- [ ] Set up Gmail App Password
- [ ] Add EMAIL_USER and EMAIL_PASSWORD to .env
- [ ] Run `node testNewEmail.js` to verify setup
- [ ] Test API endpoints with your JWT token
- [ ] Switch to production mode when ready

**Need help?** Check the troubleshooting section or review the test output for configuration issues. 
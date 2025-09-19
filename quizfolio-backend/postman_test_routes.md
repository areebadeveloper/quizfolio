# Quizfolio API - Postman Testing Guide

## Setup
1. Create a new Postman collection named "Quizfolio API"
2. Set up environment variables:
   - `BASE_URL`: http://localhost:5000 (or your deployment URL)
   - `TOKEN`: (will be filled after login)

## Authentication Routes

### Register User
- **Method**: POST
- **URL**: {{BASE_URL}}/api/auth/register
- **Body** (JSON):
```json
{
  "name": "Test Teacher",
  "email": "teacher@test.com",
  "password": "password123",
  "userType": "teacher",
  "teacherId": "T12345"
}
```

For student registration:
```json
{
  "name": "Test Student",
  "email": "student@test.com",
  "password": "password123",
  "userType": "student",
  "studentId": "S12345",
  "studentClass": "[class ID from database]"
}
```

### Login User
- **Method**: POST
- **URL**: {{BASE_URL}}/api/auth/login
- **Body** (JSON):
```json
{
  "email": "teacher@test.com",
  "password": "password123"
}
```
- **Test script**: Add this script to automatically set the token
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("TOKEN", jsonData.token);
}
```

### Get Current User
- **Method**: GET
- **URL**: {{BASE_URL}}/api/auth/user
- **Headers**:
  - x-auth-token: {{TOKEN}}

### Forgot Password
- **Method**: POST
- **URL**: {{BASE_URL}}/api/auth/forgot-password
- **Body** (JSON):
```json
{
  "email": "teacher@test.com"
}
```

### Reset Password
- **Method**: PUT
- **URL**: {{BASE_URL}}/api/auth/reset-password/[token]
- **Body** (JSON):
```json
{
  "newPassword": "newpassword123"
}
```

## Categories

### Create Category
- **Method**: POST
- **URL**: {{BASE_URL}}/api/categories
- **Headers**:
  - x-auth-token: {{TOKEN}}
- **Body** (JSON):
```json
{
  "name": "Math"
}
```

### Get All Categories
- **Method**: GET
- **URL**: {{BASE_URL}}/api/categories
- **Headers**:
  - x-auth-token: {{TOKEN}}

### Update Category
- **Method**: PUT
- **URL**: {{BASE_URL}}/api/categories/[categoryId]
- **Headers**:
  - x-auth-token: {{TOKEN}}
- **Body** (JSON):
```json
{
  "name": "Mathematics"
}
```

### Delete Category
- **Method**: DELETE
- **URL**: {{BASE_URL}}/api/categories/[categoryId]
- **Headers**:
  - x-auth-token: {{TOKEN}}

## Questions

### Create Question
- **Method**: POST
- **URL**: {{BASE_URL}}/api/questions
- **Headers**:
  - x-auth-token: {{TOKEN}}
- **Body** (JSON):
```json
{
  "text": "What is 2+2?",
  "categoryId": "[categoryId]",
  "options": [
    {"text": "3", "isCorrect": false},
    {"text": "4", "isCorrect": true},
    {"text": "5", "isCorrect": false},
    {"text": "6", "isCorrect": false}
  ]
}
```

### Get All Questions
- **Method**: GET
- **URL**: {{BASE_URL}}/api/questions
- **Headers**:
  - x-auth-token: {{TOKEN}}

### Get Questions by Category
- **Method**: GET
- **URL**: {{BASE_URL}}/api/questions/category/[categoryId]
- **Headers**:
  - x-auth-token: {{TOKEN}}

### Get Question by ID
- **Method**: GET
- **URL**: {{BASE_URL}}/api/questions/[questionId]
- **Headers**:
  - x-auth-token: {{TOKEN}}

### Delete Question
- **Method**: DELETE
- **URL**: {{BASE_URL}}/api/questions/[questionId]
- **Headers**:
  - x-auth-token: {{TOKEN}}

## Quizzes

### Create Quiz
- **Method**: POST
- **URL**: {{BASE_URL}}/api/quizzes
- **Headers**:
  - x-auth-token: {{TOKEN}}
- **Body** (JSON):
```json
{
  "title": "Math Quiz",
  "description": "Basic arithmetic",
  "questions": ["[questionId1]", "[questionId2]"],
  "timeLimit": 30
}
```

### Get All Quizzes
- **Method**: GET
- **URL**: {{BASE_URL}}/api/quizzes
- **Headers**:
  - x-auth-token: {{TOKEN}}

### Get Quiz by ID
- **Method**: GET
- **URL**: {{BASE_URL}}/api/quizzes/[quizId]
- **Headers**:
  - x-auth-token: {{TOKEN}}

### Update Quiz
- **Method**: PUT
- **URL**: {{BASE_URL}}/api/quizzes/[quizId]
- **Headers**:
  - x-auth-token: {{TOKEN}}
- **Body** (JSON):
```json
{
  "title": "Updated Math Quiz",
  "description": "Updated description",
  "questions": ["[questionId1]", "[questionId2]", "[questionId3]"],
  "timeLimit": 45
}
```

### Delete Quiz
- **Method**: DELETE
- **URL**: {{BASE_URL}}/api/quizzes/[quizId]
- **Headers**:
  - x-auth-token: {{TOKEN}}

## Classes

### Create Class
- **Method**: POST
- **URL**: {{BASE_URL}}/api/classes
- **Headers**:
  - x-auth-token: {{TOKEN}}
- **Body** (JSON):
```json
{
  "name": "Grade 5"
}
```

### Get All Classes
- **Method**: GET
- **URL**: {{BASE_URL}}/api/classes
- **Headers**:
  - x-auth-token: {{TOKEN}}

### Get Class Quizzes
- **Method**: GET
- **URL**: {{BASE_URL}}/api/classes/[classId]/quizzes
- **Headers**:
  - x-auth-token: {{TOKEN}}

### Assign Quizzes to Class
- **Method**: POST
- **URL**: {{BASE_URL}}/api/classes/assign-quizzes
- **Headers**:
  - x-auth-token: {{TOKEN}}
- **Body** (JSON):
```json
{
  "classId": "[classId]",
  "quizIds": ["[quizId1]", "[quizId2]"]
}
```

### Get Classes With Quizzes
- **Method**: GET
- **URL**: {{BASE_URL}}/api/classes-with-quizzes
- **Headers**:
  - x-auth-token: {{TOKEN}}

## Quiz Results

### Submit Quiz Result
- **Method**: POST
- **URL**: {{BASE_URL}}/api/quizResult
- **Headers**:
  - x-auth-token: {{TOKEN}}
- **Body** (JSON):
```json
{
  "quizId": "[quizId]",
  "answers": [
    {
      "questionId": "[questionId1]",
      "selectedOption": "[optionId1]"
    },
    {
      "questionId": "[questionId2]",
      "selectedOption": "[optionId2]"
    }
  ]
}
```

### Get Results by Quiz
- **Method**: GET
- **URL**: {{BASE_URL}}/api/quizResult/quiz/[quizId]
- **Headers**:
  - x-auth-token: {{TOKEN}}

### Get Results by Student
- **Method**: GET
- **URL**: {{BASE_URL}}/api/quizResult/student/[studentId]
- **Headers**:
  - x-auth-token: {{TOKEN}}

## Troubleshooting Password Issues

If you're still having password matching issues after the fix, try these steps:

1. **Manually Register a Test User**:
   - Register with a test account using the Register endpoint
   - Note the account credentials

2. **Test Login with Registered User**:
   - Try logging in with the credentials
   - Check the response for any error messages

3. **Debug with Temporary Console Logs**:
   - The login route now includes debug info showing the first 3 characters of the provided password and the length of the stored hash
   - This will help identify if the password is being properly transmitted and hashed

4. **Manual Password Reset If Needed**:
   - If existing users can't log in, use the forgot/reset password flow to update their passwords

## Common Issues & Solutions

1. **"Invalid credentials - password does not match"**:
   - Ensure the password matches what was used during registration
   - If this persists for existing users, they may need to reset their passwords

2. **"Token is not valid"**:
   - The JWT token has expired or is malformed
   - Login again to get a fresh token

3. **"No token, authorization denied"**:
   - You're missing the x-auth-token header
   - Make sure to include the token from the login response 
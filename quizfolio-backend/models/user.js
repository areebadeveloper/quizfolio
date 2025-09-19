const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
        enum: ['student', 'teacher'],
    },
    studentId: {
        type: String,
        required: function() { return this.userType === 'student'; },
    },
    studentClass: {
        type: String,
        ref: 'Class',
        required: function() { return this.userType === 'student'; },
    },
    teacherId: {
        type: String,
        required: function() { return this.userType === 'teacher'; },
    },
    // New fields for password reset functionality
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
});

// Hash password before saving (if it's new or modified)
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);

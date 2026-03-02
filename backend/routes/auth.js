import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const serializeUser = (user) => ({
    _id: user._id,
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
    bio: user.bio
});

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
    res.status(statusCode).json({ success: true, token, user: serializeUser(user) });
};

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ success: false, error: 'Username or email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ username, email, password: hashedPassword });
        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, error: 'Please provide email and password' });

        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get current user
router.get('/me', protect, async (req, res) => {
    res.status(200).json({ success: true, data: serializeUser(req.user) });
});

// Update profile
router.put('/me/profile', protect, async (req, res) => {
    try {
        const fieldsToUpdate = {};
        const allowedFields = ['username', 'email', 'bio', 'profilePicture'];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                fieldsToUpdate[field] = req.body[field];
            }
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: serializeUser(user) });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update password
router.put('/me/password', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ success: false, error: 'Incorrect current password' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.newPassword, salt);
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get user's posts
router.get('/me/posts', protect, async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user.id }).populate('category', 'name slug');
        res.status(200).json({ success: true, data: posts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;

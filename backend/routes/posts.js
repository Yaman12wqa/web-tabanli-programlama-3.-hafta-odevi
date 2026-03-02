import express from 'express';
import Post from '../models/Post.js';
import { protect, optionalProtect, authorize } from '../middleware/auth.js';

const router = express.Router();
const allowedStatuses = ['pending', 'approved', 'suspended'];

const getPostUpdates = (body) => {
    const updates = {};
    const allowedFields = ['title', 'content', 'category', 'coverImage'];

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            updates[field] = body[field];
        }
    }

    return updates;
};

// Get all approved posts (with basic filters)
router.get('/', optionalProtect, async (req, res) => {
    try {
        const query = {};
        const canViewAll = req.user?.role === 'admin' && req.query.scope === 'all';

        if (!canViewAll) {
            query.status = 'approved';
        } else if (req.query.status && allowedStatuses.includes(req.query.status)) {
            query.status = req.query.status;
        }

        if (req.query.category) query.category = req.query.category;

        const posts = await Post.find(query)
            .populate('author', 'username profilePicture')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get post by slug
router.get('/by-slug/:slug', optionalProtect, async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });

        if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

        const isOwner = req.user && post.author.toString() === req.user.id;
        const canView = post.status === 'approved' || isOwner || req.user?.role === 'admin';

        if (!canView) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        await post.populate('author', 'username profilePicture bio');
        await post.populate('category', 'name slug');

        res.status(200).json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create new post
router.post('/', protect, async (req, res) => {
    try {
        const postData = {
            ...getPostUpdates(req.body),
            author: req.user.id,
            status: req.user.role === 'admin' ? 'approved' : 'pending'
        };

        const post = await Post.create(postData);
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update post
router.put('/:id', protect, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'User not authorized to update this post' });
        }

        const updates = getPostUpdates(req.body);

        Object.assign(post, updates);
        await post.save();

        res.status(200).json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete post
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'User not authorized to delete this post' });
        }

        await post.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Like / Unlike post
router.put('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

        if (post.likes.includes(req.user.id)) {
            post.likes = post.likes.filter(id => id.toString() !== req.user.id);
        } else {
            post.likes.push(req.user.id);
        }

        await post.save();
        res.status(200).json({ success: true, data: post.likes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Admin ONLY: Change post status
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status value' });
        }

        const post = await Post.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
        if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

        await post.populate('author', 'username profilePicture');
        await post.populate('category', 'name slug');

        res.status(200).json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;

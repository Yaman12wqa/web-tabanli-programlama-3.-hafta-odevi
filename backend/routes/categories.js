import express from 'express';
import Category from '../models/Category.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).json({ success: true, data: categories });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    })
    .post(protect, authorize('admin'), async (req, res) => {
        try {
            const category = await Category.create(req.body);
            res.status(201).json({ success: true, data: category });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });

router.route('/:id')
    .delete(protect, authorize('admin'), async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
            await category.deleteOne();
            res.status(200).json({ success: true, data: {} });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });

export default router;

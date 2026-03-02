import mongoose from 'mongoose';
import slugify from 'slugify';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        default: ''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'suspended'],
        default: 'pending' // Admin must approve by default
    }
}, { timestamps: true });

PostSchema.pre('save', function (next) {
    if (!this.slug || this.isModified('title')) {
        const baseSlug = slugify(this.title, { lower: true, strict: true });
        this.slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
    }
    next();
});

export default mongoose.model('Post', PostSchema);

import mongoose from 'mongoose';
import slugify from 'slugify';

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    }
}, { timestamps: true });

CategorySchema.pre('save', function (next) {
    if (!this.slug || this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

export default mongoose.model('Category', CategorySchema);

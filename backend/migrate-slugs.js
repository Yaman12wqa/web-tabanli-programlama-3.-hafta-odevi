import mongoose from 'mongoose';
import dotenv from 'dotenv';
import slugify from 'slugify';
import Post from './models/Post.js';
import Category from './models/Category.js';

dotenv.config();

const migrateSlugs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogdb');

        console.log('Başlıyor: Category slug migrasyonu...');
        const categories = await Category.find({ slug: { $exists: false } });
        for (let cat of categories) {
            cat.slug = slugify(cat.name, { lower: true, strict: true });
            await cat.save();
            console.log(`Updated category: ${cat.name}`);
        }

        console.log('Başlıyor: Post slug migrasyonu...');
        const posts = await Post.find({ slug: { $exists: false } });
        for (let post of posts) {
            const baseSlug = slugify(post.title, { lower: true, strict: true });
            post.slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
            await post.save();
            console.log(`Updated post: ${post.title}`);
        }

        console.log('Migrasyon tamamlandı!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

migrateSlugs();

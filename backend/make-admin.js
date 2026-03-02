import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogdb');

        const email = process.argv[2];
        if (!email) {
            console.error('Lütfen bir email adresi girin: node make-admin.js <email>');
            process.exit(1);
        }

        const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });

        if (!user) {
            console.error('Kullanıcı bulunamadı.');
            process.exit(1);
        }

        console.log(`${user.email} başarıyla admin yapıldı.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

makeAdmin();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv"
dotenv.config()

// Image Model
const ImageSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 100,
        index: true,
    },
    ImageData: {
        type: Buffer,
        required: true,
    },
    ContentType: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Image = mongoose.models.Image || mongoose.model('Image', ImageSchema);

// User Model
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Admin Initialization
export async function initializeAdmins() {
    try {
        const adminUsers = [
            {
                username: 'AdminMenchie@gmail.com',
                password: 'PasswordMenchie@2023!',
                role: 'admin',
            },
            {
                username: 'AdminRichie@gmail.com',
                password: 'PasswordRichie@2023!',
                role: 'admin',
            },
        ];

        for (const admin of adminUsers) {
            const exists = await User.findOne({ username: admin.username });
            if (!exists) {
                const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
                const passwordHash = await bcrypt.hash(admin.password, salt);
                await User.create({
                    username: admin.username,
                    passwordHash,
                    role: admin.role,
                });
                console.log(`Admin user ${admin.username} created`);
            }
        }
    } catch (error) {
        console.error('Error initializing admins:', error);
    }
}

// Export the models
export { Image, User };
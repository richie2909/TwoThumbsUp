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
        // Wait for MongoDB connection to be fully established
        if (mongoose.connection.readyState !== 1) {
            console.log('Waiting for MongoDB connection before initializing admins...');
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Get admin credentials from environment variables or use defaults as fallback
        const adminUsers = [
            {
                username: process.env.ADMIN1_USERNAME || 'AdminMenchie@gmail.com',
                password: process.env.ADMIN1_PASSWORD || 'PasswordMenchie@2023!',
                role: 'admin',
            },
            {
                username: process.env.ADMIN2_USERNAME || 'AdminRichie@gmail.com',
                password: process.env.ADMIN2_PASSWORD || 'PasswordRichie@2023!',
                role: 'admin',
            },
        ];

        for (const admin of adminUsers) {
            try {
                const exists = await User.findOne({ username: admin.username });
                if (!exists) {
                    // Get salt rounds from environment variable with fallback
                    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
                    const salt = await bcrypt.genSalt(saltRounds);
                    const passwordHash = await bcrypt.hash(admin.password, salt);
                    await User.create({
                        username: admin.username,
                        passwordHash,
                        role: admin.role,
                    });
                    console.log(`Admin user ${admin.username} created`);
                } else {
                    console.log(`Admin user ${admin.username} already exists`);
                }
            } catch (adminError) {
                console.error(`Error processing admin ${admin.username}:`, adminError);
                // Continue processing other admins even if one fails
            }
        }
    } catch (error) {
        console.error('Error initializing admins:', error);
        // Don't terminate the app if admin initialization fails
    }
}

// Export the models
export { Image, User };
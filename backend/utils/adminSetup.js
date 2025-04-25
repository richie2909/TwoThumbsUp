import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Admin Initialization
export async function initializeAdmins() {
    try {
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
            // Check if admin exists
            const existingAdmin = await User.findOne({ username: admin.username });
            if (!existingAdmin) {
                console.log(`Creating admin user: ${admin.username}`);
                // Hash password
                const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS) || 12);
                const passwordHash = await bcrypt.hash(admin.password, salt);
                
                // Create new admin
                await User.create({
                    username: admin.username,
                    passwordHash,
                    role: admin.role,
                });
                console.log(`Admin user created: ${admin.username}`);
            } else {
                console.log(`Admin user already exists: ${admin.username}`);
            }
        }
    } catch (error) {
        console.error('Error initializing admin users:', error);
    }
} 
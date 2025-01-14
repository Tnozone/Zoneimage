import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../lib/mongodb.js';

export async function registerUser(name, email, password) {
    const db = await getDb();
    const users = db.collection('users');

    const existingUser = await users.findOne({ email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        name,
        email,
        password: hashedPassword,
    };

    const result = await users.insertOne(newUser);
    return result.insertedId;
}

export async function loginUser(email, password) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, userId: user._id };
}
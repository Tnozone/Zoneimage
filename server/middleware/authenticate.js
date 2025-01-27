import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
    console.log('Authenticate middleware triggered');
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('No token, rejecting request');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}
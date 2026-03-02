import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getTokenFromRequest = (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return req.headers.authorization.split(' ')[1];
    }

    return null;
};

export const protect = async (req, res, next) => {
    const token = getTokenFromRequest(req);

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'User not found with this token' });
        }
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};

export const optionalProtect = async (req, res, next) => {
    const token = getTokenFromRequest(req);

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            req.user = null;
            return next();
        }

        next();
    } catch (err) {
        req.user = null;
        return next();
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: `User role ${req.user.role} is not authorized` });
        }
        next();
    };
};

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as admin');
    }
};

// Renter middleware
const renter = (req, res, next) => {
    if (req.user && req.user.role === 'renter') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as renter');
    }
};

// Super admin middleware
const superAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as super admin');
    }
};

// Check if user is authenticated and has required role
const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        protect,
        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                res.status(401);
                throw new Error(`Not authorized as ${roles.join(', ')}`);
            }
            next();
        }
    ];
};

module.exports = {
    protect,
    admin,
    renter,
    superAdmin,
    authorize
};

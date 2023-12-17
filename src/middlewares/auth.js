require('dotenv').config();

const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');
const UserRole = require('../models/enums/user.enum');
const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (payload) => {
    const token = jwt.sign(payload, secretKey, { expiresIn: '6h' });
    return token;
};

const verifyToken = (requiredRoles) => (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new CustomError('Not authorized to access this route', 401)
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, secretKey)
        const { id, email, role } = decoded
        req.user = { id, email, role }

        if (!requiredRoles.includes(decoded.role)) {
            return res.status(403).json({
                message: 'You do not have the authorization and permissions to access this resource.'
            });
        }

        next()
    } catch (error) {
        throw new CustomError('Not authorized to access this route', 401)
    }

};

const verifyAdmin = verifyToken([UserRole.Admin]);
const verifyUser = verifyToken([UserRole.Admin, UserRole.User]);

const getReqUserInfo = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null;
        next()
        return;
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, secretKey)
        const { id, email, role } = decoded
        req.user = { id, email, role }

    } catch (error) {
        req.user = null;
    }

    next();

};

module.exports = { verifyUser, verifyAdmin, getReqUserInfo, generateToken };
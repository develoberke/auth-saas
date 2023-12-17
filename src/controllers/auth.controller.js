const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const { generateToken } = require('../middlewares/auth');

const { User } = require('../models');
const UserRole = require('../models/enums/user.enum');

const register = asyncErrorHandler(
    async (req, res, next) => {
        let user = req.body;
        user.role = UserRole.User;
        user = await User.create(user);
        res.status(201).send({
            id: user.id,
            email: user.email,
        });
    }
)


const login = asyncErrorHandler(
    async (req, res, next) => {
        const user = await loginUserWithEmailAndPassword(req.body.email, req.body.password);
        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        res.status(200).send({
            id: user.id,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            token: token,
        });
    }
)

const loginUserWithEmailAndPassword = async (email, password) => {
    try {
        const user = await User.findOne({ where: { email: email } });

        if (!user || !(await user.isPasswordMatch(password))) {
            throw new CustomError('Incorrect email or password', 401);
        }
        return user;
    }
    catch (e) {
        throw new CustomError('Incorrect email or password', 401);
    }
};


const getUser = asyncErrorHandler(
    async (req, res, next) => {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            throw new CustomError('User not found', 404);
        }
        res.status(200).send({
            id: user.id,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    }
)



module.exports = { register, login, getUser };
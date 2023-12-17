const bcrypt = require('bcrypt');
const UserRole = require('./enums/user.enum');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: { msg: "Email is required" },
                notEmpty: { msg: "Email is required" },
                min: { args: 3, msg: "Email must be at least 3 characters in length" },
                isEmail: { msg: "Must be a valid email address" },
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: "Password is required" },
                notEmpty: { msg: "Password is required" },
                len: { args: [6], msg: "Password must be at least 6 characters in length" },
            }
        },
        role: {
            type: DataTypes.ENUM(UserRole.Admin, UserRole.User),
            defaultValue: UserRole.User,
        },
    },
        {
            hooks: {
                beforeCreate: async (user) => {
                    const hash = await bcrypt.hash(user.password, 10);
                    user.password = hash;
                }
            }
        }
    );

    User.prototype.isPasswordMatch = async function (password) {
        return await bcrypt.compare(password, this.password);
    };

    return User;
};
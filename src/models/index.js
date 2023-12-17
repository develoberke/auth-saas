const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.POSTGRESQL_DB_URI)

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

User = require('./user.model.js')(sequelize, Sequelize);



db.User = User;
module.exports = db;
const Sequelize = require("sequelize");

const sequelize = require("../utils/database.js");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  image: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  resetToken: Sequelize.STRING,
  resetTokenExpiration: Sequelize.DATE,
});

module.exports = User;

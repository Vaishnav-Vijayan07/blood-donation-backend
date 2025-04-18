const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    field: 'email'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password'
  },
}, {
  tableName: 'admin_users'
});

module.exports = Admin;
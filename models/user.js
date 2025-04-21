const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Office = require('./office');

const User = sequelize.define('User', {
  login_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    field: 'login_id'
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'full_name'
  },
  rank: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'rank'
  },
  blood_group: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'blood_group'
  },
  last_donated_date: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_donated_date'
  },
  mobile_number: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'mobile_number'
  },
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
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'date_of_birth'
  },
  service_start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'service_start_date'
  },
  residential_address: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'residential_address'
  },
  profile_photo: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'profile_photo'
  },
  office_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'office_id'
  }
}, {
  tableName: 'users'
});

User.belongsTo(Office, { foreignKey: 'office_id' });

module.exports = User;
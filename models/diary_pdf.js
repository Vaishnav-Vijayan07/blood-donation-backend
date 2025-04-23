const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DiaryPdf = sequelize.define(
  'DiaryPdf',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'file_path',
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'file_name',
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'uploaded_at',
    },
  },
  {
    tableName: 'diary_pdfs',
  }
);

module.exports = DiaryPdf;
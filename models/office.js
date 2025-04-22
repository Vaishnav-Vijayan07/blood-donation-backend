const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Office = sequelize.define(
  "Office",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "name",
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      field: "email",
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "phone_number",
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "address",
    },
  },
  {
    tableName: "offices",
  }
);

Office.associate = (models) => {
  Office.hasMany(models.User, { foreignKey: "office_id", as: "users" });
};

module.exports = Office;

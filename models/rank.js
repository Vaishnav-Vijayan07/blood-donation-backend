const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rank = sequelize.define(
  "Rank",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "name",
    },
  },
  {
    tableName: "ranks",
  }
);

Rank.associate = (models) => {
  Rank.hasMany(models.User, { foreignKey: "rank_id", as: "users" });
};

module.exports = Rank;

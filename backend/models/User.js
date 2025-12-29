import { DataTypes } from "sequelize";
import {sequelize} from "../db.js";

export const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING
  },


  resetCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetCodeExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  role: { type: DataTypes.STRING, allowNull: false }
});

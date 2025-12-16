import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class User extends Model {}
User.init(
  {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: 'User' }
);

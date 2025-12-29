import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Course = sequelize.define("Course", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uplodedImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    courseTitle: {
        type: DataTypes.STRING,
        allowNull:false
    },
    tradingCategory: {
        type: DataTypes.STRING,
        allowNull:false
    },
    courseLevel: {
        type: DataTypes.STRING,
        allowNull:false
    },
    courseLanguage: {
        type: DataTypes.STRING,
        allowNull:false
    },
    accessValidity: {
        type: DataTypes.STRING,
        allowNull:false
    },
    coursePrice: {
        type: DataTypes.STRING,
        allowNull:false
    },
    discount: {
        type: DataTypes.STRING,
        allowNull:true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
})
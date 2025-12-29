import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Plan = sequelize.define("Plan", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active"
    },
    uplodedImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    planName: {
        type: DataTypes.STRING,
        allowNull:false
    },
    segment: {
        type: DataTypes.STRING,
        allowNull:false
    },
    category: {
        type: DataTypes.STRING,
        allowNull:false
    },
    risk: {
        type: DataTypes.STRING,
        allowNull:false
    },
    idealCapital: {
        type: DataTypes.STRING,
        allowNull:false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull:false
    },
    planPrice: {
        type: DataTypes.STRING,
        allowNull:false
    },
    discount: {
        type: DataTypes.STRING,
        allowNull:true
    },
    stopLoss: {
        type: DataTypes.STRING,
        allowNull:false
    },
    avgTrades: {
        type: DataTypes.STRING,
        allowNull:false
    },
    shortDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    refundPolicy: {
        type: DataTypes.TEXT,
        allowNull: true
    }
})
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Signal = sequelize.define("Signal", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    instrument: {
        type: DataTypes.STRING,
        allowNull: false
    },
    instrumentType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tradeDirection: {
        type: DataTypes.ENUM("BUY", "SELL"),
        allowNull: false
    },
    segment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    exchange: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    riskRewardRatio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subscriptionPlan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    entryPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    stopLoss: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    targetFirst: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    targetSecond: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    targetThird: {
        type: DataTypes.FLOAT,
        allowNull: true 
    },
    status: {
        type: DataTypes.ENUM("active", "closed", "expired"),
        allowNull: false,
        defaultValue: "active"
    }
})
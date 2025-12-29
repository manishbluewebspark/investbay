import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Video = sequelize.define("Video", {
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    videoTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    videoDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})
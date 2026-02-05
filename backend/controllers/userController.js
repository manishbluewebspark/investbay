import { where } from "sequelize";
import { User } from "../models/User.js";

// ============================== get website user data =============================

export const getWebsiteUserData = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

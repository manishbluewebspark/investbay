import  ResearchAnalyst  from "../models/ResearchAnalyst.js";

export const generateUserId = async () => {
  let unique = false;
  let userId;

  while (!unique) {
    userId =
      "RA" +
      Math.random().toString(36).substring(2, 6).toUpperCase() +
      Math.floor(1000 + Math.random() * 9000);

    const exists = await ResearchAnalyst.findOne({ where: { userId } });
    if (!exists) unique = true;
  }

  return userId;
};

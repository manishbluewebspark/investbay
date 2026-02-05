// import  ResearchAnalyst  from "../models/ResearchAnalyst.js";

// export const generateUserId = async () => {
//   let unique = false;
//   let userId;

//   while (!unique) {
//     userId =
//       "RA" +
//       Math.random().toString(36).substring(2, 6).toUpperCase() +
//       Math.floor(1000 + Math.random() * 9000);

//     const exists = await ResearchAnalyst.findOne({ where: { userId } });
//     if (!exists) unique = true;
//   }

//   return userId;
// };
import {pool} from "../db.js";

export const generateUserId = async () => {
  let unique = false;
  let userId;

  while (!unique) {
    userId =
      "RA" +
      Math.random().toString(36).substring(2, 6).toUpperCase() +
      Math.floor(1000 + Math.random() * 9000);

    const query = `
      SELECT 1 
      FROM research_analysts 
      WHERE user_id = $1
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      unique = true;
    }
  }

  return userId;
};

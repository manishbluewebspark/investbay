// import { DataTypes } from "sequelize";
// import { sequelize } from '../db.js';

// const ResearchAnalyst = sequelize.define("ResearchAnalyst", {
//   // Step 1: Personal Details
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   gender: {
//     type: DataTypes.STRING,
//   },
//   dob: {
//     type: DataTypes.STRING,
//   },
//   city: {
//     type: DataTypes.STRING,
//   },
//   state: {
//     type: DataTypes.STRING,
//   },
//   address: {
//     type: DataTypes.STRING,
//   },

//   // Step 2: Professional Details
//   sebiNumber: {
//     type: DataTypes.STRING,
//   },
//   specialization: {
//     type: DataTypes.STRING,
//   },
//   education: {
//     type: DataTypes.STRING,
//   },
//   experience: {
//     type: DataTypes.STRING,
//   },
//   companyName: {
//     type: DataTypes.STRING,
//   },
//   languages: {
//     type: DataTypes.STRING,
//   },
//   professionalDocument: {
//     type: DataTypes.STRING,
//   },

//   // Step 3: Documents
//   panFile: {
//     type: DataTypes.STRING,
//   },
//   sebiFile: {
//     type: DataTypes.STRING,
//   },
//   terms: {
//     type: DataTypes.TEXT,
//   },
// });

// export default ResearchAnalyst;
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const ResearchAnalyst = sequelize.define("ResearchAnalyst", {
  // 🧩 Step 1: Personal Details
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
  },
  dob: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  profileImage: {
    type: DataTypes.STRING, // file path or URL
  },

  // 🧩 Step 2: Professional Details
  sebiNumber: {
    type: DataTypes.STRING,
  },
  specialization: {
    type: DataTypes.STRING,
  },
  education: {
    type: DataTypes.STRING,
  },
  experience: {
    type: DataTypes.STRING,
  },
  companyName: {
    type: DataTypes.STRING,
  },
  languages: {
    type: DataTypes.ARRAY(DataTypes.STRING), // <-- Store as string array
  },
  professionalDocument: {
    type: DataTypes.STRING,
  },

  // 🧩 Step 3: Documents
  panFile: {
    type: DataTypes.STRING,
  },
  sebiFile: {
    type: DataTypes.STRING,
  },
  terms: {
    type: DataTypes.TEXT,
  },
});

export default ResearchAnalyst;

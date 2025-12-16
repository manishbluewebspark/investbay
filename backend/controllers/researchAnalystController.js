import ResearchAnalyst from "../models/ResearchAnalyst.js";

// =============================================== add Research Analyst ===============================================

// export const addResearchAnalyst = async (req, res) => {
//   try {
//     let personal = {};
//     let professional = {};

//     if (req.body.personal) {
//       try {
//         personal = JSON.parse(req.body.personal);
//       } catch {}
//     }
//     if (req.body.professional) {
//       try {
//         professional = JSON.parse(req.body.professional);
//       } catch {}
//     }

//     const pick = (k) =>
//       req.body?.[k] ?? personal?.[k] ?? professional?.[k] ?? null;

//     const payload = {
//       name: pick("name"),
//       email: pick("email"),
//       gender: pick("gender"),
//       dob: pick("dob"),
//       city: pick("city"),
//       state: pick("state"),
//       address: pick("address"),
//       sebiNumber: pick("sebiNumber"),
//       specialization: pick("specialization"),
//       education: pick("education"),
//       experience: pick("experience"),
//       companyName: pick("companyName"),
//       languages: pick("languages"),
//       terms: pick("terms"),
//     };

//     const panFile = req.files?.panFile?.[0]?.filename || null;
//     const sebiFile = req.files?.sebiFile?.[0]?.filename || null;
//     const professionalDocument =
//       req.files?.professionalDocument?.[0]?.filename || null;

//     if (!payload.name || !payload.email) {
//       return res.status(400).json({
//         success: false,
//         message: "Name and email are required",
//         debug: {
//           gotKeys: Object.keys(req.body || {}),
//           contentType: req.headers["content-type"],
//         },
//       });
//     }

//     const newAnalyst = await ResearchAnalyst.create({
//       ...payload,
//       panFile,
//       sebiFile,
//       professionalDocument,
//     });

//     res.status(201).json({ success: true, data: newAnalyst });
//   } catch (error) {
//     console.error("Error saving analyst:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server Error", error: error.message });
//   }
// };

export const addResearchAnalyst = async (req, res) => {
  try {
    let personal = {};
    let professional = {};

    if (req.body.personal) {
      try {
        personal = JSON.parse(req.body.personal);
      } catch (err) {
        console.warn("Invalid JSON in personal:", err.message);
      }
    }
    if (req.body.professional) {
      try {
        professional = JSON.parse(req.body.professional);
      } catch (err) {
        console.warn("Invalid JSON in professional:", err.message);
      }
    }

    const pick = (k) =>
      req.body?.[k] ?? personal?.[k] ?? professional?.[k] ?? null;

    let languages = [];
    if (Array.isArray(req.body.languages)) {
      languages = req.body.languages;
    } else {

      const langKeys = Object.keys(req.body).filter((k) =>
        k.startsWith("languages[")
      );
      if (langKeys.length > 0) {
        languages = langKeys.map((k) => req.body[k]);
      } else if (req.body.languages) {

        languages = req.body.languages.split(",").map((l) => l.trim());
      }
    }

    const payload = {
      name: pick("name"),
      email: pick("email"),
      gender: pick("gender"),
      dob: pick("dob"),
      city: pick("city"),
      state: pick("state"),
      address: pick("address"),
      sebiNumber: pick("sebiNumber"),
      specialization: pick("specialization"),
      education: pick("education"),
      experience: pick("experience"),
      companyName: pick("companyName"),
      languages,
      terms: pick("terms"),
    };


    const panFile = req.files?.panFile?.[0]?.filename || null;
    const sebiFile = req.files?.sebiFile?.[0]?.filename || null;
    const professionalDocument =
      req.files?.professionalDocument?.[0]?.filename || null;
    const profileImage = req.files?.profileImage?.[0]?.filename || null;

    if (!payload.name || !payload.email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
        debug: {
          gotKeys: Object.keys(req.body || {}),
          contentType: req.headers["content-type"],
        },
      });
    }

    const newAnalyst = await ResearchAnalyst.create({
      ...payload,
      panFile,
      sebiFile,
      professionalDocument,
      profileImage,
    });

    res.status(201).json({ success: true, data: newAnalyst });
  } catch (error) {
    console.error("Error saving analyst:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =============================================== get Research Analysts ===============================================

export const getAllReserchAnalysts = async (req, res) => {
  try {
    const analysts = await ResearchAnalyst.findAll();
    res.status(200).json({ success: true, data: analysts });
  }
  catch (error) {
    console.error("Error fetching analysts:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
}

// =============================================== delete Research Analyst ===============================================

export const deleteResearchAnalyst = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ResearchAnalyst.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ success: true, message: "Research Analyst deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Research Analyst not found" });
    } 
  } catch (error) {
    console.error("Error deleting analyst:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
}

// ================================================ get Research Analyst by ID ================================================

export const getResearchAnalystById = async (req, res) => {
  try {
    const { id } = req.params;
    const analyst = await ResearchAnalyst.findByPk(id);
    if (analyst) {
      res.status(200).json({ success: true, data: analyst });
    } else {
      res.status(404).json({ success: false, message: "Research Analyst not found" });
    }
  } catch (error) {
    console.error("Error fetching analyst:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  } 
}
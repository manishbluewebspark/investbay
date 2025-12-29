import { Course } from '../models/Course.js';

// ================================================= create a new course =================================================

export const createCourse = async (req, res) => {
  try {
    const {
      userId,
      title,
      category,
      level,
      language,
      validity,
      price,
      discount,
      description
    } = req.body;

    if (!userId || !title || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    const newCourse = await Course.create({
      userId,
      courseTitle: title,
      tradingCategory: category,
      courseLevel: level,
      courseLanguage: language,
      accessValidity: validity,
      coursePrice: Number(price),
      discount: discount ? Number(discount) : 0,
      description,
      uplodedImage: req.file?.path || null
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse
    });

  } catch (error) {
    console.error("Create Course Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};


// ================================================= get  courses by userId =================================================

export const getCoursesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const courses = await Course.findAll({ where: { userId } });

        return res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        console.error("Get Courses Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};


// ================================================= get course by courseId with userId =================================================

export const getCourseWithUserId = async (req, res) => {
  try {
    const { id } = req.params;  
    const { userId } = req.query;  
    const courseId = Number(id);
    const userIdNum = userId ? Number(userId) : undefined;

    let course;
    if (userIdNum) {
      course = await Course.findOne({ where: { id: courseId, userId: userIdNum } });
    } else {
      course = await Course.findOne({ where: { id: courseId } });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });

  } catch (error) {
    console.error("Get Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

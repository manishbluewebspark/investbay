import { where } from 'sequelize';
import { Course } from '../models/Course.js';
import ResearchAnalyst from "../models/ResearchAnalyst.js";
import {deleteFromS3,uploadToS3} from '../utils/s3Upload.js'
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

    let imageUrl = null;
    let imageKey = null;

    // Upload image to S3 - coursesimages folder
    if (req.file) {
      const s3Result = await uploadToS3(
        req.file, 
        'coursesimages', 
        req.file.mimetype
      );
      imageUrl = s3Result.url;
      imageKey = s3Result.key;
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
      uplodedImage: imageUrl,
      imageKey: imageKey // Add this to your model if needed
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse
    });

  } catch (error) {
    console.error("Create Course Error:", error);
    
    // Clean up from S3 if course creation fails
    if (imageKey) {
      await deleteFromS3(imageKey);
    }
    
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ================================================= get courses by userId =================================================
export const getCoursesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const courses = await Course.findAll({ 
            where: { userId },
            order: [['createdAt', 'DESC']]
        });

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

// ================================================= update course =================================================
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const imageFile = req.file;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Handle new image upload
    if (imageFile) {
      // Delete old image from S3
      if (course.imageKey) {
        await deleteFromS3(course.imageKey);
      }

      // Upload new image to S3
      const s3Result = await uploadToS3(
        imageFile, 
        'coursesimages', 
        imageFile.mimetype
      );
      
      course.uplodedImage = s3Result.url;
      course.imageKey = s3Result.key;
    }

    // Update other fields
    if (updates.title) course.courseTitle = updates.title;
    if (updates.category) course.tradingCategory = updates.category;
    if (updates.level) course.courseLevel = updates.level;
    if (updates.language) course.courseLanguage = updates.language;
    if (updates.validity) course.accessValidity = updates.validity;
    if (updates.price) course.coursePrice = Number(updates.price);
    if (updates.discount !== undefined) course.discount = Number(updates.discount);
    if (updates.description) course.description = updates.description;

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course
    });

  } catch (error) {
    console.error("Update Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ================================================= delete course =================================================
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Delete image from S3
    if (course.imageKey) {
      await deleteFromS3(course.imageKey);
    }

    // Delete course from database
    await course.destroy();

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });

  } catch (error) {
    console.error("Delete Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ========================================= get all courses ================================

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll(); // no `where` clause
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error("Get all courses error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================== get courses by id ============================================

export const getCoursesById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const analyst = await ResearchAnalyst.findOne({
      where: { id: course.userId },
    });

    return res.status(200).json({
      success: true,
      data: {
        course,
        analyst,
      },
    });
  } catch (error) {
    console.error("Get course by id error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


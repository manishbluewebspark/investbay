import express from 'express';
import upload from '../middleware/upload.js';
import { 
    createCourse, 
    getCoursesByUserId, 
    getCourseWithUserId,
    updateCourse,
    deleteCourse, 
    getAllCourses,
    getCoursesById
} from '../controllers/course.controller.js';

const router = express.Router();

router.post("/add-course", upload.single('uplodedImage'), createCourse);
router.get("/allcourses", getAllCourses);
router.get("/data/:id", getCoursesById);
router.get("/:userId", getCoursesByUserId);
router.get("/details/:id", getCourseWithUserId);
router.put("/:id", upload.single('uplodedImage'), updateCourse);
router.delete("/:id", deleteCourse);

export default router;
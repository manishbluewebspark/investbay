// routes/news.routes.js
import express from 'express'
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  getNewsByCategory,
  getNewsByStatus,
  getNewsByAuthor,
  incrementNewsViews,
  getNewsStats
} from '../controllers/news.controller.js'
import upload from '../middleware/upload.js' // Make sure this path is correct

const router = express.Router()

// News CRUD operations - USE 'documents' INSTEAD OF 'images'
// router.post('/create', upload.array('documents', 10), createNews)

router.post('/create', upload.fields([
  { name: 'documents', maxCount: 10 },
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 10 },
  { name: 'newsImages', maxCount: 10 },
  { name: 'news_images', maxCount: 10 },
  { name: 'uplodedImage', maxCount: 10 }
]), createNews)


router.get('/all', getAllNews)
router.get('/stats', getNewsStats)
router.get('/:id', getNewsById)
// router.put('/:id', upload.array('documents', 10), updateNews) 

router.put('/:id', upload.fields([
  { name: 'documents', maxCount: 10 },
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 10 },
  { name: 'newsImages', maxCount: 10 },
  { name: 'news_images', maxCount: 10 },
  { name: 'uplodedImage', maxCount: 10 }
]), updateNews)

router.delete('/:id', deleteNews)

// Filter routes
router.get('/category/:category', getNewsByCategory)
router.get('/status/:status', getNewsByStatus)
router.get('/author/:authorId', getNewsByAuthor)

// Additional operations
router.patch('/:id/view', incrementNewsViews)

export default router
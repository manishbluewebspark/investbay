import express from 'express'
import {
  subscribe,
  unsubscribe,
  getSubscribers
} from '../controllers/subscriber.controller.js'

const router = express.Router()

router.post('/subscribe', subscribe)
router.put('/unsubscribe', unsubscribe)
router.get('/subscribers', getSubscribers)

export default router




import express from 'express'
import { notifySubscribers } from '../controllers/notify.controller.js'

const router = express.Router()

router.post('/notify', notifySubscribers)

export default router
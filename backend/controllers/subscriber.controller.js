import {
  addSubscriber,
  deactivateSubscriber,
  getAllSubscribers
} from '../queries/subscriber.queries.js'

export const subscribe = async (req, res) => {
  try {
    const { name, phone } = req.body
    const subscriber = await addSubscriber(name, phone)
    res.json({ success: true, subscriber })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const unsubscribe = async (req, res) => {
  try {
    const { phone } = req.body
    const subscriber = await deactivateSubscriber(phone)
    res.json({ success: true, subscriber })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await getAllSubscribers()
    res.json({ success: true, subscribers })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
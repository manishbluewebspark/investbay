import { getAllLogs } from '../queries/messageLog.queries.js'

export const getLogs = async (req, res) => {
  try {
    const logs = await getAllLogs()
    res.json({ success: true, logs })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
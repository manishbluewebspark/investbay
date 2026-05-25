import { pool } from '../db.js';

export const saveMessageLog = async (subscriber_id, phone, message, status, error = null) => {
  const result = await pool.query(
    `INSERT INTO message_logs (subscriber_id, phone, message, status, error)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [subscriber_id, phone, message, status, error]
  )
  return result.rows[0]
}

export const getAllLogs = async () => {
  const result = await pool.query(
    `SELECT ml.*, s.name 
     FROM message_logs ml
     JOIN subscribers s ON s.id = ml.subscriber_id
     ORDER BY ml.created_at DESC`
  )
  return result.rows
}
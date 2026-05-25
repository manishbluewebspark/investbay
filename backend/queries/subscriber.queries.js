import { pool } from '../db.js';

export const getAllActiveSubscribers = async () => {
  const result = await pool.query(
    `SELECT id, name, phone FROM subscribers WHERE is_active = TRUE`
  )
  return result.rows
}

export const addSubscriber = async (name, phone) => {
  const result = await pool.query(
    `INSERT INTO subscribers (name, phone) 
     VALUES ($1, $2) RETURNING *`,
    [name, phone]
  )
  return result.rows[0]
}

export const deactivateSubscriber = async (phone) => {
  const result = await pool.query(
    `UPDATE subscribers SET is_active = FALSE 
     WHERE phone = $1 RETURNING *`,
    [phone]
  )
  return result.rows[0]
}

export const getAllSubscribers = async () => {
  const result = await pool.query(
    `SELECT * FROM subscribers ORDER BY created_at DESC`
  )
  return result.rows
}
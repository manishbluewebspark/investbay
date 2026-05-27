import { pool } from '../db.js';

// User — new ticket create karo
export const createTicket = async (req, res) => {
  const client = await pool.connect();
  try {
    const { subject, message, category = 'general', priority = 'normal', ra_id } = req.body;
    const userId = req.user?.id || req.user?.userId;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    await client.query('BEGIN');

    // Ticket create karo
    const ticketResult = await client.query(`
      INSERT INTO support_tickets (user_id, ra_id, category, subject, status, priority)
      VALUES ($1, $2, $3, $4, 'open', $5)
      RETURNING *
    `, [userId, ra_id || null, category, subject, priority]);

    const ticket = ticketResult.rows[0];

    // First message insert karo
    await client.query(`
      INSERT INTO ticket_messages (ticket_id, sender_id, sender_role, message)
      VALUES ($1, $2, 'user', $3)
    `, [ticket.id, userId, message]);

    await client.query('COMMIT');

    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('createTicket error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    client.release();
  }
};

// User — apne tickets dekho
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const result = await pool.query(`
      SELECT 
        st.*,
        ra.name as ra_name,
        (SELECT COUNT(*) FROM ticket_messages tm 
         WHERE tm.ticket_id = st.id AND tm.is_read = false 
         AND tm.sender_role != 'user') as unread_count,
        (SELECT message FROM ticket_messages tm 
         WHERE tm.ticket_id = st.id 
         ORDER BY tm.created_at DESC LIMIT 1) as last_message
      FROM support_tickets st
      LEFT JOIN research_analysts ra ON ra.id = st.ra_id
      WHERE st.user_id = $1
      ORDER BY st.updated_at DESC
    `, [userId]);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Ticket messages fetch karo
export const getTicketMessages = async (req, res) => {
  const client = await pool.connect();
  try {
    const { ticketId } = req.params;
    const userId = req.user?.id || req.user?.userId;

    // Verify ticket belongs to user
    const ticketCheck = await client.query(
      `SELECT * FROM support_tickets WHERE id = $1 AND user_id = $2`,
      [ticketId, userId]
    );
    if (!ticketCheck.rows.length) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Messages fetch karo
    const messages = await client.query(`
      SELECT tm.*, 
        CASE 
          WHEN tm.sender_role = 'user' THEN u.name
          WHEN tm.sender_role = 'ra'   THEN ra.name
          ELSE 'Admin'
        END as sender_name
      FROM ticket_messages tm
      LEFT JOIN users u              ON tm.sender_role = 'user' AND tm.sender_id = u.id
      LEFT JOIN research_analysts ra ON tm.sender_role = 'ra'   AND tm.sender_id = ra.id
      WHERE tm.ticket_id = $1
      ORDER BY tm.created_at ASC
    `, [ticketId]);

    // Mark as read
    await client.query(`
      UPDATE ticket_messages 
      SET is_read = true 
      WHERE ticket_id = $1 AND sender_role != 'user'
    `, [ticketId]);

    res.json({ success: true, data: messages.rows, ticket: ticketCheck.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    client.release();
  }
};

// Reply bhejo
export const replyToTicket = async (req, res) => {
  const client = await pool.connect();
  try {
    const { ticketId } = req.params;
    const { message } = req.body;
    const userId  = req.user?.id    || req.user?.userId;
    const role    = req.user?.role  || 'user';
    const isRA    = req.user?.isRA  || role === 'ra';

    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: 'Message required' });
    }

    await client.query('BEGIN');

    // Message insert karo
    const msgResult = await client.query(`
      INSERT INTO ticket_messages (ticket_id, sender_id, sender_role, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [ticketId, userId, isRA ? 'ra' : 'user', message.trim()]);

    // Ticket status update karo
    await client.query(`
      UPDATE support_tickets 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
    `, [isRA ? 'in_progress' : 'open', ticketId]);

    await client.query('COMMIT');

    res.json({ success: true, data: msgResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    client.release();
  }
};

// RA — apne assigned tickets dekhe
export const getRATickets = async (req, res) => {
  try {
    const raId = req.user?.id || req.user?.userId;
    const result = await pool.query(`
      SELECT 
        st.*,
        u.name as user_name,
        u.email as user_email,
        (SELECT COUNT(*) FROM ticket_messages tm 
         WHERE tm.ticket_id = st.id AND tm.is_read = false 
         AND tm.sender_role = 'user') as unread_count,
        (SELECT message FROM ticket_messages tm 
         WHERE tm.ticket_id = st.id 
         ORDER BY tm.created_at DESC LIMIT 1) as last_message
      FROM support_tickets st
      LEFT JOIN users u ON u.id = st.user_id
      WHERE st.ra_id = $1
      ORDER BY st.updated_at DESC
    `, [raId]);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Close ticket
export const closeTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user?.id || req.user?.userId;
    await pool.query(
      `UPDATE support_tickets SET status = 'closed', updated_at = NOW()
       WHERE id = $1 AND user_id = $2`,
      [ticketId, userId]
    );
    res.json({ success: true, message: 'Ticket closed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
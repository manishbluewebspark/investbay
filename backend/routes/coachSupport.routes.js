// routes/coachSupport.routes.js
import express from 'express';
import { createTicket, getUserTickets, getTicketMessages, replyToTicket, getRATickets, closeTicket } from '../controllers/coachSupportController.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();
router.post('/',                      authRequired, createTicket);
router.get('/',                       authRequired, getUserTickets);
router.get('/ra-tickets',             authRequired, getRATickets);
router.get('/:ticketId/messages',     authRequired, getTicketMessages);
router.post('/:ticketId/reply',       authRequired, replyToTicket);
router.post('/:ticketId/close',       authRequired, closeTicket);
export default router;
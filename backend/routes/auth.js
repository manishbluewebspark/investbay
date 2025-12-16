import { Router } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { authRequired, signToken } from '../middleware/auth.js';

const router = Router();


router.post('/seed', async (_req, res) => {


  try {
    const exists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (exists) return res.json({ ok: true, message: 'User exists' });
    const passwordHash = await bcrypt.hash('admin123', 10);
    await User.create({ email: 'admin@example.com', passwordHash, name: 'Admin' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Seed failed' });
  }
});

router.post('/login', async (req, res) => {

  
  console.log('hello ji kese ho ')


  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

router.get('/me', authRequired, async (req, _res) => {
  _res.json({ user: req.user });
});

export default router;

const r = require('express').Router(), bcrypt = require('bcryptjs'), db = require('../db');
const { auth, sign } = require('../middleware/auth');
r.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  try {
    const x = db.prepare('INSERT INTO users(name,email,password) VALUES(?,?,?)').run(name, email.toLowerCase(), bcrypt.hashSync(password, 10));
    const u = { id: x.lastInsertRowid, name, email }; res.json({ token: sign(u), user: u });
  } catch { res.status(400).json({ error: 'Email already registered' }); }
});
r.post('/login', (req, res) => {
  const u = db.prepare('SELECT * FROM users WHERE email=?').get((req.body.email || '').toLowerCase());
  if (!u || !bcrypt.compareSync(req.body.password || '', u.password)) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: sign(u), user: { id: u.id, name: u.name, email: u.email } });
});
r.get('/me', auth, (req, res) => res.json(req.user));
module.exports = r;

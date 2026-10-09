const r = require('express').Router(), db = require('../db'), { auth } = require('../middleware/auth');
r.use(auth);
r.get('/', (req, res) => res.json(db.prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY id DESC LIMIT 30').all(req.user.id)));
r.post('/read', (req, res) => { db.prepare('UPDATE notifications SET is_read=1 WHERE user_id=?').run(req.user.id); res.json({ ok: true }); });
module.exports = r;

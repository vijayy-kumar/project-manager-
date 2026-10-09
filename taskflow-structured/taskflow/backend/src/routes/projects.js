const r = require('express').Router(), db = require('../db');
const { auth, guard } = require('../middleware/auth'), { notify, changed } = require('../realtime');
r.use(auth);
r.get('/', (req, res) => res.json(db.prepare(
  'SELECT p.* FROM projects p JOIN members m ON m.project_id=p.id WHERE m.user_id=? ORDER BY p.id DESC').all(req.user.id)));
r.post('/', (req, res) => {
  const x = db.prepare('INSERT INTO projects(name,owner_id) VALUES(?,?)').run(req.body.name, req.user.id);
  db.prepare('INSERT INTO members VALUES(?,?)').run(x.lastInsertRowid, req.user.id);
  res.json({ id: x.lastInsertRowid, name: req.body.name });
});
r.get('/:id', guard, (req, res) => res.json({
  project: db.prepare('SELECT * FROM projects WHERE id=?').get(req.pid),
  members: db.prepare('SELECT u.id,u.name,u.email FROM users u JOIN members m ON m.user_id=u.id WHERE m.project_id=?').all(req.pid),
  tasks: db.prepare('SELECT * FROM tasks WHERE project_id=? ORDER BY id').all(req.pid) }));
r.post('/:id/members', guard, (req, res) => {
  const u = db.prepare('SELECT id FROM users WHERE email=?').get((req.body.email || '').toLowerCase());
  if (!u) return res.status(404).json({ error: 'No user with that email' });
  db.prepare('INSERT OR IGNORE INTO members VALUES(?,?)').run(req.pid, u.id);
  notify(u.id, `${req.user.name} added you to a project`); changed(req.pid); res.json({ ok: true });
});
r.post('/:id/tasks', guard, (req, res) => {
  const { title, description = '', assignee_id = null } = req.body;
  const x = db.prepare('INSERT INTO tasks(project_id,title,description,assignee_id) VALUES(?,?,?,?)').run(req.pid, title, description, assignee_id);
  if (assignee_id && assignee_id !== req.user.id) notify(assignee_id, `${req.user.name} assigned you: ${title}`);
  changed(req.pid); res.json({ id: x.lastInsertRowid });
});
module.exports = r;

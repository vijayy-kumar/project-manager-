const r = require('express').Router(), db = require('../db');
const { auth, taskProject } = require('../middleware/auth'), { notify, changed, commentAdded } = require('../realtime');
r.use(auth);
r.patch('/:id', taskProject, (req, res) => {
  const t = { ...req.task, ...req.body };
  db.prepare('UPDATE tasks SET title=?,description=?,status=?,assignee_id=? WHERE id=?').run(t.title, t.description, t.status, t.assignee_id || null, t.id);
  if (t.assignee_id && t.assignee_id !== req.task.assignee_id && t.assignee_id !== req.user.id) notify(t.assignee_id, `${req.user.name} assigned you: ${t.title}`);
  changed(t.project_id); res.json({ ok: true });
});
r.delete('/:id', taskProject, (req, res) => {
  db.prepare('DELETE FROM comments WHERE task_id=?').run(req.task.id);
  db.prepare('DELETE FROM tasks WHERE id=?').run(req.task.id); changed(req.task.project_id); res.json({ ok: true });
});
r.get('/:id/comments', taskProject, (req, res) => res.json(db.prepare(
  'SELECT c.*,u.name FROM comments c JOIN users u ON u.id=c.user_id WHERE task_id=? ORDER BY c.id').all(req.task.id)));
r.post('/:id/comments', taskProject, (req, res) => {
  db.prepare('INSERT INTO comments(task_id,user_id,body) VALUES(?,?,?)').run(req.task.id, req.user.id, req.body.body);
  if (req.task.assignee_id && req.task.assignee_id !== req.user.id) notify(req.task.assignee_id, `${req.user.name} commented on: ${req.task.title}`);
  commentAdded(req.task.project_id, req.task.id); res.json({ ok: true });
});
module.exports = r;

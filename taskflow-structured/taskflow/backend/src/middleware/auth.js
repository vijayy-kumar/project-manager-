const jwt = require('jsonwebtoken'), db = require('../db'), { SECRET } = require('../config');
const isMember = (pid, uid) => db.prepare('SELECT 1 FROM members WHERE project_id=? AND user_id=?').get(pid, uid);
const sign = u => jwt.sign({ id: u.id }, SECRET, { expiresIn: '7d' });
const auth = (req, res, next) => {
  try {
    req.user = db.prepare('SELECT id,name,email FROM users WHERE id=?').get(jwt.verify((req.headers.authorization || '').slice(7), SECRET).id);
    if (!req.user) throw 0; next();
  } catch { res.status(401).json({ error: 'Unauthorized' }); }
};
const guard = (req, res, next) => {            // /projects/:id -> must be a member
  req.pid = +req.params.id;
  if (!isMember(req.pid, req.user.id)) return res.status(403).json({ error: 'Not a member' }); next();
};
const taskProject = (req, res, next) => {      // /tasks/:id -> must be member of its project
  req.task = db.prepare('SELECT * FROM tasks WHERE id=?').get(req.params.id);
  if (!req.task || !isMember(req.task.project_id, req.user.id)) return res.status(404).json({ error: 'Not found' }); next();
};
module.exports = { auth, guard, taskProject, isMember, sign };

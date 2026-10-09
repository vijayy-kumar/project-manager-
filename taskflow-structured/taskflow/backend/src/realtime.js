const { Server } = require('socket.io'), jwt = require('jsonwebtoken'), db = require('./db');
const { SECRET } = require('./config'), { isMember } = require('./middleware/auth');
let io;
function init(server) {
  io = new Server(server);
  io.use((s, next) => { try { s.uid = jwt.verify(s.handshake.auth.token, SECRET).id; next(); } catch { next(new Error('auth')); } });
  io.on('connection', s => {
    s.join('user:' + s.uid);
    s.on('join', pid => isMember(pid, s.uid) && s.join('project:' + pid));
  });
}
const notify = (uid, text) => { if (!uid) return;
  db.prepare('INSERT INTO notifications(user_id,text) VALUES(?,?)').run(uid, text); io.to('user:' + uid).emit('notification', { text }); };
const changed = pid => io.to('project:' + pid).emit('project:update', { projectId: pid });
const commentAdded = (pid, taskId) => io.to('project:' + pid).emit('comment:new', { taskId });
module.exports = { init, notify, changed, commentAdded };

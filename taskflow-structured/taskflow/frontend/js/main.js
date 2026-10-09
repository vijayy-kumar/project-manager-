async function init(){try{user=await api('GET','/me')}catch{return}
 $('auth').style.display='none';$('app').style.display='grid';$('me').textContent=user.name;
 socket=io({auth:{token}});
 socket.on('project:update',e=>{if(e.projectId===pid)loadProject()});
 socket.on('comment:new',e=>{if(openTask&&openTask.id===e.taskId)loadComments()});
 socket.on('notification',e=>{toast(e.text);loadN()});
 await loadProjects();loadN()}
if(token)init();

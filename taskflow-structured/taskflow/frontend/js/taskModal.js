function showTask(id){openTask=data.tasks.find(t=>t.id===id);const t=openTask;$('modal').style.display='flex';
 $('mb').innerHTML=`<input id="mt" value="${esc(t.title)}"><textarea id="md" rows="3" placeholder="Description">${esc(t.description)}</textarea>
 <select id="ms">${COLS.map(([k,l])=>`<option value="${k}" ${t.status===k?'selected':''}>${l}</option>`).join('')}</select>
 <select id="ma"><option value="">Unassigned</option>${data.members.map(m=>`<option value="${m.id}" ${t.assignee_id===m.id?'selected':''}>${esc(m.name)}</option>`).join('')}</select>
 <div class="bar"><button onclick="saveTask()">Save</button><button class="g" onclick="delTask()">Delete</button></div><b>Comments</b><div id="cl"></div>
 <div class="bar"><input id="ci" placeholder="Write a comment" style="flex:1"><button onclick="addC()">Send</button></div>`;loadComments()}
async function saveTask(){await api('PATCH','/tasks/'+openTask.id,{title:$('mt').value,description:$('md').value,status:$('ms').value,assignee_id:+$('ma').value||null});$('modal').style.display='none'}
async function delTask(){await api('DELETE','/tasks/'+openTask.id);$('modal').style.display='none'}
async function loadComments(){const c=await api('GET',`/tasks/${openTask.id}/comments`);$('cl').innerHTML=c.map(x=>`<div class="cm"><b>${esc(x.name)}</b>: ${esc(x.body)}</div>`).join('')||'<small>No comments yet</small>'}
async function addC(){if(!$('ci').value)return;await api('POST',`/tasks/${openTask.id}/comments`,{body:$('ci').value});$('ci').value='';loadComments()}

const COLS=[['todo','To Do'],['doing','In Progress'],['done','Done']];
const nm=id=>(data.members.find(m=>m.id===id)||{}).name;
function render(){$('main').innerHTML=`<h2>${esc(data.project.name)}</h2><div class="bar"><input id="tt" placeholder="New task title">
<select id="ta"><option value="">Unassigned</option>${data.members.map(m=>`<option value="${m.id}">${esc(m.name)}</option>`).join('')}</select>
<button onclick="addTask()">Add task</button><input id="me2" placeholder="Invite by email"><button class="g" onclick="invite()">Invite</button></div>
<div class="cols">${COLS.map(([k,l])=>`<div class="col" ondragover="event.preventDefault()" ondrop="drop(event,'${k}')"><b>${l}</b>
${data.tasks.filter(t=>t.status===k).map(t=>`<div class="card" draggable="true" ondragstart="event.dataTransfer.setData('id',${t.id})" onclick="showTask(${t.id})">${esc(t.title)}<small>${t.assignee_id?'👤 '+esc(nm(t.assignee_id)):'Unassigned'}</small></div>`).join('')}</div>`).join('')}</div>`}
async function addTask(){if(!$('tt').value)return;await api('POST',`/projects/${pid}/tasks`,{title:$('tt').value,assignee_id:+$('ta').value||null})}
function drop(e,s){api('PATCH','/tasks/'+e.dataTransfer.getData('id'),{status:s})}

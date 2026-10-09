async function loadProjects(){const ps=await api('GET','/projects');$('pl').innerHTML=ps.map(p=>`<div class="p ${p.id===pid?'a':''}" onclick="selectP(${p.id})">${esc(p.name)}</div>`).join('')}
async function addProject(){if(!$('pn').value)return;const p=await api('POST','/projects',{name:$('pn').value});$('pn').value='';await loadProjects();selectP(p.id)}
function selectP(id){pid=id;socket.emit('join',id);loadProject();loadProjects()}
async function loadProject(){data=await api('GET','/projects/'+pid);render()}
async function invite(){try{await api('POST',`/projects/${pid}/members`,{email:$('me2').value})}catch(e){alert(e.message)}}

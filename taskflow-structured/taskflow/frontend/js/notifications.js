async function loadN(){const n=await api('GET','/notifications');const u=n.filter(x=>!x.is_read).length;$('cnt').textContent=u||'';
 $('nl').innerHTML=n.map(x=>`<div style="${x.is_read?'':'font-weight:600'}">${esc(x.text)}</div>`).join('')||'<div>No notifications</div>'}
async function toggleN(){const s=$('nl').style;s.display=s.display==='block'?'none':'block';if(s.display==='none'){await api('POST','/notifications/read');loadN()}}
function toast(t){const e=$('toast');e.textContent=t;e.style.display='block';setTimeout(()=>e.style.display='none',3500)}

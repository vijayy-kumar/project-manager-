let token=localStorage.t,user=null,pid=null,data=null,socket,openTask=null;const $=id=>document.getElementById(id);
const api=async(m,u,b)=>{const r=await fetch('/api'+u,{method:m,headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:b?JSON.stringify(b):undefined});
 const j=await r.json();if(!r.ok)throw new Error(j.error);return j};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

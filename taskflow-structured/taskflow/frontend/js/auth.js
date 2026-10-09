async function authGo(k){try{const r=await fetch('/api/'+k,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:$('n').value,email:$('e').value,password:$('pw').value})});
 const j=await r.json();if(!r.ok)throw new Error(j.error);token=j.token;localStorage.t=token;init()}catch(e){$('err').textContent=e.message}}
function logout(){localStorage.removeItem('t');location.reload()}

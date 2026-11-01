// Guest sessions are bearer capabilities: only their SHA-256 hashes are stored.
const base=Deno.env.get('SUPABASE_URL')!;
const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const origin='https://larp-learn.onrender.com';
const cors={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS','Vary':'Origin'};
const json=(v:unknown,status=200)=>new Response(JSON.stringify(v),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(n=>n.toString(16).padStart(2,'0')).join('');
async function db(path:string,method='GET',body?:unknown){const r=await fetch(`${base}/rest/v1/${path}`,{method,headers:{apikey:service,Authorization:`Bearer ${service}`,'Content-Type':'application/json',Prefer:'return=representation'},body:body===undefined?undefined:JSON.stringify(body)});if(!r.ok)throw new Error('Database request failed');return r.status===204?[]:r.json();}
Deno.serve(async req=>{if(req.method==='OPTIONS')return new Response(null,{headers:cors});if(req.headers.get('origin')&&req.headers.get('origin')!==origin)return json({error:'Origin not allowed'},403);try{
 const route=new URL(req.url).pathname.split('/').pop();
 if(route==='health')return json({ok:true,mailConfigured:Boolean(Deno.env.get('AGENTBOXD_API_KEY')&&Deno.env.get('AGENTBOXD_INBOX_ID'))});
 if(Number(req.headers.get('content-length')||0)>16384)return json({error:'Request too large'},413);
 const ipHash=await hash((req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim());
 const day=new Date(Date.now()-86400000).toISOString();
 if(route==='session'&&req.method==='POST'){
 const recent=await db(`larp_sessions?ip_hash=eq.${ipHash}&created_at=gte.${day}&select=id&limit=20`);if(recent.length>=20)return json({error:'Please try again tomorrow'},429);
 const token=Array.from(crypto.getRandomValues(new Uint8Array(32))).map(n=>n.toString(16).padStart(2,'0')).join('');
 await db('larp_sessions','POST',{token_hash:await hash(token),ip_hash:ipHash});return json({token},201);}
 const token=(req.headers.get('authorization')||'').replace(/^Bearer /,'');if(!/^[a-f0-9]{64}$/.test(token))return json({error:'A valid session is required'},401);
 const rows=await db(`larp_sessions?token_hash=eq.${await hash(token)}&select=id,state&limit=1`);if(!rows.length)return json({error:'Session expired'},401);const session=rows[0];
 if(route==='progress'&&req.method==='GET')return json({state:session.state});
 if(route==='progress'&&req.method==='PUT'){const body=await req.json();const s=body.state;if(!s||typeof s!=='object'||JSON.stringify(s).length>12000)return json({error:'Invalid progress'},400);const state={step:Math.min(6,Math.max(0,Math.floor(Number(s.step)||0))),hints:Math.min(999,Math.max(0,Number(s.hints)||0)),mistakes:Math.min(999,Math.max(0,Number(s.mistakes)||0)),completed:s.completed===true,answers:s.answers&&typeof s.answers==='object'?s.answers:{},persona:['founder','engineer','visionary'].includes(s.persona)?s.persona:'founder',pitchCount:Math.min(999,Math.max(0,Number(s.pitchCount)||0)),meetingScore:Math.min(3,Math.max(0,Number(s.meetingScore)||0)),activeDays:Array.isArray(s.activeDays)?s.activeDays.filter((v:unknown)=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)).slice(-365):[]};await db(`larp_sessions?id=eq.${session.id}`,'PATCH',{state,updated_at:new Date().toISOString()});return json({saved:true});}
 if(route==='receipt'&&req.method==='POST'){
 const key=Deno.env.get('AGENTBOXD_API_KEY'),inbox=Deno.env.get('AGENTBOXD_INBOX_ID');if(!key||!inbox)return json({error:'Email is being connected. Your progress is already saved.'},503);
 const {email,consent}=await req.json();if(consent!==true||typeof email!=='string'||email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return json({error:'Enter your email and confirm the one-time email request'},400);
 if(!session.state.completed)return json({error:'Finish the API mission first'},403);
 const recent=await db(`larp_mail_receipts?created_at=gte.${day}&select=id,session_id,recipient&limit=100`);if(recent.length>=40||recent.some((m:any)=>m.session_id===session.id||m.recipient===email.toLowerCase()))return json({error:'A receipt was already requested today. Please check your inbox.'},429);
 const row=(await db('larp_mail_receipts','POST',{session_id:session.id,recipient:email.toLowerCase()}))[0];
 const response=await fetch(`https://api.agentboxd.com/v1/inboxes/${encodeURIComponent(inbox)}/messages/send`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':row.id},body:JSON.stringify({to:[email.toLowerCase()],subject:'Your Larp Club skills receipt — Larpy approved',text:'You earned the flex!\n\nYou completed the API Incident practice mission.\n\nSkills practised:\n• Explain an API in plain English\n• Choose a GET endpoint and read 200 OK\n• Read JSON data\n• Handle a 503 response responsibly\n\nYour unofficial title: Junior Vice President of Knowing What HTTP Is.\n\nKeep larping: https://larp-learn.onrender.com\n\nThis is a one-time email you requested. No mailing-list subscription. This practice badge is not a professional certification.\n\n— Larpy, Larp Club'})});
 const result=await response.json();await db(`larp_mail_receipts?id=eq.${row.id}`,'PATCH',{status:response.ok?'queued':'failed',provider_id:response.ok?String(result.id||result.message?.id||'queued'):null});if(!response.ok)return json({error:'The email provider could not queue the receipt. Please try tomorrow.'},502);return json({queued:true});}
 return json({error:'Not found'},404);
 }catch{return json({error:'Something went wrong. Please try again.'},500);}});

type DB=(path:string,method?:string,body?:unknown)=>Promise<any>;
export async function roomRoute(route:string|undefined,req:Request,session:any,db:DB){
 if(!['rooms','room','room-submit'].includes(route||''))return null;
 const day=new Date(Date.now()-86400000).toISOString();
 if(route==='rooms'&&req.method==='POST'){
  const recent=await db(`larp_rooms?owner_id=eq.${session.id}&created_at=gte.${day}&select=id&limit=3`);
  if(recent.length>=3)return {status:429,body:{error:'Three rooms per day is plenty of meetings. Join one you already made.'}};
  const all=await db(`larp_rooms?created_at=gte.${day}&select=id&limit=100`);if(all.length>=100)return {status:429,body:{error:'The room limit is reached for today. Solo Hot Seat is still open.'}};
  const bytes=crypto.getRandomValues(new Uint8Array(8));const code=Array.from(bytes.slice(0,4)).map(n=>n.toString(16).padStart(2,'0')).join('').toUpperCase();
  const inventory={exercise:'inventory',snacks:[{name:'Stand-up Shortbread',stock:1+bytes[4]%9},{name:'Sprint Samosas',stock:0},{name:'Backlog Brownies',stock:1+bytes[5]%7}],note:'Shared sample inventory. Everyone in this room receives the same data.'};
  const row=(await db('larp_rooms','POST',{owner_id:session.id,code,inventory}))[0];return {status:201,body:{code:row.code}};
 }
 if(!((route==='room'&&req.method==='GET')||(route==='room-submit'&&req.method==='POST')))return {status:405,body:{error:'Method not supported'}};
 const raw=route==='room'?new URL(req.url).searchParams.get('code'):(await req.clone().json()).code;
 const code=typeof raw==='string'?raw.trim().toUpperCase():'';if(!/^[A-F0-9]{8}$/.test(code))return {status:400,body:{error:'Enter the eight-character room code.'}};
 const rooms=await db(`larp_rooms?code=eq.${code}&expires_at=gt.${new Date().toISOString()}&select=id,code,inventory,expires_at&limit=1`);
 if(!rooms.length)return {status:404,body:{error:'That room is missing or expired. Rooms stay open for six hours.'}};
 const room=rooms[0];
 if(route==='room'&&req.method==='GET'){
  const board=await db(`larp_room_entries?room_id=eq.${room.id}&select=alias,attempts,score,correct&order=score.desc,updated_at.asc&limit=20`);
  const own=await db(`larp_room_entries?room_id=eq.${room.id}&session_id=eq.${session.id}&select=alias,attempts,score,correct&limit=1`);
  return {status:200,body:{code,inventory:room.inventory,expiresAt:room.expires_at,board,you:own[0]||null}};
 }
 if(route==='room-submit'&&req.method==='POST'){
  const b=await req.json();if(![b.status,b.total,b.empty].every(n=>Number.isInteger(n)&&n>=0&&n<=999))return {status:400,body:{error:'Use whole numbers for all three answers.'}};
  const result=await db('rpc/larp_submit_room','POST',{p_code:code,p_player:session.id,p_status:b.status,p_total:b.total,p_empty:b.empty});
  return {status:result.error?404:200,body:result};
 }
 return {status:405,body:{error:'Method not supported'}};
}

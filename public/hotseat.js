// Explicit checks against the server response; no AI grading or hidden keyword score.
export function gradeInventory(data,answer){
 if(!Array.isArray(data?.snacks)||!data.snacks.length)return {ok:false,message:'Get a successful inventory response first.'};
 const total=data.snacks.reduce((n,s)=>n+s.stock,0),empty=data.snacks.filter(s=>s.stock===0).length;
 if(String(answer.status).trim()!=='200')return {ok:false,message:'Read the HTTP status above the JSON. Which code says the request succeeded?'};
 if(String(answer.total).trim()===''||Number(answer.total)!==total)return {ok:false,message:'Add the stock values across all three snacks. Count units, not rows.'};
 if(String(answer.empty).trim()===''||Number(answer.empty)!==empty)return {ok:false,message:'Count the snacks whose stock is exactly 0. Those should show as sold out.'};
 return {ok:true,total,empty,message:'You read a new response and worked out what the app should show. No answer choices. No guessing the longest sentence.'};
}

import {campaigns} from '../public/campaigns.js';
export function buildReceipt(state){
 const finished=Object.entries(campaigns).filter(([id,c])=>state.campaigns?.[id]?.done===true&&c.scenes.every((_,i)=>state.campaigns[id].solved?.[i]===true));
 if(!finished.length&&!state.completed)return null;
 const sections=finished.map(([,c])=>`${c.title}\nYour unofficial title: ${c.role}\nSkills practised:\n${c.scenes.map(s=>'• '+s.skill).join('\n')}`);
 if(!finished.length)sections.push('The API Incident\nYour unofficial title: Junior Vice President of Knowing What HTTP Is\nSkills practised:\n• Explain APIs in plain English\n• Read a GET response and JSON\n• Handle unavailable services');
 const wins=Math.min(999,Math.max(0,Math.floor(Number(state.hotseatWins)||0)));
 return `You pulled it off.\n\n${sections.join('\n\n')}\n\n${wins?`You also solved ${wins} fresh Hot Seat ${wins===1?'inventory':'inventories'} without answer choices.\n\n`:''}These are completed practice scenarios, based on your saved progress. The titles are for fun, not professional qualifications.\n\nKeep going: https://larp-learn.onrender.com\n\nThis is a one-time email you requested. No mailing-list subscription.\n\n— Larpy, Larp Club`;
}

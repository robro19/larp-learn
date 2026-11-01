// Completion is monotonic; preferences come from the browser unless it has no local save.
export function mergeProgress(local={},remote={},preferLocal=true){
 const merged=preferLocal?{...remote,...local}:{...local,...remote};
 merged.answers={...(remote.answers||{}),...(local.answers||{})};
 merged.campaigns={};
 const sceneCounts={founder:6,analyst:4,engineer:4,visionary:4};
 for(const id of ['founder','analyst','engineer','visionary']){
  const count=sceneCounts[id];
  const a=local.campaigns?.[id]||{},b=remote.campaigns?.[id]||{};
  const solved={};for(let i=0;i<count;i++)if(a.solved?.[i]===true||b.solved?.[i]===true)solved[i]=true;
  const attempts={};for(let i=0;i<count;i++){const n=Math.max(Number(a.attempts?.[i])||0,Number(b.attempts?.[i])||0);if(n)attempts[i]=n;}
  merged.campaigns[id]={solved,attempts,next:Math.max(Number(a.next)||0,Number(b.next)||0),done:a.done===true||b.done===true};
 }
 for(const k of ['step','hints','mistakes','pitchCount','hotseatWins','roomWins'])merged[k]=Math.max(Number(local[k])||0,Number(remote[k])||0);
 merged.completed=local.completed===true||remote.completed===true;
 merged.meetingCorrect=[...new Set([...(local.meetingCorrect||[]),...(remote.meetingCorrect||[])])].filter(n=>[0,1,2].includes(n));
 merged.meetingScore=Math.min(3,Math.max(merged.meetingCorrect.length,Number(local.meetingScore)||0,Number(remote.meetingScore)||0));
 merged.activeDays=[...new Set([...(local.activeDays||[]),...(remote.activeDays||[])])].sort().slice(-365);
 return merged;
}

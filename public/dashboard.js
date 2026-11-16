'use strict';
const el = id => document.getElementById(id);
let last = null;
async function request(path,options={}){
  const res=await fetch(path,{credentials:'same-origin',headers:{'Accept':'application/json','Content-Type':'application/json'},...options});
  const data=await res.json().catch(()=>({}));
  if(!res.ok) throw Error(data.error || 'Unable to load data');
  return data;
}
function showError(message){el('error').hidden=false;el('error').textContent=String(message);}
function yes(v){return v?'Yes':'No';}
function render(data){
  last=data;
  const c=data.config, s=data.stats;
  const active=c.enabled && c.autoPublish && !c.globalPause && !c.operatorPaused;
  el('state').textContent=active?'Publishing enabled':c.globalPause||c.operatorPaused?'Paused':'Dry-run / inactive';
  el('community').textContent='r/'+data.subreddit;
  el('screened').textContent=Object.values(s).reduce((n,v)=>n+Number(v||0),0);
  el('published').textContent=s.published||0;
  el('dry-run').textContent=s['dry-run']||0;
  el('error-count').textContent=s.error||0;
  el('global').textContent=c.globalPause?'STOPPED':'Released';
  el('enabled').textContent=yes(c.enabled);
  el('auto').textContent=yes(c.autoPublish);
  el('topics').textContent=c.topicKeywords||'None';
  el('limit').textContent=c.maxDailyReplies+' per day';
  el('confidence').textContent=c.minimumConfidence+'%';
  el('toggle').textContent=c.operatorPaused?'Release operator pause':'Pause bot';
  el('toggle').disabled=false;
  el('help').textContent=c.operatorPaused?'Operator pause is ON. Releasing it cannot override global/community settings.':'Operator pause is OFF. You can stop all future replies immediately.';
}
async function load(){
  try {render(await request('/api/dashboard'));el('error').hidden=true;}
  catch(e){showError(e.message);el('toggle').disabled=true;}
}
el('refresh').addEventListener('click',load);
el('toggle').addEventListener('click',async()=>{
  if(!last) return;
  const paused=!last.config.operatorPaused;
  const message=paused?'Pause all future processing?':'Release the extra operator pause? Other safety settings remain in force.';
  if(!confirm(message)) return;
  el('toggle').disabled=true;
  try {await request('/api/operator-pause',{method:'POST',body:JSON.stringify({paused})});await load();}
  catch(e){showError(e.message);}
  finally {el('toggle').disabled=false;}
});
load();

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

test('learner completes mission, wrong requests recover, and earned progress survives reload',()=>{
 const storage=new Map(),elements=new Map();
 const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',hidden:false});return elements.get(id)};
 const context={document:{querySelector:element,addEventListener(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},window:{scrollTo(){}},navigator:{},URLSearchParams,location:{search:""}};
 vm.createContext(context);const source=readFileSync(new URL('./public/app.js',import.meta.url),'utf8');vm.runInContext(source,context);
 const run=s=>vm.runInContext(s,context);
 run('start();selected=2;check()');assert.equal(run('passed'),true);run('state.step=1;resetTransient();selected=2;check()');assert.equal(run('passed'),false);assert.equal(run('state.mistakes'),1);
 run('selected=0;check()');assert.equal(run('passed'),true);
 run('state.step=2;resetTransient();mission()');element('#endpoint').value='wrong';run('request()');assert.match(element('#response').textContent,/404/);assert.equal(run('passed'),false);
 element('#endpoint').value='correct';run('request()');assert.equal(run('passed'),true);
 for(const step of [3,4,5]){run(`state.step=${step};resetTransient();selected=0;check()`);assert.equal(run('passed'),true)}
 run('state.step=6;state.completed=true;save();receipt()');assert.match(element('#app').innerHTML,/skills demonstrated/);assert.equal(JSON.parse(storage.get('larp-learn-v1')).completed,true);
 const reloaded={...context};vm.createContext(reloaded);vm.runInContext(source,reloaded);assert.equal(vm.runInContext('state.completed',reloaded),true);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {handleShortcut} from './public/shortcuts.js';

const node=(tagName='',extra={})=>({tagName,isContentEditable:false,...extra});
const event=(key,extra={})=>{const e={key,repeat:false,ctrlKey:false,metaKey:false,altKey:false,target:node('MAIN'),prevented:false,preventDefault(){this.prevented=true},...extra};return e};
function fakeRoot({choices=[],footer=null,activeElement}={}){return {activeElement,querySelectorAll:()=>choices,querySelector:()=>footer};}

test('number keys click the scene choice shown at that position',()=>{
  const clicked=[];
  const choices=[node('BUTTON',{dataset:{sceneChoice:'2'},click(){clicked.push(2)}}),node('BUTTON',{dataset:{sceneChoice:'0'},click(){clicked.push(0)}})];
  const root=fakeRoot({choices});
  const second=event('2');
  assert.equal(handleShortcut(second,{page:'campaign',root}),true);
  assert.equal(second.prevented,true);
  assert.deepEqual(clicked,[0]);
  assert.equal(handleShortcut(event('3'),{page:'campaign',root}),false);
});

test('Enter activates the enabled footer but not a focused control',()=>{
  const clicked=[];
  const footer=node('BUTTON',{click(){clicked.push('footer')}});
  const root=fakeRoot({footer});
  const enter=event('Enter');
  assert.equal(handleShortcut(enter,{page:'campaign',root}),true);
  assert.equal(enter.prevented,true);
  assert.deepEqual(clicked,['footer']);
  assert.equal(handleShortcut(event('Enter'),{page:'campaign',root,activeElement:node('BUTTON')}),false);
  assert.deepEqual(clicked,['footer']);
});

test('lesson answers and footer respond to the same shortcuts',()=>{
  const clicked=[];
  const choices=[node('BUTTON',{dataset:{choice:'0'},click(){clicked.push(0)}}),node('BUTTON',{dataset:{choice:'1'},click(){clicked.push(1)}})];
  const root=fakeRoot({choices,footer:node('BUTTON',{click(){clicked.push('check')}})});
  assert.equal(handleShortcut(event('2'),{page:'lesson',root}),true);
  assert.equal(handleShortcut(event('Enter'),{page:'lesson',root}),true);
  assert.deepEqual(clicked,[1,'check']);
});

test('ignores modifiers, repeats, typing targets and other pages',()=>{
  const clicked=[];
  const choices=[node('BUTTON',{dataset:{sceneChoice:'0'},click(){clicked.push(0)}})];
  const root=fakeRoot({choices,footer:node('BUTTON',{click(){clicked.push('footer')}})});
  assert.equal(handleShortcut(event('1',{repeat:true}),{page:'campaign',root}),false);
  assert.equal(handleShortcut(event('1',{metaKey:true}),{page:'campaign',root}),false);
  assert.equal(handleShortcut(event('1',{target:node('INPUT')}),{page:'campaign',root}),false);
  assert.equal(handleShortcut(event('1'),{page:'campaign',root,activeElement:node('TEXTAREA')}),false);
  assert.equal(handleShortcut(event('Enter',{target:node('SELECT')}),{page:'campaign',root}),false);
  assert.equal(handleShortcut(event('1'),{page:'lounge',root}),false);
  assert.deepEqual(clicked,[]);
});

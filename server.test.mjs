import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from './server.mjs';

const server=createApp();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
test.after(()=>new Promise(resolve=>server.close(resolve)));

test('pages and cacheable assets reply with correct MIME types',async()=>{
 const checks=[['/','text/html'],['/style.css','text/css'],['/app.js','text/javascript'],['/larpy.svg','image/svg+xml'],['/demo/larp-club-demo.mp4','video/mp4'],['/demo/demo.vtt','text/vtt'],['/demo/chapters.json','application/json']];
 for(const[target,type]of checks){const r=await fetch(base+target);assert.equal(r.status,200);assert.ok(r.headers.get('content-type').startsWith(type),target+' → '+r.headers.get('content-type'));}
});

test('HEAD returns metadata without a body',async()=>{
 const r=await fetch(base+'/app.js',{method:'HEAD'});
 assert.equal(r.status,200);
 assert.ok(Number(r.headers.get('content-length'))>0);
 assert.equal(await r.text(),'');
});

test('matching ETag replies 304 without a body',async()=>{
 const first=await fetch(base+'/style.css');
 const etag=first.headers.get('etag');
 assert.ok(etag);
 await first.arrayBuffer();
 const second=await fetch(base+'/style.css',{headers:{'if-none-match':etag}});
 assert.equal(second.status,304);
 assert.equal(await second.text(),'');
});

test('text assets are served gzip-compressed on request',async()=>{
 const r=await fetch(base+'/style.css',{headers:{'accept-encoding':'gzip'}});
 assert.equal(r.headers.get('content-encoding'),'gzip');
 const text=await r.text();
 assert.ok(text.includes('larp'));
});

test('health endpoint stays available and uncached',async()=>{
 const r=await fetch(base+'/health');
 assert.equal(r.status,200);
 assert.equal(r.headers.get('cache-control'),'no-store');
 assert.deepEqual(await r.json(),{ok:true});
});

test('escapes above public/ and unknown paths are rejected',async()=>{
 // URL normalization collapses single dot segments, so try the double-encoded form too.
 const escape=await fetch(base+'/%252e%252e/package.json');
 const leaked=await escape.text();
 assert.notEqual(escape.status,200,'must not serve files from above public/');
 assert.ok(!leaked.includes('larp-learn'),'must not leak package contents');
 const missing=await fetch(base+'/missing');
 assert.equal(missing.status,404);
});

test('unsupported methods are rejected politely',async()=>{
 const r=await fetch(base+'/',{method:'POST'});
 assert.equal(r.status,405);
 assert.ok((r.headers.get('allow')||'').includes('GET'));
});

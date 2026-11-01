import http from 'node:http';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('./public/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json','.mp4':'video/mp4','.webm':'video/webm','.vtt':'text/vtt','.txt':'text/plain; charset=utf-8'};
const compressible=t=>t.startsWith('text/')||t.includes('json')||t.includes('svg+xml')||t.includes('javascript');
function etag(data){return '"'+data.length.toString(36)+'-'+createHash('sha1').update(data).digest('base64url')+'"'}
export function createApp(){return http.createServer(async(req,res)=>{try{
 const method=req.method.toUpperCase();
 if(method!=='GET'&&method!=='HEAD'){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end('{"ok":true}');}
 const target=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 const data=await readFile(target);
 const type=types[path.extname(target)]||'application/octet-stream';
 const tag=etag(data);
 if(req.headers['if-none-match']===tag){res.writeHead(304,{ETag:tag});return res.end();}
 const head={'Content-Type':type,'Cache-Control':'public, max-age=300','X-Content-Type-Options':'nosniff',ETag:tag};
 if(compressible(type)&&(req.headers['accept-encoding']||'').includes('gzip')){const gz=gzipSync(data);res.writeHead(200,{...head,'Content-Encoding':'gzip',Vary:'Accept-Encoding','Content-Length':gz.length});return res.end(method==='HEAD'?undefined:gz);}
 res.writeHead(200,{...head,'Content-Length':data.length});res.end(method==='HEAD'?undefined:data);
}catch{res.writeHead(404);res.end('Not found');}})}
const invoked=process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href;
if(invoked)createApp().listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('Larp → Learn on http://localhost:'+(process.env.PORT||3000)));

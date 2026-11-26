const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),port=Number(process.env.PORT||4173);
// Optional prefix lets developers check a GitHub Pages repository subpath.
const prefix=(process.argv.find(x=>x.startsWith('--base='))?.slice(7)||'').replace(/\/$/,'');
http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end('Bad request')}
 if(prefix){if(pathname===prefix){res.writeHead(302,{Location:prefix+'/'});return res.end()}if(!pathname.startsWith(prefix+'/')){res.writeHead(404);return res.end('Not found')}pathname=pathname.slice(prefix.length)}
 let file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);return res.end('Forbidden')}
 if(file===root||fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.woff2':'font/woff2','.ttf':'font/ttf','.png':'image/png','.webmanifest':'application/manifest+json'};res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)})
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}${prefix}/`));

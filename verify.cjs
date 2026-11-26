const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const local=x=>x&&!/^(https?:|data:|#)/.test(x);
const assets=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(local);
for(const css of assets.filter(x=>x.endsWith('.css'))){const body=fs.readFileSync(path.join(root,css),'utf8');assets.push(...[...body.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(m=>m[1]).filter(local))}
for(const asset of new Set(assets)){assert(!asset.startsWith('/'),'Use relative paths for GitHub Pages: '+asset);assert(fs.existsSync(path.join(root,asset)),'Missing asset: '+asset)}
for(const name of fs.readdirSync(root).filter(n=>n.endsWith('.js'))){const result=spawnSync(process.execPath,['--check',path.join(root,name)],{encoding:'utf8'});assert.ifError(result.error);assert.equal(result.status,0,result.stderr||'Syntax check failed: '+name)}
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'config.js'),'utf8'),ctx);assert(/^[a-f0-9]{64}$/.test(ctx.window.APP_CONFIG.teacherPasswordSha256));assert.equal(new URL(ctx.window.APP_CONFIG.teamsUrl).protocol,'https:');
assert(html.includes('data-role="student"'));assert(html.indexOf('src="config.js"')<html.indexOf('src="modes.js"'));assert(fs.existsSync(path.join(root,'.nojekyll')));
console.log('Passed: JavaScript syntax, relative assets/fonts, configuration and GitHub Pages entrypoint.');

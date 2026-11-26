const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),C=require('../core.js'),F=require('../feed-core.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'seed.js'),'utf8'),ctx);
const db=C.clone(ctx.window.SEED);C.ensureRooms(db);C.ensureGreetings(db,db);C.ensureRoster(db);C.ensureTeacherColors(db);
const before=JSON.stringify(db),feed=F.create(db,'2026-11-26','2026-11-26T04:00:00Z');
assert.equal(JSON.stringify(db),before,'Export must not modify the editable planner');
assert(feed.data.weeks.every(w=>['2026-11-23','2026-11-30'].includes(w.start)));
assert(!JSON.stringify(feed).includes('source"'));assert(!feed.data.notes);
assert(feed.data.weeks.every(w=>w.entries.every(e=>e.status!=='cancelled')));
assert(feed.data.weeks.every(w=>w.greetings.every(g=>g.note===''&&g.rotationTeacherIds.length===0)));
assert.throws(()=>F.validate({...feed,format:'backup'}));
assert.throws(()=>F.create(db,'2030-01-01')); // no silent fallback to historical schedules
const changed=C.clone(feed);changed.data.weeks[0].entries[0].title='Chuyên đề vừa cập nhật';
assert.notEqual(F.signature(feed),F.signature(changed));assert.equal(F.changedWeek(feed,changed,'2026-11-26').start,'2026-11-23');
// Exercise repeated student/teacher transitions and a second accepted update.
const memory=new Map(),sandbox={URL,location:{href:'https://example.org/subpath/'},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},StudentFeed:F,C,document:{getElementById:()=>null},console};
vm.createContext(sandbox);
vm.runInContext('let db='+JSON.stringify(db)+';let teacherMode=false;function isTeacher(){return teacherMode}',sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'student-sync.js'),'utf8'),sandbox);
vm.runInContext('const original=db;acceptedFeed='+JSON.stringify(feed)+';syncScheduleRole();db.teachers[0].name="MUTATED VIEW";',sandbox);
assert.equal(vm.runInContext('acceptedFeed.data.teachers[0].name',sandbox),feed.data.teachers[0].name,'View migrations must not mutate snapshot identity');
vm.runInContext('teacherMode=true;syncScheduleRole();',sandbox);
assert.equal(vm.runInContext('db===original',sandbox),true);
vm.runInContext('db.weeks[0].entries[0].title="LOCAL TEACHER EDIT";teacherMode=false;syncScheduleRole();acceptedFeed='+JSON.stringify(changed)+';syncScheduleRole();teacherMode=true;syncScheduleRole();',sandbox);
assert.equal(vm.runInContext('db.weeks[0].entries[0].title',sandbox),'LOCAL TEACHER EDIT');
assert.equal(memory.size,0,'Role switching must not overwrite planner storage');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');assert.equal(manifest.display,'standalone');
for(const icon of manifest.icons){assert(fs.existsSync(path.join(root,icon.src)));const png=fs.readFileSync(path.join(root,icon.src));const size=Number(icon.sizes.split('x')[0]);assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);}
// Service worker: atomic pre-cache; scoped cleanup; offline navigation; feed never cached.
(async()=>{
 const emptyFeed=C.clone(feed);emptyFeed.data.weeks.forEach(w=>{w.entries=[];w.greetings=[];});
 sandbox.fetch=async()=>({ok:true,text:async()=>JSON.stringify(emptyFeed)});sandbox.AbortSignal={timeout:()=>undefined};sandbox.todayVN=()=> '2026-11-26';
 await vm.runInContext('checkStudentSchedule()',sandbox);
 assert.equal(vm.runInContext('pendingFeed.data.weeks[0].entries.length',sandbox),0,'A published empty week must still replace cancelled lessons');
 const handlers={},deleted=[],added=[],scope='https://example.org/my-repo/',shell={ok:true,body:'offline shell'};
 const cache={addAll:async urls=>added.push(...urls),match:async key=>String(key).endsWith('index.html')?shell:undefined};
 let claims=0,skips=0;
 const worker={URL,self:{registration:{scope},clients:{claim:async()=>claims++},skipWaiting:()=>skips++,addEventListener:(name,fn)=>handlers[name]=fn},caches:{open:async()=>cache,keys:async()=>['proskills-shell:/my-repo/:old','proskills-shell:/other-repo/:old','unrelated'],delete:async key=>deleted.push(key)},fetch:async()=>{throw Error('offline')}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),worker);
 let pending;handlers.install({waitUntil:p=>pending=p});await pending;
 assert(added.every(url=>url.startsWith(scope)));assert(!added.some(url=>url.endsWith('published-schedule.json')));assert.equal(skips,0);
 handlers.activate({waitUntil:p=>pending=p});await pending;assert.deepEqual(deleted,['proskills-shell:/my-repo/:old']);assert.equal(claims,1);
 let result;handlers.fetch({request:{url:scope,method:'GET',mode:'navigate'},respondWith:p=>result=p});assert.equal(await result,shell);
 result=null;handlers.fetch({request:{url:scope+'published-schedule.json',method:'GET'},respondWith:p=>result=p});assert.equal(result,null);
 handlers.message({data:{type:'SKIP_WAITING'}});assert.equal(skips,1);
 console.log('Passed: public feed sanitization/validation, revision detection, planner isolation across roles, PWA icons/paths, atomic cache, scoped cleanup, offline shell, live feed bypass and explicit worker activation.');
})().catch(error=>{console.error(error);process.exitCode=1});

const assert=require('assert/strict'),vm=require('vm'),fs=require('fs'),C=require('../core.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/../seed.js','utf8'),ctx);const db=JSON.parse(JSON.stringify(ctx.window.SEED));C.validate(db);
assert.equal(db.programs[0].lessons.length,25);assert.equal(db.programs[1].lessons.reduce((n,l)=>n+l.periods,0),36);
const src=db.weeks.at(-1),r=C.nextWeek(db,src,'2026-11-30');assert(r.advanced>0);assert.equal(r.week.entries.find(e=>e.classId==='demo-nh4').lessonId,'NH-02');C.validate({...db,weeks:[...db.weeks,r.week]});
assert.throws(()=>C.nextWeek(db,src,src.start));assert.throws(()=>C.nextWeek(db,src,'2026-12-01'));
const d=C.clone(db),cl=d.classes.find(c=>c.id==='demo-nh4');cl.active=false;assert(!C.nextWeek(d,src,'2026-11-30').week.entries.some(e=>e.classId===cl.id));
const s=C.clone(db);s.weeks.at(-1).entries.find(e=>e.classId==='demo-nh4').status='cancelled';assert(!C.nextWeek(s,s.weeks.at(-1),'2026-11-30').week.entries.some(e=>e.classId==='demo-nh4'));
const x={id:'a',day:0,start:7,end:10,classId:'c',teacherId:'t',room:'301',campus:'AB1',status:'planned'};
assert.equal(C.conflicts([x,{...x,id:'b',start:9,end:12}])[0].kinds.length,3);assert.equal(C.conflicts([x,{...x,id:'b',status:'cancelled'}]).length,0);
const wl=C.workload([x],'t');assert.equal(wl.day,2);assert.equal(wl.night,2);
// Partial and long sessions split by curriculum boundaries without skipping periods.
const mini={schemaVersion:1,programs:[{id:'p',name:'p',lessons:[{id:'l1',title:'One',periods:3},{id:'l2',title:'Two',periods:3}]}],classes:[{id:'c',name:'c',active:true,programId:'p',baseline:0}],teachers:[{id:'t',name:'t',active:true}],weeks:[{id:'w',start:'2026-11-23',entries:[{...x,start:1,end:2,lessonId:'l1',title:'One'}]}]};
const nw=C.nextWeek(mini,mini.weeks[0],'2026-11-30').week;assert.equal(nw.entries.length,2);assert.deepEqual(nw.entries.map(e=>[e.lessonId,e.start,e.end,e.lessonOffset]),[['l1',1,1,2],['l2',2,2,0]]);C.validate({...mini,weeks:[...mini.weeks,nw]});
assert.equal(C.nextWeek(db,src,'2026-11-30',{mode:'done'}).week.entries.find(e=>e.classId==='demo-nh4').lessonId,'NH-01');
const bad=C.clone(db);bad.weeks[0].entries[0].teacherId='missing';assert.throws(()=>C.validate(bad));
const roomDb=C.clone(db);const roomList=C.ensureRooms(roomDb);assert(roomList.length>0);C.validate(roomDb);
const usedRoom=roomList[0],oldName=usedRoom.name,linked=roomDb.weeks.flatMap(w=>w.entries).find(e=>e.roomId===usedRoom.id);
C.updateRoom(roomDb,{...usedRoom,name:'Phòng đã đổi tên'});assert.equal(linked.room,'Phòng đã đổi tên');C.validate(roomDb);
assert.throws(()=>C.updateRoom(roomDb,{...usedRoom,campus:usedRoom.campus==='AB1'?'AB2':'AB1'}));
const added=C.updateRoom(roomDb,{name:'Phòng kiểm tra',campus:'AB1',active:true});assert(added.id);assert.throws(()=>C.updateRoom(roomDb,{name:' phòng kiểm tra ',campus:'AB1',active:true}));
C.updateRoom(roomDb,{...added,active:false});assert.equal(roomDb.rooms.find(r=>r.id===added.id).active,false);C.validate(roomDb);
C.updateRoom(roomDb,{...usedRoom,active:false});const roomCopy=C.nextWeek(roomDb,roomDb.weeks.at(-1),'2026-11-30');assert(roomCopy.week.entries.filter(e=>e.roomId===usedRoom.id).every(e=>e.needsReview));
const brokenRoom=C.clone(roomDb);brokenRoom.rooms.push({...added,id:'dup'});assert.throws(()=>C.validate(brokenRoom));
const rangeFixture={weeks:[
 {start:'2026-11-23',entries:[{...x,id:'before',day:4},{...x,id:'start',day:6}]},
 {start:'2026-11-30',entries:[{...x,id:'end',day:0},{...x,id:'after',day:1}]}
]};
const acrossWeeks=C.sessionsBetween(rangeFixture,'2026-11-29','2026-11-30');
assert.deepEqual(acrossWeeks.map(entry=>entry.id),['start','end']);
assert.equal(C.workload(acrossWeeks,'t').day,4);
assert.equal(C.workload(acrossWeeks,'t').night,4);
assert.deepEqual(C.sessionsBetween(rangeFixture,'2026-11-30','2026-11-30').map(entry=>entry.id),['end']);
console.log('Passed: scheduling regression checks; room migration; room rename references; campus-change protection; room duplicate checks; inactive rooms; backup round-trip integrity.');

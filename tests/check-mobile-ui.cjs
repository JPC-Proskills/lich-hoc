const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function emitter(){const listeners={};return{listeners,addEventListener:(name,fn)=>{(listeners[name]??=[]).push(fn)},fire(name,event={}){for(const fn of listeners[name]||[])fn(event)}}}
function node(){const n=emitter(),classes=new Set(),attrs=new Map();return Object.assign(n,{classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)},setAttribute:(k,v)=>attrs.set(k,v),removeAttribute:k=>attrs.delete(k),hasAttribute:k=>attrs.has(k),contains:()=>false});}
const brand=node(),nav=node(),root=node(),doc=emitter(),win=emitter(),media=emitter(),dialog={open:false};
root.scrollHeight=3000;media.matches=true;let now=0,serial=0,prompts=0,teacher=false;const timers=new Map();
const sandbox={document:Object.assign(doc,{documentElement:root,visibilityState:'visible',activeElement:null,querySelectorAll:()=>[brand],getElementById:id=>id==='dialog'?dialog:nav}),matchMedia:()=>media,isTeacher:()=>teacher,switchRole:()=>prompts++,setTimeout:(fn,delay)=>{timers.set(++serial,{fn,at:now+delay});return serial},clearTimeout:id=>timers.delete(id),addEventListener:win.addEventListener,scrollY:0,innerHeight:800,Math};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../mobile-ui.js'),'utf8'),sandbox);
function tick(ms){now+=ms;for(const[id,timer]of timers)if(timer.at<=now){timers.delete(id);timer.fn();}}
const down=()=>brand.fire('pointerdown',{button:0,isPrimary:true,clientX:10,clientY:10});
down();tick(2999);assert.equal(prompts,0);doc.fire('pointerup');tick(10);assert.equal(prompts,0,'Short hold must not open authentication');
down();tick(3000);assert.equal(prompts,1,'Three seconds opens password prompt only');tick(3000);assert.equal(prompts,1,'Single hold must fire once');
down();brand.fire('pointermove',{clientX:10,clientY:30});tick(3000);assert.equal(prompts,1,'Scrolling gesture cancels hold');
down();brand.fire('pointercancel');tick(3000);assert.equal(prompts,1);
down();win.fire('blur');tick(3000);assert.equal(prompts,1);
teacher=true;down();tick(3000);assert.equal(prompts,1);teacher=false;
brand.fire('keydown',{key:'Enter',repeat:false,preventDefault(){}});tick(3000);assert.equal(prompts,2,'Keyboard hold is supported');brand.fire('keyup',{key:'Enter'});
sandbox.scrollY=100;win.fire('scroll');assert(root.classList.contains('nav-hidden'));assert(nav.hasAttribute('inert'));
sandbox.scrollY=70;win.fire('scroll');assert(!root.classList.contains('nav-hidden'));assert(!nav.hasAttribute('inert'));
sandbox.scrollY=2200;win.fire('scroll');assert(!root.classList.contains('nav-hidden'),'Navigation remains available at the bottom');
console.log('Passed: hold threshold, early release, movement/cancel/blur, single prompt, keyboard access, role guard, scroll-direction navigation and bottom recovery.');

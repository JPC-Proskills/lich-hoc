/* Hold the brand for 1.5 seconds; scrolling cancels the gesture. */
(function(){
 'use strict';
 let timer=null,holding=null,startX=0,startY=0;
 function cancel(){clearTimeout(timer);timer=null;holding?.classList.remove('logo-holding');holding=null;}
 function start(logo){
  cancel();if(isTeacher()||document.getElementById('dialog').open)return;
  holding=logo;logo.classList.add('logo-holding');
  timer=setTimeout(()=>{cancel();if(!isTeacher()&&!document.getElementById('dialog').open)switchRole();},1500);
 }
 document.querySelectorAll('.brand,.mobile-brand').forEach(logo=>{
  logo.setAttribute('role','button');logo.setAttribute('aria-label','Proskills · Giữ 1,5 giây để mở chế độ giáo viên');
  logo.title='Giữ logo hoặc chữ Proskills 1,5 giây để mở chế độ giáo viên';
  logo.addEventListener('pointerdown',event=>{if(event.button!==0||!event.isPrimary)return;startX=event.clientX;startY=event.clientY;start(logo);});
  logo.addEventListener('pointermove',event=>{if(holding===logo&&Math.hypot(event.clientX-startX,event.clientY-startY)>10)cancel();});
  logo.addEventListener('pointerleave',cancel);logo.addEventListener('pointercancel',cancel);logo.addEventListener('blur',cancel);
  logo.addEventListener('contextmenu',event=>{if(!isTeacher())event.preventDefault();});
  logo.addEventListener('click',event=>{if(!isTeacher())event.preventDefault();});
  logo.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)&&!event.repeat){event.preventDefault();start(logo);}});
  logo.addEventListener('keyup',event=>{if(['Enter',' '].includes(event.key))cancel();});
 });
 document.addEventListener('pointerup',cancel);addEventListener('blur',cancel);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible')cancel();});
 const root=document.documentElement,nav=document.getElementById('nav'),mobile=matchMedia('(max-width:760px)');
 let lastY=Math.max(0,scrollY),travel=0,direction=0;
 function showNav(){root.classList.remove('nav-hidden');nav.removeAttribute('inert');}
 function hideNav(){if(nav.contains(document.activeElement))document.activeElement.blur();root.classList.add('nav-hidden');nav.setAttribute('inert','');}
 addEventListener('scroll',()=>{
  cancel();const y=Math.max(0,Math.min(scrollY,document.documentElement.scrollHeight-innerHeight)),delta=y-lastY;lastY=y;
  if(!mobile.matches||isTeacher()||document.getElementById('dialog').open){travel=0;direction=0;showNav();return;}
  if(y<40||y>=document.documentElement.scrollHeight-innerHeight-4){travel=0;showNav();return;}
  if(Math.abs(delta)<1)return;
  const next=delta>0?1:-1;if(next!==direction){travel=0;direction=next;}travel+=Math.abs(delta);
  if(travel>=14){if(direction>0)hideNav();else showNav();travel=0;}
 },{passive:true});
 document.addEventListener('click',event=>{if(event.target.closest('[data-tab],#mode-switch')){if(event.target.closest('[data-tab]'))scrollTo({top:0,behavior:'instant'});lastY=scrollY;travel=0;showNav();}});
 mobile.addEventListener('change',showNav);
 document.addEventListener('keydown',event=>{if(event.key==='Tab')showNav();});
})();

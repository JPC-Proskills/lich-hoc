/* Install, offline shell and explicit updates; no push subscription or permission prompt. */
(function(){
 'use strict';
 let installPrompt=null,registration=null,offlineReady=false,reloadRequested=false,day=todayVN();
 const status=document.getElementById('app-connectivity'),appBanner=document.getElementById('app-update');
 function connectivity(){status.hidden=navigator.onLine;status.textContent=offlineReady?'Đang ngoại tuyến · Xem lịch đã tải trên máy.':'Đang ngoại tuyến · Nội dung đang mở có thể chưa được lưu đầy đủ.';}
 function offerAppUpdate(){
  if(!registration?.waiting)return;
  appBanner.hidden=false;
  appBanner.innerHTML='<p><b>Có phiên bản app mới.</b> Cập nhật để dùng giao diện và tính năng mới nhất.</p><button id="accept-app-update" class="button small">Cập nhật app</button>';
  document.getElementById('accept-app-update').onclick=()=>{reloadRequested=true;registration.waiting?.postMessage({type:'SKIP_WAITING'});};
 }
 async function checkUpdates(manual=false){
  if(registration)try{await registration.update();offerAppUpdate();}catch{}
  await checkStudentSchedule(manual);
 }
 function installHelp(){
  modal('Cài Proskills lên điện thoại',`<div class="help-text"><p><b>iPhone/iPad:</b> mở trang bằng Safari, chọn Chia sẻ → Thêm vào Màn hình chính → bật Mở dưới dạng ứng dụng (nếu có) → Thêm.</p><p><b>Android:</b> mở bằng Chrome, chọn menu ⋮ → Cài đặt ứng dụng hoặc Thêm vào màn hình chính. Khi trình duyệt hỗ trợ, nút “Cài app” sẽ mở hộp cài trực tiếp.</p><p>App dùng icon Proskills nền tối. Sau lần mở trực tuyến đầu tiên và lưu hoàn tất, bạn có thể mở lại để xem lịch đã tải khi mất mạng.</p><p class="form-note">Cần mở bản GitHub Pages qua HTTPS. Cách hiển thị thanh trạng thái do hệ điều hành và trình duyệt quyết định.</p></div>`);
 }
 async function install(){
  if(matchMedia('(display-mode: standalone)').matches||navigator.standalone){toast('Proskills đang chạy dưới dạng app.');return;}
  if(!installPrompt){installHelp();return;}
  const prompt=installPrompt;installPrompt=null;await prompt.prompt();const choice=await prompt.userChoice;
  if(choice.outcome==='accepted')toast('Đã gửi yêu cầu cài Proskills.');
 }
 addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;});
 addEventListener('appinstalled',()=>{installPrompt=null;toast('Đã cài Proskills lên thiết bị.');});
 // Keep the main shell limited to the requested navigation; extra actions live under Help.
 const originalHelp=showStudentHelp;
 showStudentHelp=function(){
  originalHelp();
  document.getElementById('dialog-body').insertAdjacentHTML('beforeend','<div class="app-tools"><button class="button small" id="install-app">Cài app</button><button class="button small" id="check-updates">Kiểm tra cập nhật</button></div><p class="app-version">PS-LICHDAY-V1.1.4 · Lịch ngoại tuyến trên thiết bị này</p>');
  document.getElementById('install-app').onclick=()=>{close();install().catch(()=>toast('Hãy dùng menu trình duyệt để cài Proskills.'));};
  document.getElementById('check-updates').onclick=()=>{close();checkUpdates(true);};
 };
 if('serviceWorker' in navigator&&isSecureContext){
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloadRequested)location.reload();});
  navigator.serviceWorker.register('sw.js',{scope:'./',updateViaCache:'none'}).then(r=>{
   registration=r;offlineReady=Boolean(r.active);connectivity();offerAppUpdate();
   r.addEventListener('updatefound',()=>{const worker=r.installing;worker?.addEventListener('statechange',()=>{
    if(worker.state==='installed'){if(navigator.serviceWorker.controller)offerAppUpdate();else{offlineReady=true;connectivity();}}
   });});
   return navigator.serviceWorker.ready;
  }).then(()=>{offlineReady=true;connectivity();}).catch(()=>{offlineReady=false;connectivity();});
 }
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible')return;const current=todayVN();if(day!==current&&!isTeacher()&&!document.getElementById('dialog').open){day=current;init();}checkUpdates();});
 addEventListener('online',()=>{connectivity();checkUpdates();});addEventListener('offline',connectivity);
 addEventListener('pageshow',event=>{connectivity();if(event.persisted)checkUpdates();});
 setInterval(()=>{if(document.visibilityState==='visible'&&navigator.onLine)checkUpdates();},60000);
 // A separate student snapshot may be accepted while the planner remains editable locally.
 connectivity();checkStudentSchedule();
})();

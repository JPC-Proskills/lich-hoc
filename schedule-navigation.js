/* Browser Back unwinds app actions before returning to the previous page. */
const navigationId=Date.now();
let restoringNavigation=false,closingDialogHistory=false;
function navigationState(dialog=false){
 return {navigationId,dialog,role,tab,view,weekId,catalog,sortBy,workloadRange,studentGroup,studentAdvanced,
  studentDraft:C.clone(studentDraft),studentApplied:C.clone(studentApplied),studentJoin,scrollY};
}
function rememberNavigation(dialog=false){
 if(restoringNavigation||history.state?.navigationId===navigationId&&history.state.dialog)return;
 history.replaceState(navigationState(),'',location.href);
 history.pushState({navigationId,dialog},'',location.href);
}
function enableScheduleNavigation(){
 history.replaceState(navigationState(),'',location.href);
 const dialog=$('#dialog'),handle=$('#dialog-grip');
 let startY=null,pointer=null;
 function resetDrag(){
  startY=null;
  pointer=null;
  dialog.style.removeProperty('translate');
 }
 handle.onpointerdown=event=>{
  if(event.button!==0||!event.isPrimary)return;
  startY=event.clientY;
  pointer=event.pointerId;
  handle.setPointerCapture(pointer);
 };
 handle.onpointermove=event=>{
  if(event.pointerId!==pointer)return;
  dialog.style.translate='0 '+Math.max(0,event.clientY-startY)+'px';
 };
 handle.onpointerup=event=>{
  if(event.pointerId!==pointer)return;
  const dismiss=event.clientY-startY>=55;
  resetDrag();
  if(dismiss)close();
 };
 handle.onpointercancel=resetDrag;
 handle.onlostpointercapture=resetDrag;
 dialog.addEventListener('close',()=>{
  resetDrag();
  if(!dialog.open&&history.state?.navigationId===navigationId&&history.state.dialog){
   closingDialogHistory=true;
   history.back();
  }
 });
 addEventListener('popstate',event=>{
  const state=event.state;
  if(closingDialogHistory){
   closingDialogHistory=false;
   if(state?.navigationId===navigationId)history.replaceState(navigationState(dialog.open),'',location.href);
   return;
  }
  if(state?.navigationId!==navigationId||state.dialog)return;
  const wasOpen=dialog.open;
  if(wasOpen)dialog.close();
  if(state.role!==role||!state.tab)return;
  restoringNavigation=true;
  try{
   ({tab,view,catalog,sortBy,workloadRange,studentGroup,studentAdvanced,studentDraft,studentApplied,studentJoin}=state);
   if(isTeacher())weekId=state.weekId;
   else if(state.weekId!==publicWeek().id)resetStudentSearch();
   init();
   if(!wasOpen)scrollTo(0,state.scrollY||0);
  }finally{restoringNavigation=false;}
 });
}

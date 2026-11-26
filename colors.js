function programColor(p){return C.PROGRAM_COLORS.some(c=>c.value===p?.color)?p.color:p?.id==='NH'?'#C46686':'#788C5D'}
// Keep saved color IDs stable. The teacher theme renders them in blue and slate.
const teacherPalette={
 '#D97757':['Xanh đại dương','#3D79AA'],
 '#6A9BCC':['Xanh da trời','#6A9BCC'],
 '#788C5D':['Xanh thép','#52748B'],
 '#C46686':['Xanh chàm','#5A6FA4'],
 '#CBCADB':['Xanh khói','#A3B3CF'],
 '#BCD1CA':['Xanh băng','#A8CBDC'],
 '#EBCECE':['Xanh sương','#C0D2E9'],
 '#D4A27F':['Xanh denim','#597DAD'],
 '#EBDBBC':['Xám lam nhạt','#B7C5D3'],
 '#666663':['Xám đá','#66717D']
};
function scheduleAccent(color){return isTeacher()?(teacherPalette[color]?.[1]||color):color}
function teacherChip(id){
 const t=teacher(id);
 const color=C.PROGRAM_COLORS.some(c=>c.value===t?.color)?t.color:'#6A9BCC';
 return `<span class="teacher-chip" style="--teacher-color:${scheduleAccent(color)}">${esc(t?.name)}</span>`;
}
function colorPicker(name,current='#6A9BCC'){
 const choices=C.PROGRAM_COLORS.map(c=>{
  const [label,color]=teacherPalette[c.value]||[c.name,c.value];
  return `<label class="color-option" title="${label} · ${color}"><input type="radio" name="${name}" value="${c.value}" ${c.value===current?'checked':''}><span style="--swatch:${color}"></span><small>${label}</small></label>`;
 });
 return `<fieldset class="color-picker"><legend>Màu chương trình</legend><div class="color-options">${choices.join('')}</div></fieldset>`;
}
function editProgramColor(){if(!requireTeacher())return;const p=program(programId);modal('Màu chương trình học',`<form id="color-form"><p class="form-note">${esc(p.name)} · Màu dùng để nhận diện chương trình trong lịch.</p>${colorPicker('program-color',programColor(p))}<div class="form-actions"><button class="button" type="button" id="cancel-form">Hủy</button><button class="button primary">Lưu màu chương trình</button></div></form>`);$('#cancel-form').onclick=close;$('#color-form').onsubmit=e=>{e.preventDefault();if(!requireTeacher())return;p.color=document.querySelector('input[name="program-color"]:checked').value;save();close();render();toast('Đã cập nhật màu chương trình.')};}

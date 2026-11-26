// Use the same visual choices in both roles while preserving stored color values.
const programPalette={
 '#D97757':['Cam','#F97316'],
 '#6A9BCC':['Xanh dương','#1D4ED8'],
 '#788C5D':['Xanh teal','#0D9488'],
 '#C46686':['Coral','#E7676C'],
 '#CBCADB':['Tím','#8465D0'],
 '#BCD1CA':['Xanh lá','#65A30D'],
 '#EBCECE':['Hồng mâm xôi','#C64A8B'],
 '#D4A27F':['Xanh cyan','#0891B2'],
 '#EBDBBC':['Vàng','#FACC15'],
 '#666663':['Xám','#64748B']
};
function programColor(program){
 return Object.hasOwn(programPalette,program?.color)?program.color:program?.id==='NH'?'#C46686':'#788C5D';
}
function programAccent(program){
 return programPalette[programColor(program)][1];
}
function teacherChip(id){
 const item=teacher(id);
 const color=C.PROGRAM_COLORS.some(option=>option.value===item?.color)?item.color:'#6A9BCC';
 return `<span class="teacher-chip" style="--teacher-color:${color}">${esc(item?.name)}</span>`;
}
function colorPicker(name,current='#6A9BCC'){
 const choices=C.PROGRAM_COLORS.map(option=>{
  const [label,color]=programPalette[option.value];
  return `<label class="color-option" title="${label} · ${color}"><input type="radio" name="${name}" value="${option.value}" ${option.value===current?'checked':''}><span style="--swatch:${color}"></span><small>${label}</small></label>`;
 });
 return `<fieldset class="color-picker"><legend>Màu chương trình</legend><div class="color-options">${choices.join('')}</div></fieldset>`;
}
function editProgramColor(){if(!requireTeacher())return;const p=program(programId);modal('Màu chương trình học',`<form id="color-form"><p class="form-note">${esc(p.name)} · Màu dùng để nhận diện chương trình trong lịch.</p>${colorPicker('program-color',programColor(p))}<div class="form-actions"><button class="button" type="button" id="cancel-form">Hủy</button><button class="button primary">Lưu màu chương trình</button></div></form>`);$('#cancel-form').onclick=close;$('#color-form').onsubmit=e=>{e.preventDefault();if(!requireTeacher())return;p.color=document.querySelector('input[name="program-color"]:checked').value;save();close();render();toast('Đã cập nhật màu chương trình.')};}

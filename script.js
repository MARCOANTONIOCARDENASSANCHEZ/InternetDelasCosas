const slides=[...document.querySelectorAll('.slide')];
const counter=document.getElementById('counter');
const progress=document.getElementById('progress');
let current=0;

function show(index){
  current=Math.max(0,Math.min(index,slides.length-1));
  slides.forEach((slide,i)=>slide.classList.toggle('active',i===current));
  counter.textContent=`${String(current+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  progress.style.width=`${((current+1)/slides.length)*100}%`;
  history.replaceState(null,'',`#${slides[current].id}`);
  document.title=`${slides[current].dataset.label} · IoT en Rusia`;
}
document.getElementById('prevButton').addEventListener('click',()=>show(current-1));
document.getElementById('nextButton').addEventListener('click',()=>show(current+1));
document.getElementById('fullscreenButton').addEventListener('click',()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen());
document.addEventListener('keydown',e=>{
  if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(current+1)}
  if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}
  if(e.key==='Home')show(0); if(e.key==='End')show(slides.length-1);
  if(e.key.toLowerCase()==='f')document.getElementById('fullscreenButton').click();
});
let startX=0;document.addEventListener('touchstart',e=>startX=e.changedTouches[0].clientX,{passive:true});document.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>60)show(current+(dx<0?1:-1))},{passive:true});
const hashIndex=slides.findIndex(s=>`#${s.id}`===location.hash);show(hashIndex>=0?hashIndex:0);

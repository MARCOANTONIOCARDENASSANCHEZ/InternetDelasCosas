const slides=[...document.querySelectorAll('.slide')];
const counter=document.getElementById('counter');
const progress=document.getElementById('progress');
const videoModal=document.getElementById('videoModal');
const videoFrame=document.getElementById('videoFrame');
const clipProgress=document.getElementById('clipProgress');
const clipTime=document.getElementById('clipTime');
const videos={
  esa:{src:'https://www.youtube-nocookie.com/embed/ot2SbM3ZOzk?start=0&end=25&autoplay=1&rel=0',seconds:25},
  security:{src:'https://www.youtube-nocookie.com/embed/7zWVxrjjIpE?start=8&end=33&autoplay=1&rel=0',seconds:25}
};
let clipTimer;
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
function closeVideo(){clearInterval(clipTimer);videoFrame.src='';videoModal.hidden=true;clipProgress.style.width='0%'}
document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>{
  const video=videos[button.dataset.video];let left=video.seconds;
  videoFrame.src=video.src;videoModal.hidden=false;clipTime.textContent=`${left} s`;clipProgress.style.width='0%';
  clipTimer=setInterval(()=>{left-=1;clipTime.textContent=`${Math.max(left,0)} s`;clipProgress.style.width=`${((video.seconds-left)/video.seconds)*100}%`;if(left<=0)clearInterval(clipTimer)},1000);
}));
document.getElementById('videoClose').addEventListener('click',closeVideo);
videoModal.addEventListener('click',e=>{if(e.target===videoModal)closeVideo()});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!videoModal.hidden){closeVideo();return}
  if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(current+1)}
  if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}
  if(e.key==='Home')show(0); if(e.key==='End')show(slides.length-1);
  if(e.key.toLowerCase()==='f')document.getElementById('fullscreenButton').click();
});
let startX=0;document.addEventListener('touchstart',e=>startX=e.changedTouches[0].clientX,{passive:true});document.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>60)show(current+(dx<0?1:-1))},{passive:true});
const hashIndex=slides.findIndex(s=>`#${s.id}`===location.hash);show(hashIndex>=0?hashIndex:0);

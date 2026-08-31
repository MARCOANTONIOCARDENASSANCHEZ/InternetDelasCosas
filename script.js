const slides=[...document.querySelectorAll('.slide')];
const counter=document.getElementById('counter');
const progress=document.getElementById('progress');
const videoModal=document.getElementById('videoModal');
const videoFrame=document.getElementById('videoFrame');
const clipProgress=document.getElementById('clipProgress');
const clipTime=document.getElementById('clipTime');
const videos={security:{src:'https://www.youtube-nocookie.com/embed/7zWVxrjjIpE?start=8&end=33&autoplay=1&rel=0',seconds:25}};
let clipTimer;
const iotTransition=document.getElementById('iotTransition');
const transitionVideo=document.getElementById('transitionVideo');
let transitionTimer;
let transitionRunning=false;
let current=0;

function show(index){
  current=Math.max(0,Math.min(index,slides.length-1));
  slides.forEach((slide,i)=>slide.classList.toggle('active',i===current));
  counter.textContent=`${String(current+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  progress.style.width=`${((current+1)/slides.length)*100}%`;
  history.replaceState(null,'',`#${slides[current].id}`);
  document.title=`${slides[current].dataset.label} · IoT en Rusia`;
}
function finishTransition(){
  clearTimeout(transitionTimer);
  if(current===0)show(1);
  transitionRunning=false;
  transitionVideo.src='';
  iotTransition.classList.remove('playing');
  iotTransition.setAttribute('aria-hidden','true');
}
function go(index){
  if(current===0&&index===1&&!transitionRunning&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    transitionRunning=true;transitionVideo.src='https://www.youtube-nocookie.com/embed/ot2SbM3ZOzk?start=0&end=24&autoplay=1&mute=1&controls=0&rel=0&playsinline=1&modestbranding=1&disablekb=1';iotTransition.classList.add('playing');iotTransition.setAttribute('aria-hidden','false');transitionTimer=setTimeout(finishTransition,24000);return;
  }
  show(index);
}
document.getElementById('skipTransition').addEventListener('click',finishTransition);
document.getElementById('prevButton').addEventListener('click',()=>show(current-1));
document.getElementById('nextButton').addEventListener('click',()=>go(current+1));
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
  if(transitionRunning){if(['Escape','ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();finishTransition()}return}
  if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(current+1)}
  if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}
  if(e.key==='Home')show(0); if(e.key==='End')show(slides.length-1);
  if(e.key.toLowerCase()==='f')document.getElementById('fullscreenButton').click();
});
let startX=0;document.addEventListener('touchstart',e=>startX=e.changedTouches[0].clientX,{passive:true});document.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>60)(dx<0?go(current+1):show(current-1))},{passive:true});
const hashIndex=slides.findIndex(s=>`#${s.id}`===location.hash);show(hashIndex>=0?hashIndex:0);

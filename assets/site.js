const toast=document.querySelector('#toast');let toastTimer,leaveTimer;
function notice(text){clearTimeout(toastTimer);clearTimeout(leaveTimer);toast.textContent=text;toast.className='visible';toastTimer=setTimeout(()=>{toast.classList.add('leaving');leaveTimer=setTimeout(()=>toast.className='',220)},2400);}
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(button.dataset.copy);notice(document.body.dataset.copied)}catch{notice(document.body.dataset.copyFailed)}}));
const play=document.querySelector('#demo-play');
if(play){
 const seek=document.querySelector('#demo-seek'),clock=document.querySelector('#demo-time'),frames=[...document.querySelectorAll('.demo-frame')],chapters=[...document.querySelectorAll('[data-chapter]')],caption=document.querySelector('#demo-caption'),captions=JSON.parse(document.querySelector('#demo-captions').textContent);
 let elapsed=0,playing=false,last=0,raf;
 function render(){const chapter=Math.min(3,Math.floor(elapsed/11.25));frames.forEach((frame,i)=>{frame.classList.toggle('active',i===chapter);frame.setAttribute('aria-hidden',String(i!==chapter))});chapters.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===chapter)));caption.textContent=captions[chapter];seek.value=String(elapsed);clock.textContent=`00:${String(Math.floor(elapsed)).padStart(2,'0')} / 00:45`;play.textContent=playing?play.dataset.pause:play.dataset.play;play.setAttribute('aria-pressed',String(playing));}
 function tick(now){if(!playing)return;elapsed=Math.min(45,elapsed+(now-last)/1000);last=now;if(elapsed===45)playing=false;render();if(playing)raf=requestAnimationFrame(tick);}
 function stop(){playing=false;cancelAnimationFrame(raf);render();}
 play.addEventListener('click',()=>{if(playing){stop();return}if(elapsed>=45)elapsed=0;playing=true;last=performance.now();render();raf=requestAnimationFrame(tick);});
 seek.addEventListener('input',()=>{elapsed=Number(seek.value);last=performance.now();render();});
 chapters.forEach(button=>button.addEventListener('click',()=>{stop();elapsed=Number(button.dataset.chapter)*11.25;render();}));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});render();
}

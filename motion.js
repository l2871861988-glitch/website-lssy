/* Original pointer interactions inspired by the public Celebration Cursor demo.
   No external animation libraries; each page owns and cleans up its listeners. */
(() => {
  const disposers=[];
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const listen=(target,event,fn,options)=>{target.addEventListener(event,fn,options);disposers.push(()=>target.removeEventListener(event,fn,options));};
  const allowed=()=>!document.hidden&&!document.body.classList.contains('menu-open');
  const fine=()=>matchMedia('(pointer:fine)').matches;
  const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
  function followIcon(){
    const hero=document.querySelector('.hero'),layer=hero?.querySelector('.emoji-follow');
    if(!layer||!fine())return;
    let x=0,y=0,tx=0,ty=0,raf=0,last=0;
    const tick=now=>{
      const dt=Math.min(32,now-(last||now-16));last=now;
      if(!allowed()){tx=0;ty=0;}
      const k=1-Math.exp(-dt/110);x+=(tx-x)*k;y+=(ty-y)*k;
      layer.style.setProperty('--follow-x',`${x.toFixed(2)}px`);
      layer.style.setProperty('--follow-y',`${y.toFixed(2)}px`);
      layer.style.setProperty('--follow-angle',`${(x*.06).toFixed(2)}deg`);
      if(Math.abs(tx-x)+Math.abs(ty-y)>.03)raf=requestAnimationFrame(tick);else{raf=0;last=0;}
    };
    const wake=()=>{if(!raf)raf=requestAnimationFrame(tick);};
    listen(window,'pointermove',e=>{
      if(e.pointerType==='touch')return;
      const r=hero.getBoundingClientRect();
      if(!allowed()||r.bottom<80||r.top>innerHeight){tx=0;ty=0;}else{
        tx=clamp((e.clientX-r.left)/r.width-.5,-.5,.5)*90;
        ty=clamp((e.clientY-r.top)/r.height-.5,-.5,.5)*64;
      }wake();
    },{passive:true});
    listen(document,'pointerleave',()=>{tx=0;ty=0;wake();});
    disposers.push(()=>cancelAnimationFrame(raf));
  }

  function followEyes(){
    const art=document.querySelector('.home-art'),image=art?.querySelector('img');
    if(!image||!fine())return;
    const canvas=document.createElement('canvas');canvas.className='eye-follow';canvas.setAttribute('aria-hidden','true');art.append(canvas);
    const ctx=canvas.getContext('2d');
    let pixels,width,height,raf=0,stopped=false,mx=null,my=null;
    // Eye centers are measured in the original 1440 × 1092 portrait, not screen pixels.
    const eyes=[{cx:562,cy:688,rx:66,ry:31,angle:.08,x:0,y:0},{cx:804,cy:670,rx:65,ry:29,angle:-.13,x:0,y:0}];
    const prepare=()=>{
      if(stopped||!image.naturalWidth)return;
      width=image.naturalWidth;height=image.naturalHeight;canvas.width=width;canvas.height=height;
      const source=document.createElement('canvas');source.width=width;source.height=height;
      const sc=source.getContext('2d',{willReadFrequently:true});sc.drawImage(image,0,0);
      pixels=sc.getImageData(0,0,width,height).data;
      for(const eye of eyes){
        eye.left=Math.floor(eye.cx-eye.rx-5);eye.top=Math.floor(eye.cy-eye.ry-12);
        eye.w=Math.ceil(eye.rx*2+10);eye.h=Math.ceil(eye.ry*2+24);
        eye.output=ctx.createImageData(eye.w,eye.h);
        const cos=Math.cos(eye.angle),sin=Math.sin(eye.angle);eye.weights=new Float32Array(eye.w*eye.h);
        for(let y=0;y<eye.h;y++)for(let x=0;x<eye.w;x++){
          const px=x+eye.left-eye.cx,py=y+eye.top-eye.cy;
          const ex=(px*cos+py*sin)/eye.rx,ey=(-px*sin+py*cos)/eye.ry;
          const d=ex*ex+ey*ey;eye.weights[y*eye.w+x]=d<1?Math.pow(1-d,1.5):0;
        }
      }
    };
    function paint(eye){
      const out=eye.output.data;
      for(let y=0;y<eye.h;y++)for(let x=0;x<eye.w;x++){
        const at=y*eye.w+x,w=eye.weights[at];
        const sx=clamp(eye.left+x-eye.x*w,0,width-2),sy=clamp(eye.top+y-eye.y*w,0,height-2);
        const ix=Math.floor(sx),iy=Math.floor(sy),fx=sx-ix,fy=sy-iy;
        const p=(iy*width+ix)*4,q=p+width*4,o=at*4;
        for(let c=0;c<4;c++)out[o+c]=(pixels[p+c]*(1-fx)+pixels[p+4+c]*fx)*(1-fy)+(pixels[q+c]*(1-fx)+pixels[q+4+c]*fx)*fy;
      }
      ctx.putImageData(eye.output,eye.left,eye.top);
    }
    const tick=()=>{
      if(stopped||!pixels){raf=0;return;}
      const r=image.getBoundingClientRect();let moving=false;
      for(const eye of eyes){
        const cx=r.left+eye.cx/width*r.width,cy=r.top+eye.cy/height*r.height;
        const active=mx!==null&&allowed()&&r.bottom>0&&r.top<innerHeight;
        const tx=active?Math.tanh((mx-cx)/250)*22:0,ty=active?Math.tanh((my-cy)/200)*10:0;
        eye.x+=(tx-eye.x)*.16;eye.y+=(ty-eye.y)*.16;
        if(Math.abs(tx-eye.x)+Math.abs(ty-eye.y)>.02)moving=true;
        paint(eye);
      }
      if(moving)raf=requestAnimationFrame(tick);else raf=0;
    };
    const wake=()=>{if(pixels&&!raf)raf=requestAnimationFrame(tick);};
    if(image.complete)prepare();else listen(image,'load',prepare,{once:true});
    listen(window,'pointermove',e=>{if(e.pointerType==='touch')return;mx=e.clientX;my=e.clientY;wake();},{passive:true});
    listen(document,'pointerleave',()=>{mx=null;my=null;wake();});
    listen(window,'blur',()=>{mx=null;my=null;wake();});
    disposers.push(()=>{stopped=true;cancelAnimationFrame(raf);canvas.remove();});
  }

  function celebration(){
    if(!document.querySelector('.home-hero'))return;
    const canvas=document.createElement('canvas');canvas.className='celebration-cursor';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
    const ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return;}
    const colors=['#ff9bb4','#f9fcf4','#e7c56e','#b8dcd8'];
    let pieces=[],raf=0,last=0,previous=null,lastTrail=0,stopped=false;
    const resize=()=>{const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
    resize();listen(window,'resize',resize,{passive:true});
    const piece=(x,y,vx,vy)=>({x,y,vx,vy,age:0,life:1.8+Math.random()*1.4,size:5+Math.random()*7,angle:Math.random()*Math.PI*2,spin:(Math.random()-.5)*10,phase:Math.random()*7,color:colors[Math.floor(Math.random()*colors.length)],shape:Math.floor(Math.random()*3)});
    function tick(now){
      if(stopped)return;
      const dt=Math.min(.035,(now-(last||now-16))/1000);last=now;ctx.clearRect(0,0,innerWidth,innerHeight);
      pieces=pieces.filter(p=>p.age<p.life&&p.y<innerHeight+50);
      for(const p of pieces){
        p.age+=dt;p.vy+=330*dt;p.vx*=Math.pow(.985,dt*60);p.x+=(p.vx+Math.sin(p.age*5+p.phase)*20)*dt;p.y+=p.vy*dt;p.angle+=p.spin*dt;
        const flip=Math.cos(p.age*7+p.phase),fade=Math.min(1,(p.life-p.age)/.6);
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.scale(1,Math.max(.12,Math.abs(flip)));ctx.globalAlpha=Math.max(0,fade)*(.72+.28*Math.abs(flip));ctx.fillStyle=p.color;
        if(p.shape===2){ctx.beginPath();ctx.arc(0,0,p.size*.32,0,Math.PI*2);ctx.fill();}else{ctx.fillRect(-p.size/2,-p.size*.25,p.size,p.shape===1?p.size*.22:p.size*.55);}
        ctx.restore();
      }
      if(pieces.length)raf=requestAnimationFrame(tick);else{raf=0;last=0;ctx.clearRect(0,0,innerWidth,innerHeight);}
    }
    const wake=()=>{if(pieces.length>260)pieces.splice(0,pieces.length-260);if(!raf)raf=requestAnimationFrame(tick);};
    listen(window,'pointermove',e=>{
      if(e.pointerType==='touch'||!fine()||!allowed()){previous=null;return;}
      const now=performance.now();
      if(previous&&now-lastTrail>28){
        const dx=e.clientX-previous.x,dy=e.clientY-previous.y,distance=Math.hypot(dx,dy),count=Math.min(7,Math.floor(distance/13));
        for(let i=0;i<count;i++){const t=(i+1)/(count+1);pieces.push(piece(previous.x+dx*t,previous.y+dy*t,dx*1.8+(Math.random()-.5)*75,dy*.8-35-Math.random()*65));}
        if(count){lastTrail=now;wake();}
      }
      previous={x:e.clientX,y:e.clientY};
    },{passive:true});
    listen(window,'pointerdown',e=>{
      if(!allowed()||e.button>0)return;
      for(let i=0;i<(e.pointerType==='touch'?30:68);i++){
        const angle=-Math.PI/2+(Math.random()-.5)*1.8,speed=150+Math.random()*270;
        pieces.push(piece(e.clientX,e.clientY,Math.cos(angle)*speed,Math.sin(angle)*speed));
      }wake();
    },{passive:true});
    listen(document,'pointerleave',()=>{previous=null;});
    listen(document,'visibilitychange',()=>{if(document.hidden){pieces=[];cancelAnimationFrame(raf);raf=0;last=0;ctx.clearRect(0,0,innerWidth,innerHeight);}});
    disposers.push(()=>{stopped=true;cancelAnimationFrame(raf);canvas.remove();});
  }
  const clear=()=>{while(disposers.length)disposers.pop()();};
  window.siteMotion={clear,mount(){clear();if(reduced())return;followIcon();celebration();enhancedCards();}};
  // A change in system motion preferences takes effect without reloading the site.
  matchMedia('(prefers-reduced-motion:reduce)').addEventListener('change',()=>window.siteMotion.mount());
})();

// Layered objects, foil lighting, and elastic photos use the existing artwork.
function homeObjects(){
 const art=document.querySelector('.home-art');if(!art)return;
 const layer=document.createElement('div');layer.className='home-objects';layer.setAttribute('aria-hidden','true');
 const specs=[['graduation.png','cap'],['character.png','doll'],['computer.png','screen'],['palette.png','paint']];
 layer.innerHTML=specs.map(([src,cls])=>`<div class="home-object ${cls}"><img draggable="false" src="assets/${src}" alt=""></div>`).join('');art.append(layer);art.classList.add('layered');
 const controller=new AbortController(),signal=controller.signal;
 window.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;layer.querySelectorAll('.home-object').forEach((el,i)=>{if(el.matches(':hover'))return;el.style.setProperty('--lift-x',((e.clientX/innerWidth-.5)*(6+i*2))+'px');el.style.setProperty('--lift-y',((e.clientY/innerHeight-.5)*(5+i*2))+'px');});},{signal,passive:true});
 layer.querySelectorAll('.home-object').forEach((el,i)=>{
  el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--lift-x',`${(e.clientX-r.left-r.width/2)*.08}px`);el.style.setProperty('--lift-y',`${-12+(e.clientY-r.top-r.height/2)*.06}px`);},{signal});
  el.addEventListener('pointerleave',()=>{el.style.setProperty('--lift-x','0px');el.style.setProperty('--lift-y','0px');},{signal});
 });
 // Clean up when the route is replaced.
 const observer=new MutationObserver(()=>{if(!art.isConnected){controller.abort();observer.disconnect();}});observer.observe(document.querySelector('main'),{childList:true});
}
function enhancedCards(){
 const controller=new AbortController(),signal=controller.signal;
 const book=document.querySelector('.book-art');
 if(book){
  book.classList.add('holo-book');book.insertAdjacentHTML('beforeend','<span class="holo-foil" aria-hidden="true"></span>');
  book.addEventListener('pointermove',e=>{const r=book.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;book.style.setProperty('--rx',`${(y-.5)*-22}deg`);book.style.setProperty('--ry',`${(x-.5)*25}deg`);book.style.setProperty('--shine-x',`${x*100}%`);book.style.setProperty('--shine-y',`${y*100}%`);book.classList.add('shining');},{signal});
  book.addEventListener('pointerleave',()=>{book.classList.remove('shining');book.style.setProperty('--rx','0deg');book.style.setProperty('--ry','0deg');},{signal});
 }
 const daily=document.querySelector('.daily');let io;
 if(daily){
  daily.classList.add('bounce-gallery');
  const cards=[...daily.querySelectorAll('.photo')];
  cards.forEach((card,i)=>{card.style.setProperty('--i',i);card.tabIndex=0;card.setAttribute('aria-label',['日常自拍','海边旅行','毕业留念','小组学习','课堂汇报'][i]);
   const enter=()=>{daily.classList.add('card-active');cards.forEach((other,j)=>{other.style.setProperty('--spread',`${j===i?0:(j<i?-17:17)}px`);});};
   const leave=()=>{daily.classList.remove('card-active');cards.forEach(other=>other.style.setProperty('--spread','0px'));};
   card.addEventListener('pointerenter',enter,{signal});card.addEventListener('pointerleave',leave,{signal});card.addEventListener('focus',enter,{signal});card.addEventListener('blur',leave,{signal});
  });
  io=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){daily.classList.add('cards-in');io.disconnect();}},{threshold:.15});io.observe(daily);
 }
 const anchor=book||daily;if(anchor){const observer=new MutationObserver(()=>{if(!anchor.isConnected){controller.abort();io?.disconnect();observer.disconnect();}});observer.observe(document.querySelector('main'),{childList:true});}
}

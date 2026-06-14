/* ============================================================
   DL Architecture Diagrams — shared engine
   Reads global `DIAGRAM` (defined by each page) and wires up:
   header, architecture map (full <-> docked), step animations,
   captions, takeaways, controls, keyboard.
   All drawing helpers are global so a page's step functions can use them.
   ============================================================ */
const NS='http://www.w3.org/2000/svg';
const C={a1:'#f59e0b',a2:'#fbbf24',orange:'#f97316',purple:'#a855f7',cyan:'#06b6d4',
  green:'#22c55e',blue:'#60a5fa',red:'#ef4444',pink:'#ec4899',muted:'#475569',dim:'#94a3b8',
  line:'#1e293b',text:'#e2e8f0',bg:'#0b0f1a',bg2:'#0e1322'};
const COLORKEY={amber:C.a1,purple:C.purple,green:C.green,cyan:C.cyan,orange:C.orange,blue:C.blue,red:C.red,pink:C.pink};

let scene,gMain,fx,appEl;
let speed=1,current=-1,busy=false,autoOn=false,phase='start';
let CAPTIONS=[],STEPS=[],ARCH=[],TOTAL=0;

/* ---------- drawing helpers (global) ---------- */
function el(tag,attrs={},parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);(parent||gMain).appendChild(e);return e;}
function txt(x,y,s,o={}){const t=el('text',Object.assign({x,y,'text-anchor':o.anchor||'middle','font-family':o.mono===false?'DM Sans':'JetBrains Mono','font-size':o.size||12,fill:o.fill||C.text,opacity:o.opacity==null?1:o.opacity},o.weight?{'font-weight':o.weight}:{}),o.parent);t.textContent=s;return t;}
const easeOut=p=>1-Math.pow(1-p,3);
const easeInOut=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
const easeOutBack=p=>{const c=1.70158;return 1+(c+1)*Math.pow(p-1,3)+c*Math.pow(p-1,2);};
function wait(ms){return new Promise(r=>setTimeout(r,ms/speed));}
function tween({from=0,to=1,dur=600,ease=easeOut,onUpdate,onDone}){
  const D=Math.max(16,dur/speed),t0=performance.now();let done=false;
  return new Promise(res=>{
    function finish(){if(done)return;done=true;onUpdate&&onUpdate(to,1);onDone&&onDone();res();}
    function f(){if(done)return;let p=Math.min(1,(performance.now()-t0)/D);onUpdate&&onUpdate(from+(to-from)*ease(p),p);if(p<1)requestAnimationFrame(f);else finish();}
    requestAnimationFrame(f);setTimeout(finish,D+260);
  });
}
function fade(node,to=1,dur=400){return tween({dur,onUpdate:v=>node.setAttribute('opacity',(to*v).toFixed(3))});}
function appear(node,dur=420,dy=8){node.setAttribute('opacity',0);
  const tr=node.getAttribute('transform')||'';const m=/translate\(([-\d.]+)[ ,]([-\d.]+)\)/.exec(tr);
  const bx=m?+m[1]:0,by=m?+m[2]:0;
  return tween({dur,onUpdate:(v,p)=>{node.setAttribute('opacity',v);node.setAttribute('transform',`translate(${bx},${by+dy*(1-p)})`+(tr.replace(/translate\([^)]*\)/,'')));}});
}
function flow(d,{color=C.a1,count=4,dur=950,r=3,trail=true,onDone}={}){
  const p=el('path',{d,fill:'none',stroke:trail?color:'none','stroke-width':trail?1.4:0,'stroke-opacity':trail?0.18:0},fx);
  const len=p.getTotalLength();
  const dots=[];for(let i=0;i<count;i++)dots.push({c:el('circle',{r,fill:color,opacity:0},fx),off:i/count*0.5});
  const D=dur/speed,t0=performance.now();let done=false;
  return new Promise(res=>{
    function cleanup(){if(done)return;done=true;dots.forEach(x=>x.c.remove());
      if(trail)tween({dur:300,onUpdate:v=>p.setAttribute('stroke-opacity',0.18*(1-v)),onDone:()=>p.remove()});else p.remove();
      onDone&&onDone();res();}
    function f(){if(done)return;let base=(performance.now()-t0)/D;
      if(base>1.25){cleanup();return;}
      dots.forEach(dt=>{let q=base-dt.off;if(q<0||q>1){dt.c.setAttribute('opacity',0);return;}
        const pt=p.getPointAtLength(q*len);dt.c.setAttribute('cx',pt.x);dt.c.setAttribute('cy',pt.y);
        dt.c.setAttribute('opacity',Math.sin(q*Math.PI).toFixed(3));});
      requestAnimationFrame(f);}
    requestAnimationFrame(f);setTimeout(cleanup,D*1.25+260);
  });
}
function curve(x1,y1,x2,y2,k=0.5){const cx=x1+(x2-x1)*0.5;return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`;}
function vcurve(x1,y1,x2,y2){const cy=y1+(y2-y1)*0.5;return `M${x1},${y1} C${x1},${cy} ${x2},${cy} ${x2},${y2}`;}
function chip(x,y,w,h,label,color,o={}){
  const g=el('g',{transform:`translate(${x},${y})`,opacity:0},o.parent);
  el('rect',{x:0,y:0,width:w,height:h,rx:o.rx==null?7:o.rx,fill:(o.solid?color+'22':color+'14'),stroke:color,'stroke-width':o.sw||1.5},g);
  const t=el('text',{x:w/2,y:h/2+(o.fs||12)*0.36,'text-anchor':'middle','font-family':'JetBrains Mono','font-size':o.fs||12,fill:o.tc||color},g);
  t.textContent=label;
  return {g,cx:x+w/2,cy:y+h/2,x,y,w,h,rect:g.firstChild,label:t};
}
/* section title at top of the stage */
function stageTitle(s,color=C.a1){return txt(500,52,s,{size:13,fill:color,weight:700});}
/* animated heat/grid: cells filled by fn(r,c)->0..1 ; returns cell rects */
async function grid(gx,gy,rows,cols,cell,gap,fn,o={}){
  const color=o.color||C.a1,stepDelay=o.stepDelay==null?26:o.stepDelay,rects=[];
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const x=gx+c*(cell+gap),y=gy+r*(cell+gap),v=fn(r,c);
    el('rect',{x,y,width:cell,height:cell,rx:o.rx==null?4:o.rx,fill:C.bg2,stroke:C.line,'stroke-width':1});
    const rect=el('rect',{x,y,width:cell,height:cell,rx:o.rx==null?4:o.rx,fill:color,'fill-opacity':0});
    rects.push(rect);
    tween({dur:240,onUpdate:p=>rect.setAttribute('fill-opacity',(v*p).toFixed(3))});
    if(stepDelay)await wait(stepDelay);
  }
  return rects;
}
function clearScene(){gMain.innerHTML='';fx.innerHTML='';}

/* ============================================================
   ARCHITECTURE MAP
   ============================================================ */
function buildArch(){
  const host=document.getElementById('arch');host.innerHTML='';
  ARCH.forEach((b,i)=>{
    if(i>0){const cn=document.createElement('div');cn.className='aconn';host.appendChild(cn);}
    let node;
    if(b.type==='tokens'){
      node=document.createElement('div');node.className='atokrow';node.id='ab-'+b.id;
      (b.items||[]).forEach(t=>{const k=document.createElement('div');k.className='atok'+((b.hot!=null&&(t===b.hot))?' hot':'');k.textContent=t;node.appendChild(k);});
    }else if(b.type==='split'){
      node=document.createElement('div');node.className='abranch';node.id='ab-'+b.id;
      let html=b.label?'<div class="lab">'+b.label+'</div>':'';
      html+='<div class="aqkv-row">';
      (b.items||[]).forEach(it=>{html+='<div class="aqkv '+(it.cls||'')+'"><div class="h">'+it.h+'</div>'+(it.l?'<div class="l">'+it.l+'</div>':'')+'</div>';});
      html+='</div>';node.innerHTML=html;
    }else{
      node=document.createElement('div');node.className='ab '+(b.c||'');node.id='ab-'+b.id;
      node.innerHTML='<div class="t">'+b.t+'</div>'+(b.s?'<div class="s">'+b.s+'</div>':'')+'<div class="tick">✅</div><div class="here">▶</div>';
    }
    if(b.step!=null){node.setAttribute('data-step',b.step);node.addEventListener('click',()=>jumpTo(b.step));}
    host.appendChild(node);
  });
}
function updateArch(activeStep,allDone){
  const activeBlock=activeStep>=0?ARCH.find(b=>b.step===activeStep):null;
  const activeIdx=activeBlock?ARCH.indexOf(activeBlock):-1;
  ARCH.forEach((b,i)=>{
    const n=document.getElementById('ab-'+b.id);if(!n)return;
    n.classList.remove('active','done');
    if(allDone)n.classList.add('done');
    else if(activeIdx>=0){if(i<activeIdx)n.classList.add('done');if(b===activeBlock)n.classList.add('active');}
  });
}
let archState=null;
function computeArchTarget(mode){
  const arch=document.getElementById('arch');
  const ah=arch.offsetHeight||520,aw=arch.offsetWidth||312;
  const dockReserve=100,topPad=12;
  const dockW=window.innerWidth<=900?150:252;
  const regionH=appEl.clientHeight-dockReserve-topPad;
  let s,X,Y;
  if(mode==='step'){s=Math.min((dockW-22)/aw,regionH/ah);X=(dockW-aw*s)/2;Y=16;}
  else{s=Math.min(1.0,(appEl.clientWidth-44)/aw,regionH/ah);X=(appEl.clientWidth-aw*s)/2;Y=topPad+(regionH-ah*s)/2;}
  return {x:X,y:Y,s};
}
function applyArch(t){const arch=document.getElementById('arch');arch.style.transform=`translate(${t.x.toFixed(1)}px,${t.y.toFixed(1)}px) scale(${t.s.toFixed(3)})`;archState=t;}
function layoutArch(mode,animate){
  const t=computeArchTarget(mode);
  if(!animate||!archState){applyArch(t);return;}
  const f={x:archState.x,y:archState.y,s:archState.s};
  tween({dur:560,ease:easeInOut,onUpdate:v=>{applyArch({x:f.x+(t.x-f.x)*v,y:f.y+(t.y-f.y)*v,s:f.s+(t.s-f.s)*v});}});
}

/* ============================================================
   TAKEAWAYS (rendered from config)
   ============================================================ */
function liList(arr,mk){return arr.map(it=>{const b=Array.isArray(it)?it[0]:'';const rest=Array.isArray(it)?it[1]:it;
  return '<li><span class="mk">'+mk+'</span><span>'+(b?'<b>'+b+'</b> ':'')+rest+'</span></li>';}).join('');}
function buildTakeaways(){
  const T=DIAGRAM.takeaways||{};const host=document.getElementById('takeaways');
  let h='<div class="tk-head"><div class="h">Takeaways</div><div class="s">'+(DIAGRAM.takeawaysSub||'')+'</div></div><div class="tk-grid">';
  if(T.advantages)h+='<div class="tk-card adv"><h4>✓ Advantages</h4><ul>'+liList(T.advantages,'+')+'</ul></div>';
  if(T.challenges)h+='<div class="tk-card cha"><h4>⚠ Challenges</h4><ul>'+liList(T.challenges,'!')+'</ul></div>';
  if(T.uses)h+='<div class="tk-card use"><h4>◆ Where it\'s used</h4><ul>'+liList(T.uses,'›')+'</ul></div>';
  if(T.variants)h+='<div class="tk-card var"><h4>⚡ Variants &amp; improvements</h4><ul>'+liList(T.variants,'›')+'</ul></div>';
  if(T.compare){
    const cmp=T.compare;
    h+='<div class="tk-card full cmp"><h4>⇄ '+(cmp.title||(DIAGRAM.title+' vs. the alternatives'))+'</h4><table class="cmp-t"><thead><tr><th>Aspect</th>';
    cmp.cols.forEach((c,i)=>h+='<th'+(i===0?' class="att"':'')+'>'+c+'</th>');
    h+='</tr></thead><tbody>';
    cmp.rows.forEach(row=>{h+='<tr><td>'+row[0]+'</td>';for(let i=1;i<row.length;i++)h+='<td'+(i===1?' class="att"':'')+'>'+row[i]+'</td>';h+='</tr>';});
    h+='</tbody></table></div>';
  }
  if(T.pitfalls)h+='<div class="tk-card full pit"><h4>✗ Common pitfalls</h4><ul>'+liList(T.pitfalls,'✗')+'</ul></div>';
  h+='</div>';host.innerHTML=h;
}

/* ============================================================
   ORCHESTRATION
   ============================================================ */
function setMode(m){phase=m;appEl.dataset.mode=m;document.body.classList.toggle('ended',m==='end');layoutArch(m,true);}
function setCaption(i){
  const c=CAPTIONS[i],cap=document.getElementById('caption');
  cap.classList.add('swap');
  setTimeout(()=>{
    document.getElementById('capEye').textContent=c[0];
    document.getElementById('capTitle').textContent=c[1];
    document.getElementById('capBody').innerHTML=c[2];
    const eq=document.getElementById('capEq');
    if(c[3]){eq.style.display='inline-block';eq.textContent=c[3];}else{eq.style.display='none';}
    cap.classList.remove('swap');
  },170);
}
function setIndicator(){document.getElementById('indicator').innerHTML=(phase==='start'?'Ready':phase==='end'?'Complete ✓':'Step '+(current+1)+' / '+TOTAL)+'<span class="cursor">_</span>';}
function syncButtons(){
  document.getElementById('btnPrev').disabled=busy||phase==='start';
  const n=document.getElementById('btnNext');
  if(phase==='start'){n.textContent='▶ Begin';n.disabled=false;}
  else if(phase==='end'){n.textContent='↺ Restart';n.disabled=false;}
  else if(current>=TOTAL-1){n.textContent='Summary ▸';n.disabled=busy;}
  else{n.textContent='▶ Next Step';n.disabled=busy;}
  document.getElementById('btnAuto').classList.toggle('on',autoOn);
}
async function runStep(i){
  busy=true;setMode('step');current=i;updateArch(i,false);setCaption(i);setIndicator();syncButtons();
  clearScene();await wait(200);
  const myRun=++runToken;
  await STEPS[i]();
  if(myRun!==runToken)return;        // a newer step started; don't clobber state
  busy=false;syncButtons();
}
let runToken=0;
function goEnd(){
  autoOn=false;current=TOTAL-1;setMode('end');updateArch(-1,true);clearScene();setIndicator();syncButtons();
  window.scrollTo({top:0,behavior:'auto'});
}
function afterAuto(){
  if(!autoOn)return;
  if(current<TOTAL-1)setTimeout(()=>{if(autoOn)next();},700/speed);
  else setTimeout(()=>{if(autoOn){autoOn=false;goEnd();}},800/speed);
}
async function next(){
  if(busy)return;
  if(phase==='end'){resetAll();return;}
  if(phase==='step'&&current>=TOTAL-1){goEnd();return;}
  const target=(phase==='start')?0:current+1;
  await runStep(target);afterAuto();
}
async function prev(){
  if(busy)return;autoOn=false;
  if(phase==='end'){await runStep(TOTAL-1);return;}
  if(phase==='step'){if(current<=0)resetAll();else await runStep(current-1);}
}
function jumpTo(i){if(busy)return;autoOn=false;runStep(i);}
function toggleAuto(){
  if(phase==='end')resetAll();
  autoOn=!autoOn;syncButtons();
  if(autoOn)next();
}
function resetAll(){
  autoOn=false;busy=false;current=-1;runToken++;setMode('start');updateArch(-1,false);clearScene();
  document.getElementById('capEq').style.display='none';
  setIndicator();syncButtons();
}

/* ============================================================
   INIT
   ============================================================ */
function initEngine(){
  scene=document.getElementById('scene');
  gMain=document.createElementNS(NS,'g');scene.appendChild(gMain);
  fx=document.createElementNS(NS,'g');scene.appendChild(fx);
  appEl=document.querySelector('.app');

  // header
  document.getElementById('hTitle').textContent=DIAGRAM.title;
  document.getElementById('hSub').textContent=DIAGRAM.subtitle;
  document.title=DIAGRAM.title+' — Animated Walkthrough';
  if(DIAGRAM.formula){document.getElementById('hEq').innerHTML=DIAGRAM.formula;}else{document.getElementById('hEq').style.display='none';}
  if(DIAGRAM.startHint)document.querySelector('.start-hint').textContent=DIAGRAM.startHint;

  CAPTIONS=DIAGRAM.captions;STEPS=DIAGRAM.steps;ARCH=DIAGRAM.arch;TOTAL=STEPS.length;

  buildArch();buildTakeaways();

  document.getElementById('btnNext').addEventListener('click',next);
  document.getElementById('btnPrev').addEventListener('click',prev);
  document.getElementById('btnAuto').addEventListener('click',toggleAuto);
  document.getElementById('btnReset').addEventListener('click',resetAll);
  document.getElementById('speed').addEventListener('input',e=>{speed=parseFloat(e.target.value);document.getElementById('speedLbl').textContent=speed+'×';});
  document.addEventListener('keydown',e=>{
    if(e.target.tagName==='INPUT')return;
    if(e.code==='Space'||e.code==='ArrowRight'){e.preventDefault();next();}
    else if(e.code==='ArrowLeft'){e.preventDefault();prev();}
    else if(e.code==='KeyA'){e.preventDefault();toggleAuto();}
    else if(e.code==='KeyR'){e.preventDefault();resetAll();}
  });
  window.addEventListener('resize',()=>layoutArch(appEl.dataset.mode,false));

  resetAll();
  function refit(){layoutArch(appEl.dataset.mode,false);}
  requestAnimationFrame(refit);setTimeout(refit,200);setTimeout(refit,500);
  window.addEventListener('load',refit);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(refit);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initEngine);else initEngine();

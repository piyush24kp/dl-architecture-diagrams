/* Mamba — selective state space model */
window.DIAGRAM={
 title:'Mamba',
 subtitle:'Selective state-space model · linear-time sequence modelling',
 formula:'hₜ = Āₜ hₜ₋₁ + B̄ₜ xₜ   ·   yₜ = Cₜ hₜ   (input-dependent)',
 takeawaysSub:'how SSMs rival attention · strengths · the linear-time payoff',
 arch:[
  {id:'in',type:'tokens',items:['a','long','long','sequence'],step:0},
  {id:'ssm',t:'State-Space Model',s:'a learnable recurrence',c:'cyan',step:1},
  {id:'select',t:'Selective Gating',s:'params depend on input',c:'amber',step:2},
  {id:'state',t:'Compressed State h',s:'fixed-size memory',c:'purple',step:3},
  {id:'scan',t:'Parallel Scan',s:'train like a CNN',c:'green',step:4},
  {id:'linear',t:'Linear-Time',s:'O(n), long context',c:'blue',step:5},
 ],
 captions:[
  ['01 · The Goal','Attention’s quality, RNN’s cost','Attention is O(n²); RNNs are O(n) but weak. Mamba is a state-space model that aims for both — linear time AND strong long-range modelling.','want: O(n) + long memory'],
  ['02 · State-Space Model','A continuous recurrence','An SSM maps the sequence through a hidden state with learned matrices A, B, C. Like an RNN, but derived from a continuous-time linear system.','hₜ = Āhₜ₋₁ + B̄xₜ ; yₜ = Chₜ'],
  ['03 · Selectivity','Let the input steer the dynamics','The key idea: make B, C and the step size functions of the input. Now the model can choose to remember or ignore each token — content-aware memory.','A, B, C depend on xₜ'],
  ['04 · Compressed State','One fixed-size memory','All history is summarised in a constant-size state — no growing KV cache. Memory and compute per token stay flat as the sequence grows.','state size independent of n'],
  ['05 · Parallel Scan','Recurrent yet parallelisable','A clever associative scan computes the whole recurrence in parallel on GPUs during training — RNN-style inference, CNN-style training speed.','associative scan over time'],
  ['06 · Linear Time','Scale to very long context','The result is O(n) compute and memory, so Mamba handles sequences of hundreds of thousands of tokens where attention becomes impractical.','O(n) · 100k+ tokens'],
 ],
 steps:[
  async function(){
   stageTitle('THE GOAL  ·  attention quality at RNN cost',C.a1);
   // cost curves
   el('line',{x1:140,y1:380,x2:880,y2:380,stroke:C.line,'stroke-width':1.2});el('line',{x1:140,y1:380,x2:140,y2:110,stroke:C.line,'stroke-width':1.2});
   txt(500,400,'sequence length →',{size:10,fill:C.muted,parent:gMain});txt(120,250,'cost',{size:10,fill:C.muted,anchor:'end',parent:gMain});
   let qd='M140,370 ';for(let x=0;x<=720;x+=10)qd+='L'+(140+x)+','+(370-Math.pow(x/720,2)*250)+' ';
   const q=el('path',{d:qd,fill:'none',stroke:C.red,'stroke-width':2,opacity:0});fade(q,1,400);txt(840,150,'attention O(n²)',{size:11,fill:C.red,parent:gMain});
   await wait(400);
   let md='M140,370 ';for(let x=0;x<=720;x+=10)md+='L'+(140+x)+','+(370-x/720*120)+' ';
   const m=el('path',{d:md,fill:'none',stroke:C.green,'stroke-width':2.5,opacity:0});fade(m,1,400);txt(840,290,'Mamba O(n)',{size:11,fill:C.green,parent:gMain});
   txt(500,440,'linear time, while keeping strong long-range modelling',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('STATE-SPACE MODEL  ·  a learnable recurrence',C.cyan);
   const xs=[140,360,580,800];const cy=210;let prev=null;
   for(let i=0;i<4;i++){const c=chip(xs[i],cy-32,150,64,'h'+(i+1)+' = Āh+B̄x',C.cyan,{fs:10,solid:true});
     const tk=chip(xs[i]+25,cy+80,100,40,'x'+(i+1),C.a1,{fs:12});await appear(c.g,240);appear(tk.g,220);
     await flow(`M${xs[i]+75},${cy+80} L${xs[i]+75},${cy+32}`,{color:C.a1,count:1,dur:300,trail:false});
     if(prev!=null)await flow(`M${prev+150},${cy} L${xs[i]},${cy}`,{color:C.purple,count:2,dur:420});
     prev=xs[i];}
   txt(500,400,'matrices A, B, C define the dynamics — learned, like an RNN',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('SELECTIVITY  ·  parameters depend on the input',C.a1);
   const tok=chip(110,225,140,56,'token xₜ',C.a1,{fs:13,solid:true});await appear(tok.g,300);
   const gen=chip(330,220,130,66,'projections',C.a1,{fs:12});await appear(gen.g,300);await flow(`M250,253 L330,253`,{color:C.a1,count:2,dur:300});
   const params=[['B̄ₜ',C.cyan,150],['C̄ₜ',C.purple,250],['Δₜ',C.green,350]];
   for(const[n,col,y] of params){const p=chip(560,y,120,52,n,col,{fs:15,solid:true});await appear(p.g,240);await flow(curve(460,253,560,y+26,0.25),{color:col,count:2,dur:360});}
   txt(760,250,'→ content-aware',{size:11,fill:C.green,parent:gMain});txt(760,275,'remembering',{size:11,fill:C.green,parent:gMain});
   txt(500,430,'unlike classic SSMs, the recurrence adapts to each token',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('COMPRESSED STATE  ·  fixed-size memory',C.purple);
   const xs=[120,300,480,660,840];const cy=180;
   const state=[];for(let i=0;i<8;i++){const r=el('rect',{x:380+i*34,y:300,width:30,height:54,rx:5,fill:C.purple,'fill-opacity':0.3,stroke:C.purple,'stroke-width':1.2});state.push(r);}
   txt(500,290,'state h  (constant size)',{size:11,fill:C.purple,parent:gMain});
   for(let i=0;i<5;i++){const tk=chip(xs[i],cy-22,90,44,'x'+(i+1),C.a1,{fs:11});await appear(tk.g,180);
     await flow(`M${xs[i]+45},${cy+22} L500,300`,{color:C.a1,count:1,dur:300,trail:false});
     state.forEach((r,k)=>tween({dur:200,onUpdate:p=>r.setAttribute('fill-opacity',(0.3+0.5*Math.abs(Math.sin(i*1.4+k))*p).toFixed(2))}));await wait(60);}
   txt(500,410,'no growing KV cache — memory per token stays flat',{size:12,fill:C.green});
  },
  async function(){
   stageTitle('PARALLEL SCAN  ·  recurrent, yet GPU-parallel',C.green);
   const xs=[140,300,460,620,780];const cy=300;
   for(let i=0;i<5;i++){const c=chip(xs[i],cy,110,46,'x'+(i+1),C.a1,{fs:11});appear(c.g,160);}
   await wait(300);
   // tree reduction arcs
   const pairs=[[0,1,220],[2,3,540],[0,2,380]];
   for(const[a,b,mx] of pairs){await flow(`M${xs[a]+55},${cy} C${xs[a]+55},${cy-80} ${xs[b]+55},${cy-80} ${xs[b]+55},${cy}`,{color:C.green,count:2,dur:500,r:2.5});}
   const all=chip(360,120,280,50,'combined in log(n) depth',C.green,{fs:12,tc:C.green});await appear(all.g,360);
   txt(500,400,'an associative scan → RNN inference, CNN-fast training',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('LINEAR TIME  ·  scale to 100k+ tokens',C.blue);
   const bars=[['1k',60,C.green],['16k',90,C.green],['128k',130,C.green],['1M',170,C.green]];
   el('line',{x1:160,y1:380,x2:860,y2:380,stroke:C.line,'stroke-width':1.2});
   for(let i=0;i<4;i++){const[lbl,h,col]=bars[i];const x=240+i*160;
     el('rect',{x:x-40,y:380-h,width:80,height:h,rx:6,fill:C.blue,opacity:0.75});
     txt(x,400,lbl+' tokens',{size:10,fill:C.muted,parent:gMain});await wait(180);}
   txt(820,180,'attention',{size:10,fill:C.red,parent:gMain});txt(820,202,'gives up here',{size:10,fill:C.red,parent:gMain});
   txt(500,440,'linear scaling makes very long context practical',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Linear time &amp; memory.','O(n) compute, constant state — no KV cache.'],
   ['Long context.','Handles hundreds of thousands of tokens efficiently.'],
   ['Fast inference.','Recurrent form gives O(1) per generated token.'],
   ['Competitive quality.','Matches Transformers on many sequence tasks.'],
  ],
  challenges:[
   ['Newer &amp; less proven.','Smaller ecosystem and tooling than Transformers.'],
   ['Weaker exact recall.','Attention can copy specific tokens more reliably.'],
   ['Hardware-aware kernels.','Needs custom scan kernels for full speed.'],
   ['In-context learning.','Still being studied vs. attention-based models.'],
  ],
  uses:[
   ['Long-document modelling.','Books, logs, long transcripts.'],
   ['Genomics.','DNA sequences with very long dependencies.'],
   ['Audio.','Long raw-waveform modelling.'],
   ['Hybrid LLMs.','Mamba+attention blocks (e.g. Jamba).'],
  ],
  variants:[
   ['Mamba-2.','Simpler, faster state-space duality.'],
   ['Jamba.','Interleaves Mamba and attention layers.'],
   ['S4 / S5.','Earlier structured SSMs Mamba builds on.'],
   ['Vision Mamba.','SSM backbones for images.'],
  ],
  compare:{cols:['Mamba','Transformer','RNN/LSTM'],rows:[
   ['Time complexity','O(n)','O(n²)','O(n)'],
   ['Memory in length','Constant state','Grows (KV cache)','Constant state'],
   ['Parallel training','Yes (scan)','Yes','No'],
   ['Exact token recall','Weaker','Strong','Weak'],
   ['Maturity','Emerging','Dominant','Legacy'],
  ]},
  pitfalls:[
   ['Expecting attention-level recall','— add attention layers if exact copying matters.'],
   ['Skipping the hardware-aware scan','— naive recurrence is slow.'],
   ['Ignoring selectivity','— non-selective SSMs underperform on language.'],
   ['Tiny state size','— too small a state bottlenecks long dependencies.'],
  ],
 },
};

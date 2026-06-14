/* LSTM */
window.DIAGRAM={
 title:'Long Short-Term Memory',
 subtitle:'Gated memory cell · solves the vanishing gradient',
 formula:'cₜ = fₜ⊙cₜ₋₁ + iₜ⊙c̃ₜ   ·   hₜ = oₜ⊙tanh(cₜ)',
 takeawaysSub:'how gates protect memory · strengths · vs GRU & Transformers',
 arch:[
  {id:'in',type:'tokens',items:['the','cat','sat','down'],step:0},
  {id:'cell',t:'LSTM Cell',s:'cell state + 3 gates',c:'cyan',step:1},
  {id:'forget',t:'Forget Gate fₜ',s:'what to erase',c:'red',step:2},
  {id:'input',t:'Input Gate iₜ',s:'what to write',c:'amber',step:3},
  {id:'cstate',t:'Cell State cₜ',s:'the memory highway',c:'purple',step:4},
  {id:'output',t:'Output Gate oₜ',s:'what to expose as hₜ',c:'green',step:5},
 ],
 captions:[
  ['01 · The Problem','RNNs forget','A plain RNN overwrites its whole memory every step, so gradients vanish and long-range facts are lost. The LSTM adds a protected memory line and gates to control it.','keep “cat” in mind until “sat”'],
  ['02 · The Cell','A cell state + three gates','The LSTM keeps a separate cell state cₜ that flows almost unchanged, plus three sigmoid gates that decide what to forget, write, and read.','3 gates regulate one memory'],
  ['03 · Forget Gate','Decide what to erase','A sigmoid looks at the input and previous state and outputs a 0–1 mask. Multiplying the cell state by it selectively erases stale information.','fₜ = σ(W_f·[hₜ₋₁,xₜ])'],
  ['04 · Input Gate','Decide what to write','The input gate picks which new candidate values to add to the cell state — writing fresh information into memory.','iₜ⊙c̃ₜ added to cₜ'],
  ['05 · Cell State','The memory highway','The cell state runs straight through with only minor, gated edits — so gradients flow back across hundreds of steps without vanishing.','cₜ = fₜ⊙cₜ₋₁ + iₜ⊙c̃ₜ'],
  ['06 · Output Gate','Expose a filtered view','The output gate reads the cell state through a tanh to produce the hidden state hₜ — the part of memory shared with the next layer.','hₜ = oₜ⊙tanh(cₜ)'],
 ],
 steps:[
  async function(){
   stageTitle('THE PROBLEM  ·  vanilla RNNs overwrite memory',C.a1);
   const xs=[140,360,580,800];const cy=230;
   for(let i=0;i<4;i++){const c=chip(xs[i],cy-30,140,60,'h'+(i+1),C.a1,{fs:14,solid:true});appear(c.g,200);}
   await wait(250);
   for(let i=0;i<3;i++){await flow(`M${xs[i]+140},${cy} L${xs[i+1]},${cy}`,{color:C.red,count:Math.max(1,3-i),dur:520});}
   const fade1=chip(95,cy-26,46,52,'cat',C.green,{fs:12});appear(fade1.g,300);
   tween({dur:1400,onUpdate:p=>fade1.g.setAttribute('opacity',1-0.85*p)});
   txt(500,360,'the fact “cat” fades out before the model reaches “sat”',{size:12,fill:C.muted});
   txt(500,400,'LSTM fixes this with a protected memory line + gates',{size:12,fill:C.cyan});
  },
  async function(){
   stageTitle('THE LSTM CELL  ·  one memory, three gates',C.cyan);
   const cell=el('rect',{x:250,y:120,width:500,height:260,rx:16,fill:C.cyan,'fill-opacity':0.04,stroke:C.cyan,'stroke-width':1.6,opacity:0});
   fade(cell,1,420);
   // memory highway
   await wait(200);
   const hw=el('line',{x1:270,y1:170,x2:730,y2:170,stroke:C.purple,'stroke-width':3,opacity:0});fade(hw,1,400);
   txt(500,158,'cell state cₜ  (memory highway)',{size:11,fill:C.purple,parent:gMain});
   const gates=[['forget fₜ',C.red,330],['input iₜ',C.a1,500],['output oₜ',C.green,670]];
   for(const[n,col,gx] of gates){const g=chip(gx-55,250,110,52,n,col,{fs:11});await appear(g.g,300);await flow(`M${gx},250 L${gx},172`,{color:col,count:2,dur:420,trail:false});}
   txt(500,420,'gates are sigmoids (0–1) that regulate the memory line',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('FORGET GATE  ·  erase stale memory',C.red);
   const mem=[];for(let i=0;i<8;i++){const r=el('rect',{x:300+i*44,y:170,width:38,height:54,rx:6,fill:C.purple,'fill-opacity':0.6,stroke:C.purple,'stroke-width':1.2});mem.push(r);}
   txt(500,150,'cell state cₜ₋₁',{size:11,fill:C.purple,parent:gMain});
   await wait(300);
   const mask=[1,1,0.1,1,0.2,1,1,0.0];
   txt(500,300,'forget mask fₜ = σ(...)',{size:11,fill:C.red,parent:gMain});
   for(let i=0;i<8;i++){const m=txt(300+i*44+19,330,mask[i].toFixed(1),{size:11,fill:C.red,parent:gMain,opacity:0});fade(m,1,200);await wait(60);}
   await wait(200);
   for(let i=0;i<8;i++){tween({dur:300,onUpdate:p=>mem[i].setAttribute('fill-opacity',(0.6*(1-(1-mask[i])*p)).toFixed(3))});await wait(50);}
   txt(500,410,'low gate values wipe out information no longer needed',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('INPUT GATE  ·  write new information',C.a1);
   const xt=chip(80,300,150,52,'xₜ  (new input)',C.cyan,{fs:12});await appear(xt.g,300);
   const cand=chip(360,290,170,64,'c̃ₜ  candidate',C.a1,{fs:13,solid:true});await appear(cand.g,320);
   await flow(curve(230,326,360,322,0.2),{color:C.cyan,count:3,dur:560});
   const gate=chip(360,170,170,56,'iₜ  input gate',C.a2,{fs:12});await appear(gate.g,320);
   const mem=[];for(let i=0;i<6;i++){const r=el('rect',{x:660+i*42,y:250,width:36,height:50,rx:6,fill:C.purple,'fill-opacity':0.5,stroke:C.purple,'stroke-width':1.2});mem.push(r);}
   txt(760,230,'cell state cₜ',{size:11,fill:C.purple,parent:gMain});
   await flow(curve(530,290,660,275,0.2),{color:C.a1,count:3,dur:640});
   await flow(curve(530,198,660,260,0.2),{color:C.a2,count:2,dur:560});
   for(let i=0;i<6;i++){tween({dur:240,onUpdate:p=>mem[i].setAttribute('fill-opacity',0.5+0.4*Math.abs(Math.sin(i*1.3))*p)});await wait(50);}
   txt(500,420,'iₜ⊙c̃ₜ  is added into the cell state',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('CELL STATE  ·  gradients flow unbroken',C.purple);
   const xs=[120,330,540,750];const cy=210;
   const hw=el('line',{x1:120,y1:cy,x2:900,y2:cy,stroke:C.purple,'stroke-width':4,opacity:0});fade(hw,1,500);
   txt(500,180,'cell state highway — only tiny gated edits per step',{size:11,fill:C.purple,parent:gMain});
   for(let i=0;i<4;i++){const c=chip(xs[i]-10,cy+50,120,52,'×fₜ +iₜ',C.cyan,{fs:11});appear(c.g,240);await flow(`M${xs[i]+50},${cy+50} L${xs[i]+50},${cy+4}`,{color:C.cyan,count:1,dur:360,trail:false});await wait(80);}
   await flow(`M120,${cy} L900,${cy}`,{color:C.green,count:5,dur:1100,r:3});
   txt(500,330,'because edits are additive, ∂cₜ/∂cₜ₋₁ ≈ 1',{size:12,fill:C.green});
   txt(500,400,'→ memory and gradients survive hundreds of steps',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('OUTPUT GATE  ·  expose a filtered view',C.green);
   const mem=[];for(let i=0;i<6;i++){const r=el('rect',{x:120+i*44,y:200,width:38,height:54,rx:6,fill:C.purple,'fill-opacity':0.55,stroke:C.purple,'stroke-width':1.2});mem.push(r);}
   txt(220,180,'cell state cₜ',{size:11,fill:C.purple,parent:gMain});
   await wait(250);
   const tanh=chip(440,205,120,52,'tanh',C.cyan,{fs:14});await appear(tanh.g,300);
   await flow(`M384,227 L440,227`,{color:C.purple,count:3,dur:480});
   const gate=chip(440,90,120,52,'oₜ gate',C.green,{fs:12});await appear(gate.g,300);
   const ht=chip(660,200,150,60,'hₜ',C.green,{fs:18,solid:true});await appear(ht.g,320);
   await flow(`M560,231 L660,231`,{color:C.cyan,count:3,dur:480});
   await flow(`M500,142 L500,205`,{color:C.green,count:2,dur:360,trail:false});
   txt(500,410,'hₜ passes to the next layer; cₜ stays as private memory',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Long-range memory.','The gated cell state preserves information across hundreds of steps.'],
   ['Stable gradients.','Additive memory updates keep ∂cₜ/∂cₜ₋₁ near 1 — no vanishing.'],
   ['Selective control.','Gates learn what to keep, write, and read for each input.'],
   ['Proven & robust.','Dominated sequence modelling for ~7 years across many domains.'],
  ],
  challenges:[
   ['Still sequential.','Like RNNs, it cannot parallelise across time — slow to train.'],
   ['Heavier cell.','Four weight matrices per cell mean more parameters and compute.'],
   ['Capacity limits.','One vector still bottlenecks very long or complex context.'],
   ['Beaten at scale.','Transformers outperform on large datasets and long context.'],
  ],
  uses:[
   ['Speech recognition.','Acoustic models, before Conformers took over.'],
   ['Time-series.','Forecasting, healthcare signals, finance.'],
   ['Handwriting / OCR.','Sequence labelling tasks.'],
   ['On-device NLP.','Compact, streaming-friendly language models.'],
  ],
  variants:[
   ['GRU.','Merges gates into 2 — fewer params, similar accuracy.'],
   ['Peephole LSTM.','Gates also see the cell state directly.'],
   ['Bidirectional LSTM.','Reads both directions for full context.'],
   ['ConvLSTM.','Replaces matrix mults with convolutions for spatial data.'],
  ],
  compare:{cols:['LSTM','GRU','Transformer'],rows:[
   ['Gates','3 (forget/input/output)','2 (update/reset)','none — attention'],
   ['Long-range memory','Good','Good','Excellent'],
   ['Parallelism','None','None','Full'],
   ['Parameters','Most','Fewer','Many'],
   ['Best for','Medium sequences','Lighter models','Large-scale everything'],
  ]},
  pitfalls:[
   ['Forget-gate bias','— initialise it to 1 so the cell remembers by default early in training.'],
   ['Over-long sequences','still strain memory; consider truncation or attention.'],
   ['Confusing hₜ and cₜ','— hₜ is the exposed output, cₜ is the private memory line.'],
   ['Too many layers','without residuals can re-introduce optimisation trouble.'],
  ],
 },
};

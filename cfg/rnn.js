/* Recurrent Neural Network */
window.DIAGRAM={
 title:'Recurrent Neural Network',
 subtitle:'Sequential memory · hidden state · the original sequence model',
 formula:'hₜ = tanh(Wₓ·xₜ + Wₕ·hₜ₋₁ + b)',
 takeawaysSub:'sequential memory · its strengths · why attention replaced it',
 arch:[
  {id:'in',type:'tokens',items:['I','love','deep','learning'],step:0},
  {id:'emb',t:'Embedding',s:'tokens → vectors'},
  {id:'cell',t:'Recurrent Cell ↺',s:'tanh(Wₓxₜ + Wₕhₜ₋₁)',c:'amber',step:1},
  {id:'state',t:'Hidden State hₜ',s:'memory carried forward',c:'purple',step:2},
  {id:'unroll',t:'Unrolled Through Time',s:'h₁ → h₂ → h₃ → h₄',c:'cyan',step:3},
  {id:'out',t:'Output yₜ',s:'one prediction per step',c:'green',step:4},
  {id:'bptt',t:'Backprop Through Time',s:'gradients vanish',c:'red',step:5},
 ],
 captions:[
  ['01 · Sequential Intake','One token at a time','Unlike attention, an RNN reads the sequence strictly left-to-right. Each token must wait for the previous step to finish — the computation is inherently sequential.','xₜ enters at time-step t'],
  ['02 · The Recurrent Cell','Mix input with memory','At every step the cell blends the new input xₜ with the previous hidden state hₜ₋₁ through learned weights, then squashes with tanh.','hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁ + b)'],
  ['03 · Hidden State','A running summary','The hidden state is the network’s memory — a fixed-size vector that carries everything seen so far forward to the next step.','hₜ summarises x₁…xₜ'],
  ['04 · Unrolling Through Time','The same cell, reused','Picture the cell copied at each step, passing its state along the chain. The weights are shared across all time-steps — that’s parameter sharing.','one shared cell, T steps'],
  ['05 · Per-step Output','Predict as you go','At each step the hidden state can be projected to an output — the next word, a tag, or a final summary at the end of the sequence.','yₜ = softmax(Wᵧhₜ)'],
  ['06 · Vanishing Gradients','Memory fades','Training backpropagates through every step. Repeated multiplication shrinks the gradient, so early tokens barely influence late ones — long-range memory is lost.','∂L/∂h₁ → 0'],
 ],
 steps:[
  async function(){
   stageTitle('ONE TOKEN AT A TIME  ·  strictly sequential',C.a1);
   const cell=chip(610,205,210,96,'RNN Cell',C.a1,{fs:17,solid:true});
   await appear(cell.g,420);
   const toks=['I','love','deep','learning'];
   const clk=txt(715,335,'t = 0',{size:13,fill:C.a2,weight:700,parent:gMain});
   for(let i=0;i<toks.length;i++){
     const t=chip(80,232,130,44,'"'+toks[i]+'"',C.dim,{fs:13,tc:C.text});
     await appear(t.g,260);
     await flow(curve(210,254,610,253,0.25),{color:C.a1,count:3,dur:640});
     clk.textContent='t = '+(i+1);
     t.g.remove();
   }
   txt(500,420,'each step blocks on the previous one — no parallelism',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('INSIDE THE CELL  ·  blend input with memory',C.a1);
   const xt=chip(70,300,140,52,'xₜ  (input)',C.cyan,{fs:13});
   const hp=chip(70,150,140,52,'hₜ₋₁  (memory)',C.purple,{fs:12});
   await appear(xt.g,300);await appear(hp.g,300);
   const sum=chip(430,215,150,72,'+',C.a1,{fs:26,solid:true});
   await appear(sum.g,360);
   await flow(curve(210,326,430,260,0.3),{color:C.cyan,count:3,dur:700});
   await flow(curve(210,176,430,235,0.3),{color:C.purple,count:3,dur:700});
   txt(355,200,'Wₓ',{size:12,fill:C.cyan,parent:gMain});
   txt(355,300,'Wₕ',{size:12,fill:C.purple,parent:gMain});
   const tanh=chip(660,215,150,72,'tanh',C.green,{fs:18,solid:true});
   await appear(tanh.g,360);
   await flow(`M580,251 L660,251`,{color:C.a1,count:3,dur:560});
   const ht=chip(850,222,120,58,'hₜ',C.a2,{fs:18,solid:true});
   await appear(ht.g,360);
   await flow(`M810,251 L850,251`,{color:C.green,count:2,dur:420});
   txt(500,420,'learned Wₓ, Wₕ are shared across every time-step',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('HIDDEN STATE  ·  a fixed-size running summary',C.purple);
   const cell=chip(410,120,180,70,'RNN Cell',C.a1,{fs:15,solid:true});
   await appear(cell.g,360);
   // hidden state vector
   const vy=320,vx=360;
   txt(500,250,'hₜ  —  compresses everything seen so far',{size:12,fill:C.purple,parent:gMain});
   const cells=[];
   for(let i=0;i<8;i++){const r=el('rect',{x:vx+i*34,y:vy,width:30,height:46,rx:5,fill:C.purple,'fill-opacity':0,stroke:C.purple,'stroke-width':1.2});cells.push(r);}
   for(let i=0;i<8;i++){tween({dur:240,onUpdate:p=>cells[i].setAttribute('fill-opacity',(0.25+0.5*Math.abs(Math.sin(i*1.7)))*p)});await wait(70);}
   await flow(vcurve(500,190,500,316),{color:C.a1,count:3,dur:640});
   txt(500,420,'no matter how long the sequence, hₜ stays the same size',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('UNROLLED THROUGH TIME  ·  one shared cell',C.cyan);
   const toks=['I','love','deep','learning'];const xs=[120,330,540,750];const cy=250;
   let prev=null;
   for(let i=0;i<4;i++){
     const c=chip(xs[i],cy-36,150,72,'cell',C.a1,{fs:13,solid:true});
     txt(xs[i]+75,cy-58,'t='+(i+1),{size:10,fill:C.a2,parent:gMain});
     const tk=chip(xs[i],cy+70,150,40,'"'+toks[i]+'"',C.cyan,{fs:12});
     await appear(c.g,260);appear(tk.g,260);
     await flow(`M${xs[i]+75},${cy+70} L${xs[i]+75},${cy+36}`,{color:C.cyan,count:2,dur:420,trail:false});
     if(prev!=null){await flow(`M${prev+150},${cy} L${xs[i]},${cy}`,{color:C.purple,count:3,dur:560});}
     prev=xs[i];
   }
   txt(500,420,'hidden state (purple) flows step → step, carrying memory forward',{size:12,fill:C.purple});
  },
  async function(){
   stageTitle('OUTPUT AT EACH STEP  ·  yₜ = softmax(Wᵧhₜ)',C.green);
   const xs=[120,330,540,750];const cy=270;const outs=['(noun)','(verb)','(adj)','(noun)'];
   for(let i=0;i<4;i++){
     const c=chip(xs[i],cy-30,150,60,'h'+(i+1),C.a1,{fs:14,solid:true});
     await appear(c.g,220);
     await flow(`M${xs[i]+75},${cy-30} L${xs[i]+75},${cy-70}`,{color:C.green,count:2,dur:420});
     const o=chip(xs[i],cy-130,150,46,outs[i],C.green,{fs:12});
     appear(o.g,260);
     if(i<3)await flow(`M${xs[i]+150},${cy} L${xs[i+1]},${cy}`,{color:C.purple,count:2,dur:420});
   }
   txt(500,420,'tagging, translation, generation — a prediction per time-step',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('BACKPROP THROUGH TIME  ·  the vanishing gradient',C.red);
   const xs=[140,360,580,800];const cy=230;
   for(let i=0;i<4;i++){const c=chip(xs[i],cy-30,140,60,'h'+(i+1),i===0?C.red:C.a1,{fs:14,solid:true});appear(c.g,200);}
   await wait(300);
   // gradient flows backward shrinking
   for(let i=3;i>0;i--){
     const grad=(0.6**(3-i));
     await flow(`M${xs[i]},${cy} L${xs[i-1]+140},${cy}`,{color:C.red,count:Math.max(1,Math.round(grad*5)),dur:560,r:1.5+grad*3});
     txt((xs[i]+xs[i-1]+140)/2,cy+34,'×0.6',{size:10,fill:C.red,parent:gMain});
   }
   txt(360,330,'gradient ≈ 0.22',{size:11,fill:C.red,parent:gMain});
   txt(800,330,'gradient = 1.0',{size:11,fill:C.green,parent:gMain});
   txt(500,420,'early tokens barely update → RNNs forget long-range context',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Natural for sequences.','Processes inputs of any length with the same compact cell — built for time series and text.'],
   ['Parameter sharing.','One set of weights reused across all steps keeps the model small.'],
   ['Online / streaming.','Can consume tokens as they arrive without seeing the whole sequence.'],
   ['Memory of the past.','The hidden state is a running summary of everything seen so far.'],
  ],
  challenges:[
   ['Vanishing/exploding gradients.','Long dependencies are hard to learn as gradients shrink or blow up.'],
   ['Sequential — slow.','Each step depends on the last, so it cannot parallelise across time on a GPU.'],
   ['Short effective memory.','In practice vanilla RNNs forget beyond ~10–20 steps.'],
   ['Fixed-size bottleneck.','All history is squeezed into one vector.'],
  ],
  uses:[
   ['Time-series.','Sensor data, forecasting, anomaly detection.'],
   ['Classic NLP.','Language modelling, tagging, early machine translation.'],
   ['Speech &amp; audio.','Acoustic modelling before Transformers/Conformers.'],
   ['On-device.','Small RNNs/GRUs still run cheaply on edge hardware.'],
  ],
  variants:[
   ['LSTM.','Gated cell with a separate memory line — solves vanishing gradients.'],
   ['GRU.','Lighter 2-gate variant, similar accuracy, fewer parameters.'],
   ['Bidirectional RNN.','Reads forwards and backwards for full context.'],
   ['Seq2Seq + attention.','Encoder–decoder RNNs were the bridge to Transformers.'],
  ],
  compare:{cols:['RNN','LSTM','Transformer'],rows:[
   ['Long-range memory','Weak','Good','Excellent'],
   ['Parallelism','None (sequential)','None (sequential)','Full'],
   ['Cost in length n','O(n·d²)','O(n·d²)','O(n²·d)'],
   ['Parameters','Few','Moderate','Many'],
   ['Best for','Short streams','Medium sequences','Everything at scale'],
  ]},
  pitfalls:[
   ['No gradient clipping','— exploding gradients make training diverge; clip the norm.'],
   ['Too-long sequences','— truncate BPTT or memory cost and vanishing make learning fail.'],
   ['Forgetting to reset state','between independent sequences leaks information.'],
   ['Using tanh everywhere','can saturate; watch initialisation and learning rate.'],
  ],
 },
};

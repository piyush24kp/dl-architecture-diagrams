/* LoRA — Low-Rank Adaptation */
window.DIAGRAM={
 title:'LoRA',
 subtitle:'Low-rank adapters · fine-tune giant models by training ~0.1% of weights',
 formula:'W = W₀ + B·A   ·   train only A, B  (rank r ≪ d)',
 takeawaysSub:'how tiny adapters fine-tune huge models · strengths · trade-offs',
 arch:[
  {id:'base',t:'Frozen Base Model',s:'W₀ — never updated',c:'muted',step:0},
  {id:'full',t:'Full Fine-tune (costly)',s:'update all of W',c:'red',step:1},
  {id:'lr',t:'Low-Rank Insight',s:'updates are low-rank',c:'purple',step:2},
  {id:'ab',t:'Adapters A, B',s:'two small matrices',c:'amber',step:3},
  {id:'merge',t:'W₀ + B·A',s:'inject the update',c:'green',step:4},
  {id:'swap',t:'Swap Adapters',s:'one base, many skills',c:'cyan',step:5},
 ],
 captions:[
  ['01 · The Base Model','Billions of frozen weights','Start from a huge pre-trained model. Its weight matrix W₀ holds general knowledge — we want to specialise it without disturbing that.','W₀ : d × d, frozen'],
  ['02 · Full Fine-tuning','Powerful but expensive','Updating every weight needs a full copy of the model in memory and a fresh checkpoint per task — gigabytes each. It does not scale to many tasks.','update all d×d weights'],
  ['03 · The Insight','The update is low-rank','Research showed the change ΔW needed to adapt a model lies in a tiny subspace — it can be approximated by a low-rank matrix.','ΔW ≈ B·A, rank r ≪ d'],
  ['04 · Adapters A and B','Train two skinny matrices','LoRA freezes W₀ and learns only A (d×r) and B (r×d). With r=8, that’s a fraction of a percent of the parameters.','A: d×r,  B: r×d'],
  ['05 · Inject the Update','W₀ + B·A','At runtime the low-rank product B·A is added to the frozen weights. The model behaves as if fully fine-tuned — at a tiny training cost.','W = W₀ + B·A'],
  ['06 · Swap Adapters','One base, many skills','Each task is just a few MB of A,B. Keep one frozen base in memory and hot-swap adapters for chat, code, medicine — instantly.','base + {adapter per task}'],
 ],
 steps:[
  async function(){
   stageTitle('THE FROZEN BASE  ·  W₀ holds general knowledge',C.dim);
   const gx=360,gy=120,cell=30,n=9;
   await grid(gx,gy,n,n,cell,2,(r,c)=>0.35+0.4*Math.abs(Math.sin(r*0.6+c*0.5)),{color:C.muted,stepDelay:8,rx:2});
   const lock=txt(500,150,'🔒 frozen',{size:13,fill:C.dim,parent:gMain});
   txt(500,420,'a d×d weight matrix with billions of parameters — we keep it fixed',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('FULL FINE-TUNING  ·  update everything (costly)',C.red);
   const gx=360,gy=120,cell=30,n=9;
   for(let r=0;r<n;r++)for(let c=0;c<n;c++){const rect=el('rect',{x:gx+c*(cell+2),y:gy+r*(cell+2),width:cell,height:cell,rx:2,fill:C.red,'fill-opacity':0.5,stroke:C.line,'stroke-width':0.5});
     tween({dur:1200,onUpdate:p=>rect.setAttribute('fill-opacity',(0.3+0.4*Math.abs(Math.sin(r+c+p*6))).toFixed(2))});}
   await wait(600);
   txt(500,420,'every weight changes → a full GB-scale checkpoint per task. Doesn’t scale.',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('THE INSIGHT  ·  the update ΔW is low-rank',C.purple);
   const gx=200,gy=140,cell=26,n=9;
   txt(gx+n*cell/2,gy-20,'ΔW (the change)',{size:11,fill:C.purple,parent:gMain});
   await grid(gx,gy,n,n,cell,2,(r,c)=>0.2+0.5*Math.abs(Math.sin(r*0.9))*Math.abs(Math.sin(c*0.9)),{color:C.purple,stepDelay:6,rx:2});
   const eq=chip(560,230,90,60,'≈',C.dim,{fs:26});await appear(eq.g,260);
   // B (tall) x A (wide)
   const Bx=680;for(let r=0;r<9;r++)el('rect',{x:Bx,y:gy+r*(cell+2),width:cell,height:cell,rx:2,fill:C.a1,'fill-opacity':(0.4+0.4*Math.random()).toFixed(2)});
   txt(Bx+13,gy-20,'B',{size:12,fill:C.a1,parent:gMain});
   const Ax=740;for(let c=0;c<9;c++)el('rect',{x:Ax+c*(cell+2),y:gy,width:cell,height:cell,rx:2,fill:C.green,'fill-opacity':(0.4+0.4*Math.random()).toFixed(2)});
   txt(Ax+100,gy-20,'A',{size:12,fill:C.green,parent:gMain});
   txt(500,430,'a fat matrix ≈ a tall (B) times a wide (A) — rank r ≪ d',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('ADAPTERS A & B  ·  train only these',C.a1);
   const x=chip(110,225,90,56,'x',C.blue,{fs:16,solid:true});await appear(x.g,280);
   // frozen path
   const w0=chip(300,150,150,60,'W₀ (frozen)',C.muted,{fs:12});await appear(w0.g,260);await flow(`M200,235 L300,180`,{color:C.muted,count:2,dur:300});
   // lora path
   const A=chip(280,300,90,52,'A',C.green,{fs:15,solid:true});const B=chip(420,300,90,52,'B',C.a1,{fs:15,solid:true});
   await appear(A.g,240);await flow(`M200,250 L280,326`,{color:C.green,count:2,dur:300});
   await appear(B.g,240);await flow(`M370,326 L420,326`,{color:C.a1,count:2,dur:260});
   txt(325,290,'r=8',{size:9,fill:C.muted,parent:gMain});
   const add=chip(600,225,90,60,'⊕',C.cyan,{fs:24,solid:true});await appear(add.g,300);
   await flow(`M450,180 L600,240`,{color:C.muted,count:2,dur:300});await flow(`M510,326 L600,270`,{color:C.a1,count:2,dur:300});
   const out=chip(740,225,120,60,'output',C.cyan,{fs:13,solid:true});await appear(out.g,280);await flow(`M690,255 L740,255`,{color:C.cyan,count:2,dur:260});
   txt(500,420,'only A and B get gradients — ~0.1% of the parameters',{size:12,fill:C.green});
  },
  async function(){
   stageTitle('INJECT  ·  W = W₀ + B·A',C.green);
   const w0=chip(140,220,130,70,'W₀',C.muted,{fs:18,solid:true});await appear(w0.g,300);
   const plus=chip(300,232,60,48,'+',C.dim,{fs:24});await appear(plus.g,200);
   const ba=chip(390,220,130,70,'B·A',C.a1,{fs:16,solid:true});await appear(ba.g,300);
   const eq=chip(550,232,60,48,'=',C.dim,{fs:24});await appear(eq.g,200);
   const w=chip(650,210,170,90,'adapted W',C.green,{fs:15,solid:true});await appear(w.g,320);
   await flow(`M270,255 L650,255`,{color:C.muted,count:2,dur:420});await flow(`M520,255 L650,255`,{color:C.a1,count:3,dur:420});
   txt(500,400,'merged at inference → zero extra latency, behaves fully fine-tuned',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('SWAP ADAPTERS  ·  one base, many skills',C.cyan);
   const base=chip(380,120,240,64,'Frozen Base 🔒',C.muted,{fs:14,solid:true});await appear(base.g,360);
   const tasks=[['💬 Chat',C.green,150],['💻 Code',C.a1,400],['⚕ Medical',C.purple,640]];
   const xs=[140,400,660];const names=['💬 Chat adapter','💻 Code adapter','⚕ Medical adapter'];const cols=[C.green,C.a1,C.purple];
   for(let i=0;i<3;i++){await flow(`M500,184 C500,250 ${xs[i]+110},250 ${xs[i]+110},300`,{color:cols[i],count:2,dur:500});
     const a=chip(xs[i],300,220,52,names[i],cols[i],{fs:12});await appear(a.g,240);txt(xs[i]+110,372,'~few MB',{size:9,fill:C.muted,parent:gMain});}
   txt(500,430,'hot-swap a few MB to change the model’s personality instantly',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Tiny &amp; cheap.','Trains ~0.1% of weights — fits on a single GPU.'],
   ['No inference cost.','Adapters merge into W₀ — same speed as the base.'],
   ['Modular.','Swap small adapters per task; share one frozen base.'],
   ['Less forgetting.','The base stays intact, preserving general ability.'],
  ],
  challenges:[
   ['Rank choice matters.','Too small underfits; too large loses the savings.'],
   ['Not always enough.','Big domain shifts may need full fine-tuning.'],
   ['Adapter sprawl.','Managing many task adapters adds ops overhead.'],
   ['Layer selection.','Which matrices to adapt affects quality.'],
  ],
  uses:[
   ['LLM customisation.','Domain/brand assistants on top of a base LLM.'],
   ['Stable Diffusion styles.','Lightweight style/subject adapters.'],
   ['Multi-tenant serving.','Per-customer adapters over one base.'],
   ['Research iteration.','Cheap, fast experiments.'],
  ],
  variants:[
   ['QLoRA.','LoRA on a 4-bit quantised base — fine-tune 65B on one GPU.'],
   ['DoRA.','Decomposes magnitude & direction for higher quality.'],
   ['AdaLoRA.','Allocates rank adaptively across layers.'],
   ['LoHa / LoKr.','Alternative low-rank factorisations.'],
  ],
  compare:{cols:['LoRA','Full fine-tune','Prompt tuning'],rows:[
   ['Trainable params','~0.1%','100%','<0.01%'],
   ['Memory to train','Low','Very high','Lowest'],
   ['Inference overhead','None (merged)','None','Small'],
   ['Quality ceiling','High','Highest','Lower'],
   ['Task switching','Swap adapter','New checkpoint','Swap prompt'],
  ]},
  pitfalls:[
   ['Rank too low','— underfits complex tasks; try r=16/32.'],
   ['Adapting only attention','— sometimes MLP layers matter more.'],
   ['Wrong learning rate','— LoRA often needs a higher LR than full fine-tune.'],
   ['Forgetting to merge','— unmerged adapters add a little latency.'],
  ],
 },
};

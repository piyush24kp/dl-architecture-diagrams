/* Fine-tuning landscape */
window.DIAGRAM={
 title:'Fine-tuning Landscape',
 subtitle:'From a base model to a specialist · the spectrum of adaptation methods',
 formula:'pre-train  →  adapt  →  align  →  deploy',
 takeawaysSub:'how to choose a method · trade-offs · the modern recipe',
 arch:[
  {id:'base',t:'Pre-trained Base',s:'broad knowledge',c:'muted',step:0},
  {id:'prompt',t:'Prompting / In-context',s:'no weight change',c:'blue',step:1},
  {id:'peft',t:'PEFT (LoRA, adapters)',s:'train a tiny fraction',c:'purple',step:2},
  {id:'full',t:'Full Fine-tune',s:'update all weights',c:'amber',step:3},
  {id:'align',t:'Alignment (SFT+RLHF)',s:'make it helpful & safe',c:'green',step:4},
  {id:'pick',t:'Choose by Constraints',s:'data · compute · control',c:'cyan',step:5},
 ],
 captions:[
  ['01 · The Base Model','A generalist to start from','Pre-training gives a model broad capability but no task focus. Fine-tuning is how we turn that generalist into a reliable specialist.','broad, not specialised'],
  ['02 · Prompting','Adapt with words, not weights','The lightest option: craft instructions and examples in the prompt. No training, instant iteration — but limited control and context budget.','few-shot / in-context'],
  ['03 · PEFT','Train a tiny fraction','Parameter-efficient methods like LoRA freeze the base and train small adapters — most of full fine-tuning’s benefit at a fraction of the cost.','LoRA, adapters, prefix-tuning'],
  ['04 · Full Fine-tuning','Update every weight','Maximum control and quality: retrain all parameters on your data. Costly in compute and storage, and risks forgetting general skills.','update 100% of weights'],
  ['05 · Alignment','Make it helpful and safe','Instruction tuning (SFT) then preference optimisation (RLHF/DPO) shape behaviour — turning a raw predictor into a usable assistant.','SFT → RLHF / DPO'],
  ['06 · Choosing','Match method to constraints','There is no single best method. Pick along the spectrum by your data volume, compute budget, and how much behavioural control you need.','data · compute · control'],
 ],
 steps:[
  async function(){
   stageTitle('THE STARTING POINT  ·  a broad generalist',C.dim);
   const base=chip(360,210,280,80,'Pre-trained Base',C.muted,{fs:16,solid:true});await appear(base.g,400);
   const skills=['knows a bit of everything','no task focus','not aligned'];
   for(let i=0;i<3;i++){const s=chip(330,310+i*0,340,30,skills[i],C.muted,{fs:11});s.g.setAttribute('transform',`translate(330,${310+i*38})`);appear(s.g,260);await wait(120);}
   txt(500,460,'fine-tuning specialises this generalist for our needs',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('PROMPTING  ·  adapt with words, no training',C.blue);
   const p=chip(120,170,760,140,'',C.blue,{parent:gMain});await appear(p.g,360);
   txt(30,34,'System: You are a legal assistant.',{size:12,fill:C.blue,parent:p.g,anchor:'start'});
   txt(30,66,'Example: Q: … → A: …   (few-shot)',{size:12,fill:C.dim,parent:p.g,anchor:'start'});
   txt(30,104,'User: Summarise this contract clause →',{size:12,fill:C.text,parent:p.g,anchor:'start'});
   await wait(200);
   txt(500,360,'✓ zero training   ✓ instant iteration',{size:12,fill:C.green});
   txt(500,400,'✗ limited control   ✗ eats the context window',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('PEFT  ·  freeze the base, train small adapters',C.purple);
   const gx=300,gy=130,cell=26,n=8;
   for(let r=0;r<n;r++)for(let c=0;c<n;c++)el('rect',{x:gx+c*(cell+2),y:gy+r*(cell+2),width:cell,height:cell,rx:2,fill:C.muted,'fill-opacity':0.4,stroke:C.line,'stroke-width':0.5});
   txt(gx+n*(cell+2)/2,gy-16,'frozen base 🔒',{size:11,fill:C.muted,parent:gMain});
   await wait(300);
   // small adapter highlighted
   for(let r=0;r<n;r++){el('rect',{x:gx+n*(cell+2)+20,y:gy+r*(cell+2),width:cell,height:cell,rx:2,fill:C.purple,'fill-opacity':0.7});}
   txt(gx+n*(cell+2)+33,gy-16,'A,B',{size:11,fill:C.purple,parent:gMain});
   const tag=chip(600,250,260,60,'~0.1% params trained',C.purple,{fs:13,tc:C.purple});await appear(tag.g,360);
   txt(500,420,'most of full fine-tuning’s benefit, a fraction of the cost (see LoRA)',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('FULL FINE-TUNE  ·  maximum control, maximum cost',C.a1);
   const gx=360,gy=120,cell=28,n=9;
   for(let r=0;r<n;r++)for(let c=0;c<n;c++){const rect=el('rect',{x:gx+c*(cell+2),y:gy+r*(cell+2),width:cell,height:cell,rx:2,fill:C.a1,'fill-opacity':0.4,stroke:C.line,'stroke-width':0.5});
     tween({dur:1000,onUpdate:p=>rect.setAttribute('fill-opacity',(0.3+0.4*Math.abs(Math.sin(r+c+p*5))).toFixed(2))});}
   await wait(500);
   txt(500,420,'✓ highest quality   ✗ GPU-heavy, full checkpoint, can forget skills',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('ALIGNMENT  ·  SFT then preference optimisation',C.green);
   const steps=[['Base',C.muted,150],['+ SFT',C.a1,400],['+ RLHF/DPO',C.green,650]];
   for(let i=0;i<3;i++){const[n,col,x]=steps[i];const c=chip(x-90,210,180,70,n,col,{fs:14,solid:i>0});await appear(c.g,300);
     if(i<2)await flow(`M${x+90},245 L${steps[i+1][2]-90},245`,{color:steps[i+1][1],count:3,dur:500});}
   txt(240,320,'raw predictor',{size:10,fill:C.muted,parent:gMain});
   txt(490,320,'follows instructions',{size:10,fill:C.a1,parent:gMain});
   txt(740,320,'helpful & safe',{size:10,fill:C.green,parent:gMain});
   txt(500,420,'this is the recipe behind ChatGPT, Claude, and friends',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('CHOOSING  ·  match method to your constraints',C.cyan);
   const rows=[['Just need behaviour','→ Prompting',C.blue],['Limited compute / many tasks','→ PEFT (LoRA)',C.purple],['Lots of data, need quality','→ Full fine-tune',C.a1],['Need helpful + safe','→ + Alignment',C.green]];
   for(let i=0;i<4;i++){const y=140+i*72;const cond=chip(110,y,360,54,'',C.line,{parent:gMain});txt(20,32,rows[i][0],{size:12,fill:C.text,parent:cond.g,anchor:'start'});
     await appear(cond.g,240);await flow(`M470,${y+27} L560,${y+27}`,{color:rows[i][2],count:2,dur:280});
     const pick=chip(560,y,300,54,rows[i][1],rows[i][2],{fs:13,tc:rows[i][2]});appear(pick.g,260);}
   txt(500,445,'the methods stack — most real systems combine several',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['A spectrum, not one choice.','Pick the lightest method that meets the need.'],
   ['Reuse pre-training.','Adapt broad knowledge instead of training from scratch.'],
   ['Composable.','Prompting + PEFT + alignment stack together.'],
   ['Cost control.','Trade compute for quality explicitly.'],
  ],
  challenges:[
   ['Catastrophic forgetting.','Aggressive tuning can erase general skills.'],
   ['Data quality.','Garbage fine-tuning data degrades the model.'],
   ['Evaluation.','Measuring real improvement is hard.'],
   ['Overfitting.','Small datasets can memorise, not generalise.'],
  ],
  uses:[
   ['Domain assistants.','Legal, medical, finance specialists.'],
   ['Brand &amp; tone.','Consistent voice for products.'],
   ['Task models.','Classification, extraction, structured output.'],
   ['Safety &amp; policy.','Aligning behaviour to guidelines.'],
  ],
  variants:[
   ['SFT.','Supervised instruction tuning on demonstrations.'],
   ['RLHF / DPO.','Optimise to human preferences.'],
   ['PEFT.','LoRA, adapters, prefix/prompt tuning.'],
   ['RAG (no tuning).','Inject knowledge at inference instead.'],
  ],
  compare:{cols:['Prompting','PEFT','Full fine-tune'],rows:[
   ['Weight changes','None','~0.1%','100%'],
   ['Compute','None','Low','High'],
   ['Control','Low','Medium','High'],
   ['Iteration speed','Instant','Fast','Slow'],
   ['Best when','Quick tasks','Many tasks/cheap','Data-rich, quality-critical'],
  ]},
  pitfalls:[
   ['Fine-tuning for knowledge','— often RAG is better for facts than tuning.'],
   ['Tiny, noisy datasets','— cause overfitting and forgetting.'],
   ['No eval set','— you can’t tell if tuning helped.'],
   ['Skipping alignment','— a capable model can still be unsafe/unhelpful.'],
  ],
 },
};

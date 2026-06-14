/* MoE — Mixture of Experts */
window.DIAGRAM={
 title:'Mixture of Experts',
 subtitle:'Sparse routing · many experts, few active · scale params without the compute',
 formula:'y = Σ  gate(x)ₖ · Expertₖ(x)   (top-k experts only)',
 takeawaysSub:'how sparsity scales models · strengths · its engineering costs',
 arch:[
  {id:'in',type:'tokens',items:['the','river','bank'],step:0},
  {id:'router',t:'Router / Gate',s:'score the experts',c:'amber',step:1},
  {id:'topk',t:'Top-k Selection',s:'pick 2 of N experts',c:'purple',step:2},
  {id:'experts',type:'split',label:'EXPERTS (sparsely active)',items:[{h:'E1',cls:''},{h:'E2',cls:'g'},{h:'E3',cls:''},{h:'E4',cls:'g'}],step:3},
  {id:'combine',t:'Weighted Combine',s:'gate-weighted sum',c:'green',step:4},
  {id:'scale',t:'Sparse Scaling',s:'huge params, fixed FLOPs',c:'cyan',step:5},
 ],
 captions:[
  ['01 · One Token In','Route, don’t run everything','In a dense model every parameter processes every token. MoE replaces one big feed-forward layer with many “experts” and runs only a few per token.','token → which experts?'],
  ['02 · The Router','Score each expert','A small gating network looks at the token and outputs a score for every expert — how useful each one is likely to be for this token.','gate(x) → scores over N experts'],
  ['03 · Top-k','Activate just a couple','Only the top-k experts (often k=2) are switched on. The rest stay idle — that’s the sparsity that keeps compute flat as experts multiply.','keep top-2, drop the rest'],
  ['04 · Experts','Specialists do the work','Each chosen expert is its own feed-forward network. Over training they specialise — syntax, numbers, code — and process the token in parallel.','Expertₖ(x), only k active'],
  ['05 · Combine','Blend by gate weight','The active experts’ outputs are merged in proportion to their gate scores, producing the layer’s output for this token.','y = Σ gateₖ · Expertₖ(x)'],
  ['06 · Sparse Scaling','Trillions of params, cheaply','Because only k experts run per token, you can add experts to grow capacity massively while keeping the per-token compute almost constant.','params ↑↑  ·  FLOPs ≈ flat'],
 ],
 steps:[
  async function(){
   stageTitle('DENSE vs SPARSE  ·  why route at all?',C.a1);
   txt(270,120,'DENSE: every param runs',{size:11,fill:C.muted,parent:gMain});
   for(let i=0;i<5;i++){const e=chip(150+i*90,160,80,52,'FFN',C.muted,{fs:11});appear(e.g,160);}
   await wait(400);
   txt(270,290,'MoE: only a few run',{size:11,fill:C.green,parent:gMain});
   for(let i=0;i<5;i++){const on=i===1||i===3;const e=chip(150+i*90,330,80,52,'E'+(i+1),on?C.green:C.muted,{fs:11,solid:on});appear(e.g,160);}
   txt(500,430,'same compute per token, far more total capacity',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('THE ROUTER  ·  score every expert',C.a1);
   const tok=chip(110,225,130,56,'token “bank”',C.a1,{fs:12,solid:true});await appear(tok.g,300);
   const router=chip(310,220,130,66,'Router',C.a1,{fs:13});await appear(router.g,300);await flow(`M240,253 L310,253`,{color:C.a1,count:2,dur:300});
   const scores=[0.12,0.55,0.08,0.71,0.05,0.18];const bx=540;
   await flow(`M440,253 L540,253`,{color:C.a1,count:2,dur:300});
   for(let i=0;i<6;i++){const top=scores[i]>0.5;const w=scores[i]*260;const y=150+i*42;
     el('rect',{x:bx,y,width:0,height:28,rx:4,fill:top?C.green:C.muted,opacity:0.85});const r=gMain.lastChild;
     txt(bx-12,y+20,'E'+(i+1),{size:11,fill:top?C.green:C.dim,anchor:'end',parent:gMain});
     tween({dur:360,onUpdate:p=>r.setAttribute('width',w*p)});
     txt(bx+w+16,y+20,scores[i].toFixed(2),{size:10,fill:top?C.green:C.muted,anchor:'start',parent:gMain});await wait(70);}
   txt(500,420,'a tiny softmax gate — its scores decide the routing',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('TOP-k  ·  keep the best 2, drop the rest',C.purple);
   const scores=[0.12,0.55,0.08,0.71,0.05,0.18];
   for(let i=0;i<6;i++){const top=scores[i]>0.5;const e=chip(120+i*135,210,110,70,'E'+(i+1),top?C.green:C.muted,{fs:14,solid:top});await appear(e.g,200);
     txt(175+i*135,300,scores[i].toFixed(2),{size:11,fill:top?C.green:C.muted,parent:gMain});
     if(!top){tween({dur:500,onUpdate:p=>e.g.setAttribute('opacity',1-0.7*p)});const x=el('text',{x:175+i*135,y:250,'text-anchor':'middle','font-size':20,fill:C.red,opacity:0});x.textContent='✕';fade(x,1,300);}}
   txt(500,400,'only E2 and E4 activate → 4 of 6 experts stay completely idle',{size:12,fill:C.green});
  },
  async function(){
   stageTitle('EXPERTS  ·  specialists process in parallel',C.green);
   const tok=chip(110,225,120,56,'token',C.a1,{fs:13,solid:true});await appear(tok.g,280);
   const e2=chip(380,140,180,70,'Expert 2',C.green,{fs:14,solid:true});const e4=chip(380,300,180,70,'Expert 4',C.green,{fs:14,solid:true});
   await appear(e2.g,260);await appear(e4.g,260);
   txt(470,128,'“syntax” specialist',{size:9,fill:C.muted,parent:gMain});txt(470,392,'“entities” specialist',{size:9,fill:C.muted,parent:gMain});
   await flow(curve(230,250,380,175,0.3),{color:C.green,count:3,dur:560});await flow(curve(230,253,380,335,0.3),{color:C.green,count:3,dur:560});
   const o2=el('g',{});for(let i=0;i<6;i++)el('rect',{x:640,y:120+i*15,width:50,height:12,rx:2,fill:C.green,'fill-opacity':(0.3+0.5*Math.random()).toFixed(2)},o2);fade(o2,1,360);
   const o4=el('g',{});for(let i=0;i<6;i++)el('rect',{x:640,y:300+i*15,width:50,height:12,rx:2,fill:C.green,'fill-opacity':(0.3+0.5*Math.random()).toFixed(2)},o4);fade(o4,1,360);
   await flow(`M560,175 L640,175`,{color:C.green,count:2,dur:300});await flow(`M560,335 L640,335`,{color:C.green,count:2,dur:300});
   txt(500,430,'each expert is its own feed-forward network',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('COMBINE  ·  gate-weighted sum',C.green);
   const e2=chip(120,160,150,60,'E2 out',C.green,{fs:13,solid:true});const e4=chip(120,300,150,60,'E4 out',C.green,{fs:13,solid:true});
   await appear(e2.g,260);await appear(e4.g,260);
   txt(300,180,'× 0.44',{size:12,fill:C.a2,parent:gMain});txt(300,320,'× 0.56',{size:12,fill:C.a2,parent:gMain});
   const sum=chip(470,225,110,70,'⊕',C.a1,{fs:26,solid:true});await appear(sum.g,320);
   await flow(curve(270,190,470,250,0.3),{color:C.green,count:Math.round(0.44*8),dur:560});
   await flow(curve(270,330,470,265,0.3),{color:C.green,count:Math.round(0.56*8),dur:560});
   const out=chip(660,225,150,70,'layer output',C.cyan,{fs:13,solid:true});await appear(out.g,300);await flow(`M580,260 L660,260`,{color:C.a1,count:2,dur:300});
   txt(500,420,'outputs blended in proportion to their gate scores',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('SPARSE SCALING  ·  params ↑↑, FLOPs ≈ flat',C.cyan);
   // params bar grows, compute bar stays
   el('line',{x1:160,y1:380,x2:160,y2:120,stroke:C.line,'stroke-width':1.2});el('line',{x1:160,y1:380,x2:860,y2:380,stroke:C.line,'stroke-width':1.2});
   const ns=[8,16,64,256];const xs=[260,440,620,800];
   for(let i=0;i<4;i++){const ph=40+i*70;
     el('rect',{x:xs[i]-50,y:380-ph,width:42,height:ph,rx:4,fill:C.cyan,opacity:0.8});
     el('rect',{x:xs[i]+2,y:380-60,width:42,height:60,rx:4,fill:C.green,opacity:0.7});
     txt(xs[i],400,ns[i]+' experts',{size:10,fill:C.muted,parent:gMain});await wait(200);}
   txt(720,160,'total params',{size:11,fill:C.cyan,parent:gMain});txt(720,330,'compute/token',{size:11,fill:C.green,parent:gMain});
   txt(500,440,'add experts → capacity soars, per-token cost barely moves',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Scale without the FLOPs.','Add experts to grow capacity at near-constant per-token compute.'],
   ['Specialisation.','Experts learn to handle different token types.'],
   ['Faster training per quality.','More effective parameters per GPU-hour.'],
   ['Proven at frontier.','Powers Mixtral, GLaM, and GPT-4-class systems.'],
  ],
  challenges:[
   ['Memory hungry.','All experts must be stored even if rarely used.'],
   ['Load balancing.','Routers can overload a few experts (needs aux loss).'],
   ['Communication cost.','Distributing experts adds all-to-all traffic.'],
   ['Training instability.','Routing decisions are discrete and can be brittle.'],
  ],
  uses:[
   ['Frontier LLMs.','Mixtral 8×7B, GLaM, DeepSeek-MoE.'],
   ['Multilingual models.','Experts specialise per language/domain.'],
   ['Vision MoE.','Sparse experts in large vision models.'],
   ['Recommenders.','Multi-task gating over shared experts.'],
  ],
  variants:[
   ['Switch Transformer.','Top-1 routing for simplicity & speed.'],
   ['GShard / GLaM.','Scaled MoE to hundreds of billions of params.'],
   ['Expert Choice.','Experts pick tokens — better load balance.'],
   ['Soft MoE.','Differentiable soft assignment, no hard routing.'],
  ],
  compare:{cols:['MoE','Dense model','Ensemble'],rows:[
   ['Active params/token','Sparse (top-k)','All','All models'],
   ['Total capacity','Very high','Tied to compute','Sum of models'],
   ['Compute/token','Low','High','Very high'],
   ['Memory','High','Moderate','High'],
   ['Routing','Learned gate','None','None'],
  ]},
  pitfalls:[
   ['No load-balancing loss','— a few experts hog all tokens, others die.'],
   ['Too-large k','— erodes the sparsity savings.'],
   ['Ignoring capacity factor','— dropped tokens hurt quality.'],
   ['Underestimating memory','— experts dominate the parameter budget.'],
  ],
 },
};

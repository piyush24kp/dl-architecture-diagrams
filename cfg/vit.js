/* ViT — Vision Transformer */
window.DIAGRAM={
 title:'Vision Transformer',
 subtitle:'An image is worth 16×16 words · patches as tokens',
 formula:'image → patches → linear embed → Transformer encoder → class',
 takeawaysSub:'how attention sees images · strengths · vs CNNs',
 arch:[
  {id:'in',t:'Input Image',s:'224 × 224 × 3',c:'amber',step:0},
  {id:'patch',t:'Split into Patches',s:'16×16 grid',c:'amber',step:1},
  {id:'embed',t:'Linear Patch Embedding',s:'flatten + project',c:'purple',step:2},
  {id:'cls',t:'[class] + Positional',s:'prepend token, add order',c:'cyan',step:3},
  {id:'enc',t:'Transformer Encoder ×L',s:'self-attention over patches',c:'blue',step:4},
  {id:'head',t:'MLP Head',s:'class from [class] token',c:'green',step:5},
 ],
 captions:[
  ['01 · The Idea','Treat an image like text','A Vision Transformer drops convolution entirely. It chops the image into patches and feeds them to a standard Transformer — as if each patch were a word.','no convolutions at all'],
  ['02 · Patchify','16×16 pixel tiles','The 224×224 image is split into a grid of non-overlapping 16×16 patches — 196 of them — each becoming one input token.','224/16 = 14×14 = 196 patches'],
  ['03 · Patch Embedding','Flatten and project','Each patch is flattened into a vector and linearly projected to the model dimension — exactly like a word embedding.','patch → flatten → Linear → d'],
  ['04 · Class Token + Position','Add identity and order','A learnable [class] token is prepended to collect the answer, and positional embeddings tell the model where each patch sat in the image.','+ [class], + positional'],
  ['05 · Transformer Encoder','Patches attend globally','Standard encoder layers let every patch attend to every other from the very first layer — global context with no receptive-field limits.','self-attention, all patches'],
  ['06 · Classify','Read the class token','After L layers, the [class] token’s vector is sent through a small MLP head to predict the image label.','[class] → MLP → label'],
 ],
 steps:[
  async function(){
   stageTitle('THE IDEA  ·  an image is a sequence of patches',C.a1);
   const img=el('g',{});for(let r=0;r<6;r++)for(let c=0;c<6;c++)el('rect',{x:130+c*40,y:130+r*40,width:38,height:38,fill:C.a1,'fill-opacity':(0.2+0.6*Math.abs(Math.sin(r*0.8+c*0.7))).toFixed(2),stroke:C.bg,'stroke-width':1},img);
   img.setAttribute('opacity',0);await fade(img,1,500);
   const arrow=chip(420,250,90,50,'→',C.dim,{fs:24});await appear(arrow.g,300);
   for(let i=0;i<6;i++){const t=chip(560+i*60,250,52,52,'',C.a1,{fs:10});appear(t.g,200);await wait(70);}
   txt(700,210,'patches as “words”',{size:11,fill:C.a1,parent:gMain});
   txt(500,400,'a standard Transformer then processes them — like a sentence',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('PATCHIFY  ·  split into a 16×16 grid',C.a1);
   const gx=300,gy=110,n=7,cell=42;
   for(let r=0;r<n;r++)for(let c=0;c<n;c++){const v=(0.2+0.6*Math.abs(Math.sin(r*0.7+c*0.6))).toFixed(2);
     const rect=el('rect',{x:gx+c*cell,y:gy+r*cell,width:cell,height:cell,fill:C.a1,'fill-opacity':v,stroke:C.bg,'stroke-width':1.5,opacity:0});
     fade(rect,1,30);await wait(14);}
   // pop the grid into separated tiles
   await wait(200);
   txt(500,440,'14×14 = 196 non-overlapping patches, each one token',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('PATCH EMBEDDING  ·  flatten → linear → vector',C.purple);
   const patch=el('g',{});for(let r=0;r<4;r++)for(let c=0;c<4;c++)el('rect',{x:120+c*28,y:180+r*28,width:26,height:26,fill:C.a1,'fill-opacity':Math.abs(Math.sin(r+c*1.3)).toFixed(2),stroke:C.bg,'stroke-width':1},patch);
   await appear(patch,360);txt(176,160,'one 16×16 patch',{size:10,fill:C.a1,parent:gMain});
   const flat=el('g',{});for(let i=0;i<16;i++)el('rect',{x:300,y:130+i*16,width:40,height:13,rx:2,fill:C.a1,'fill-opacity':Math.abs(Math.sin(i)).toFixed(2)},flat);
   flat.setAttribute('opacity',0);await fade(flat,1,360);txt(320,118,'flatten',{size:10,fill:C.a1,parent:gMain});
   await flow(`M236,250 L300,250`,{color:C.a1,count:3,dur:420});
   const lin=chip(420,210,120,60,'Linear',C.purple,{fs:13});await appear(lin.g,300);await flow(`M340,250 L420,250`,{color:C.purple,count:2,dur:300});
   const emb=el('g',{});for(let i=0;i<10;i++)el('rect',{x:620,y:160+i*18,width:50,height:15,rx:2,fill:C.purple,'fill-opacity':(0.3+0.5*Math.abs(Math.sin(i*1.2))).toFixed(2)},emb);
   emb.setAttribute('opacity',0);await fade(emb,1,360);txt(645,148,'patch embedding',{size:10,fill:C.purple,parent:gMain});
   await flow(`M540,240 L620,240`,{color:C.purple,count:2,dur:300});
   txt(500,420,'identical to a word embedding — now it’s just a token',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('[class] TOKEN + POSITIONAL',C.cyan);
   const cls=chip(110,210,90,56,'[cls]',C.green,{fs:12,solid:true});await appear(cls.g,300);
   for(let i=0;i<7;i++){const t=chip(230+i*100,210,80,56,'p'+(i+1),C.purple,{fs:11});appear(t.g,180);
     const p=chip(230+i*100,300,80,40,'pos '+(i+1),C.a1,{fs:9});appear(p.g,180);
     await flow(`M${270+i*100},300 L${270+i*100},266`,{color:C.a1,count:1,dur:260,trail:false});}
   txt(155,300,'prepended',{size:9,fill:C.green,parent:gMain});
   txt(500,400,'[class] gathers the answer · positional restores spatial order',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('TRANSFORMER ENCODER  ·  patches attend globally',C.blue);
   const xs=[170,310,450,590,730,870];const cy=160;
   const cls=chip(40,cy-24,90,48,'[cls]',C.green,{fs:11,solid:true});await appear(cls.g,220);
   const nodes=xs.map((x,i)=>chip(x-38,cy-24,76,48,'p'+(i+1),C.blue,{fs:10,solid:true}));
   for(const n of nodes){appear(n.g,160);}await wait(200);
   // global attention: cls attends to all + a few cross links
   for(let i=0;i<6;i++)flow(curve(85,cy+24,xs[i],cy+24,0.5),{color:C.green,count:1,dur:700,r:2});
   for(let k=0;k<8;k++){const i=Math.floor(Math.random()*6),j=Math.floor(Math.random()*6);if(i!==j)flow(curve(xs[i],cy+24,xs[j],cy+24,0.5),{color:C.blue,count:1,dur:700,r:1.5});}
   await wait(750);
   txt(500,300,'no receptive-field limit — global context from layer 1',{size:12,fill:C.blue});
   txt(500,344,'×L identical encoder layers (attention + MLP + residual)',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('MLP HEAD  ·  read the [class] token',C.green);
   const cls=chip(140,210,140,64,'[class] vector',C.green,{fs:12,solid:true});await appear(cls.g,320);
   const mlp=chip(380,210,140,64,'MLP head',C.a1,{fs:13});await appear(mlp.g,300);await flow(`M280,242 L380,242`,{color:C.a1,count:2,dur:300});
   const classes=['cat','dog','bird'];const probs=[0.88,0.08,0.04];const bx=620;
   await flow(`M520,242 L620,242`,{color:C.green,count:2,dur:300});
   for(let i=0;i<3;i++){const w=probs[i]*280;const y=180+i*52;const hot=i===0;
     el('rect',{x:bx,y,width:0,height:36,rx:5,fill:hot?C.green:C.muted,opacity:0.85});const r=gMain.lastChild;
     txt(bx-12,y+24,classes[i],{size:12,fill:hot?C.green:C.dim,anchor:'end',parent:gMain});
     tween({dur:460,onUpdate:p=>r.setAttribute('width',w*p)});
     txt(bx+w+20,y+24,probs[i].toFixed(2),{size:11,fill:hot?C.green:C.muted,anchor:'start',parent:gMain});await wait(110);}
   txt(500,400,'only the class token’s output is used for the prediction',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Global context.','Every patch attends to every other from the first layer.'],
   ['Scales with data.','Surpasses CNNs given enough training images.'],
   ['Unified architecture.','Same Transformer as NLP — shared tooling & tricks.'],
   ['Flexible.','Naturally extends to multimodal and self-supervised setups.'],
  ],
  challenges:[
   ['Data-hungry.','Weak inductive bias — needs huge datasets or pre-training.'],
   ['Quadratic cost.','Attention over many patches is expensive at high resolution.'],
   ['Less efficient on small data.','CNNs win when labels are scarce.'],
   ['Patch boundaries.','Fixed patches can split fine details.'],
  ],
  uses:[
   ['Image classification.','ImageNet at scale, foundation vision models.'],
   ['Detection / segmentation.','DETR, Segment Anything (SAM).'],
   ['Multimodal.','CLIP, image-text models use ViT encoders.'],
   ['Self-supervised.','MAE, DINO learn strong features without labels.'],
  ],
  variants:[
   ['DeiT.','Data-efficient ViT trained on ImageNet alone.'],
   ['Swin Transformer.','Shifted windows → hierarchical, efficient.'],
   ['MAE.','Masked autoencoding for self-supervised pre-training.'],
   ['Hybrid.','CNN stem + Transformer body for data efficiency.'],
  ],
  compare:{cols:['ViT','CNN','Swin'],rows:[
   ['Inductive bias','Minimal','Strong (locality)','Moderate (windows)'],
   ['Receptive field','Global from layer 1','Local → grows','Local → global'],
   ['Data needs','High','Low–medium','Medium'],
   ['Cost at high-res','O(n²)','Efficient','Near-linear'],
   ['Best regime','Large-scale data','Small data','General vision'],
  ]},
  pitfalls:[
   ['Training from scratch on small data','— ViTs overfit; pre-train or use DeiT tricks.'],
   ['Forgetting positional embeddings','— the model loses all spatial layout.'],
   ['High-res without windowing','— attention cost explodes.'],
   ['Ignoring the [class] token role','— pooling choice affects accuracy.'],
  ],
 },
};

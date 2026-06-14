/* CLIP — Contrastive Language-Image Pre-training */
window.DIAGRAM={
 title:'CLIP',
 subtitle:'Contrastive image–text pre-training · one shared embedding space',
 formula:'maximise cosine similarity of matching image–text pairs',
 takeawaysSub:'how it links vision & language · strengths · its limits',
 arch:[
  {id:'pairs',t:'Image–Text Pairs',s:'400M from the web',c:'blue',step:0},
  {id:'ienc',t:'Image Encoder',s:'ViT / ResNet → vector',c:'blue',step:1},
  {id:'tenc',t:'Text Encoder',s:'Transformer → vector',c:'amber',step:2},
  {id:'space',t:'Shared Embedding Space',s:'images & text together',c:'green',step:3},
  {id:'contrast',t:'Contrastive Loss',s:'pull matches, push others',c:'purple',step:4},
  {id:'zero',t:'Zero-Shot Use',s:'classify with words',c:'cyan',step:5},
 ],
 captions:[
  ['01 · The Data','400M image–caption pairs','CLIP learns from the web: hundreds of millions of images paired with their alt-text captions. No manual labels — the caption is the label.','(image, text) pairs at scale'],
  ['02 · Image Encoder','Picture → vector','An image encoder (ViT or ResNet) maps each image to a single embedding vector that summarises its content.','image → embedding'],
  ['03 · Text Encoder','Caption → vector','In parallel, a Transformer text encoder maps each caption to a vector of the same dimensionality.','text → embedding'],
  ['04 · Shared Space','One space for both','Both encoders project into the same embedding space, so an image and its caption can be compared directly with a dot product.','same space, comparable'],
  ['05 · Contrastive Loss','Pull matches together','In a batch of N pairs, the loss pulls each image toward its caption and pushes it away from all the others — a giant matching game.','match → high · mismatch → low'],
  ['06 · Zero-Shot','Classify with sentences','At test time, turn labels into sentences (“a photo of a dog”), embed them, and pick the closest to the image — classification with no training.','no fine-tuning needed'],
 ],
 steps:[
  async function(){
   stageTitle('WEB-SCALE PAIRS  ·  image + its caption',C.blue);
   const pairs=[['🖼 cat','“a photo of a cat”',180],['🖼 car','“a red sports car”',270],['🖼 dog','“a dog on grass”',360]];
   for(const[img,cap,y] of pairs){const i=chip(150,y,150,52,img,C.blue,{fs:13});const t=chip(420,y,360,52,cap,C.a1,{fs:12,tc:C.text});
     await appear(i.g,220);appear(t.g,220);await flow(`M300,${y+26} L420,${y+26}`,{color:C.green,count:1,dur:300,trail:false});}
   txt(500,430,'400M pairs scraped from the web — the caption IS the label',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('IMAGE ENCODER  ·  picture → vector',C.blue);
   const img=el('g',{});for(let r=0;r<6;r++)for(let c=0;c<6;c++){const f=(r-3)*(r-3)+(c-3)*(c-3)<7;el('rect',{x:120+c*28,y:170+r*28,width:26,height:26,fill:f?C.blue:C.bg2,'fill-opacity':f?0.7:0.25},img);}
   await appear(img,360);
   const enc=chip(360,205,150,80,'ViT / ResNet',C.blue,{fs:13});await appear(enc.g,320);await flow(`M288,250 L360,250`,{color:C.blue,count:3,dur:420});
   const v=el('g',{});for(let i=0;i<10;i++)el('rect',{x:600,y:160+i*18,width:60,height:15,rx:2,fill:C.blue,'fill-opacity':(0.3+0.5*Math.abs(Math.sin(i*1.3))).toFixed(2)},v);
   v.setAttribute('opacity',0);await flow(`M510,250 L600,250`,{color:C.blue,count:2,dur:300});await fade(v,1,360);
   txt(630,355,'image embedding',{size:11,fill:C.blue,parent:gMain});
  },
  async function(){
   stageTitle('TEXT ENCODER  ·  caption → vector',C.a1);
   const cap=chip(110,210,300,56,'“a photo of a cat”',C.a1,{fs:14,solid:true});await appear(cap.g,320);
   const enc=chip(470,205,150,80,'Transformer',C.a1,{fs:13});await appear(enc.g,320);await flow(`M410,238 L470,238`,{color:C.a1,count:3,dur:420});
   const v=el('g',{});for(let i=0;i<10;i++)el('rect',{x:710,y:160+i*18,width:60,height:15,rx:2,fill:C.a1,'fill-opacity':(0.3+0.5*Math.abs(Math.cos(i*1.3))).toFixed(2)},v);
   v.setAttribute('opacity',0);await flow(`M620,245 L710,245`,{color:C.a1,count:2,dur:300});await fade(v,1,360);
   txt(740,355,'text embedding',{size:11,fill:C.a1,parent:gMain});
   txt(500,430,'same dimensionality as the image vector — by design',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('SHARED EMBEDDING SPACE',C.green);
   const cx=500,cy=250;el('circle',{cx,cy,r:180,fill:C.green,'fill-opacity':0.03,stroke:C.green,'stroke-width':1,'stroke-dasharray':'4 4'});
   const items=[['🖼',C.blue,420,200],['“cat”',C.a1,460,215],['🖼',C.blue,650,300],['“car”',C.a1,690,310],['🖼',C.blue,500,360],['“dog”',C.a1,540,355]];
   for(const[lbl,col,x,y] of items){const c=el('circle',{cx:x,cy:y,r:8,fill:col,opacity:0});gMain.appendChild(c);fade(c,1,260);txt(x,y-14,lbl,{size:10,fill:col,parent:gMain});await wait(80);}
   // matched pairs close
   el('line',{x1:430,y1:205,x2:455,y2:213,stroke:C.green,'stroke-width':1.5});
   txt(500,460,'matching images and captions land close together',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('CONTRASTIVE LOSS  ·  the matching matrix',C.purple);
   const imgs=['🖼cat','🖼car','🖼dog','🖼fox'];const txts=['“cat”','“car”','“dog”','“fox”'];
   const gx=320,gy=130,cell=60;
   txts.forEach((t,c)=>txt(gx+c*cell+cell/2,gy-10,t,{size:9,fill:C.a1}));
   imgs.forEach((t,r)=>txt(gx-12,gy+r*cell+cell/2+3,t,{size:9,fill:C.blue,anchor:'end'}));
   for(let r=0;r<4;r++)for(let c=0;c<4;c++){const match=r===c;const x=gx+c*cell,y=gy+r*cell;
     el('rect',{x,y,width:cell-4,height:cell-4,rx:5,fill:match?C.green:C.purple,'fill-opacity':0,stroke:C.line,'stroke-width':1});const rect=gMain.lastChild;
     tween({dur:240,onUpdate:p=>rect.setAttribute('fill-opacity',((match?0.7:0.15))*p)});
     if(match)txt(x+cell/2-2,y+cell/2,'✓',{size:14,fill:C.green});await wait(34);}
   txt(720,200,'diagonal = matches',{size:11,fill:C.green,parent:gMain});
   txt(720,230,'pull these UP',{size:11,fill:C.green,parent:gMain});
   txt(720,270,'off-diagonal =',{size:11,fill:C.purple,parent:gMain});
   txt(720,294,'mismatches — push DOWN',{size:11,fill:C.purple,parent:gMain});
   txt(500,440,'maximise similarity on the diagonal, minimise everywhere else',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('ZERO-SHOT  ·  classify with sentences',C.cyan);
   const img=el('g',{});for(let r=0;r<6;r++)for(let c=0;c<6;c++){const f=(r-3)*(r-3)+(c-3)*(c-3)<7;el('rect',{x:110+c*26,y:180+r*26,width:24,height:24,fill:f?C.blue:C.bg2,'fill-opacity':f?0.7:0.25},img);}
   await appear(img,300);txt(180,350,'new image',{size:11,fill:C.blue,parent:gMain});
   const cands=['“a photo of a dog”','“a photo of a cat”','“a photo of a car”'];const sims=[0.31,0.86,0.22];const bx=560;
   for(let i=0;i<3;i++){const y=180+i*54;const hot=i===1;const t=chip(330,y,200,40,'',hot?C.cyan:C.muted,{parent:gMain});txt(100,26,cands[i],{size:10,fill:hot?C.cyan:C.dim,parent:t.g});appear(t.g,220);
     await flow(`M290,242 L330,${y+20}`,{color:C.cyan,count:1,dur:240,trail:false});
     const w=sims[i]*230;el('rect',{x:bx,y:y+4,width:0,height:30,rx:4,fill:hot?C.cyan:C.muted,opacity:0.85});const r=gMain.lastChild;
     tween({dur:420,onUpdate:p=>r.setAttribute('width',w*p)});txt(bx+w+18,y+24,sims[i].toFixed(2),{size:11,fill:hot?C.cyan:C.muted,anchor:'start',parent:gMain});await wait(120);}
   txt(500,430,'pick the closest caption — classification with zero training examples',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Zero-shot transfer.','Classify new categories from words alone — no fine-tuning.'],
   ['Shared vision–language space.','Compare images and text directly.'],
   ['Web-scale, label-free.','Learns from natural captions, not curated labels.'],
   ['Versatile backbone.','Powers retrieval, captioning, and generative guidance.'],
  ],
  challenges:[
   ['Prompt sensitivity.','Wording of the label sentence affects accuracy.'],
   ['Inherits web bias.','Reflects biases and gaps in scraped data.'],
   ['Coarse understanding.','Weak at counting, spatial relations, fine detail.'],
   ['Compute to train.','Pre-training needs massive data and GPUs.'],
  ],
  uses:[
   ['Zero-shot classification.','Label anything with a sentence.'],
   ['Image/text search.','Retrieve images by text and vice-versa.'],
   ['Generative guidance.','Conditions Stable Diffusion, DALL·E.'],
   ['Moderation &amp; filtering.','Flagging content via similarity.'],
  ],
  variants:[
   ['OpenCLIP.','Open reproductions at larger scale.'],
   ['SigLIP.','Sigmoid loss — better small-batch training.'],
   ['EVA-CLIP.','Stronger vision encoders.'],
   ['BLIP / BLIP-2.','Adds captioning & VQA on top.'],
  ],
  compare:{cols:['CLIP','Supervised CNN','Captioning model'],rows:[
   ['Labels needed','None (web text)','Manual classes','Paired captions'],
   ['New classes','Zero-shot via text','Needs retraining','Generates text'],
   ['Output','Shared embedding','Class logits','Sentences'],
   ['Vision–language','Aligned','Vision only','Aligned'],
   ['Training data','400M pairs','Curated sets','Curated captions'],
  ]},
  pitfalls:[
   ['Single-word labels','— use “a photo of a {label}” prompts for accuracy.'],
   ['Expecting fine reasoning','— CLIP struggles with counts and relations.'],
   ['Distribution shift','— odd domains (X-rays, sketches) may need adaptation.'],
   ['Ignoring prompt ensembling','— averaging several templates boosts results.'],
  ],
 },
};

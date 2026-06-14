/* Transformer (full encoder-decoder) */
window.DIAGRAM={
 title:'Transformer',
 subtitle:'Encoder–decoder · self-attention · “Attention Is All You Need” (2017)',
 formula:'Encoder → Decoder · multi-head attention + feed-forward, stacked N×',
 takeawaysSub:'why it replaced RNNs · its costs · the model behind every LLM',
 arch:[
  {id:'in',type:'tokens',items:['Je','suis','étudiant'],step:0},
  {id:'pe',t:'Input Embedding + Positional',s:'tokens + order signal',c:'blue',step:1},
  {id:'enc',t:'Encoder ×N',s:'self-attn + FFN',c:'amber',step:2},
  {id:'dec',t:'Decoder ×N',s:'masked self-attn',c:'purple',step:3},
  {id:'cross',t:'Cross-Attention',s:'decoder attends to encoder',c:'cyan',step:4},
  {id:'ffn',t:'Feed-Forward + Residual',s:'+ LayerNorm',c:'green',step:5},
  {id:'out',t:'Linear + Softmax',s:'next-token probabilities',c:'outp',step:6},
 ],
 captions:[
  ['01 · Tokens In','Words become vectors','The sentence is split into tokens and each is mapped to an embedding vector. Here we translate French “Je suis étudiant” → English.','tokenise → embed'],
  ['02 · Positional Encoding','Inject word order','Attention is order-blind, so a positional signal is added to each embedding — giving the model a sense of sequence without recurrence.','x = embed(tok) + PE(pos)'],
  ['03 · The Encoder','Build rich context','Each encoder layer runs self-attention so every token mixes in information from all others, then a feed-forward network refines it. Stacked N times.','self-attention over the input'],
  ['04 · The Decoder','Generate left-to-right','The decoder produces the translation one token at a time, using masked self-attention so each position only sees tokens already generated.','masked: no peeking ahead'],
  ['05 · Cross-Attention','Look back at the source','Decoder queries attend to the encoder’s output keys/values — this is where the English words actually consult the French sentence.','Q from decoder · K,V from encoder'],
  ['06 · Residual + FFN','Stabilise & transform','Every sub-layer is wrapped in a residual connection and LayerNorm, then a position-wise feed-forward network adds capacity.','LayerNorm(x + Sublayer(x))'],
  ['07 · Output','Pick the next word','A final linear layer projects to the vocabulary and softmax turns it into probabilities — the highest becomes the next output token.','softmax(W·h) → “I am a student”'],
 ],
 steps:[
  async function(){
   stageTitle('TOKENISE & EMBED  ·  Je suis étudiant → vectors',C.blue);
   const toks=['Je','suis','étudiant'];const xs=[180,440,700];
   for(let i=0;i<3;i++){const t=chip(xs[i],120,130,48,'"'+toks[i]+'"',C.dim,{fs:13,tc:C.text});await appear(t.g,260);
     await flow(`M${xs[i]+65},168 L${xs[i]+65},250`,{color:C.blue,count:2,dur:420,trail:false});
     const v=el('g',{});for(let k=0;k<5;k++)el('rect',{x:xs[i]+12+k*22,y:255,width:18,height:60,rx:3,fill:C.blue,'fill-opacity':(0.3+0.5*Math.abs(Math.sin(i*2+k)))},v);
     v.setAttribute('opacity',0);fade(v,1,360);}
   txt(500,400,'each token → a learned embedding vector',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('POSITIONAL ENCODING  ·  inject word order',C.blue);
   const xs=[180,440,700];
   for(let i=0;i<3;i++){const e=chip(xs[i],150,130,56,'embed',C.blue,{fs:12});appear(e.g,240);
     const p=chip(xs[i],250,130,56,'PE('+i+')',C.a1,{fs:12});appear(p.g,240);}
   await wait(400);
   // sinusoid
   let path='M120,400 ';for(let x=0;x<=760;x+=8){const y=400-Math.sin(x/40)*26;path+='L'+(120+x)+','+y+' ';}
   const s=el('path',{d:path,fill:'none',stroke:C.a1,'stroke-width':1.6,opacity:0,'stroke-dasharray':900,'stroke-dashoffset':900});
   fade(s,0.9,400);tween({dur:1000,onUpdate:p=>s.setAttribute('stroke-dashoffset',900*(1-p))});
   for(let i=0;i<3;i++){await flow(`M${xs[i]+65},306 L${xs[i]+65},210`,{color:C.a1,count:2,dur:420,trail:false});}
   txt(500,360,'x = embedding + positional signal  (sin/cos of position)',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('ENCODER  ·  self-attention mixes every token',C.a1);
   const toks=['Je','suis','étudiant'];const xs=[260,500,740];const cy=160;
   const nodes=toks.map((t,i)=>chip(xs[i]-55,cy-26,110,52,t,C.a1,{fs:12,solid:true}));
   for(const n of nodes){await appear(n.g,240);}
   await wait(150);
   for(let i=0;i<3;i++)for(let j=0;j<3;j++){if(i!==j)flow(curve(xs[i],cy+26,xs[j],cy+26,0.5),{color:C.a1,count:1,dur:700,r:2});}
   await wait(700);
   const ffn=chip(360,300,280,56,'Feed-Forward Network',C.green,{fs:13});await appear(ffn.g,360);
   for(let i=0;i<3;i++)await flow(`M${xs[i]},${cy+26} L500,300`,{color:C.green,count:1,dur:420,trail:false});
   txt(500,410,'every token now carries context from the whole sentence  ·  ×N layers',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('DECODER  ·  masked self-attention (no peeking)',C.purple);
   const out=['I','am','a','?'];const xs=[180,360,540,720];const cy=180;
   const nodes=out.map((t,i)=>chip(xs[i]-50,cy-24,100,48,t,i===3?C.dim:C.purple,{fs:12,solid:i<3}));
   for(const n of nodes){await appear(n.g,220);}
   await wait(150);
   // masked: position i attends only to <= i
   for(let i=0;i<4;i++)for(let j=0;j<=i;j++){if(i!==j)flow(curve(xs[i],cy+24,xs[j],cy+24,0.6),{color:C.purple,count:1,dur:600,r:2});}
   // show mask grid
   const gx=720,gy=300;txt(790,288,'causal mask',{size:10,fill:C.purple,parent:gMain});
   for(let r=0;r<4;r++)for(let c=0;c<4;c++){el('rect',{x:gx+c*22,y:gy+r*22,width:20,height:20,rx:3,fill:c<=r?C.purple:C.bg2,'fill-opacity':c<=r?0.6:1,stroke:C.line,'stroke-width':1});}
   txt(380,330,'position 4 may only see positions 1–3',{size:12,fill:C.muted,parent:gMain});
   txt(380,366,'→ generation stays autoregressive',{size:12,fill:C.purple,parent:gMain});
   await wait(200);
  },
  async function(){
   stageTitle('CROSS-ATTENTION  ·  decoder consults the encoder',C.cyan);
   const enc=['Je','suis','étudiant'];const ex=[150,310,470];
   enc.forEach((t,i)=>{const c=chip(ex[i]-45,120,90,46,t,C.a1,{fs:11,solid:true});appear(c.g,240);});
   txt(310,100,'ENCODER output (K, V)',{size:10,fill:C.a1,parent:gMain});
   const dec=chip(720,250,180,60,'decoder “am”',C.purple,{fs:13,solid:true});await appear(dec.g,320);
   txt(810,228,'query Q',{size:10,fill:C.purple,parent:gMain});
   await wait(200);
   for(let i=0;i<3;i++){const hot=i===2;await flow(curve(720,275,ex[i],143,0.3),{color:hot?C.green:C.cyan,count:hot?4:2,dur:800,r:hot?3.2:2});}
   const res=chip(640,360,260,48,'→ aligns with “étudiant”',C.green,{fs:12});await appear(res.g,360);
   txt(330,300,'Q from decoder · K,V from encoder',{size:12,fill:C.muted,parent:gMain});
  },
  async function(){
   stageTitle('RESIDUAL + LAYERNORM + FFN',C.green);
   const x=chip(120,220,120,60,'x',C.dim,{fs:16});await appear(x.g,260);
   const sub=chip(330,220,170,60,'Sub-layer',C.a1,{fs:13});await appear(sub.g,280);
   await flow(`M240,250 L330,250`,{color:C.a1,count:2,dur:360});
   // residual skip
   const skip=el('path',{d:'M180,220 C180,120 560,120 560,210',fill:'none',stroke:C.green,'stroke-width':1.6,'stroke-dasharray':'5 4',opacity:0});fade(skip,1,400);
   txt(370,110,'residual connection  x +',{size:11,fill:C.green,parent:gMain});
   const add=chip(540,220,90,60,'⊕',C.green,{fs:22,solid:true});await appear(add.g,300);
   await flow(`M500,250 L540,250`,{color:C.a1,count:2,dur:300});
   await flow('M180,220 C180,120 560,120 560,210',{color:C.green,count:3,dur:800});
   const ln=chip(690,220,140,60,'LayerNorm',C.cyan,{fs:12});await appear(ln.g,300);
   await flow(`M630,250 L690,250`,{color:C.green,count:2,dur:300});
   txt(500,360,'LayerNorm(x + Sublayer(x)) — keeps deep stacks trainable',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('OUTPUT  ·  linear → softmax → next token',C.green);
   const h=chip(110,230,130,60,'decoder hₜ',C.purple,{fs:12,solid:true});await appear(h.g,280);
   const lin=chip(320,230,150,60,'Linear → |V|',C.a1,{fs:12});await appear(lin.g,280);
   await flow(`M240,260 L320,260`,{color:C.a1,count:2,dur:360});
   const words=['I','am','a','student','the'];const probs=[0.04,0.05,0.06,0.81,0.04];const bx=560;
   await flow(`M470,260 L560,260`,{color:C.green,count:2,dur:360});
   for(let i=0;i<5;i++){const w=probs[i]*300;const y=150+i*44;const hot=i===3;
     el('rect',{x:bx,y,width:0,height:30,rx:4,fill:hot?C.green:C.muted,opacity:0.85});const r=gMain.lastChild;
     txt(bx-12,y+21,words[i],{size:11,fill:hot?C.green:C.dim,anchor:'end',parent:gMain});
     tween({dur:500,onUpdate:p=>r.setAttribute('width',w*p)});
     txt(bx+w+22,y+21,probs[i].toFixed(2),{size:10,fill:hot?C.green:C.muted,anchor:'start',parent:gMain});await wait(80);}
   txt(500,420,'“student” wins → emitted, then fed back in to predict the next word',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Massively parallel.','The whole sequence is processed at once — ideal for GPU/TPU training.'],
   ['Long-range context.','Self-attention links any two tokens in one hop.'],
   ['Scales beautifully.','Quality keeps improving with more data, params, and compute.'],
   ['General purpose.','One architecture for text, vision, audio, code, and more.'],
  ],
  challenges:[
   ['Quadratic attention.','Cost grows O(n²) with sequence length.'],
   ['Data &amp; compute hungry.','Needs large corpora and big clusters to shine.'],
   ['Memory at inference.','The KV cache grows with context length.'],
   ['Positional handling.','Order must be injected and can limit length extrapolation.'],
  ],
  uses:[
   ['LLMs.','GPT, Claude, Gemini, LLaMA — decoder-only descendants.'],
   ['Translation &amp; NLU.','The original task; plus BERT-style encoders.'],
   ['Vision &amp; audio.','ViT, Whisper, speech and music models.'],
   ['Multimodal.','Text-image-audio models share the same backbone.'],
  ],
  variants:[
   ['Encoder-only (BERT).','Bidirectional understanding tasks.'],
   ['Decoder-only (GPT).','Autoregressive generation — todays LLMs.'],
   ['Efficient attention.','FlashAttention, sparse, linear for long context.'],
   ['MoE Transformers.','Sparsely-activated experts for huge capacity.'],
  ],
  compare:{cols:['Transformer','RNN/LSTM','CNN'],rows:[
   ['Context','Global, O(1) hops','Sequential, fading','Local receptive field'],
   ['Parallelism','Full','None','Full'],
   ['Cost in length n','O(n²·d)','O(n·d²)','O(n·k·d)'],
   ['Order handling','Positional encodings','Inherent','Relative'],
   ['Scaling','State-of-the-art','Limited','Strong for images'],
  ]},
  pitfalls:[
   ['Missing causal mask','in the decoder leaks future tokens during training.'],
   ['Forgetting positional encodings','— the model loses all sense of order.'],
   ['Post- vs pre-LayerNorm','placement strongly affects training stability.'],
   ['Underestimating KV-cache memory','at long context lengths.'],
  ],
 },
};

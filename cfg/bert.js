/* BERT — encoder-only, bidirectional */
window.DIAGRAM={
 title:'BERT',
 subtitle:'Bidirectional encoder · masked language modelling · understanding, not generation',
 formula:'pre-train: Masked-LM + Next-Sentence  →  fine-tune per task',
 takeawaysSub:'why bidirectional wins for understanding · strengths · vs GPT',
 arch:[
  {id:'in',type:'tokens',items:['[CLS]','the','[MASK]','sat'],hot:'[MASK]',step:0},
  {id:'emb',t:'Token + Segment + Position',s:'three embeddings summed',c:'amber',step:1},
  {id:'enc',t:'Bidirectional Encoder ×N',s:'see left AND right',c:'cyan',step:2},
  {id:'mlm',t:'Masked-LM Head',s:'predict the hidden word',c:'purple',step:3},
  {id:'cls',t:'[CLS] Pooled Output',s:'sentence representation',c:'green',step:4},
  {id:'ft',t:'Fine-tune per Task',s:'classify · tag · QA',c:'outp',step:5},
 ],
 captions:[
  ['01 · Mask Some Words','A fill-in-the-blank game','BERT is trained by hiding ~15% of tokens and asking the model to recover them. Here “cat” is replaced with [MASK].','15% of tokens → [MASK]'],
  ['02 · Three Embeddings','Token + segment + position','Each input is the sum of a token embedding, a segment embedding (sentence A/B), and a positional embedding.','E = E_tok + E_seg + E_pos'],
  ['03 · Bidirectional Encoder','Look both ways','Unlike GPT, BERT has no causal mask — every token attends to the entire sentence, left and right, building deep context.','full self-attention, both directions'],
  ['04 · Masked-LM','Predict the blank','The hidden state at the masked position is projected over the vocabulary. Because it sees both sides, “cat” is easy to recover.','softmax(W·h_[MASK]) → “cat”'],
  ['05 · [CLS] Token','One vector for the whole sentence','A special [CLS] token aggregates a sentence-level representation, used for classification tasks.','h_[CLS] → sentence embedding'],
  ['06 · Fine-tuning','One backbone, many tasks','Add a small task head and fine-tune: sentiment, NER, question answering, similarity — all from the same pre-trained encoder.','frozen knowledge → task head'],
 ],
 steps:[
  async function(){
   stageTitle('MASKED LANGUAGE MODELLING  ·  fill in the blank',C.a1);
   const toks=['the','cat','sat','on','the','mat'];const xs=[120,250,380,510,640,770];
   for(let i=0;i<6;i++){const masked=i===1;const c=chip(xs[i],210,118,52,masked?'[MASK]':toks[i],masked?C.a1:C.dim,{fs:12,tc:masked?C.a1:C.text,solid:masked});await appear(c.g,180);}
   await wait(300);
   const q=chip(150,330,260,52,'[MASK] = ?',C.a1,{fs:14,solid:true});await appear(q.g,300);
   await flow(curve(309,262,280,330,0.2),{color:C.a1,count:3,dur:600});
   txt(560,356,'model must recover the hidden word from BOTH sides',{size:12,fill:C.muted,parent:gMain});
  },
  async function(){
   stageTitle('INPUT EMBEDDINGS  ·  token + segment + position',C.a1);
   const toks=['[CLS]','the','[MASK]','sat'];const xs=[180,400,620,840].map(x=>x-60);
   const rows=[['token',C.a1,150],['segment',C.cyan,235],['position',C.purple,320]];
   for(let i=0;i<4;i++){txt(xs[i]+60,120,toks[i],{size:11,fill:C.dim,parent:gMain});}
   for(const[n,col,y] of rows){for(let i=0;i<4;i++){const c=chip(xs[i],y,120,46,n,col,{fs:10});appear(c.g,160);}txt(70,y+28,n,{size:10,fill:col,anchor:'end',parent:gMain});await wait(160);}
   await wait(150);
   for(let i=0;i<4;i++){const s=chip(xs[i],400,120,44,'⊕ sum',C.green,{fs:11});appear(s.g,200);
     [150,235,320].forEach(y=>flow(`M${xs[i]+60},${y+46} L${xs[i]+60},400`,{color:C.green,count:1,dur:300,trail:false}));}
   txt(500,475,'',{size:1});
  },
  async function(){
   stageTitle('BIDIRECTIONAL ENCODER  ·  attend left AND right',C.cyan);
   const toks=['[CLS]','the','[MASK]','sat'];const xs=[200,400,600,800];const cy=180;
   const nodes=toks.map((t,i)=>chip(xs[i]-58,cy-26,116,52,t,i===2?C.a1:C.cyan,{fs:11,solid:i===2}));
   for(const n of nodes){await appear(n.g,200);}
   await wait(150);
   // full attention from [MASK] both directions, then all-to-all faint
   for(let i=0;i<4;i++)for(let j=0;j<4;j++){if(i!==j){const hot=(i===2||j===2);flow(curve(xs[i],cy+26,xs[j],cy+26,0.5),{color:hot?C.a1:C.cyan,count:1,dur:700,r:hot?2.6:1.6});}}
   await wait(750);
   txt(500,300,'no causal mask → every token sees the whole sentence',{size:12,fill:C.cyan});
   txt(500,344,'that’s why “[MASK]” can use “sat” (to its right) as a clue',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('MASKED-LM HEAD  ·  recover the hidden word',C.purple);
   const h=chip(110,225,150,60,'h_[MASK]',C.a1,{fs:13,solid:true});await appear(h.g,280);
   const lin=chip(330,225,150,60,'Linear → |V|',C.purple,{fs:12});await appear(lin.g,260);
   await flow(`M260,255 L330,255`,{color:C.purple,count:2,dur:300});
   const words=['cat','dog','man','car','it'];const probs=[0.79,0.08,0.05,0.04,0.04];const bx=590;
   await flow(`M480,255 L590,255`,{color:C.green,count:2,dur:300});
   for(let i=0;i<5;i++){const w=probs[i]*300;const y=140+i*46;const hot=i===0;
     el('rect',{x:bx,y,width:0,height:32,rx:4,fill:hot?C.green:C.muted,opacity:0.85});const r=gMain.lastChild;
     txt(bx-12,y+22,words[i],{size:12,fill:hot?C.green:C.dim,anchor:'end',parent:gMain});
     tween({dur:460,onUpdate:p=>r.setAttribute('width',w*p)});
     txt(bx+w+20,y+22,probs[i].toFixed(2),{size:10,fill:hot?C.green:C.muted,anchor:'start',parent:gMain});await wait(80);}
   txt(500,420,'loss is computed only on masked positions',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('[CLS] TOKEN  ·  one vector for the sentence',C.green);
   const toks=['[CLS]','the','cat','sat'];const xs=[200,400,600,800];const cy=160;
   toks.forEach((t,i)=>{const c=chip(xs[i]-55,cy-24,110,48,t,i===0?C.green:C.cyan,{fs:11,solid:i===0});appear(c.g,220);});
   await wait(300);
   for(let i=1;i<4;i++)await flow(curve(xs[i],cy+24,xs[0],cy+24,0.5),{color:C.green,count:2,dur:560});
   const pooled=el('g',{});for(let k=0;k<10;k++)el('rect',{x:280+k*28,y:300,width:24,height:54,rx:4,fill:C.green,'fill-opacity':(0.3+0.5*Math.abs(Math.sin(k*1.4)))},pooled);
   pooled.setAttribute('opacity',0);await fade(pooled,1,400);
   await flow(`M200,${cy+24} L500,300`,{color:C.green,count:2,dur:420,trail:false});
   txt(500,400,'h_[CLS] summarises the sentence for classification',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('FINE-TUNING  ·  one backbone, many heads',C.green);
   const bert=chip(370,120,260,64,'Pre-trained BERT',C.cyan,{fs:14,solid:true});await appear(bert.g,360);
   const tasks=[['Sentiment',C.a1,120],['NER tags',C.purple,370],['Q & A span',C.green,620],['Similarity',C.blue,...[120]]];
   const xs=[130,370,610];const names=['Sentiment','NER tagging','Question Answering'];const cols=[C.a1,C.purple,C.green];
   for(let i=0;i<3;i++){await flow(`M500,184 C500,250 ${xs[i]+110},250 ${xs[i]+110},310`,{color:cols[i],count:2,dur:600});
     const h=chip(xs[i],310,220,56,names[i],cols[i],{fs:12});await appear(h.g,260);}
   txt(500,420,'add a small task head + fine-tune — knowledge transfers',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Bidirectional context.','Sees both sides of every word — superior for understanding.'],
   ['Transfer learning.','Pre-train once, fine-tune cheaply on many tasks.'],
   ['Strong on NLU.','State-of-the-art classification, NER, QA when released.'],
   ['Rich embeddings.','[CLS] and token vectors power search and similarity.'],
  ],
  challenges:[
   ['Not generative.','Cannot fluently produce long text — it fills blanks.'],
   ['Pre-train/fine-tune gap.','[MASK] never appears at fine-tune or inference time.'],
   ['Compute heavy.','Large encoders are costly to pre-train.'],
   ['Fixed length.','Capped context (typically 512 tokens).'],
  ],
  uses:[
   ['Search &amp; ranking.','Query/document relevance (e.g. web search).'],
   ['Classification.','Sentiment, intent, toxicity, spam.'],
   ['Token tasks.','Named-entity recognition, POS tagging.'],
   ['Embeddings.','Semantic similarity, clustering, retrieval.'],
  ],
  variants:[
   ['RoBERTa.','Better-trained BERT — more data, no NSP.'],
   ['DistilBERT.','40% smaller, ~60% faster, ~97% of accuracy.'],
   ['ALBERT.','Parameter sharing for a lighter model.'],
   ['DeBERTa / ELECTRA.','Disentangled attention; replaced-token detection.'],
  ],
  compare:{cols:['BERT','GPT','ELECTRA'],rows:[
   ['Direction','Bidirectional','Left-to-right','Bidirectional'],
   ['Objective','Masked-LM','Next-token','Replaced-token detection'],
   ['Best at','Understanding','Generation','Efficient pre-training'],
   ['Generates text?','No','Yes','No'],
   ['Typical size','110M–340M','1B–1T+','110M–335M'],
  ]},
  pitfalls:[
   ['Using [CLS] untrained','— its embedding is weak until fine-tuned on the task.'],
   ['Exceeding 512 tokens','— inputs are silently truncated.'],
   ['Expecting generation','— BERT is an encoder, not a text generator.'],
   ['Domain mismatch','— pre-training corpus may not fit specialised jargon.'],
  ],
 },
};

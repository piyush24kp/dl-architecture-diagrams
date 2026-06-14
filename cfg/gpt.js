/* GPT — decoder-only autoregressive LM */
window.DIAGRAM={
 title:'GPT',
 subtitle:'Decoder-only Transformer · autoregressive next-token prediction',
 formula:'P(x₁…xₙ) = Πₜ P(xₜ | x₁…xₜ₋₁)',
 takeawaysSub:'how it generates text · strengths · limits of autoregression',
 arch:[
  {id:'in',type:'tokens',items:['The','sky','is'],step:0},
  {id:'emb',t:'Token + Positional Embedding',s:'+ order',c:'amber',step:1},
  {id:'mask',t:'Masked Self-Attention',s:'look only at the past',c:'purple',step:2},
  {id:'block',t:'Decoder Block ×N',s:'attn + MLP + residual',c:'cyan',step:3},
  {id:'head',t:'LM Head · softmax',s:'vocabulary probabilities',c:'green',step:4},
  {id:'loop',t:'Autoregressive Loop ↺',s:'append & repeat',c:'outp',step:5},
 ],
 captions:[
  ['01 · The Prompt','Predict the next token','GPT is a decoder-only Transformer trained on one job: given the tokens so far, predict the next one. Here the prompt is “The sky is”.','given context → next token'],
  ['02 · Embeddings','Tokens + position','Each token becomes an embedding and a positional vector is added so the model knows the order — no recurrence needed.','x = tokEmb + posEmb'],
  ['03 · Masked Attention','Only look backwards','A causal mask blocks every position from attending to future tokens. That keeps prediction honest — the model can’t see the answer.','token t attends to ≤ t'],
  ['04 · Decoder Blocks','Stacked attention + MLP','Dozens of identical blocks (masked attention + a big MLP, each with residual + norm) refine the representation. Depth is where capability comes from.','×N blocks, residual stream'],
  ['05 · LM Head','Score every word','The final hidden state is projected onto the whole vocabulary and softmax turns it into probabilities. “blue” gets the highest.','softmax(W·hₜ) over |V|'],
  ['06 · Autoregression','Append and repeat','The chosen token is appended to the input and the whole process runs again — generating text one token at a time, left to right.','sample → append → repeat'],
 ],
 steps:[
  async function(){
   stageTitle('NEXT-TOKEN PREDICTION  ·  the only objective',C.a1);
   const ctx=chip(120,210,330,72,'“The sky is ___”',C.a1,{fs:18,solid:true});await appear(ctx.g,420);
   const q=chip(640,210,240,72,'next token = ?',C.green,{fs:16});await appear(q.g,360);
   await flow(curve(450,246,640,246,0.2),{color:C.a1,count:4,dur:800});
   txt(500,330,'trained on trillions of tokens doing exactly this',{size:12,fill:C.muted});
   txt(500,372,'P(x₁…xₙ) = Πₜ P(xₜ | x₁…xₜ₋₁)',{size:13,fill:C.a2});
  },
  async function(){
   stageTitle('EMBEDDINGS  ·  token + positional',C.a1);
   const toks=['The','sky','is'];const xs=[200,460,720];
   for(let i=0;i<3;i++){const t=chip(xs[i],110,120,46,'"'+toks[i]+'"',C.dim,{fs:13,tc:C.text});await appear(t.g,220);
     const te=chip(xs[i],190,120,44,'tokEmb',C.a1,{fs:11});appear(te.g,220);
     const pe=chip(xs[i],250,120,44,'pos '+i,C.purple,{fs:11});appear(pe.g,220);
     const add=chip(xs[i],325,120,48,'⊕',C.cyan,{fs:18,solid:true});appear(add.g,260);
     await flow(`M${xs[i]+60},234 L${xs[i]+60},325`,{color:C.a1,count:2,dur:360,trail:false});
     await flow(`M${xs[i]+60},294 L${xs[i]+60},325`,{color:C.purple,count:1,dur:300,trail:false});}
   txt(500,420,'sum feeds the residual stream',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('CAUSAL MASK  ·  no peeking at the future',C.purple);
   const toks=['The','sky','is','blue'];const n=4,cell=58,gx=300,gy=110,gap=5;
   toks.forEach((t,c)=>txt(gx+c*(cell+gap)+cell/2,gy-12,t,{size:10,fill:C.muted}));
   toks.forEach((t,r)=>txt(gx-12,gy+r*(cell+gap)+cell/2+3,t,{size:10,fill:C.muted,anchor:'end'}));
   for(let r=0;r<n;r++)for(let c=0;c<n;c++){const allow=c<=r;const x=gx+c*(cell+gap),y=gy+r*(cell+gap);
     el('rect',{x,y,width:cell,height:cell,rx:5,fill:allow?C.purple:C.bg2,'fill-opacity':allow?0.55:1,stroke:allow?C.purple:C.red,'stroke-width':allow?1:1.2,'stroke-opacity':allow?1:0.4});
     txt(x+cell/2,y+cell/2+4,allow?'✓':'✕',{size:13,fill:allow?C.green:C.red});await wait(28);}
   txt(660,250,'upper triangle = masked',{size:11,fill:C.red,parent:gMain});
   txt(660,286,'each token sees only itself',{size:11,fill:C.muted,parent:gMain});
   txt(660,310,'and the tokens before it',{size:11,fill:C.muted,parent:gMain});
  },
  async function(){
   stageTitle('DECODER BLOCKS  ·  the residual stream',C.cyan);
   const stream=el('line',{x1:160,y1:80,x2:160,y2:430,stroke:C.cyan,'stroke-width':3,opacity:0});fade(stream,1,400);
   txt(120,250,'residual',{size:10,fill:C.cyan,parent:gMain,anchor:'middle'});
   const blocks=[['Masked Attn',C.purple,120],['MLP',C.a1,210],['Masked Attn',C.purple,300],['MLP',C.a1,390]];
   for(const[n,col,y] of blocks){const b=chip(300,y-22,260,44,n,col,{fs:12});await appear(b.g,240);
     await flow(`M160,${y} L300,${y}`,{color:col,count:2,dur:300});
     await flow(`M560,${y} C640,${y} 640,${y} 160,${y}`,{color:col,count:1,dur:1,trail:false});}
   await flow(`M160,80 L160,430`,{color:C.green,count:5,dur:1100,r:3});
   txt(640,250,'each block reads & writes the stream',{size:11,fill:C.muted,parent:gMain});
   txt(640,286,'depth (N=12…96+) → capability',{size:11,fill:C.cyan,parent:gMain});
  },
  async function(){
   stageTitle('LM HEAD  ·  probability over the vocabulary',C.green);
   const h=chip(110,230,140,60,'final hₜ',C.cyan,{fs:13,solid:true});await appear(h.g,280);
   const lin=chip(320,230,150,60,'Linear → |V|',C.a1,{fs:12});await appear(lin.g,280);
   await flow(`M250,260 L320,260`,{color:C.a1,count:2,dur:300});
   const words=['blue','clear','falling','grey','the'];const probs=[0.74,0.10,0.05,0.07,0.04];const bx=580;
   await flow(`M470,260 L580,260`,{color:C.green,count:2,dur:300});
   for(let i=0;i<5;i++){const w=probs[i]*330;const y=140+i*46;const hot=i===0;
     el('rect',{x:bx,y,width:0,height:32,rx:4,fill:hot?C.green:C.muted,opacity:0.85});const r=gMain.lastChild;
     txt(bx-12,y+22,words[i],{size:12,fill:hot?C.green:C.dim,anchor:'end',parent:gMain});
     tween({dur:480,onUpdate:p=>r.setAttribute('width',w*p)});
     txt(bx+w+20,y+22,probs[i].toFixed(2),{size:10,fill:hot?C.green:C.muted,anchor:'start',parent:gMain});await wait(80);}
   txt(500,420,'sampling temperature / top-p decides how the winner is chosen',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('AUTOREGRESSIVE LOOP  ·  generate one token at a time',C.green);
   const seq=['The','sky','is'];const adds=['blue','today','—'];const baseY=200;
   let line=seq.join(' ');
   const box=chip(250,baseY,500,64,'"'+line+'"',C.a1,{fs:16,solid:true});await appear(box.g,360);
   for(let k=0;k<3;k++){
     await flow(curve(500,baseY+64,500,baseY+150,0),{color:C.green,count:3,dur:600});
     const pred=chip(390,baseY+150,220,52,'predict: “'+adds[k]+'”',C.green,{fs:13});await appear(pred.g,300);
     await wait(200);
     line+=' '+adds[k];box.label.textContent='"'+line+'"';
     tween({dur:300,onUpdate:p=>box.rect.setAttribute('stroke-width',1.5+2*Math.sin(p*Math.PI))});
     pred.g.remove();
   }
   txt(500,400,'append the token, feed it back, repeat — that’s generation',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Simple, scalable objective.','Just predict the next token — scales to trillions of tokens.'],
   ['Emergent abilities.','Reasoning, coding, translation appear with scale, unprogrammed.'],
   ['In-context learning.','Adapts from examples in the prompt — no weight updates.'],
   ['One model, many tasks.','A single decoder handles chat, code, summarisation, and more.'],
  ],
  challenges:[
   ['Sequential decoding.','Tokens are generated one at a time — latency grows with length.'],
   ['Hallucination.','Fluent text can be confidently wrong.'],
   ['Context limit & KV cache.','Memory and cost rise with context length.'],
   ['Exposure bias.','Trained on gold context, but at inference sees its own outputs.'],
  ],
  uses:[
   ['Chat assistants.','ChatGPT, Claude, Gemini.'],
   ['Code generation.','Copilot, code completion, agents.'],
   ['Writing &amp; summarising.','Drafting, rewriting, extraction.'],
   ['Reasoning &amp; tools.','Function calling, planning, RAG backends.'],
  ],
  variants:[
   ['Instruction-tuned.','SFT + RLHF/DPO for helpful, aligned responses.'],
   ['Long-context.','RoPE scaling, sliding windows for 100k+ tokens.'],
   ['MoE.','Sparse experts (Mixtral, GPT-4-class) for capacity.'],
   ['Multimodal.','Vision/audio tokens in the same stream (GPT-4o).'],
  ],
  compare:{cols:['GPT (decoder)','BERT (encoder)','Seq2Seq'],rows:[
   ['Attention','Causal (masked)','Bidirectional','Enc bi + dec causal'],
   ['Main use','Generation','Understanding','Translation'],
   ['Training','Next-token','Masked-token','Next-token (target)'],
   ['Sees future?','No','Yes','Decoder: no'],
   ['Output','Free text','Embeddings/labels','Target sequence'],
  ]},
  pitfalls:[
   ['Greedy decoding','can loop or go bland — tune temperature/top-p.'],
   ['Prompt injection','— untrusted text in context can hijack behaviour.'],
   ['Ignoring the context window','— silently truncated history breaks answers.'],
   ['Trusting outputs blindly','— always verify facts and code.'],
  ],
 },
};

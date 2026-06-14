/* RAG — Retrieval-Augmented Generation */
window.DIAGRAM={
 title:'Retrieval-Augmented Generation',
 subtitle:'Give the LLM an open book · ground answers in real documents',
 formula:'query → retrieve top-k chunks → stuff into prompt → generate',
 takeawaysSub:'how retrieval grounds LLMs · strengths · its failure modes',
 arch:[
  {id:'docs',t:'Documents',s:'your knowledge base',c:'blue',step:0},
  {id:'index',t:'Embed + Index',s:'vectors in a DB',c:'purple',step:1},
  {id:'query',t:'User Query',s:'embed the question',c:'amber',step:2},
  {id:'retrieve',t:'Retrieve Top-k',s:'nearest neighbours',c:'cyan',step:3},
  {id:'augment',t:'Augment Prompt',s:'context + question',c:'green',step:4},
  {id:'gen',t:'Generate (grounded)',s:'answer with citations',c:'outp',step:5},
 ],
 captions:[
  ['01 · The Problem','LLMs don’t know your data','A model’s knowledge is frozen at training time and can’t see your private or recent documents. RAG fixes this by retrieving relevant text at query time.','frozen weights ≠ your docs'],
  ['02 · Build the Index','Embed and store chunks','Documents are split into chunks, each embedded into a vector, and stored in a vector database. Similar meanings sit close together in this space.','chunk → embedding → vector DB'],
  ['03 · Embed the Query','Turn the question into a vector','When a question arrives it is embedded by the same model, producing a query vector to compare against everything in the index.','query → embedding'],
  ['04 · Retrieve','Find the nearest chunks','A nearest-neighbour search returns the top-k most similar chunks — the passages most likely to contain the answer.','top-k by cosine similarity'],
  ['05 · Augment','Stuff context into the prompt','The retrieved chunks are inserted into the prompt alongside the question, so the model answers from supplied evidence, not memory.','prompt = context + question'],
  ['06 · Generate','Grounded, cited answers','The LLM composes an answer using the provided passages — accurate, up-to-date, and able to cite its sources.','answer grounded in sources'],
 ],
 steps:[
  async function(){
   stageTitle('THE PROBLEM  ·  the model can’t see your data',C.a1);
   const llm=chip(360,150,280,80,'LLM (frozen)',C.muted,{fs:15,solid:true});await appear(llm.g,360);
   const q=chip(330,300,340,52,'“What’s in our Q3 internal report?”',C.a1,{fs:12});await appear(q.g,300);
   await flow(`M500,300 L500,230`,{color:C.a1,count:3,dur:500});
   const bad=chip(360,380,280,48,'🤷 “I don’t have access…”',C.red,{fs:12});await appear(bad.g,300);
   txt(820,190,'knowledge',{size:10,fill:C.muted,parent:gMain});txt(820,212,'frozen at',{size:10,fill:C.muted,parent:gMain});txt(820,234,'training time',{size:10,fill:C.muted,parent:gMain});
  },
  async function(){
   stageTitle('BUILD THE INDEX  ·  embed chunks into a vector DB',C.purple);
   const docs=chip(110,200,140,80,'documents',C.blue,{fs:12,solid:true});await appear(docs.g,300);
   const chunks=chip(310,210,120,60,'chunks',C.blue,{fs:12});await appear(chunks.g,260);await flow(`M250,240 L310,240`,{color:C.blue,count:2,dur:260});
   const emb=chip(490,210,120,60,'embed',C.purple,{fs:12});await appear(emb.g,260);await flow(`M430,240 L490,240`,{color:C.purple,count:2,dur:260});
   // vector cloud
   const cx=780,cy=240;el('circle',{cx,cy,r:90,fill:C.purple,'fill-opacity':0.04,stroke:C.purple,'stroke-width':1,'stroke-dasharray':'4 4'});
   await flow(`M610,240 L690,240`,{color:C.purple,count:2,dur:260});
   for(let i=0;i<16;i++){const a=Math.random()*6.28,rr=Math.random()*75;const c=el('circle',{cx:cx+Math.cos(a)*rr,cy:cy+Math.sin(a)*rr,r:3.5,fill:C.purple,opacity:0});gMain.appendChild(c);fade(c,0.8,200);await wait(40);}
   txt(780,360,'vector database',{size:11,fill:C.purple,parent:gMain});
   txt(400,400,'done once, offline — similar meanings cluster together',{size:12,fill:C.muted,parent:gMain});
  },
  async function(){
   stageTitle('EMBED THE QUERY  ·  same space as the docs',C.a1);
   const q=chip(120,220,260,60,'“Q3 revenue?”',C.a1,{fs:14,solid:true});await appear(q.g,320);
   const emb=chip(440,220,120,60,'embed',C.a1,{fs:13});await appear(emb.g,280);await flow(`M380,250 L440,250`,{color:C.a1,count:2,dur:260});
   const v=el('g',{});for(let i=0;i<10;i++)el('rect',{x:640,y:170+i*16,width:55,height:13,rx:2,fill:C.a1,'fill-opacity':(0.3+0.5*Math.abs(Math.sin(i*1.3))).toFixed(2)},v);
   v.setAttribute('opacity',0);await flow(`M560,250 L640,250`,{color:C.a1,count:2,dur:260});await fade(v,1,360);
   txt(668,360,'query vector',{size:11,fill:C.a1,parent:gMain});
   txt(500,420,'the question becomes a vector we can compare to every chunk',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('RETRIEVE  ·  nearest neighbours to the query',C.cyan);
   const cx=350,cy=240;el('circle',{cx,cy,r:140,fill:C.purple,'fill-opacity':0.03,stroke:C.purple,'stroke-width':1,'stroke-dasharray':'4 4'});
   const qx=cx,qy=cy;el('circle',{cx:qx,cy:qy,r:7,fill:C.a1});txt(qx,qy-16,'query',{size:10,fill:C.a1,parent:gMain});
   const pts=[];for(let i=0;i<18;i++){const a=Math.random()*6.28,rr=30+Math.random()*110;pts.push({x:qx+Math.cos(a)*rr,y:qy+Math.sin(a)*rr,d:rr});}
   pts.sort((p,q)=>p.d-q.d);
   for(let i=0;i<pts.length;i++){const top=i<3;const c=el('circle',{cx:pts[i].x,cy:pts[i].y,r:top?5.5:3.5,fill:top?C.cyan:C.muted,opacity:0});gMain.appendChild(c);fade(c,top?1:0.5,180);
     if(top){el('line',{x1:qx,y1:qy,x2:pts[i].x,y2:pts[i].y,stroke:C.cyan,'stroke-width':1.4,opacity:0.6});}await wait(40);}
   const list=chip(640,180,260,150,'',C.cyan,{parent:gMain});await appear(list.g,360);
   txt(20,34,'top-3 chunks:',{size:12,fill:C.cyan,parent:list.g,anchor:'start',weight:700});
   ['• “Q3 revenue was $4.2M…”','• “…up 18% YoY driven by…”','• “Operating margin rose to…”'].forEach((t,i)=>txt(20,64+i*30,t,{size:10.5,fill:C.dim,parent:list.g,anchor:'start'}));
   txt(360,420,'k most similar passages retrieved',{size:12,fill:C.muted,parent:gMain});
  },
  async function(){
   stageTitle('AUGMENT  ·  context + question → prompt',C.green);
   const ctx=chip(110,140,360,120,'',C.cyan,{parent:gMain});await appear(ctx.g,320);
   txt(20,30,'CONTEXT (retrieved):',{size:11,fill:C.cyan,parent:ctx.g,anchor:'start',weight:700});
   txt(20,58,'“Q3 revenue was $4.2M, up 18%…”',{size:10.5,fill:C.dim,parent:ctx.g,anchor:'start'});
   txt(20,84,'“Operating margin rose to 22%…”',{size:10.5,fill:C.dim,parent:ctx.g,anchor:'start'});
   const qq=chip(110,300,360,60,'',C.a1,{parent:gMain});await appear(qq.g,300);
   txt(20,36,'QUESTION: “What was Q3 revenue?”',{size:11,fill:C.a1,parent:qq.g,anchor:'start'});
   const arrow=chip(520,210,70,52,'→',C.dim,{fs:22});await appear(arrow.g,240);
   const prompt=chip(620,180,280,120,'final prompt',C.green,{fs:14,solid:true});await appear(prompt.g,320);
   await flow(`M470,200 L620,230`,{color:C.cyan,count:2,dur:360});await flow(`M470,330 L620,260`,{color:C.a1,count:2,dur:360});
   txt(500,420,'the model is handed the evidence — it no longer relies on memory',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('GENERATE  ·  grounded answer with citations',C.green);
   const prompt=chip(120,210,180,70,'augmented prompt',C.green,{fs:11,solid:true});await appear(prompt.g,300);
   const llm=chip(380,205,160,80,'LLM',C.cyan,{fs:15,solid:true});await appear(llm.g,300);await flow(`M300,245 L380,245`,{color:C.green,count:3,dur:360});
   const ans=chip(620,170,300,150,'',C.green,{parent:gMain});await flow(`M540,245 L620,245`,{color:C.cyan,count:3,dur:360});await appear(ans.g,360);
   txt(20,36,'“Q3 revenue was $4.2M,',{size:12,fill:C.text,parent:ans.g,anchor:'start'});
   txt(20,62,'up 18% year-over-year.”',{size:12,fill:C.text,parent:ans.g,anchor:'start'});
   txt(20,104,'📎 source: Q3_report.pdf, p.3',{size:10,fill:C.cyan,parent:ans.g,anchor:'start'});
   txt(500,420,'accurate, up-to-date, and traceable to a real document',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Up-to-date knowledge.','Answer from current or private data without retraining.'],
   ['Reduces hallucination.','Grounding in real passages improves factuality.'],
   ['Citable.','Answers can point to their sources.'],
   ['Cheap to update.','Change the documents, not the model weights.'],
  ],
  challenges:[
   ['Retrieval quality is everything.','Bad chunks → bad answers.'],
   ['Chunking &amp; context limits.','Splitting and fitting passages is fiddly.'],
   ['Latency &amp; cost.','Extra search + longer prompts per query.'],
   ['Stale or conflicting docs.','Garbage in the index misleads the model.'],
  ],
  uses:[
   ['Enterprise Q&amp;A.','Chat over internal wikis and policies.'],
   ['Customer support.','Answer from product docs and tickets.'],
   ['Research assistants.','Cite papers and reports.'],
   ['Personal knowledge.','Query your own notes and files.'],
  ],
  variants:[
   ['Hybrid search.','Combine keyword (BM25) + vector retrieval.'],
   ['Reranking.','A cross-encoder reorders the top results.'],
   ['HyDE / query rewriting.','Improve recall before searching.'],
   ['Agentic RAG.','Iterative retrieve-reason-retrieve loops.'],
  ],
  compare:{cols:['RAG','Fine-tuning','Long-context'],rows:[
   ['Adds new knowledge','At query time','At train time','In the prompt'],
   ['Update cost','Edit the index','Retrain','None'],
   ['Citations','Yes','No','Sometimes'],
   ['Best for','Facts / docs','Behaviour / style','Small, fixed corpora'],
   ['Hallucination','Lower (grounded)','Unchanged','Lower'],
  ]},
  pitfalls:[
   ['Poor chunking','— too big dilutes, too small loses context.'],
   ['Ignoring retrieval eval','— measure recall@k, not just the LLM.'],
   ['No reranking','— top-k by embedding alone can miss the best passage.'],
   ['Trusting blindly','— still verify; retrieval can surface wrong docs.'],
  ],
 },
};

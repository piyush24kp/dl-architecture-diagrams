/* AI Agent — reason, act, observe loop (ReAct) */
window.DIAGRAM={
 title:'AI Agent',
 subtitle:'Reason · Act · Observe · an LLM that uses tools in a loop',
 formula:'Thought → Action → Observation → … → Final Answer',
 takeawaysSub:'how LLMs take actions · strengths · why agents are hard',
 arch:[
  {id:'goal',t:'User Goal',s:'a task to accomplish',c:'amber',step:0},
  {id:'think',t:'Reason (Thought)',s:'plan the next step',c:'purple',step:1},
  {id:'act',t:'Act (Tool Call)',s:'search · code · API',c:'cyan',step:2},
  {id:'obs',t:'Observe (Result)',s:'feed output back',c:'green',step:3},
  {id:'loop',t:'Loop until Done ↺',s:'repeat reason→act',c:'blue',step:4},
  {id:'answer',t:'Final Answer',s:'goal accomplished',c:'outp',step:5},
 ],
 captions:[
  ['01 · The Goal','A task, not just a question','An agent is given an open-ended goal that may need several steps and external tools — not a single prompt it can answer from memory.','“Book the cheapest flight next Friday.”'],
  ['02 · Reason','Think before acting','The LLM writes a Thought: it reasons about the current state and decides what to do next. This explicit reasoning is the “brain” of the loop.','Thought: I should search flights first'],
  ['03 · Act','Call a tool','The agent emits an Action — a structured call to a tool: web search, a calculator, code execution, or an API. This is how it affects the world.','Action: search_flights(Fri)'],
  ['04 · Observe','Read the result','The tool runs and its output becomes an Observation fed back into the context. The agent now knows something it didn’t before.','Observation: 3 flights found'],
  ['05 · Loop','Repeat until solved','Reason → Act → Observe repeats. Each cycle adds information, letting the agent break a complex goal into a sequence of grounded steps.','think → act → observe → …'],
  ['06 · Final Answer','Stop when the goal is met','When the agent judges the goal is achieved, it exits the loop and returns a final answer — backed by the actions it actually took.','Final Answer: booked ✈️'],
 ],
 steps:[
  async function(){
   stageTitle('THE GOAL  ·  an open-ended task',C.a1);
   const g=chip(230,200,540,90,'“Book the cheapest flight next Friday”',C.a1,{fs:17,solid:true});await appear(g.g,420);
   const needs=['needs live data','multiple steps','external tools'];
   for(let i=0;i<3;i++){const n=chip(230+i*185,330,170,42,needs[i],C.muted,{fs:11});appear(n.g,260);await wait(110);}
   txt(500,420,'can’t be answered from memory — the agent must take actions',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('REASON  ·  the LLM plans its next move',C.purple);
   const brain=chip(360,120,280,80,'🧠 LLM',C.purple,{fs:16,solid:true});await appear(brain.g,360);
   const thought=chip(180,260,640,120,'',C.purple,{parent:gMain});await appear(thought.g,360);
   txt(24,34,'Thought:',{size:13,fill:C.purple,parent:thought.g,anchor:'start',weight:700});
   const line='“To find the cheapest flight, I first need to search';
   const t1=txt(110,34,'',{size:12,fill:C.text,parent:thought.g,anchor:'start'});
   await flow(`M500,200 L500,260`,{color:C.purple,count:2,dur:360});
   // typewriter
   for(let i=0;i<=line.length;i+=2){t1.textContent=line.slice(0,i);await wait(18);}
   txt(24,74,'available flights for next Friday.”',{size:12,fill:C.text,parent:thought.g,anchor:'start'});
   txt(500,430,'explicit reasoning decides what to do — and why',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('ACT  ·  call a tool',C.cyan);
   const agent=chip(110,210,150,70,'Agent',C.purple,{fs:14,solid:true});await appear(agent.g,300);
   const action=chip(330,215,250,60,'search_flights("Fri")',C.cyan,{fs:13,solid:true});await appear(action.g,300);
   await flow(`M260,245 L330,245`,{color:C.cyan,count:3,dur:360});
   const tools=[['🔍 Search',C.cyan,140],['🧮 Calculator',C.a1,250],['💻 Code',C.green,360]];
   for(let i=0;i<3;i++){const[n,col,y]=tools[i];const on=i===0;const t=chip(680,y-22,200,46,n,col,{fs:12,solid:on});await appear(t.g,220);}
   await flow(curve(580,245,680,140,0.3),{color:C.cyan,count:3,dur:500});
   txt(500,430,'the agent emits a structured Action → routed to the right tool',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('OBSERVE  ·  the result returns to context',C.green);
   const tool=chip(110,210,180,70,'🔍 flight API',C.cyan,{fs:13,solid:true});await appear(tool.g,300);
   const obs=chip(380,160,500,170,'',C.green,{parent:gMain});await appear(obs.g,360);
   txt(24,34,'Observation:',{size:13,fill:C.green,parent:obs.g,anchor:'start',weight:700});
   const rows=['1.  UA 482 — $214  (07:40)','2.  DL 119 — $189  (12:05)  ← cheapest','3.  AA 233 — $256  (18:20)'];
   for(let i=0;i<3;i++){await flow(`M290,245 L380,${200+i*10}`,{color:C.green,count:2,dur:260});txt(24,72+i*30,rows[i],{size:11.5,fill:i===1?C.green:C.dim,parent:obs.g,anchor:'start'});await wait(120);}
   txt(500,420,'the tool output is appended — the agent now knows the prices',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('THE LOOP  ·  reason → act → observe, repeat',C.blue);
   const cx=500,cy=250,r=140;
   const nodes=[['Reason',C.purple,-90],['Act',C.cyan,30],['Observe',C.green,150]];
   const pos=nodes.map(([n,col,deg])=>{const a=deg*Math.PI/180;return {x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r,n,col};});
   for(const p of pos){const c=chip(p.x-75,p.y-26,150,52,p.n,p.col,{fs:13,solid:true});await appear(c.g,260);}
   // arcs between them
   for(let i=0;i<3;i++){const a=pos[i],b=pos[(i+1)%3];await flow(`M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`,{color:b.col,count:3,dur:600,r:2.6});}
   for(let k=0;k<2;k++)for(let i=0;i<3;i++){const a=pos[i],b=pos[(i+1)%3];flow(`M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`,{color:b.col,count:2,dur:600,r:2});await wait(140);}
   txt(cx,cy+4,'↺',{size:30,fill:C.blue,parent:gMain});
   txt(500,440,'each cycle adds information until the goal can be met',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('FINAL ANSWER  ·  goal accomplished',C.green);
   const steps=['🧠 search flights','✅ found DL 119 ($189)','🧠 confirm it’s cheapest','✅ book it'];
   for(let i=0;i<4;i++){const s=chip(140,140+i*52,420,42,steps[i],i%2?C.green:C.purple,{fs:12,tc:i%2?C.green:C.purple});await appear(s.g,220);}
   const ans=chip(600,200,300,120,'',C.green,{parent:gMain});await appear(ans.g,400);
   txt(24,40,'Final Answer:',{size:13,fill:C.green,parent:ans.g,anchor:'start',weight:700});
   txt(24,76,'“Booked DL 119, Fri 12:05',{size:12,fill:C.text,parent:ans.g,anchor:'start'});
   txt(24,100,'for $189. ✈️”',{size:12,fill:C.text,parent:ans.g,anchor:'start'});
   txt(500,420,'the answer is backed by the actions the agent actually took',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Acts in the world.','Tools let it fetch live data, run code, and call APIs.'],
   ['Breaks down complexity.','Multi-step reasoning tackles goals one move at a time.'],
   ['Grounded.','Observations correct course and reduce hallucination.'],
   ['Extensible.','Add a tool and the agent gains a new capability.'],
  ],
  challenges:[
   ['Error compounding.','A wrong early step can derail the whole chain.'],
   ['Cost &amp; latency.','Many LLM calls and tool round-trips per task.'],
   ['Loops &amp; flailing.','Agents can get stuck repeating actions.'],
   ['Safety.','Tool access means real-world side effects and risk.'],
  ],
  uses:[
   ['Coding agents.','Plan, edit, run, and debug code.'],
   ['Research &amp; browsing.','Search, read, and synthesise across sources.'],
   ['Workflow automation.','Multi-app tasks and RPA.'],
   ['Customer ops.','Look up, decide, and act on requests.'],
  ],
  variants:[
   ['ReAct.','Interleaves reasoning traces with actions.'],
   ['Plan-and-Execute.','Plan all steps first, then carry them out.'],
   ['Reflexion.','Self-critiques and retries after failures.'],
   ['Multi-agent.','Specialised agents collaborate on subtasks.'],
  ],
  compare:{cols:['Agent','Plain LLM','RAG'],rows:[
   ['Takes actions','Yes (tools)','No','Retrieval only'],
   ['Multi-step','Yes (loop)','Single pass','Usually single'],
   ['External effects','Yes','No','Read-only'],
   ['Latency','High','Low','Medium'],
   ['Best for','Tasks &amp; workflows','Q&amp;A / text','Grounded answers'],
  ]},
  pitfalls:[
   ['No stop condition','— the agent loops forever; cap iterations.'],
   ['Over-trusting tools','— validate outputs before acting on them.'],
   ['Unbounded permissions','— sandbox actions with real side effects.'],
   ['Vague tool descriptions','— the model picks the wrong tool.'],
  ],
 },
};

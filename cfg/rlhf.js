/* RLHF — Reinforcement Learning from Human Feedback */
window.DIAGRAM={
 title:'RLHF',
 subtitle:'Reinforcement Learning from Human Feedback · aligning models with people',
 formula:'SFT  →  Reward Model (from human prefs)  →  PPO optimise',
 takeawaysSub:'how models learn human preferences · strengths · its pitfalls',
 arch:[
  {id:'sft',t:'① Supervised Fine-tune',s:'learn to follow instructions',c:'blue',step:0},
  {id:'pairs',t:'② Collect Comparisons',s:'humans rank responses',c:'amber',step:1},
  {id:'rm',t:'③ Reward Model',s:'predict human preference',c:'purple',step:2},
  {id:'ppo',t:'④ PPO Optimisation',s:'maximise reward',c:'green',step:3},
  {id:'kl',t:'KL Penalty',s:'stay near the SFT model',c:'red',step:4},
  {id:'aligned',t:'Aligned Model',s:'helpful · honest · harmless',c:'cyan',step:5},
 ],
 captions:[
  ['01 · Supervised Fine-tune','Teach the format first','RLHF starts from a model fine-tuned on human-written demonstrations, so it already answers in a helpful, instruction-following style.','SFT on demonstrations'],
  ['02 · Collect Comparisons','Humans rank outputs','For each prompt, the model generates several responses and people rank them best-to-worst. Comparisons are easier and more reliable than absolute scores.','A ≻ B ≻ C  (human ranking)'],
  ['03 · Train a Reward Model','Learn what people prefer','A separate model is trained on those rankings to output a scalar reward — a learned proxy for human judgement it can score any response with.','RM(prompt, response) → reward'],
  ['04 · Optimise with PPO','Chase higher reward','The language model becomes a policy: it generates, the reward model scores, and PPO nudges the weights to produce higher-rewarded responses.','maximise 𝔼[ RM(response) ]'],
  ['05 · KL Penalty','Don’t drift too far','A KL term keeps the policy close to the original SFT model — preventing it from gaming the reward model with weird, degenerate text.','reward − β·KL(π ‖ π_SFT)'],
  ['06 · The Aligned Model','Helpful, honest, harmless','The result follows instructions, refuses harmful requests, and matches human preferences — the difference between a raw LLM and an assistant.','a usable assistant'],
 ],
 steps:[
  async function(){
   stageTitle('① SUPERVISED FINE-TUNE  ·  learn the format',C.blue);
   const demo=chip(120,160,760,120,'',C.blue,{parent:gMain});await appear(demo.g,360);
   txt(30,34,'Prompt: “Explain gravity to a child.”',{size:12,fill:C.blue,parent:demo.g,anchor:'start'});
   txt(30,72,'Human answer: “Gravity is what pulls things down…”',{size:12,fill:C.dim,parent:demo.g,anchor:'start'});
   txt(30,100,'→ model imitates thousands of these',{size:11,fill:C.muted,parent:demo.g,anchor:'start'});
   await wait(200);
   txt(500,360,'now the model answers in a helpful style — but isn’t yet tuned to preferences',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('② COLLECT COMPARISONS  ·  humans rank responses',C.a1);
   const prompt=chip(360,90,280,50,'one prompt',C.a1,{fs:13,solid:true});await appear(prompt.g,300);
   const resps=[['Response A',C.green,'👍 best',180],['Response B',C.dim,'',260],['Response C',C.red,'👎 worst',340]];
   for(let i=0;i<3;i++){const[n,col,tag,y]=resps[i];await flow(`M500,140 L${300},${y+25}`,{color:C.a1,count:1,dur:300,trail:false});
     const r=chip(290,y,230,52,n,col,{fs:12});await appear(r.g,220);if(tag){txt(560,y+30,tag,{size:12,fill:col,parent:gMain});}}
   const rank=chip(680,230,200,60,'A ≻ B ≻ C',C.a2,{fs:15,tc:C.a2});await appear(rank.g,360);
   txt(500,430,'ranking is easier & more consistent than absolute scoring',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('③ REWARD MODEL  ·  predict human preference',C.purple);
   const a=chip(110,160,200,56,'Response A',C.green,{fs:12,solid:true});const b=chip(110,300,200,56,'Response B',C.dim,{fs:12});
   await appear(a.g,260);await appear(b.g,260);
   const rm=chip(420,210,170,90,'Reward Model',C.purple,{fs:13,solid:true});await appear(rm.g,320);
   await flow(`M310,188 L420,240`,{color:C.green,count:2,dur:360});await flow(`M310,328 L420,270`,{color:C.dim,count:2,dur:360});
   const sa=chip(680,165,150,52,'reward 8.4',C.green,{fs:13});const sb=chip(680,300,150,52,'reward 2.1',C.red,{fs:13});
   await flow(`M590,235 L680,191`,{color:C.purple,count:2,dur:300});await appear(sa.g,240);
   await flow(`M590,265 L680,326`,{color:C.purple,count:2,dur:300});await appear(sb.g,240);
   txt(500,420,'trained so preferred responses score higher — a proxy for human taste',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('④ PPO  ·  optimise the policy for reward',C.green);
   const policy=chip(110,210,170,80,'Policy (LLM)',C.green,{fs:13,solid:true});await appear(policy.g,300);
   const resp=chip(360,225,150,52,'response',C.a1,{fs:12});await appear(resp.g,260);await flow(`M280,250 L360,250`,{color:C.green,count:2,dur:300});
   const rm=chip(610,225,150,52,'Reward Model',C.purple,{fs:11});await appear(rm.g,260);await flow(`M510,250 L610,250`,{color:C.a1,count:2,dur:300});
   const reward=chip(820,225,110,52,'reward',C.a2,{fs:12});await appear(reward.g,240);await flow(`M760,250 L820,250`,{color:C.purple,count:2,dur:260});
   // feedback loop
   const loop=el('path',{d:'M875,225 C875,120 195,120 195,205',fill:'none',stroke:C.green,'stroke-width':1.6,'stroke-dasharray':'6 4',opacity:0});fade(loop,1,400);
   txt(500,110,'gradient update ↑ reward',{size:11,fill:C.green,parent:gMain});
   await flow('M875,225 C875,120 195,120 195,205',{color:C.green,count:4,dur:1000});
   txt(500,420,'generate → score → nudge weights toward higher-rewarded outputs',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('KL PENALTY  ·  don’t game the reward model',C.red);
   const sft=chip(150,210,180,70,'SFT model π_SFT',C.blue,{fs:12,solid:true});await appear(sft.g,300);
   const pol=chip(620,210,180,70,'policy π',C.green,{fs:13,solid:true});await appear(pol.g,300);
   // tether
   const tether=el('line',{x1:330,y1:245,x2:620,y2:245,stroke:C.red,'stroke-width':2,'stroke-dasharray':'5 4',opacity:0});fade(tether,1,400);
   txt(475,228,'KL leash',{size:11,fill:C.red,parent:gMain});
   await wait(300);
   // policy tries to drift, gets pulled back
   await tween({dur:700,onUpdate:p=>pol.g.setAttribute('transform',`translate(${30*Math.sin(p*9)},0)`)});
   pol.g.setAttribute('transform','translate(0,0)');
   txt(500,340,'reward − β·KL(π ‖ π_SFT)',{size:14,fill:C.a2});
   txt(500,400,'without it, the model finds gibberish that fools the reward model',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('THE ALIGNED MODEL  ·  helpful · honest · harmless',C.cyan);
   const m=chip(370,130,260,76,'Aligned Assistant',C.cyan,{fs:15,solid:true});await appear(m.g,400);
   const traits=[['✓ follows instructions',C.green,150],['✓ refuses harmful asks',C.green,400],['✓ matches preferences',C.green,640]];
   const xs=[120,400,650];const names=['follows instructions','refuses harmful asks','matches human prefs'];
   for(let i=0;i<3;i++){await flow(`M500,206 C500,260 ${xs[i]+115},260 ${xs[i]+115},300`,{color:C.green,count:2,dur:500});
     const t=chip(xs[i],300,230,54,'✓ '+names[i],C.green,{fs:12,tc:C.green});await appear(t.g,260);}
   txt(500,420,'the gap between a raw next-token predictor and a real assistant',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Captures fuzzy goals.','Learns “helpful” and “harmless” that are hard to hand-code.'],
   ['Strong alignment.','Dramatically improves usability over raw SFT.'],
   ['Scales feedback.','A reward model generalises limited human labels.'],
   ['Flexible control.','Reward shaping steers tone, safety, and style.'],
  ],
  challenges:[
   ['Reward hacking.','The policy exploits flaws in the reward model.'],
   ['Costly &amp; complex.','Human labels + a multi-stage RL pipeline.'],
   ['Annotator bias.','Preferences reflect the labellers, not everyone.'],
   ['Instability.','PPO is finicky; KL tuning is delicate.'],
  ],
  uses:[
   ['Chat assistants.','ChatGPT, Claude, Gemini alignment.'],
   ['Safety &amp; refusals.','Declining harmful or disallowed requests.'],
   ['Tone &amp; helpfulness.','Tuning style to user expectations.'],
   ['Summarisation.','Preference-tuned faithful summaries.'],
  ],
  variants:[
   ['DPO.','Skip the RL loop — optimise preferences directly.'],
   ['RLAIF.','AI-generated feedback instead of humans.'],
   ['Constitutional AI.','Self-critique against written principles.'],
   ['Rejection sampling / Best-of-N.','Pick the top-scored sample.'],
  ],
  compare:{cols:['RLHF','SFT only','DPO'],rows:[
   ['Signal','Human rankings','Demonstrations','Human rankings'],
   ['Uses RL loop','Yes (PPO)','No','No'],
   ['Complexity','High','Low','Medium'],
   ['Reward model','Required','None','Implicit'],
   ['Alignment quality','High','Moderate','High'],
  ]},
  pitfalls:[
   ['No KL penalty','— the policy drifts into reward-hacking gibberish.'],
   ['Over-optimising reward','— quality drops as RM is exploited.'],
   ['Biased/clashing labels','— inconsistent preferences confuse the RM.'],
   ['Skipping evals','— alignment gains can hide capability regressions.'],
  ],
 },
};

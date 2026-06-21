/* Diffusion model */
window.DIAGRAM={
 title:'Diffusion Models',
 subtitle:'Add noise, then learn to remove it · the engine of modern image generation',
 formula:'forward: add noise  ·  reverse: predict & subtract noise, T steps',
 takeawaysSub:'how denoising generates images · strengths · its main cost',
 arch:[
  {id:'x0',t:'Real Image x₀',s:'training sample',c:'green',step:0},
  {id:'fwd',t:'Forward Process',s:'add Gaussian noise',c:'red',step:1},
  {id:'noise',t:'Pure Noise x_T',s:'standard normal',c:'red',step:2},
  {id:'unet',t:'Denoiser (U-Net)',s:'predict the noise ε',c:'purple',step:3},
  {id:'rev',t:'Reverse Process',s:'subtract noise, T steps',c:'cyan',step:4},
  {id:'gen',t:'Generated Image',s:'clean sample',c:'green',step:5},
 ],
 captions:[
  ['01 · Start Clean','A real training image','Diffusion learns by destruction and repair. We begin with a real image x₀ from the dataset.','x₀ ~ data'],
  ['02 · Forward Process','Add noise, step by step','Over many steps we add small amounts of Gaussian noise. This “forward process” is fixed — no learning — and gradually erases the image.','xₜ = √(ᾱₜ)·x₀ + √(1−ᾱₜ)·ε'],
  ['03 · Pure Noise','Information fully destroyed','After T steps nothing remains but standard Gaussian noise. Crucially, this endpoint is something we can sample for free.','x_T ~ 𝒩(0, I)'],
  ['04 · The Denoiser','Learn to predict the noise','A U-Net is trained to look at a noisy image (and the timestep) and predict exactly what noise was added. That’s the only thing it learns.','ε_θ(xₜ, t) ≈ ε'],
  ['05 · Reverse Process','Subtract noise to generate','To create an image, start from pure noise and repeatedly predict-and-remove a little noise. Step by step a coherent image emerges.','xₜ → xₜ₋₁, t = T…1'],
  ['06 · The Sample','A brand-new image','After T reverse steps the noise has become a clean, novel image — never seen in training, drawn from the learned distribution.','x₀ generated'],
 ],
 steps:[
  async function(){
   stageTitle('START CLEAN  ·  a real image x₀',C.green);
   const g=el('g',{});for(let r=0;r<9;r++)for(let c=0;c<9;c++){const f=(r-4)*(r-4)+(c-4)*(c-4)<12;el('rect',{x:380+c*26,y:120+r*26,width:24,height:24,fill:f?C.green:C.bg2,'fill-opacity':f?0.7:0.25},g);}
   g.setAttribute('opacity',0);await fade(g,1,500);
   txt(500,400,'a clean sample from the training data',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('FORWARD PROCESS  ·  add noise step by step',C.red);
   const xs=[110,310,510,710];const noise=[0.15,0.45,0.75,1.0];
   for(let s=0;s<4;s++){const g=el('g',{opacity:0});gMain.appendChild(g);
     for(let r=0;r<7;r++)for(let c=0;c<7;c++){const f=(r-3)*(r-3)+(c-3)*(c-3)<8;const q=noise[s];
       el('rect',{x:xs[s]+c*24,y:160+r*24,width:22,height:22,fill:f?C.green:C.bg2,'fill-opacity':((f?0.7:0.25)*(1-q)+q*Math.random()).toFixed(2)},g);}
     txt(xs[s]+84,150,'t='+[0,'T/3','2T/3','T'][s],{size:10,fill:C.red,parent:g});
     await appear(g,360);if(s<3)await flow(`M${xs[s]+170},270 L${xs[s+1]},270`,{color:C.red,count:2,dur:340});}
   txt(500,420,'a FIXED schedule — no learning here, just controlled corruption',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('PURE NOISE  ·  x_T ~ 𝒩(0, I)',C.red);
   const g=el('g',{});for(let r=0;r<9;r++)for(let c=0;c<9;c++)el('rect',{x:380+c*26,y:120+r*26,width:24,height:24,fill:C.red,'fill-opacity':Math.random().toFixed(2)},g);
   g.setAttribute('opacity',0);await fade(g,1,400);
   for(let k=0;k<3;k++){await wait(200);g.querySelectorAll('rect').forEach(r=>r.setAttribute('fill-opacity',Math.random().toFixed(2)));}
   txt(500,400,'the image is gone — but we can sample this endpoint for free',{size:12,fill:C.cyan});
  },
  async function(){
   stageTitle('THE DENOISER  ·  U-Net predicts the noise ε',C.purple);
   const noisy=el('g',{});for(let r=0;r<6;r++)for(let c=0;c<6;c++)el('rect',{x:110+c*24,y:170+r*24,width:22,height:22,fill:C.red,'fill-opacity':Math.random().toFixed(2)},noisy);
   await appear(noisy,300);txt(176,330,'noisy xₜ',{size:11,fill:C.red,parent:gMain});
   const t=chip(110,360,150,42,'+ timestep t',C.a1,{fs:11});await appear(t.g,240);
   const unet=chip(360,205,170,90,'U-Net  ε_θ',C.purple,{fs:14,solid:true});await appear(unet.g,320);
   await flow(`M254,250 L360,250`,{color:C.red,count:3,dur:420});await flow(`M260,380 L360,290`,{color:C.a1,count:2,dur:360});
   const pred=el('g',{});for(let r=0;r<6;r++)for(let c=0;c<6;c++)el('rect',{x:640+c*24,y:170+r*24,width:22,height:22,fill:C.purple,'fill-opacity':Math.random().toFixed(2)},pred);
   pred.setAttribute('opacity',0);await flow(`M530,250 L640,250`,{color:C.purple,count:3,dur:420});await fade(pred,1,360);
   txt(706,330,'predicted noise ε',{size:11,fill:C.purple,parent:gMain});
   txt(500,420,'trained to answer one question: what noise was added?',{size:12,fill:C.muted});
  },
  async function(){
   // Pre-create grid cells; renderLevel() updates them in-place (no flicker)
   stageTitle('REVERSE PROCESS  ·  scrub through denoising',C.cyan);
   const n=9,noise_levels=[1.0,0.72,0.45,0.18,0.04];
   const cells=[];
   for(let r=0;r<n;r++)for(let c=0;c<n;c++){
     const f=(r-4)*(r-4)+(c-4)*(c-4)<12;
     const rect=el('rect',{x:380+c*26,y:120+r*26,width:24,height:24,fill:f?C.green:C.bg2,'fill-opacity':0});
     cells.push({rect,f,s:r*9+c});}
   const statusT=txt(500,380,'',{size:12,fill:C.cyan});
   const pctT=txt(500,406,'',{size:10,fill:C.muted});
   function renderLevel(idx){
     const nl=noise_levels[idx];
     cells.forEach(({rect,f,s})=>{const det=Math.abs(Math.sin(s*1.7+idx*2.3));
       const a=Math.max(0,Math.min(1,f?(0.72*(1-nl)+nl*det):(0.2*(1-nl)+nl*det*0.8)));
       rect.setAttribute('fill-opacity',a.toFixed(2));});
     statusT.textContent=['pure noise — image buried','mostly noise','taking shape','nearly there','clean — generation done'][idx];
     statusT.setAttribute('fill',[C.red,C.orange,C.a1,C.cyan,C.green][idx]);
     pctT.textContent=['100%','72%','45%','18%','4%'][idx]+' noise remaining';
     setScrubberActive(idx);}
   addScrubber({labels:['t=T  noise','t=¾T','t=½T','t=¼T','t=0  clean'],onScrub:renderLevel,initial:0});
   for(let i=0;i<5;i++){await tween({dur:360,ease:easeOut,onUpdate:p=>{const nl_f=noise_levels[Math.max(0,i-1)],nl_t=noise_levels[i];const nl=i===0?nl_t:nl_f+(nl_t-nl_f)*p;cells.forEach(({rect,f,s})=>{const det=Math.abs(Math.sin(s*1.7+i*2.3));const a=Math.max(0,Math.min(1,f?(0.72*(1-nl)+nl*det):(0.2*(1-nl)+nl*det*0.8)));rect.setAttribute('fill-opacity',a.toFixed(2));});}});renderLevel(i);await wait(200);}
  },
  async function(){
   stageTitle('THE SAMPLE  ·  a brand-new image',C.green);
   const g=el('g',{});for(let r=0;r<9;r++)for(let c=0;c<9;c++){const f=(r-4)*(r-4)+(c-4)*(c-4)<12;el('rect',{x:380+c*26,y:120+r*26,width:24,height:24,fill:f?C.green:C.bg2,'fill-opacity':0},g);}
   const rects=g.querySelectorAll('rect');gMain.appendChild(g);
   for(let i=0;i<rects.length;i++){const f=rects[i].getAttribute('fill')===C.green;tween({dur:300,onUpdate:p=>rects[i].setAttribute('fill-opacity',((f?0.7:0.25)*p).toFixed(2))});if(i%9===0)await wait(40);}
   txt(500,400,'never seen in training — sampled from the learned distribution',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['State-of-the-art quality.','The sharpest, most diverse image generation today.'],
   ['Stable training.','A simple noise-prediction regression — no adversarial game.'],
   ['Great mode coverage.','Captures the full data distribution, little collapse.'],
   ['Controllable.','Guidance and conditioning steer generation precisely.'],
  ],
  challenges:[
   ['Slow sampling.','Many denoising steps make generation costly.'],
   ['Compute heavy.','Training and inference need significant GPU time.'],
   ['Pixel-space cost.','High-resolution images are expensive (→ latent diffusion).'],
   ['Many steps to tune.','Schedules and samplers affect quality and speed.'],
  ],
  uses:[
   ['Text-to-image.','Stable Diffusion, DALL·E 3, Imagen, Midjourney.'],
   ['Editing &amp; inpainting.','Fill, extend, and modify images.'],
   ['Video &amp; 3D.','Sora-style video, audio, and 3D generation.'],
   ['Science.','Molecule and protein structure generation.'],
  ],
  variants:[
   ['DDIM.','Deterministic, far fewer sampling steps.'],
   ['Latent Diffusion.','Run in a VAE latent — the basis of Stable Diffusion.'],
   ['Classifier-free guidance.','Stronger prompt adherence.'],
   ['Consistency models.','One/few-step generation.'],
  ],
  compare:{cols:['Diffusion','GAN','VAE'],rows:[
   ['Sample quality','Highest','Sharp','Blurry'],
   ['Training stability','Stable','Unstable','Stable'],
   ['Sampling speed','Slow (many steps)','Fast','Fast'],
   ['Mode coverage','Excellent','Can collapse','Good'],
   ['Controllability','Excellent','Moderate','Moderate'],
  ]},
  pitfalls:[
   ['Too few steps','— images stay noisy; balance steps vs speed (or use DDIM).'],
   ['Bad noise schedule','— hurts both training and sample quality.'],
   ['Over-strong guidance','— oversaturated, less diverse outputs.'],
   ['Forgetting the timestep input','— the denoiser needs to know how noisy xₜ is.'],
  ],
 },
};

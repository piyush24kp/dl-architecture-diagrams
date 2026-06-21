/* Stable Diffusion — end to end latent text-to-image */
window.DIAGRAM={
 title:'Stable Diffusion',
 subtitle:'Latent diffusion · text-to-image · denoising in a compressed space',
 formula:'text → CLIP → denoise latent (U-Net + cross-attn) → VAE decode',
 takeawaysSub:'how a prompt becomes a picture · strengths · its trade-offs',
 arch:[
  {id:'prompt',t:'Text Prompt',s:'“a cat astronaut”',c:'amber',step:0},
  {id:'clip',t:'CLIP Text Encoder',s:'prompt → embeddings',c:'amber',step:1},
  {id:'latent',t:'Latent Noise',s:'64×64×4, not pixels',c:'purple',step:2},
  {id:'unet',t:'U-Net Denoiser',s:'+ cross-attention to text',c:'cyan',step:3},
  {id:'loop',t:'Sampling Loop',s:'denoise ~20–50 steps',c:'blue',step:4},
  {id:'vae',t:'VAE Decoder',s:'latent → full image',c:'green',step:5},
 ],
 captions:[
  ['01 · The Prompt','Words in, picture out','Stable Diffusion turns a text prompt into an image. The magic is doing all the heavy work in a small latent space, not on raw pixels.','“a cat astronaut, oil painting”'],
  ['02 · Text Encoder','Understand the words','A frozen CLIP text encoder converts the prompt into a sequence of embeddings that capture its meaning — the condition for generation.','prompt → text embeddings'],
  ['03 · Latent Space','Diffuse small, not big','Instead of a 512×512×3 image, generation happens in a 64×64×4 latent — ~48× smaller. This is why Stable Diffusion runs on consumer GPUs.','start from latent noise z_T'],
  ['04 · Cross-Attention','Steer noise with text','At each denoising step the U-Net cross-attends to the text embeddings, so the prompt guides which noise to remove — “cat” and “astronaut” take shape.','U-Net attends to text'],
  ['05 · Sampling Loop','Denoise, step by step','A sampler (DDIM, Euler…) repeats predict-and-subtract for ~20–50 steps. Classifier-free guidance strengthens how closely the result follows the prompt.','z_T → … → z₀, 20–50 steps'],
  ['06 · VAE Decode','Latent to pixels','Finally the VAE decoder expands the clean 64×64 latent back into a full-resolution image — the finished picture.','decode z₀ → 512×512 image'],
 ],
 steps:[
  async function(){
   stageTitle('TEXT-TO-IMAGE  ·  a prompt becomes a picture',C.a1);
   const p=chip(120,210,360,72,'“a cat astronaut”',C.a1,{fs:18,solid:true});await appear(p.g,400);
   const arrow=chip(520,222,80,46,'→',C.dim,{fs:24});await appear(arrow.g,260);
   const img=el('g',{});for(let r=0;r<7;r++)for(let c=0;c<7;c++){const f=(r-3)*(r-3)+(c-3)*(c-3)<7;el('rect',{x:640+c*30,y:130+r*30,width:28,height:28,fill:f?C.green:C.bg2,'fill-opacity':f?0.6:0.25},img);}
   img.setAttribute('opacity',0);await flow(curve(480,246,640,246,0.2),{color:C.a1,count:4,dur:700});await fade(img,1,400);
   txt(500,400,'all the heavy lifting happens in a compressed latent space',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('CLIP TEXT ENCODER  ·  prompt → embeddings',C.a1);
   const toks=['a','cat','astro','-naut'];const xs=[140,330,520,710];
   for(let i=0;i<4;i++){const t=chip(xs[i],130,150,46,'"'+toks[i]+'"',C.dim,{fs:12,tc:C.text});await appear(t.g,200);
     await flow(`M${xs[i]+75},176 L${xs[i]+75},230`,{color:C.a1,count:2,dur:300,trail:false});
     const e=el('g',{});for(let k=0;k<6;k++)el('rect',{x:xs[i]+12+k*22,y:235,width:18,height:50,rx:2,fill:C.a1,'fill-opacity':(0.3+0.5*Math.abs(Math.sin(i*2+k))).toFixed(2)},e);
     e.setAttribute('opacity',0);fade(e,1,300);}
   txt(500,370,'a frozen CLIP encoder — the same one used for image–text matching',{size:12,fill:C.muted});
   txt(500,410,'output conditions every denoising step',{size:12,fill:C.a1});
  },
  async function(){
   stageTitle('LATENT SPACE  ·  64×64×4, not 512×512×3',C.purple);
   const pix=el('g',{});for(let r=0;r<12;r++)for(let c=0;c<12;c++)el('rect',{x:120+c*15,y:150+r*15,width:13,height:13,fill:C.blue,'fill-opacity':Math.abs(Math.sin(r+c)).toFixed(2)},pix);
   await appear(pix,360);txt(210,350,'pixel image 512² (big)',{size:10,fill:C.blue,parent:gMain});
   const arrow=chip(360,250,80,44,'→',C.dim,{fs:20});await appear(arrow.g,240);
   const lat=el('g',{});for(let r=0;r<5;r++)for(let c=0;c<5;c++)el('rect',{x:520+c*30,y:200+r*30,width:28,height:28,fill:C.purple,'fill-opacity':Math.random().toFixed(2)},lat);
   lat.setAttribute('opacity',0);await fade(lat,1,360);txt(595,350,'latent 64² (≈48× smaller)',{size:10,fill:C.purple,parent:gMain});
   txt(820,250,'→ runs on a',{size:11,fill:C.muted,parent:gMain});txt(820,272,'single GPU',{size:11,fill:C.green,parent:gMain});
   txt(500,420,'we start from random noise directly in this latent space',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('CROSS-ATTENTION  ·  text steers the denoiser',C.cyan);
   const lat=el('g',{});for(let r=0;r<5;r++)for(let c=0;c<5;c++)el('rect',{x:120+c*30,y:190+r*30,width:28,height:28,fill:C.purple,'fill-opacity':(0.4+0.4*Math.random()).toFixed(2)},lat);
   await appear(lat,300);txt(195,360,'noisy latent',{size:10,fill:C.purple,parent:gMain});
   const unet=chip(400,200,170,110,'U-Net',C.cyan,{fs:15,solid:true});await appear(unet.g,320);
   await flow(`M270,255 L400,255`,{color:C.purple,count:3,dur:420});
   const text=chip(400,360,170,52,'text embeddings',C.a1,{fs:11});await appear(text.g,280);
   await flow(`M485,360 L485,310`,{color:C.a1,count:3,dur:360});
   txt(560,340,'cross-attention',{size:10,fill:C.a1,parent:gMain});
   const out=el('g',{});for(let r=0;r<5;r++)for(let c=0;c<5;c++){const f=(r-2)*(r-2)+(c-2)*(c-2)<4;el('rect',{x:720+c*30,y:190+r*30,width:28,height:28,fill:f?C.green:C.purple,'fill-opacity':(f?0.6:0.4).toFixed(2)},out);}
   out.setAttribute('opacity',0);await flow(`M570,255 L720,255`,{color:C.cyan,count:3,dur:420});await fade(out,1,360);
   txt(500,440,'the prompt decides which noise to remove — “cat” + “astronaut” emerge',{size:12,fill:C.muted});
  },
  async function(){
   // Scrubber version — latent grid updates in-place across sampling steps
   stageTitle('SAMPLING LOOP  ·  scrub through denoising steps',C.blue);
   const n=5,noise_levels=[1.0,0.7,0.42,0.18,0.06];
   const cells=[];
   for(let r=0;r<n;r++)for(let c=0;c<n;c++){
     const f=(r-2)*(r-2)+(c-2)*(c-2)<4;
     const rect=el('rect',{x:390+c*36,y:170+r*36,width:32,height:32,rx:5,fill:f?C.green:C.purple,'fill-opacity':0});
     cells.push({rect,f,s:r*5+c});}
   const statusT=txt(500,370,'',{size:12,fill:C.blue});
   const stepT=txt(500,396,'',{size:10,fill:C.muted});
   function renderSample(idx){
     const nl=noise_levels[idx];
     cells.forEach(({rect,f,s})=>{const det=Math.abs(Math.sin(s*1.9+idx*2.1));
       const a=Math.max(0,Math.min(1,f?(0.7*(1-nl)+nl*det*0.5):(0.45*(1-nl)+nl*det)));
       rect.setAttribute('fill-opacity',a.toFixed(2));});
     statusT.textContent=['random latent — no structure','weak shapes emerging','prompt taking hold','mostly coherent','clean latent — ready to decode'][idx];
     statusT.setAttribute('fill',[C.red,C.orange,C.a1,C.cyan,C.green][idx]);
     stepT.textContent=['step 1 / 50','step ~10','step ~20','step ~35','step 50  ·  CFG guided'][idx];
     setScrubberActive(idx);}
   const labels=['step 1','step 10','step 20','step 35','step 50'];
   addScrubber({labels,onScrub:renderSample,initial:0});
   for(let i=0;i<5;i++){await tween({dur:340,ease:easeOut,onUpdate:p=>{const nl_from=noise_levels[Math.max(0,i-1)],nl_to=noise_levels[i];const nl=i===0?nl_to:nl_from+(nl_to-nl_from)*p;cells.forEach(({rect,f,s})=>{const det=Math.abs(Math.sin(s*1.9+i*2.1));const a=Math.max(0,Math.min(1,f?(0.7*(1-nl)+nl*det*0.5):(0.45*(1-nl)+nl*det)));rect.setAttribute('fill-opacity',a.toFixed(2));});}});renderSample(i);await wait(180);}
   txt(500,440,'classifier-free guidance strengthens prompt adherence across all steps',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('VAE DECODE  ·  latent → full image',C.green);
   const lat=el('g',{});for(let r=0;r<5;r++)for(let c=0;c<5;c++){const f=(r-2)*(r-2)+(c-2)*(c-2)<4;el('rect',{x:120+c*30,y:200+r*30,width:28,height:28,fill:f?C.green:C.purple,'fill-opacity':0.55},lat);}
   await appear(lat,320);txt(195,370,'clean latent z₀',{size:10,fill:C.purple,parent:gMain});
   const dec=chip(350,215,120,80,'VAE dec',C.green,{fs:12});await appear(dec.g,300);await flow(`M270,255 L350,255`,{color:C.green,count:2,dur:300});
   const img=el('g',{});for(let r=0;r<11;r++)for(let c=0;c<11;c++){const f=(r-5)*(r-5)+(c-5)*(c-5)<16;el('rect',{x:560+c*16,y:140+r*16,width:14,height:14,fill:f?C.a1:C.bg2,'fill-opacity':f?0.7:0.25},img);}
   img.setAttribute('opacity',0);await flow(`M470,255 L560,255`,{color:C.green,count:2,dur:300});await fade(img,1,420);
   txt(648,330,'512×512 image',{size:11,fill:C.green,parent:gMain});
   txt(500,420,'the finished picture — decoded once, at the very end',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Efficient.','Latent diffusion runs on consumer GPUs, not data centres.'],
   ['High quality &amp; diverse.','Photoreal to painterly, broad concept coverage.'],
   ['Strong prompt control.','Cross-attention + guidance follow text closely.'],
   ['Open &amp; extensible.','ControlNet, LoRA, inpainting, img2img ecosystem.'],
  ],
  challenges:[
   ['Multi-step sampling.','Still 20–50 passes — slower than a GAN.'],
   ['Prompt sensitivity.','Wording and weights strongly affect results.'],
   ['Text &amp; hands.','Fine structure and legible text remain hard.'],
   ['Bias &amp; safety.','Inherits biases and misuse risks from training data.'],
  ],
  uses:[
   ['Art &amp; design.','Concept art, illustration, marketing assets.'],
   ['Editing.','Inpainting, outpainting, image-to-image.'],
   ['Controlled generation.','ControlNet poses, depth, edges.'],
   ['Personalisation.','LoRA / DreamBooth for custom subjects & styles.'],
  ],
  variants:[
   ['SDXL.','Larger, higher-fidelity base model.'],
   ['ControlNet.','Condition on pose, depth, edges, scribbles.'],
   ['LoRA / DreamBooth.','Lightweight fine-tuning for subjects/styles.'],
   ['Turbo / LCM.','Distilled few-step sampling for speed.'],
  ],
  compare:{cols:['Stable Diffusion','Pixel diffusion','GAN'],rows:[
   ['Works in','Latent (small)','Pixels (large)','One pass'],
   ['Compute','Consumer GPU','Heavy','Light'],
   ['Sampling','20–50 steps','Many steps','1 step'],
   ['Prompt control','Strong (cross-attn)','Strong','Weaker'],
   ['Quality/diversity','High','High','High but can collapse'],
  ]},
  pitfalls:[
   ['Guidance too high','— oversaturated, less diverse images.'],
   ['Too few steps','— soft, undercooked results.'],
   ['Negative prompts ignored','— configure them to remove artefacts.'],
   ['Resolution far from training','— composition breaks; tile or upscale.'],
  ],
 },
};

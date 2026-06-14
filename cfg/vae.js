/* VAE — Variational Autoencoder */
window.DIAGRAM={
 title:'Variational Autoencoder',
 subtitle:'Probabilistic encoder–decoder · a smooth, samplable latent space',
 formula:'ℒ = reconstruction − KL( q(z|x) ‖ 𝒩(0, I) )',
 takeawaysSub:'why it is probabilistic · strengths · vs GANs & diffusion',
 arch:[
  {id:'in',t:'Input x',s:'image / data',c:'blue',step:0},
  {id:'enc',t:'Encoder',s:'predict μ and σ',c:'blue',step:1},
  {id:'latent',t:'Latent Distribution',s:'𝒩(μ, σ²)',c:'purple',step:2},
  {id:'sample',t:'Reparameterise',s:'z = μ + σ⊙ε',c:'amber',step:3},
  {id:'dec',t:'Decoder',s:'z → reconstruction',c:'cyan',step:4},
  {id:'loss',t:'Recon + KL Loss',s:'fit + regularise',c:'green',step:5},
 ],
 captions:[
  ['01 · Input','Compress, but smartly','An autoencoder squeezes data through a bottleneck and reconstructs it. A VAE adds a twist: the bottleneck is a probability distribution, not a point.','x → ? → x̂'],
  ['02 · Encoder','Output a distribution','Instead of one latent vector, the encoder predicts a mean μ and a standard deviation σ for each latent dimension — a little Gaussian per input.','encoder(x) → μ, σ'],
  ['03 · Latent Distribution','A cloud, not a point','Each input maps to a Gaussian in latent space. Overlapping clouds make the space continuous — nearby points decode to similar images.','z ~ 𝒩(μ, σ²)'],
  ['04 · Reparameterisation','Make sampling differentiable','Sampling is random, which blocks gradients. The trick: draw ε from a fixed normal and compute z = μ + σ⊙ε, so gradients flow through μ and σ.','z = μ + σ ⊙ ε'],
  ['05 · Decoder','Rebuild from z','The decoder maps the sampled latent back to data space, reconstructing the input — and, for new z, generating fresh samples.','decoder(z) → x̂'],
  ['06 · The Loss','Reconstruct + regularise','Two terms: reconstruction error pulls x̂ toward x, and a KL term pulls each latent Gaussian toward 𝒩(0, I) — keeping the space smooth and samplable.','ℒ = recon − KL'],
 ],
 steps:[
  async function(){
   stageTitle('AUTOENCODER  ·  squeeze through a bottleneck',C.blue);
   const x=el('g',{});for(let r=0;r<6;r++)for(let c=0;c<6;c++)el('rect',{x:110+c*24,y:160+r*24,width:22,height:22,fill:C.blue,'fill-opacity':Math.abs(Math.sin(r+c)).toFixed(2)},x);
   await appear(x,360);txt(176,330,'input x',{size:11,fill:C.blue,parent:gMain});
   const enc=chip(310,210,90,80,'enc',C.blue,{fs:12});await appear(enc.g,260);await flow(`M254,250 L310,250`,{color:C.blue,count:2,dur:300});
   const z=chip(450,225,70,50,'z',C.purple,{fs:16,solid:true});await appear(z.g,260);await flow(`M400,250 L450,250`,{color:C.purple,count:2,dur:300});
   const dec=chip(570,210,90,80,'dec',C.cyan,{fs:12});await appear(dec.g,260);await flow(`M520,250 L570,250`,{color:C.cyan,count:2,dur:300});
   const xh=el('g',{});for(let r=0;r<6;r++)for(let c=0;c<6;c++)el('rect',{x:710+c*24,y:160+r*24,width:22,height:22,fill:C.cyan,'fill-opacity':Math.abs(Math.sin(r+c)).toFixed(2)},xh);
   xh.setAttribute('opacity',0);await flow(`M660,250 L710,250`,{color:C.cyan,count:2,dur:300});await fade(xh,1,360);txt(776,330,'reconstruction x̂',{size:11,fill:C.cyan,parent:gMain});
   txt(500,420,'a VAE makes the bottleneck a distribution — so we can sample it',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('ENCODER  ·  predict μ and σ',C.blue);
   const x=chip(110,210,110,70,'x',C.blue,{fs:18,solid:true});await appear(x.g,300);
   const enc=chip(290,205,140,80,'Encoder',C.blue,{fs:13});await appear(enc.g,300);await flow(`M220,245 L290,245`,{color:C.blue,count:2,dur:300});
   const mu=el('g',{});for(let i=0;i<6;i++)el('rect',{x:520,y:140+i*20,width:50,height:16,rx:2,fill:C.a1,'fill-opacity':(0.4+0.4*Math.abs(Math.sin(i))).toFixed(2)},mu);
   mu.setAttribute('opacity',0);await fade(mu,1,300);txt(545,128,'μ (mean)',{size:10,fill:C.a1,parent:gMain});
   await flow(`M430,230 L520,180`,{color:C.a1,count:2,dur:300});
   const sg=el('g',{});for(let i=0;i<6;i++)el('rect',{x:520,y:290+i*20,width:50,height:16,rx:2,fill:C.purple,'fill-opacity':(0.4+0.4*Math.abs(Math.cos(i))).toFixed(2)},sg);
   sg.setAttribute('opacity',0);await fade(sg,1,300);txt(545,278,'σ (std-dev)',{size:10,fill:C.purple,parent:gMain});
   await flow(`M430,260 L520,330`,{color:C.purple,count:2,dur:300});
   txt(500,430,'two vectors describe a Gaussian for this input',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('LATENT SPACE  ·  clouds, not points',C.purple);
   // scatter of gaussian clouds
   const centers=[[300,200,C.a1],[500,260,C.green],[700,190,C.cyan],[560,360,C.purple]];
   for(const[cx,cy,col] of centers){const g=el('g',{opacity:0});gMain.appendChild(g);
     for(let i=0;i<24;i++){const a=Math.random()*6.28,rr=Math.random()*40;el('circle',{cx:cx+Math.cos(a)*rr,cy:cy+Math.sin(a)*rr,r:3,fill:col,opacity:(0.7-rr/60).toFixed(2)},g);}
     await appear(g,300);}
   txt(500,430,'overlapping clouds → a smooth, continuous space you can interpolate',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('REPARAMETERISATION  ·  z = μ + σ ⊙ ε',C.a1);
   const mu=chip(110,180,110,56,'μ',C.a1,{fs:18,solid:true});await appear(mu.g,280);
   const sg=chip(110,280,110,56,'σ',C.purple,{fs:18,solid:true});await appear(sg.g,280);
   const eps=chip(110,380,110,50,'ε ~ 𝒩(0,I)',C.dim,{fs:11});await appear(eps.g,280);
   const mult=chip(360,300,90,56,'σ·ε',C.purple,{fs:14});await appear(mult.g,280);
   await flow(`M220,305 L360,322`,{color:C.purple,count:2,dur:300});await flow(`M220,400 L360,340`,{color:C.dim,count:2,dur:300});
   const add=chip(560,230,90,56,'⊕',C.a1,{fs:22,solid:true});await appear(add.g,300);
   await flow(`M220,208 L560,250`,{color:C.a1,count:2,dur:300});await flow(`M450,328 L560,275`,{color:C.purple,count:2,dur:300});
   const z=chip(740,230,110,56,'z',C.green,{fs:18,solid:true});await appear(z.g,280);await flow(`M650,258 L740,258`,{color:C.green,count:2,dur:300});
   txt(500,430,'randomness lives in ε (fixed) → gradients flow through μ and σ',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('DECODER  ·  z → reconstruction (and new samples)',C.cyan);
   const z=chip(110,225,90,56,'z',C.green,{fs:18,solid:true});await appear(z.g,280);
   const layers=[[250,3],[380,5],[540,7]];
   for(const[x,n] of layers){await flow(`M${x-60},253 L${x},253`,{color:C.cyan,count:2,dur:280});
     const g=el('g',{opacity:0});gMain.appendChild(g);for(let r=0;r<n;r++)for(let c=0;c<n;c++)el('rect',{x:x+c*(110/n),y:253-55+r*(110/n),width:110/n-2,height:110/n-2,fill:C.cyan,'fill-opacity':(0.3+0.5*Math.random()).toFixed(2)},g);await appear(g,240);}
   await flow(`M660,253 L730,253`,{color:C.cyan,count:2,dur:280});
   const out=el('g',{});for(let r=0;r<8;r++)for(let c=0;c<8;c++){const f=(r-4)*(r-4)+(c-4)*(c-4)<9;el('rect',{x:740+c*18,y:180+r*18,width:16,height:16,fill:f?C.a1:C.bg2,'fill-opacity':f?0.7:0.3},out);}
   out.setAttribute('opacity',0);await fade(out,1,360);txt(810,340,'x̂',{size:12,fill:C.cyan,parent:gMain});
   txt(500,430,'feed a brand-new z from 𝒩(0,I) and the decoder invents an image',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('THE LOSS  ·  reconstruct + regularise',C.green);
   const recon=chip(120,180,300,90,'',C.green,{parent:gMain});await appear(recon.g,320);
   txt(150,40,'① Reconstruction',{size:13,fill:C.green,parent:recon.g,anchor:'start',weight:700});
   txt(150,66,'pull x̂ toward x (pixel / likelihood)',{size:11,fill:C.dim,parent:recon.g,anchor:'start'});
   const kl=chip(120,310,300,90,'',C.purple,{parent:gMain});await appear(kl.g,320);
   txt(150,40,'② KL divergence',{size:13,fill:C.purple,parent:kl.g,anchor:'start',weight:700});
   txt(150,66,'pull q(z|x) toward 𝒩(0, I)',{size:11,fill:C.dim,parent:kl.g,anchor:'start'});
   await wait(150);
   // KL pulling cloud to center
   const cx=720,cy=250;el('circle',{cx,cy,r:70,fill:'none',stroke:C.purple,'stroke-width':1,'stroke-dasharray':'4 4'});
   txt(cx,cy-86,'𝒩(0, I)',{size:11,fill:C.purple,parent:gMain});
   const cloud=el('g',{});for(let i=0;i<20;i++){const a=Math.random()*6.28,rr=Math.random()*30;el('circle',{cx:cx+120+Math.cos(a)*rr,cy:cy+Math.sin(a)*rr,r:3,fill:C.a1,opacity:0.7},cloud);}
   gMain.appendChild(cloud);
   await tween({dur:1000,ease:easeInOut,onUpdate:p=>cloud.setAttribute('transform',`translate(${-120*p},0)`)});
   txt(500,440,'balance keeps the space both accurate and smoothly samplable',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Smooth latent space.','Continuous and structured — great for interpolation.'],
   ['Stable training.','A clean likelihood objective, unlike GANs.'],
   ['Principled &amp; probabilistic.','Grounded in variational inference.'],
   ['Encoder included.','Maps data → latent, useful for downstream tasks.'],
  ],
  challenges:[
   ['Blurry samples.','Pixel losses + averaging soften fine detail.'],
   ['Posterior collapse.','Latent dims can be ignored by a strong decoder.'],
   ['Balancing the loss.','Recon vs KL (β) needs tuning.'],
   ['Lower fidelity.','Beaten by GANs and diffusion on sharpness.'],
  ],
  uses:[
   ['Representation learning.','Compact, meaningful embeddings.'],
   ['Anomaly detection.','High reconstruction error flags outliers.'],
   ['Latent diffusion.','VAE compresses images for Stable Diffusion.'],
   ['Molecule / drug design.','Sampling novel valid structures.'],
  ],
  variants:[
   ['β-VAE.','Weighted KL for disentangled factors.'],
   ['VQ-VAE.','Discrete latent codes — powers DALL·E, audio.'],
   ['Conditional VAE.','Generation conditioned on labels.'],
   ['NVAE / hierarchical.','Deep latents for sharper images.'],
  ],
  compare:{cols:['VAE','GAN','Diffusion'],rows:[
   ['Sample sharpness','Blurry','Sharp','Sharpest'],
   ['Training','Stable','Unstable','Stable'],
   ['Latent space','Smooth, usable','Less structured','Noise schedule'],
   ['Has encoder?','Yes','No','No (usually)'],
   ['Sampling speed','Fast','Fast','Slow'],
  ]},
  pitfalls:[
   ['Posterior collapse','— weaken the decoder or anneal KL.'],
   ['Wrong KL weight','— too high blurs, too low breaks the prior.'],
   ['Skipping the reparam trick','— gradients can’t pass through random sampling.'],
   ['Expecting GAN sharpness','— VAEs trade fidelity for a clean latent space.'],
  ],
 },
};

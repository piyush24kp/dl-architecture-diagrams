/* GAN — Generative Adversarial Network */
window.DIAGRAM={
 title:'Generative Adversarial Network',
 subtitle:'Generator vs Discriminator · a forger and a detective',
 formula:'min_G max_D  𝔼[log D(x)] + 𝔼[log(1 − D(G(z)))]',
 takeawaysSub:'the adversarial game · strengths · why training is hard',
 arch:[
  {id:'z',t:'Noise z',s:'random latent vector',c:'purple',step:0},
  {id:'gen',t:'Generator G',s:'noise → fake image',c:'purple',step:1},
  {id:'real',t:'Real Images',s:'training data',c:'green',step:2},
  {id:'disc',t:'Discriminator D',s:'real or fake?',c:'red',step:3},
  {id:'game',t:'Adversarial Loss',s:'minimax game',c:'amber',step:4},
  {id:'conv',t:'Convergence',s:'fakes become realistic',c:'cyan',step:5},
 ],
 captions:[
  ['01 · Random Noise','Start from nothing','The generator begins with a random latent vector z — pure noise. Its job is to turn this into something that looks real.','z ~ 𝒩(0, I)'],
  ['02 · The Generator','A forger learns to paint','A neural network upsamples the noise into a full image. Early on its outputs are garbage; over training they become convincing fakes.','G(z) → fake image'],
  ['03 · Real vs Fake','Two sources of images','The discriminator is shown a mix: genuine images from the dataset and fakes from the generator — without being told which is which.','real x  ·  fake G(z)'],
  ['04 · The Discriminator','A detective judges','The discriminator outputs a probability that an image is real. It is trained to catch fakes; the generator is trained to fool it.','D(image) → P(real)'],
  ['05 · The Minimax Game','Adversaries push each other','One loss, two opposite goals: D maximises its accuracy, G minimises D’s success. Their competition drives both to improve.','min_G max_D V(D, G)'],
  ['06 · Convergence','Fakes become indistinguishable','At equilibrium the generator’s samples are so realistic the discriminator can only guess — 50/50. The forger has won.','D(G(z)) → 0.5'],
 ],
 steps:[
  async function(){
   stageTitle('RANDOM NOISE  ·  z ~ 𝒩(0, I)',C.purple);
   const g=el('g',{});for(let r=0;r<8;r++)for(let c=0;c<8;c++)el('rect',{x:380+c*26,y:140+r*26,width:24,height:24,fill:C.purple,'fill-opacity':Math.random().toFixed(2)},g);
   g.setAttribute('opacity',0);await fade(g,1,400);
   // reshuffle to feel random
   for(let k=0;k<3;k++){await wait(220);g.querySelectorAll('rect').forEach(r=>r.setAttribute('fill-opacity',Math.random().toFixed(2)));}
   txt(500,400,'a vector of random numbers — the seed for one generated image',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('GENERATOR  ·  noise → image (upsampling)',C.purple);
   const z=el('g',{});for(let i=0;i<6;i++)el('rect',{x:110,y:170+i*22,width:40,height:18,rx:2,fill:C.purple,'fill-opacity':Math.random().toFixed(2)},z);
   await appear(z,300);txt(130,150,'z',{size:12,fill:C.purple,parent:gMain});
   const layers=[[230,3],[360,5],[520,7]];
   for(const[x,n] of layers){await flow(`M${x-60},250 L${x},250`,{color:C.purple,count:2,dur:300});
     const g=el('g',{opacity:0});gMain.appendChild(g);for(let r=0;r<n;r++)for(let c=0;c<n;c++)el('rect',{x:x+c*(110/n),y:250-55+r*(110/n),width:110/n-2,height:110/n-2,fill:C.purple,'fill-opacity':(0.3+0.5*Math.random()).toFixed(2)},g);await appear(g,260);}
   await flow(`M640,250 L710,250`,{color:C.purple,count:2,dur:300});
   const out=el('g',{});for(let r=0;r<9;r++)for(let c=0;c<9;c++){const face=(r-4)*(r-4)+(c-4)*(c-4)<10;el('rect',{x:720+c*18,y:170+r*18,width:16,height:16,fill:face?C.a1:C.bg2,'fill-opacity':face?0.7:0.3},out);}
   out.setAttribute('opacity',0);await fade(out,1,400);txt(800,330,'fake image G(z)',{size:11,fill:C.purple,parent:gMain});
  },
  async function(){
   stageTitle('TWO SOURCES  ·  real data and fakes',C.green);
   const real=el('g',{});for(let r=0;r<6;r++)for(let c=0;c<6;c++){const f=(r-3)*(r-3)+(c-3)*(c-3)<7;el('rect',{x:150+c*28,y:160+r*28,width:26,height:26,fill:f?C.green:C.bg2,'fill-opacity':f?0.7:0.3},real);}
   real.setAttribute('opacity',0);await fade(real,1,360);txt(234,340,'REAL  (dataset)',{size:11,fill:C.green,parent:gMain});
   const fake=el('g',{});for(let r=0;r<6;r++)for(let c=0;c<6;c++){const f=(r-3)*(r-3)+(c-3)*(c-3)<7;el('rect',{x:640+c*28,y:160+r*28,width:26,height:26,fill:f?C.a1:C.bg2,'fill-opacity':(f?0.6:0.3)*(0.7+0.3*Math.random())},fake);}
   fake.setAttribute('opacity',0);await fade(fake,1,360);txt(724,340,'FAKE  G(z)',{size:11,fill:C.purple,parent:gMain});
   txt(500,420,'both are fed to the discriminator, unlabelled',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('DISCRIMINATOR  ·  real or fake?',C.red);
   const img=el('g',{});for(let r=0;r<6;r++)for(let c=0;c<6;c++)el('rect',{x:120+c*26,y:180+r*26,width:24,height:24,fill:C.a1,'fill-opacity':Math.abs(Math.sin(r+c)).toFixed(2)},img);
   await appear(img,300);
   const d=chip(360,200,160,80,'Discriminator',C.red,{fs:13,solid:true});await appear(d.g,320);
   await flow(`M276,240 L360,240`,{color:C.red,count:3,dur:420});
   // probability meter
   await flow(`M520,240 L600,240`,{color:C.red,count:2,dur:300});
   const meter=el('rect',{x:600,y:215,width:240,height:50,rx:8,fill:'none',stroke:C.line,'stroke-width':1.4});
   const fillm=el('rect',{x:600,y:215,width:0,height:50,rx:8,fill:C.green,'fill-opacity':0.4});
   await tween({dur:800,onUpdate:p=>fillm.setAttribute('width',(0.82*240*p).toFixed(1))});
   txt(720,245,'P(real) = 0.82',{size:13,fill:C.green,parent:gMain});
   txt(500,360,'a single number: how confident it is the image is genuine',{size:12,fill:C.muted});
   txt(500,400,'trained to push real → 1 and fake → 0',{size:12,fill:C.red});
  },
  async function(){
   stageTitle('THE MINIMAX GAME  ·  one loss, opposite goals',C.a1);
   const g=chip(120,210,200,80,'Generator',C.purple,{fs:14,solid:true});await appear(g.g,300);
   const d=chip(680,210,200,80,'Discriminator',C.red,{fs:14,solid:true});await appear(d.g,300);
   txt(220,320,'minimise: fool D',{size:11,fill:C.purple,parent:gMain});
   txt(780,320,'maximise: catch G',{size:11,fill:C.red,parent:gMain});
   await wait(200);
   // tug of war arrows
   for(let k=0;k<3;k++){await flow(`M320,250 L680,250`,{color:C.purple,count:3,dur:600});await flow(`M680,250 L320,250`,{color:C.red,count:3,dur:600});}
   txt(500,180,'min_G max_D  𝔼[log D(x)] + 𝔼[log(1 − D(G(z)))]',{size:13,fill:C.a2});
   txt(500,400,'each improvement by one forces the other to get better',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('CONVERGENCE  ·  fakes become indistinguishable',C.cyan);
   const steps=[0.15,0.4,0.7,0.95];const xs=[140,360,580,800];
   for(let i=0;i<4;i++){const g=el('g',{opacity:0});gMain.appendChild(g);
     for(let r=0;r<7;r++)for(let c=0;c<7;c++){const face=(r-3)*(r-3)+(c-3)*(c-3)<8;const q=steps[i];
       el('rect',{x:xs[i]-70+c*20,y:150+r*20,width:18,height:18,fill:face?C.a1:C.bg2,'fill-opacity':((face?0.7:0.3)*q+(1-q)*Math.random()).toFixed(2)},g);}
     txt(xs[i],310,'epoch '+[1,20,60,150][i],{size:10,fill:C.cyan,parent:g});await appear(g,360);await wait(120);}
   txt(500,380,'at equilibrium D(G(z)) → 0.5 — the detective can only guess',{size:12,fill:C.green});
  },
 ],
 takeaways:{
  advantages:[
   ['Sharp, realistic samples.','GANs produce crisp images, often sharper than VAEs.'],
   ['Fast generation.','One forward pass through G — no iterative sampling.'],
   ['No explicit likelihood.','Learns the data distribution implicitly via the game.'],
   ['Flexible conditioning.','Class, text, or image conditioning is easy to add.'],
  ],
  challenges:[
   ['Unstable training.','The minimax game can oscillate or diverge.'],
   ['Mode collapse.','G may produce only a few sample types.'],
   ['Hard to evaluate.','No clean likelihood; FID/IS are imperfect proxies.'],
   ['Sensitive to hyperparameters.','Balance between G and D is delicate.'],
  ],
  uses:[
   ['Photorealistic faces.','StyleGAN — “this person does not exist”.'],
   ['Image-to-image.','Pix2Pix, CycleGAN translation.'],
   ['Super-resolution.','SRGAN/ESRGAN upscaling.'],
   ['Data augmentation.','Synthetic samples for scarce datasets.'],
  ],
  variants:[
   ['DCGAN.','Convolutional GAN — the stable baseline.'],
   ['StyleGAN.','State-of-the-art controllable face synthesis.'],
   ['CycleGAN.','Unpaired domain translation.'],
   ['WGAN-GP.','Wasserstein loss for stabler training.'],
  ],
  compare:{cols:['GAN','VAE','Diffusion'],rows:[
   ['Sample quality','Very sharp','Blurrier','Highest, very sharp'],
   ['Training stability','Hard','Stable','Stable'],
   ['Sampling speed','Fast (1 pass)','Fast','Slow (many steps)'],
   ['Mode coverage','Can collapse','Good','Excellent'],
   ['Likelihood','Implicit','Lower-bound','Tractable-ish'],
  ]},
  pitfalls:[
   ['Discriminator too strong','— G gets no gradient; balance the two.'],
   ['Mode collapse','— add minibatch tricks, diverse losses, or WGAN-GP.'],
   ['Bad normalisation','— BatchNorm in D can leak batch statistics.'],
   ['Judging by loss curves','— GAN losses don’t track quality; look at samples/FID.'],
  ],
 },
};

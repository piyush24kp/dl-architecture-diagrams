/* ResNet — residual learning */
window.DIAGRAM={
 title:'ResNet',
 subtitle:'Residual learning · skip connections · networks 100+ layers deep',
 formula:'y = F(x, W) + x',
 takeawaysSub:'how skips unlock depth · strengths · its lasting influence',
 arch:[
  {id:'in',t:'Input',s:'image / features',c:'blue',step:0},
  {id:'prob',t:'The Degradation Problem',s:'deeper ≠ better',c:'red',step:1},
  {id:'block',t:'Residual Block',s:'F(x) + x',c:'green',step:2},
  {id:'skip',t:'Skip Connection',s:'identity shortcut',c:'amber',step:3},
  {id:'grad',t:'Gradient Highway',s:'backprop stays strong',c:'purple',step:4},
  {id:'deep',t:'Stack to 50/101/152',s:'very deep, trainable',c:'cyan',step:5},
 ],
 captions:[
  ['01 · Going Deeper','More layers, more power?','In principle, stacking more layers should never hurt — extra layers could just copy their input. In practice, plain deep nets got worse.','depth should help…'],
  ['02 · The Degradation Problem','Plain deep nets get worse','A 56-layer plain network had higher training error than a 20-layer one — not overfitting, but an optimisation failure. Signals and gradients degrade with depth.','56-layer worse than 20-layer'],
  ['03 · Residual Block','Learn the difference','Instead of learning a full mapping H(x), the block learns only the residual F(x) = H(x) − x, then adds x back. Learning “do nothing” becomes trivial.','y = F(x) + x'],
  ['04 · Skip Connection','An identity shortcut','A connection carries x directly past the block and adds it to the output. If the layers learn nothing useful, the identity still flows through.','shortcut: x → +'],
  ['05 · Gradient Highway','Backprop stays alive','The skip gives gradients a direct path to early layers. The +x term means the gradient is never fully attenuated — vanishing is solved.','∂y/∂x = ∂F/∂x + 1'],
  ['06 · Go Very Deep','50, 101, 152 layers','With residuals, depth finally pays off. ResNet-152 won ImageNet 2015 and the idea now underpins Transformers, U-Nets, and beyond.','depth that actually trains'],
 ],
 steps:[
  async function(){
   stageTitle('GOING DEEPER  ·  should always help',C.blue);
   const xs=[140,300,460,620,780];const cy=230;
   for(let i=0;i<5;i++){const b=chip(xs[i],cy-30,120,60,'layer '+(i+1),C.blue,{fs:12});await appear(b.g,180);if(i<4)await flow(`M${xs[i]+120},${cy} L${xs[i+1]},${cy}`,{color:C.blue,count:2,dur:300});}
   txt(500,350,'extra layers could just copy their input → depth shouldn’t hurt',{size:12,fill:C.muted});
   txt(500,392,'…but in practice, plain deep networks got worse',{size:12,fill:C.red});
  },
  async function(){
   stageTitle('THE DEGRADATION PROBLEM',C.red);
   el('line',{x1:140,y1:380,x2:880,y2:380,stroke:C.line,'stroke-width':1.2});
   el('line',{x1:140,y1:120,x2:140,y2:380,stroke:C.line,'stroke-width':1.2});
   txt(120,250,'error',{size:10,fill:C.muted,anchor:'end',parent:gMain});txt(500,400,'training iterations →',{size:10,fill:C.muted,parent:gMain});
   // two curves
   let p20='M140,360 ';for(let x=0;x<=720;x+=10)p20+='L'+(140+x)+','+(360-180*(1-Math.exp(-x/160)))+' ';
   let p56='M140,360 ';for(let x=0;x<=720;x+=10)p56+='L'+(140+x)+','+(360-110*(1-Math.exp(-x/160)))+' ';
   const c20=el('path',{d:p20,fill:'none',stroke:C.green,'stroke-width':2,opacity:0,'stroke-dasharray':1400,'stroke-dashoffset':1400});
   const c56=el('path',{d:p56,fill:'none',stroke:C.red,'stroke-width':2,opacity:0,'stroke-dasharray':1400,'stroke-dashoffset':1400});
   fade(c56,1,300);tween({dur:1100,onUpdate:p=>c56.setAttribute('stroke-dashoffset',1400*(1-p))});
   txt(840,250,'56-layer',{size:11,fill:C.red,parent:gMain});
   await wait(700);
   fade(c20,1,300);tween({dur:1100,onUpdate:p=>c20.setAttribute('stroke-dashoffset',1400*(1-p))});
   txt(840,200,'20-layer',{size:11,fill:C.green,parent:gMain});
   await wait(800);
   txt(500,440,'deeper had HIGHER training error — an optimisation failure, not overfitting',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('RESIDUAL BLOCK  ·  learn F(x) = H(x) − x',C.green);
   const x=chip(110,220,110,60,'x',C.blue,{fs:18,solid:true});await appear(x.g,260);
   const w1=chip(290,220,150,60,'weight + ReLU',C.a1,{fs:11});await appear(w1.g,260);
   await flow(`M220,250 L290,250`,{color:C.a1,count:2,dur:300});
   const w2=chip(490,220,150,60,'weight',C.a1,{fs:12});await appear(w2.g,260);
   await flow(`M440,250 L490,250`,{color:C.a1,count:2,dur:300});
   const add=chip(710,220,90,60,'⊕',C.green,{fs:24,solid:true});await appear(add.g,300);
   await flow(`M640,250 L710,250`,{color:C.a1,count:2,dur:300});
   txt(465,210,'F(x)',{size:12,fill:C.a1,parent:gMain});
   const skip=el('path',{d:'M165,220 C165,120 755,120 755,210',fill:'none',stroke:C.green,'stroke-width':2,'stroke-dasharray':'6 4',opacity:0});fade(skip,1,400);
   txt(460,108,'identity x',{size:12,fill:C.green,parent:gMain});
   await flow('M165,220 C165,120 755,120 755,210',{color:C.green,count:3,dur:800});
   const y=chip(850,220,110,60,'y',C.cyan,{fs:18,solid:true});await appear(y.g,260);await flow(`M800,250 L850,250`,{color:C.green,count:2,dur:300});
   txt(500,360,'if F(x)=0 the block becomes identity — “do nothing” is free to learn',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('SKIP CONNECTION  ·  the shortcut always flows',C.a1);
   const x=chip(120,230,120,60,'x',C.blue,{fs:18,solid:true});await appear(x.g,280);
   const block=chip(380,230,200,60,'conv layers',C.muted,{fs:12});await appear(block.g,280);
   await flow(`M240,260 L380,260`,{color:C.muted,count:2,dur:360});
   const add=chip(720,230,90,60,'⊕',C.a1,{fs:24,solid:true});await appear(add.g,300);
   // dead block scenario
   txt(480,300,'suppose layers learn nothing useful…',{size:11,fill:C.muted,parent:gMain});
   const skip=el('path',{d:'M180,230 C180,130 765,130 765,220',fill:'none',stroke:C.a1,'stroke-width':2,'stroke-dasharray':'6 4',opacity:0});fade(skip,1,400);
   await flow('M180,230 C180,130 765,130 765,220',{color:C.a1,count:4,dur:900,r:3});
   const y=chip(860,230,100,60,'≈ x',C.green,{fs:16,solid:true});await appear(y.g,280);await flow(`M810,260 L860,260`,{color:C.a1,count:2,dur:300});
   txt(500,390,'the identity path preserves the signal no matter what',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('GRADIENT HIGHWAY  ·  ∂y/∂x = ∂F/∂x + 1',C.purple);
   const xs=[140,360,580,800];const cy=200;
   for(let i=0;i<4;i++){const b=chip(xs[i],cy-28,140,56,'block '+(i+1),C.a1,{fs:12});appear(b.g,200);}
   // skip arcs
   for(let i=0;i<3;i++){const d=`M${xs[i]+70},${cy-28} C${xs[i]+70},${cy-90} ${xs[i+1]+70},${cy-90} ${xs[i+1]+70},${cy-28}`;el('path',{d,fill:'none',stroke:C.purple,'stroke-width':1.5,'stroke-dasharray':'5 4',opacity:0.6});}
   await wait(300);
   // backward gradient flows full strength along the top
   for(let i=2;i>=0;i--){await flow(`M${xs[i+1]+70},${cy-28} C${xs[i+1]+70},${cy-90} ${xs[i]+70},${cy-90} ${xs[i]+70},${cy-28}`,{color:C.purple,count:3,dur:520,r:3});}
   txt(500,310,'the “+1” means the gradient is never multiplied down to zero',{size:12,fill:C.green});
   txt(500,352,'→ even 100+ layers receive a strong learning signal',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('STACK DEEP  ·  ResNet-50 / 101 / 152',C.cyan);
   const groups=[['conv1',1,150],['res ×3',3,300],['res ×4',4,450],['res ×6',6,600],['res ×3',3,760]];
   for(const[name,n,x] of groups){const g=el('g',{opacity:0});gMain.appendChild(g);
     for(let k=0;k<n;k++)el('rect',{x:x-22,y:150+k*40,width:60,height:32,rx:5,fill:C.cyan,'fill-opacity':0.5,stroke:C.cyan,'stroke-width':1},g);
     txt(x+8,140,name,{size:10,fill:C.cyan,parent:g});await appear(g,300);
     if(x<760)await flow(`M${x+40},200 L${x+130},200`,{color:C.cyan,count:1,dur:300});}
   const bot=chip(360,400,280,52,'ImageNet 2015 winner · 152 layers',C.green,{fs:12,tc:C.green});await appear(bot.g,400);
   txt(500,470,'',{size:1});
  },
 ],
 takeaways:{
  advantages:[
   ['Trains very deep nets.','Skip connections make 100+ layers optimisable.'],
   ['Solves vanishing gradients.','The identity path keeps gradients strong.'],
   ['Easy to optimise.','Learning a residual near zero is simple.'],
   ['Universal building block.','Residuals now appear in almost every modern net.'],
  ],
  challenges:[
   ['More memory.','Storing activations for skips increases memory use.'],
   ['Diminishing returns.','Beyond ~150 layers, extra depth helps little.'],
   ['Dimension matching.','Shortcuts need projection when shapes change.'],
   ['Still a CNN.','Inherits convolution’s local-bias limitations.'],
  ],
  uses:[
   ['Image classification.','The default ImageNet backbone for years.'],
   ['Detection / segmentation.','Backbone for Faster R-CNN, Mask R-CNN.'],
   ['Feature extraction.','Pre-trained ResNets power transfer learning.'],
   ['Beyond vision.','Residuals are core to Transformers and U-Nets.'],
  ],
  variants:[
   ['ResNeXt.','Grouped convolutions for more capacity.'],
   ['Wide ResNet.','Fewer, wider layers — faster, accurate.'],
   ['DenseNet.','Connect every layer to every later layer.'],
   ['Pre-activation ResNet.','BN-ReLU before conv improves very deep training.'],
  ],
  compare:{cols:['ResNet','Plain deep CNN','DenseNet'],rows:[
   ['Connections','Additive skip','None','Concatenated'],
   ['Max trainable depth','1000+','~30 before degrading','Hundreds'],
   ['Gradient flow','Strong (highway)','Vanishes','Strong'],
   ['Parameter efficiency','Good','Poor at depth','Very good'],
   ['Legacy','Everywhere today','Obsolete','Niche but strong'],
  ]},
  pitfalls:[
   ['Shape mismatch on shortcut','— use a 1×1 conv projection when channels/stride change.'],
   ['Skipping BatchNorm','— deep ResNets still rely on normalisation.'],
   ['Wrong residual scaling','can destabilise extremely deep stacks.'],
   ['Assuming depth alone helps','— width and data matter too.'],
  ],
 },
};

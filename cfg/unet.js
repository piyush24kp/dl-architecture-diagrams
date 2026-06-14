/* U-Net — encoder-decoder with skip connections */
window.DIAGRAM={
 title:'U-Net',
 subtitle:'Encoder–decoder + skip connections · pixel-perfect segmentation',
 formula:'contract (downsample) → bottleneck → expand (upsample) + skips',
 takeawaysSub:'why the U shape works · strengths · where it is used',
 arch:[
  {id:'in',t:'Input Image',s:'full resolution',c:'blue',step:0},
  {id:'enc',t:'Encoder ↓',s:'contract: capture context',c:'blue',step:1},
  {id:'bottle',t:'Bottleneck',s:'compressed semantics',c:'purple',step:2},
  {id:'dec',t:'Decoder ↑',s:'expand: recover detail',c:'cyan',step:3},
  {id:'skip',t:'Skip Connections',s:'copy fine detail across',c:'amber',step:4},
  {id:'out',t:'Output Mask',s:'per-pixel labels',c:'green',step:5},
 ],
 captions:[
  ['01 · The Task','Label every pixel','Segmentation needs a class for each pixel, not one label per image. U-Net keeps full spatial detail while still understanding the whole scene.','dense, per-pixel prediction'],
  ['02 · Encoder (Contracting)','Downsample for context','The left arm repeatedly convolves and downsamples — resolution falls, channels rise. The model trades “where” for “what”.','↓ resolution, ↑ semantics'],
  ['03 · Bottleneck','The compressed middle','At the bottom of the U the representation is small but semantically rich — it knows what is in the image, but not precisely where.','smallest map, richest features'],
  ['04 · Decoder (Expanding)','Upsample to recover detail','The right arm upsamples step by step, rebuilding resolution. Alone it would produce blurry, imprecise boundaries.','↑ resolution back to full'],
  ['05 · Skip Connections','Bridge the U','Each decoder level concatenates the matching encoder features. These skips carry crisp edges and locations straight across the U.','concat encoder ↔ decoder'],
  ['06 · Output Mask','A label per pixel','A final 1×1 convolution maps features to class scores per pixel, producing a full-resolution segmentation mask.','1×1 conv → pixel classes'],
 ],
 steps:[
  async function(){
   stageTitle('PER-PIXEL PREDICTION  ·  not just one label',C.blue);
   const img=el('g',{});for(let r=0;r<7;r++)for(let c=0;c<7;c++)el('rect',{x:140+c*34,y:130+r*34,width:32,height:32,fill:C.blue,'fill-opacity':(0.2+0.5*Math.abs(Math.sin(r+c))).toFixed(2),stroke:C.bg,'stroke-width':1},img);
   img.setAttribute('opacity',0);await fade(img,1,400);txt(258,400,'input',{size:11,fill:C.blue,parent:gMain});
   const arrow=chip(420,250,80,46,'→',C.dim,{fs:22});await appear(arrow.g,260);
   const mask=el('g',{});for(let r=0;r<7;r++)for(let c=0;c<7;c++){const organ=(r-3)*(r-3)+(c-3)*(c-3)<6;el('rect',{x:560+c*34,y:130+r*34,width:32,height:32,fill:organ?C.green:C.purple,'fill-opacity':0.5,stroke:C.bg,'stroke-width':1},mask);}
   mask.setAttribute('opacity',0);await fade(mask,1,400);txt(678,400,'segmentation mask',{size:11,fill:C.green,parent:gMain});
  },
  async function(){
   stageTitle('ENCODER ↓  ·  contract: resolution down, channels up',C.blue);
   const levels=[[160,200,7],[330,230,5],[470,255,3],[580,275,2]];
   for(let i=0;i<levels.length;i++){const[x,y,n]=levels[i];const g=el('g',{opacity:0});gMain.appendChild(g);
     for(let r=0;r<n;r++)for(let c=0;c<n;c++)el('rect',{x:x+c*(140/n),y:y+r*(140/n),width:140/n-2,height:140/n-2,fill:C.blue,'fill-opacity':(0.3+0.4*Math.abs(Math.sin(r+c+i))).toFixed(2)},g);
     await appear(g,300);if(i<3)await flow(`M${x+150},${y+70} L${levels[i+1][0]},${levels[i+1][1]+70}`,{color:C.blue,count:2,dur:360});}
   txt(500,430,'each ↓ step halves H,W and doubles the channels',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('BOTTLENECK  ·  small but semantically rich',C.purple);
   const g=el('g',{});for(let r=0;r<2;r++)for(let c=0;c<2;c++)el('rect',{x:440+c*50,y:200+r*50,width:46,height:46,rx:4,fill:C.purple,'fill-opacity':(0.5+0.3*Math.abs(Math.sin(r+c))).toFixed(2)},g);
   g.setAttribute('opacity',0);await fade(g,1,400);
   const ch=el('g',{});for(let i=0;i<14;i++)el('rect',{x:300+i*30,y:330,width:26,height:40,rx:3,fill:C.purple,'fill-opacity':(0.3+0.5*Math.abs(Math.sin(i*1.1))).toFixed(2)},ch);
   ch.setAttribute('opacity',0);await fade(ch,1,400);txt(500,400,'many channels',{size:10,fill:C.purple,parent:gMain});
   txt(500,180,'knows WHAT is in the image — but has lost precise WHERE',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('DECODER ↑  ·  expand: rebuild resolution',C.cyan);
   const levels=[[170,260,2],[300,250,3],[450,235,5],[640,210,7]];
   for(let i=0;i<levels.length;i++){const[x,y,n]=levels[i];const g=el('g',{opacity:0});gMain.appendChild(g);
     for(let r=0;r<n;r++)for(let c=0;c<n;c++)el('rect',{x:x+c*(150/n),y:y+r*(150/n),width:150/n-2,height:150/n-2,fill:C.cyan,'fill-opacity':(0.3+0.4*Math.abs(Math.sin(r+c+i))).toFixed(2)},g);
     await appear(g,300);if(i<3)await flow(`M${x+160},${y+75} L${levels[i+1][0]},${levels[i+1][1]+75}`,{color:C.cyan,count:2,dur:360});}
   txt(500,430,'upsampling alone → blurry, imprecise boundaries (fixed next)',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('SKIP CONNECTIONS  ·  bridge the U',C.a1);
   // draw a U: encoder left going down, decoder right going up
   const encX=[150,210,270,330],encY=[120,200,280,350];
   const decX=[670,730,790,850],decY=[120,200,280,350];
   for(let i=0;i<4;i++){const e=chip(encX[i]-30,encY[i],60,44,'E'+(i+1),C.blue,{fs:10,solid:true});appear(e.g,180);
     const d=chip(decX[i]-30,decY[i],60,44,'D'+(i+1),C.cyan,{fs:10,solid:true});appear(d.g,180);}
   await wait(250);
   // bottleneck connect
   await flow(`M330,372 C480,440 520,440 670,372`,{color:C.purple,count:3,dur:700});
   for(let i=0;i<4;i++){await flow(`M${encX[i]+30},${encY[i]+22} L${decX[i]-30},${decY[i]+22}`,{color:C.a1,count:3,dur:560,r:2.6});txt((encX[i]+decX[i])/2,encY[i]+10,'copy '+(i+1),{size:9,fill:C.a1,parent:gMain});}
   txt(500,440,'crisp edges & locations flow straight across to the decoder',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('OUTPUT MASK  ·  1×1 conv → per-pixel class',C.green);
   const feat=el('g',{});for(let r=0;r<7;r++)for(let c=0;c<7;c++)el('rect',{x:130+c*30,y:140+r*30,width:28,height:28,fill:C.cyan,'fill-opacity':Math.abs(Math.sin(r+c)).toFixed(2)},feat);
   await appear(feat,300);txt(235,360,'decoder features',{size:10,fill:C.cyan,parent:gMain});
   const conv=chip(420,240,110,56,'1×1 conv',C.a1,{fs:12});await appear(conv.g,280);await flow(`M340,268 L420,268`,{color:C.a1,count:2,dur:300});
   const mask=el('g',{});for(let r=0;r<7;r++)for(let c=0;c<7;c++){const organ=(r-3)*(r-3)+(c-2.5)*(c-2.5)<5;el('rect',{x:620+c*30,y:140+r*30,width:28,height:28,fill:organ?C.green:C.purple,'fill-opacity':0.55},mask);}
   mask.setAttribute('opacity',0);await flow(`M530,268 L620,268`,{color:C.green,count:2,dur:300});await fade(mask,1,400);
   txt(725,360,'segmentation mask',{size:10,fill:C.green,parent:gMain});
   txt(500,430,'every pixel gets a class — full-resolution output',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Precise localisation.','Skip connections preserve fine spatial detail.'],
   ['Works with little data.','Strong results from few annotated images + augmentation.'],
   ['Symmetric &amp; simple.','Clean encoder–decoder design, easy to adapt.'],
   ['Full-resolution output.','Produces dense, per-pixel predictions.'],
  ],
  challenges:[
   ['Memory heavy.','Storing encoder features for skips uses lots of memory.'],
   ['Fixed input sizes.','Pooling/upsampling constrains dimensions.'],
   ['Class imbalance.','Small structures need weighted or Dice losses.'],
   ['Context limits.','Pure CNN U-Nets have a bounded receptive field.'],
  ],
  uses:[
   ['Medical imaging.','Organ, tumour, and cell segmentation — its origin.'],
   ['Satellite / remote sensing.','Land cover, roads, buildings.'],
   ['Diffusion models.','The denoiser in Stable Diffusion is a U-Net.'],
   ['Image-to-image.','Inpainting, super-resolution, style transfer.'],
  ],
  variants:[
   ['U-Net++.','Nested, denser skip pathways.'],
   ['Attention U-Net.','Gates skips to focus on relevant regions.'],
   ['3D U-Net / V-Net.','Volumetric segmentation for CT/MRI.'],
   ['TransUNet.','Transformer encoder + U-Net decoder.'],
  ],
  compare:{cols:['U-Net','Plain encoder-decoder','FCN'],rows:[
   ['Skip connections','Yes (concat)','None','Few, additive'],
   ['Boundary detail','Sharp','Blurry','Moderate'],
   ['Data efficiency','High','Lower','Medium'],
   ['Output','Full-res mask','Often coarse','Upsampled'],
   ['Typical domain','Medical/dense','General','Early segmentation'],
  ]},
  pitfalls:[
   ['Mismatched skip sizes','— encoder/decoder feature maps must align to concat.'],
   ['Ignoring class imbalance','— use Dice/Tversky loss for small targets.'],
   ['Too-aggressive downsampling','loses small structures permanently.'],
   ['Insufficient augmentation','— small datasets overfit without it.'],
  ],
 },
};

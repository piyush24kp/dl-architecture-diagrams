/* CNN — Convolutional Neural Network */
window.DIAGRAM={
 title:'Convolutional Neural Network',
 subtitle:'Learned filters · spatial hierarchy · the workhorse of computer vision',
 formula:'feature = ReLU( image ✻ kernel + b )  →  pool  →  repeat',
 takeawaysSub:'how convolution sees · strengths · vs Transformers for vision',
 arch:[
  {id:'in',t:'Input Image',s:'H × W × 3 pixels',c:'blue',step:0},
  {id:'conv',t:'Convolution',s:'sliding learned filters',c:'blue',step:1},
  {id:'relu',t:'ReLU',s:'keep positives',c:'amber',step:2},
  {id:'pool',t:'Pooling',s:'downsample, keep strongest',c:'purple',step:3},
  {id:'stack',t:'Stacked Blocks',s:'edges → textures → objects',c:'cyan',step:4},
  {id:'fc',t:'Flatten + Dense',s:'class scores',c:'green',step:5},
 ],
 captions:[
  ['01 · The Image','A grid of pixels','An image is a height × width grid of pixel values (×3 for RGB). The network never sees the whole thing at once — it scans it with small filters.','input: H × W × 3'],
  ['02 · Convolution','Slide a learned filter','A small kernel slides across the image, computing a dot product at each position. Each filter learns to detect one pattern — an edge, a colour, a corner.','feature map = image ✻ kernel'],
  ['03 · ReLU','Throw away the negatives','A ReLU keeps positive activations and zeroes the rest — a cheap non-linearity that lets the network model complex shapes.','ReLU(x) = max(0, x)'],
  ['04 · Pooling','Shrink, keep the signal','Max-pooling takes the strongest response in each region, halving the resolution. This adds translation tolerance and cuts compute.','2×2 max-pool → ½ size'],
  ['05 · Depth = Hierarchy','From edges to objects','Early layers detect edges; deeper layers combine them into textures, parts, then whole objects. Spatial size shrinks as channels grow.','shallow → deep features'],
  ['06 · Classifier','Flatten and decide','The final feature maps are flattened and passed to dense layers + softmax, producing class probabilities — “cat: 0.92”.','softmax → class probabilities'],
 ],
 steps:[
  async function(){
   stageTitle('THE INPUT IMAGE  ·  a grid of pixels',C.blue);
   const gx=350,gy=110,cell=30,n=9;
   await grid(gx,gy,n,n,cell,2,(r,c)=>0.2+0.6*Math.abs(Math.sin(r*0.7+c*0.5)),{color:C.blue,stepDelay:10,rx:2});
   txt(500,420,'every pixel is a number (0–255), ×3 channels for colour',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('CONVOLUTION  ·  slide a 3×3 learned filter',C.blue);
   const gx=120,gy=120,cell=30,n=9;
   const vals=[];for(let r=0;r<n;r++){vals[r]=[];for(let c=0;c<n;c++){vals[r][c]=0.2+0.6*Math.abs(Math.sin(r*0.7+c*0.5));el('rect',{x:gx+c*(cell+2),y:gy+r*(cell+2),width:cell,height:cell,rx:2,fill:C.blue,'fill-opacity':vals[r][c].toFixed(2),stroke:C.line,'stroke-width':0.5});}}
   // feature map on right
   const fx0=640,fy=140,fc=44;
   txt(640+3*fc,118,'feature map',{size:11,fill:C.a1,parent:gMain});
   const kernel=el('rect',{x:gx,y:gy,width:cell*3+4,height:cell*3+4,rx:3,fill:'none',stroke:C.a1,'stroke-width':2.5});
   for(let r=0;r<=6;r+=1){for(let c=0;c<=6;c+=1){
     kernel.setAttribute('x',gx+c*(cell+2));kernel.setAttribute('y',gy+r*(cell+2));
     if((r+c)%2===0){const v=Math.abs(Math.sin(r*0.9+c*0.6));el('rect',{x:640+c*fc,y:fy+r*fc,width:fc-4,height:fc-4,rx:3,fill:C.a1,'fill-opacity':v.toFixed(2),stroke:C.line,'stroke-width':0.5});}
     await wait(12);}}
   txt(360,440,'each position → one dot product → one output value',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('ReLU  ·  max(0, x)',C.a1);
   // before / after
   const vals=[-0.6,0.8,-0.3,0.5,-0.9,0.2,0.7,-0.4];const gx=120,gy=200;
   txt(230,180,'before',{size:11,fill:C.muted,parent:gMain});
   txt(700,180,'after ReLU',{size:11,fill:C.green,parent:gMain});
   for(let i=0;i<8;i++){const v=vals[i];const neg=v<0;
     const a=el('rect',{x:gx+i*40,y:gy,width:34,height:50,rx:5,fill:neg?C.red:C.green,'fill-opacity':Math.abs(v).toFixed(2),stroke:C.line,'stroke-width':1});
     txt(gx+i*40+17,gy+30,v.toFixed(1),{size:10,fill:C.text,parent:gMain});}
   await wait(500);
   for(let i=0;i<8;i++){const v=Math.max(0,vals[i]);
     const b=el('rect',{x:600+i*40,y:gy,width:34,height:50,rx:5,fill:C.green,'fill-opacity':v.toFixed(2),stroke:C.line,'stroke-width':1});
     txt(600+i*40+17,gy+30,v.toFixed(1),{size:10,fill:v>0?C.text:C.muted,parent:gMain});
     await flow(`M${gx+i*40+34},${gy+25} L${600+i*40},${gy+25}`,{color:v>0?C.green:C.red,count:1,dur:300,trail:false});await wait(40);}
   txt(500,330,'negatives become 0 — cheap non-linearity, no vanishing on the +side',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('MAX-POOLING  ·  2×2 → keep the strongest',C.purple);
   const gx=120,gy=130,cell=34,n=8;const vals=[];
   for(let r=0;r<n;r++){vals[r]=[];for(let c=0;c<n;c++){const v=Math.abs(Math.sin(r*0.8+c*0.6));vals[r][c]=v;el('rect',{x:gx+c*(cell+2),y:gy+r*(cell+2),width:cell,height:cell,rx:2,fill:C.cyan,'fill-opacity':v.toFixed(2),stroke:C.line,'stroke-width':0.5});}}
   const ox=680,oy=180,oc=44;
   txt(680+2*oc,158,'pooled ½',{size:11,fill:C.purple,parent:gMain});
   for(let r=0;r<n;r+=2)for(let c=0;c<n;c+=2){const m=Math.max(vals[r][c],vals[r][c+1],vals[r+1][c],vals[r+1][c+1]);
     const hl=el('rect',{x:gx+c*(cell+2),y:gy+r*(cell+2),width:cell*2+2,height:cell*2+2,rx:3,fill:'none',stroke:C.purple,'stroke-width':2});
     el('rect',{x:ox+(c/2)*oc,y:oy+(r/2)*oc,width:oc-4,height:oc-4,rx:3,fill:C.purple,'fill-opacity':m.toFixed(2),stroke:C.line,'stroke-width':0.5});
     await wait(70);hl.remove();}
   txt(380,430,'halves resolution, adds translation tolerance, cuts compute',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('DEPTH = HIERARCHY  ·  edges → textures → objects',C.cyan);
   const stages=[['edges',C.blue,150,9,46],['textures',C.a1,400,6,40],['parts',C.purple,610,4,46],['object',C.green,800,2,60]];
   for(const[name,col,x,nn,sz] of stages){
     const g=el('g',{opacity:0});gMain.appendChild(g);
     for(let r=0;r<nn;r++)for(let c=0;c<nn;c++)el('rect',{x:x+(c-(nn-1)/2)*(sz/2.2),y:200+(r-(nn-1)/2)*(sz/2.2),width:sz/2.6,height:sz/2.6,rx:2,fill:col,'fill-opacity':Math.abs(Math.sin(r*1.3+c*0.9+name.length)).toFixed(2)},g);
     txt(x,300,name,{size:11,fill:col,parent:g});txt(x,322,'ch↑ size↓',{size:8,fill:C.muted,parent:g});
     await appear(g,360);
     if(x<800)await flow(`M${x+50},210 L${x+170},210`,{color:C.cyan,count:2,dur:420});
   }
   txt(500,420,'spatial size shrinks while the number of channels grows',{size:12,fill:C.muted});
  },
  async function(){
   stageTitle('CLASSIFIER  ·  flatten → dense → softmax',C.green);
   const fm=el('g',{});for(let r=0;r<3;r++)for(let c=0;c<3;c++)el('rect',{x:110+c*30,y:200+r*30,width:28,height:28,rx:3,fill:C.cyan,'fill-opacity':Math.abs(Math.sin(r+c)).toFixed(2)},fm);
   await appear(fm,300);
   const flat=el('g',{});for(let i=0;i<9;i++)el('rect',{x:300,y:140+i*26,width:60,height:22,rx:3,fill:C.a1,'fill-opacity':(0.3+0.5*Math.abs(Math.sin(i))).toFixed(2)},flat);
   flat.setAttribute('opacity',0);await fade(flat,1,360);
   txt(330,128,'flatten',{size:10,fill:C.a1,parent:gMain});
   await flow(`M200,230 L300,260`,{color:C.a1,count:3,dur:420});
   const classes=['cat','dog','fox'];const probs=[0.92,0.05,0.03];const bx=520;
   for(let i=0;i<3;i++){const w=probs[i]*320;const y=200+i*52;const hot=i===0;
     el('rect',{x:bx,y,width:0,height:36,rx:5,fill:hot?C.green:C.muted,opacity:0.85});const r=gMain.lastChild;
     txt(bx-12,y+24,classes[i],{size:12,fill:hot?C.green:C.dim,anchor:'end',parent:gMain});
     await flow(`M360,260 L${bx},${y+18}`,{color:C.green,count:1,dur:300,trail:false});
     tween({dur:460,onUpdate:p=>r.setAttribute('width',w*p)});
     txt(bx+w+20,y+24,probs[i].toFixed(2),{size:11,fill:hot?C.green:C.muted,anchor:'start',parent:gMain});await wait(120);}
   txt(500,420,'highest score wins → “cat”',{size:12,fill:C.muted});
  },
 ],
 takeaways:{
  advantages:[
   ['Parameter sharing.','One filter scans the whole image — far fewer weights than dense nets.'],
   ['Translation invariance.','A feature is detected wherever it appears.'],
   ['Spatial hierarchy.','Edges compose into textures, parts, then objects.'],
   ['Efficient on images.','Strong inductive bias means it learns from less data than ViT.'],
  ],
  challenges:[
   ['Local receptive field.','Global context needs many layers or large kernels.'],
   ['Fixed grid assumption.','Less natural for irregular or sequence data.'],
   ['Limited rotation/scale invariance.','Needs augmentation to generalise.'],
   ['Beaten at huge scale.','ViTs can surpass CNNs given enough data.'],
  ],
  uses:[
   ['Image classification.','ImageNet, medical imaging, quality control.'],
   ['Detection &amp; segmentation.','YOLO, Mask R-CNN, U-Net backbones.'],
   ['Faces &amp; OCR.','Recognition and text extraction.'],
   ['Beyond vision.','Audio spectrograms, 1-D signals, even Go (AlphaGo).'],
  ],
  variants:[
   ['ResNet.','Skip connections enable very deep CNNs.'],
   ['Depthwise separable.','MobileNet/EfficientNet for speed on devices.'],
   ['Dilated convolutions.','Wider receptive field without more params.'],
   ['ConvNeXt.','Modernised CNN matching ViT accuracy.'],
  ],
  compare:{cols:['CNN','Vision Transformer','MLP'],rows:[
   ['Inductive bias','Strong (locality)','Weak — learns it','None'],
   ['Data efficiency','High','Needs lots of data','Low'],
   ['Receptive field','Local → grows','Global from layer 1','Global'],
   ['Compute on images','Efficient','Heavier (O(n²))','Very heavy'],
   ['Best regime','Small–medium data','Large-scale data','Tiny inputs'],
  ]},
  pitfalls:[
   ['No normalisation','— deep CNNs need BatchNorm/GroupNorm to train.'],
   ['Wrong padding/stride','silently changes output sizes and alignment.'],
   ['Forgetting augmentation','— CNNs overfit without flips/crops/colour jitter.'],
   ['Tiny datasets','— without transfer learning, deep CNNs overfit fast.'],
  ],
 },
};

const test=require('node:test');
const assert=require('node:assert/strict');
let Flight;
try { ({Flight}=require('./flight.js')); } catch {}
const from={focus:{x:2,y:-1,z:4},orientation:{x:0,y:0,z:0,w:1},zoom:.4};
const to={focus:{x:-3,y:2,z:-6},orientation:{x:0,y:1,z:0,w:0},zoom:1.8};
test('voyage travels continuously, brakes at destination and restores an exact departure view',async()=>{
  assert.equal(typeof Flight,'function');const f=new Flight();const arrival=f.start(from,to,420);
  assert.deepEqual(f.advance(0),from);const a=f.advance(105),b=f.advance(210),c=f.advance(105);
  assert.ok(a.focus.x<from.focus.x&&a.focus.x>to.focus.x);assert.ok(b.zoom>a.zoom&&b.zoom<to.zoom);
  assert.deepEqual(c,to);assert.equal(await arrival,true);assert.equal(f.active,false);
  const back=f.start(c,from,420);assert.deepEqual(f.advance(420),from);assert.equal(await back,true);
});
test('taking control or choosing another destination resolves old travel as cancelled',async()=>{
  assert.equal(typeof Flight,'function');const f=new Flight();const old=f.start(from,to,420);const midway=f.advance(100);
  f.cancel();assert.equal(await old,false);assert.equal(f.active,false);
  const second=f.start(midway,to,420);const third=f.start(midway,from,420);
  assert.equal(await second,false);f.advance(420);assert.equal(await third,true);
});
test('reduced motion completes immediately and extremely distant zoom stays finite',async()=>{
  assert.equal(typeof Flight,'function');const f=new Flight();const far={...from,zoom:Number.MIN_VALUE};
  const immediate=f.start(far,to,0);assert.deepEqual(f.advance(0),to);assert.equal(await immediate,true);
  const normal=f.start(far,to,420);const middle=f.advance(210);assert.ok(Number.isFinite(middle.zoom)&&middle.zoom>0);
  f.advance(210);await normal;
});
test('quaternions use the short rotation and travel is frame-rate independent',()=>{
  assert.equal(typeof Flight,'function');const a=new Flight(),b=new Flight();const opposite={...to,orientation:{x:0,y:0,z:0,w:-1}};
  a.start(from,opposite,420);b.start(from,opposite,420);
  for(let i=0;i<6;i++)a.advance(16);b.advance(96);
  assert.deepEqual(a.view,b.view);assert.equal(a.view.orientation.w,1);
});

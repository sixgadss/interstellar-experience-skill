(function(root){
  'use strict';
  const copy=view=>({focus:{...view.focus},orientation:{...view.orientation},zoom:view.zoom});
  // Matches the interface's --ease-in-out cubic-bezier(.65,0,.35,1).
  function progress(t){
    if(t<=0||t>=1)return Math.max(0,Math.min(1,t));
    let lo=0,hi=1,u=t;
    for(let i=0;i<20;i++){u=(lo+hi)/2;const x=3*(1-u)**2*u*.65+3*(1-u)*u*u*.35+u**3;if(x<t)lo=u;else hi=u;}
    return 3*(1-u)*u*u+u**3;
  }
  function interpolate(a,b,t){
    if(t<=0)return copy(a);if(t>=1)return copy(b);
    const p=progress(t),focus={};
    for(const axis of ['x','y','z'])focus[axis]=a.focus[axis]*(1-p)+b.focus[axis]*p;
    const keys=['x','y','z','w'],dot=keys.reduce((n,k)=>n+a.orientation[k]*b.orientation[k],0),sign=dot<0?-1:1;
    const angle=Math.acos(Math.min(1,Math.abs(dot))),sin=Math.sin(angle);
    const weights=sin>.0001?[Math.sin((1-p)*angle)/sin,Math.sin(p*angle)/sin]:[1-p,p];
    const orientation=Object.fromEntries(keys.map(k=>[k,a.orientation[k]*weights[0]+b.orientation[k]*sign*weights[1]]));
    const length=Math.hypot(...Object.values(orientation));for(const k of keys)orientation[k]/=length;
    return {focus,orientation,zoom:Math.exp(Math.log(a.zoom)*(1-p)+Math.log(b.zoom)*p)};
  }
  class Flight {
    active=false;
    start(from,to,duration){
      this.cancel();this.from=copy(from);this.to=copy(to);this.view=copy(from);this.elapsed=0;this.duration=Math.max(0,duration);this.active=true;
      return new Promise(resolve=>{this.resolve=resolve;});
    }
    advance(dt){
      if(!this.active)return this.view;
      this.elapsed+=Math.max(0,dt);const t=this.duration?Math.min(1,this.elapsed/this.duration):1;
      this.view=interpolate(this.from,this.to,t);
      if(t===1){this.active=false;this.resolve(true);this.resolve=null;}
      return this.view;
    }
    cancel(){if(this.active){this.active=false;this.resolve(false);this.resolve=null;}}
  }
  const api={Flight};if(typeof module!=='undefined')module.exports=api;else root.InterstellarFlight=api;
})(typeof window==='undefined'?globalThis:window);

/* stage.js — 3D 무대: 지금은 임시 도형 캐릭터. 나중에 VRoid(VRM) + XSTAGE 모션으로 교체 */
"use strict";
/* ───────── 3D 무대 (임시 도형 캐릭터 · 실제로는 VRoid 캐릭터 + XSTAGE 모션으로 교체) ───────── */
const stage=(function(){
  const hasGL=!!window.THREE;
  let renderer,scene,camera,turn,J=null,curMotion="idle",mStart=0,mDur=0,clock,camGoal=null,camBase,parentEl=null,ground,orbit=false,curId=null;
  let yaw=0,yawGoal=0,drag=null;
  const canvas=document.createElement("canvas");
  if(hasGL){
    renderer=new THREE.WebGLRenderer({canvas,antialias:true});
    renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1)); renderer.outputEncoding=THREE.sRGBEncoding;
    scene=new THREE.Scene(); camera=new THREE.PerspectiveCamera(32,1,0.1,60);
    camBase={pos:new THREE.Vector3(0,1.32,4.1),look:new THREE.Vector3(0,1.02,0)}; camera.position.copy(camBase.pos);
    scene.add(new THREE.HemisphereLight(0xfff1f4,0x40384a,0.85));
    const kl=new THREE.DirectionalLight(0xffffff,0.9); kl.position.set(2.4,4,3); scene.add(kl);
    const rim=new THREE.DirectionalLight(0xffc6d6,0.55); rim.position.set(-3,2.4,-2.5); scene.add(rim);
    ground=new THREE.Mesh(new THREE.CircleGeometry(2.2,48),new THREE.MeshToonMaterial({color:0x3a3444})); ground.rotation.x=-Math.PI/2; scene.add(ground);
    const ring=new THREE.Mesh(new THREE.RingGeometry(1.1,1.13,64),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.18})); ring.rotation.x=-Math.PI/2; ring.position.y=.002; scene.add(ring);
    turn=new THREE.Group(); scene.add(turn); clock=new THREE.Clock();
    canvas.addEventListener("pointerdown",e=>{drag={x:e.clientX,y0:yawGoal};canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener("pointermove",e=>{if(drag) yawGoal=drag.y0+(e.clientX-drag.x)*0.012;});
    canvas.addEventListener("pointerup",()=>{drag=null;});
    document.addEventListener("click",e=>{const b=e.target.closest("[data-view]"); if(b) yawGoal=+b.dataset.view;});
    requestAnimationFrame(loop);
  }
  const mat=c=>new THREE.MeshToonMaterial({color:c});
  function buildChar(c){
    const g=new THREE.Group(),skin=mat(c.skin),top=mat(c.top),bot=mat(c.bottom),hair=mat(c.hair),dark=mat(0x222026),f=c.female?0.94:1;
    const legGeo=new THREE.CylinderGeometry(0.07*f,0.06*f,0.78,12);
    for(const s of [-1,1]){const l=new THREE.Mesh(legGeo,bot);l.position.set(0.1*s*f,0.39,0);g.add(l);const sh=new THREE.Mesh(new THREE.BoxGeometry(0.11,0.06,0.2),c.dancer?mat(0xffffff):dark);sh.position.set(0.1*s*f,0.03,0.03);g.add(sh);}
    const hips=new THREE.Group(); hips.position.y=0.8; g.add(hips);
    hips.add(new THREE.Mesh(new THREE.CylinderGeometry(0.17*f,0.16*f,0.14,16),bot));
    const torso=new THREE.Group(); torso.position.y=0.06; hips.add(torso);
    const chest=new THREE.Mesh(new THREE.CylinderGeometry(0.2*f,0.16*f,0.5,16),top); chest.position.y=0.27; torso.add(chest);
    const cap=new THREE.Mesh(new THREE.SphereGeometry(0.2*f,16,10,0,Math.PI*2,0,Math.PI/2),top); cap.position.y=0.52; cap.scale.y=0.45; torso.add(cap);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.055,0.1,10),skin); neck.position.y=0.6; torso.add(neck);
    const head=new THREE.Group(); head.position.y=0.66; torso.add(head);
    const skull=new THREE.Mesh(new THREE.SphereGeometry(0.15,24,18),skin); skull.position.y=0.13; skull.scale.set(1,1.08,1); head.add(skull);
    for(const s of [-1,1]){const eye=new THREE.Mesh(new THREE.SphereGeometry(0.018,10,8),dark);eye.position.set(0.052*s,0.13,0.138);eye.scale.y=1.4;head.add(eye);}
    const hcap=new THREE.Mesh(new THREE.SphereGeometry(0.162,24,16,0,Math.PI*2,0,Math.PI*0.56),hair); hcap.position.y=0.15; head.add(hcap);
    const fringe=new THREE.Mesh(new THREE.BoxGeometry(0.27,0.07,0.06),hair); fringe.position.set(0,0.235,0.12); fringe.rotation.x=0.35; head.add(fringe);
    if(c.style==="long"){const b=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.42,0.1),hair);b.position.set(0,0,-0.09);head.add(b);for(const s of [-1,1]){const sd=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.3,0.12),hair);sd.position.set(0.14*s,0.03,0.02);head.add(sd);}}
    if(c.style==="messy"){for(let i=0;i<5;i++){const t=new THREE.Mesh(new THREE.ConeGeometry(0.035,0.09,6),hair);const a=i/5*Math.PI*2;t.position.set(Math.cos(a)*0.1,0.29,Math.sin(a)*0.1);t.rotation.set(Math.sin(a)*0.6,0,-Math.cos(a)*0.6);head.add(t);}}
    if(c.style==="soft"){const b=new THREE.Mesh(new THREE.SphereGeometry(0.15,16,12),hair);b.position.set(0,0.12,-0.04);b.scale.set(1.05,0.95,1);head.add(b);}
    if(c.style==="short"){const b=new THREE.Mesh(new THREE.SphereGeometry(0.155,16,12),hair);b.position.set(0,0.14,-0.03);head.add(b);fringe.scale.set(1,0.8,1);}
    if(c.style==="idol"){const b=new THREE.Mesh(new THREE.SphereGeometry(0.165,16,12),hair);b.position.set(0,0.15,-0.03);b.scale.set(1.08,1,1.05);head.add(b);for(const s of [-1,1]){const t=new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8),hair);t.position.set(0.13*s,0.07,0.03);head.add(t);}}
    if(c.glasses){for(const s of [-1,1]){const r=new THREE.Mesh(new THREE.TorusGeometry(0.035,0.006,6,18),dark);r.position.set(0.055*s,0.13,0.15);head.add(r);}}
    function arm(s){const sh=new THREE.Group();sh.position.set(0.24*s*f,0.5,0);torso.add(sh);
      const up=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.048,0.3,10),top);up.position.y=-0.15;sh.add(up);
      const el=new THREE.Group();el.position.y=-0.3;sh.add(el);
      const lo=new THREE.Mesh(new THREE.CylinderGeometry(0.046,0.04,0.27,10),top);lo.position.y=-0.135;el.add(lo);
      const hd=new THREE.Mesh(new THREE.SphereGeometry(0.045,10,8),skin);hd.position.y=-0.29;el.add(hd);return {sh,el};}
    const L=arm(1),R=arm(-1);
    return {g,hips,torso,head,lsh:L.sh,lel:L.el,rsh:R.sh,rel:R.el};
  }
  function setCharacter(c){ if(!hasGL||!c||curId===c.id) return; if(J) turn.remove(J.g); J=buildChar(c); turn.add(J.g); curId=c.id; curMotion="idle"; yaw=yawGoal=0; }
  function setScene(st){ if(!hasGL||!st) return; orbit=false; scene.background=new THREE.Color(st.bg); scene.fog=new THREE.Fog(st.fog,6,14); ground.material.color.set(new THREE.Color(st.fog).offsetHSL(0,0,0.06)); }
  function decor(d,st){ if(!hasGL) return; orbit=d.cam==="orbit";
    const bgs={base:st?st.bg:0x222222,sunset:0x5a3040,neon:0x1a1040},fogs={base:st?st.fog:0x333333,sunset:0x8a4a50,neon:0x3a1a70};
    scene.background=new THREE.Color(bgs[d.bg]); scene.fog=new THREE.Fog(fogs[d.bg],6,14); }
  const IDLE={tx:0,tz:0,hx:0,hy:0,hz:0,lsx:0,lsz:0.12,rsx:0,rsz:-0.12,lex:-0.12,rex:-0.12,py:0,pz:0,ry:0};
  const K=o=>Object.assign({},IDLE,o);
  const LIB={
   idle:{d:1,keys:[[0,K({})]]},
   cross:{d:2.6,keys:[[0,K({})],[0.35,K({lsx:-0.55,lsz:0.32,lex:-1.9,rsx:-0.6,rsz:-0.32,rex:-1.95,tx:-0.05,hx:-0.05})],[2.1,K({lsx:-0.55,lsz:0.32,lex:-1.9,rsx:-0.6,rsz:-0.32,rex:-1.95,tx:-0.05,hy:0.15})],[2.6,K({})]]},
   look_away:{d:2.2,keys:[[0,K({})],[0.4,K({hy:0.75,hx:0.12,ry:0.18,rsx:-0.25,rex:-1.2})],[1.7,K({hy:0.7,hx:0.18,ry:0.2,rsx:-0.6,rsz:-0.1,rex:-2.2})],[2.2,K({})]]},
   sigh:{d:2.2,keys:[[0,K({})],[0.6,K({py:0.03,lsz:0.2,rsz:-0.2,hx:-0.15})],[1.4,K({py:-0.03,hx:0.35,tx:0.12,lsz:0.08,rsz:-0.08})],[2.2,K({})]]},
   toss:{d:1.9,keys:[[0,K({})],[0.45,K({rsx:0.6,rsz:-0.25,rex:-0.8,ry:-0.25,tx:-0.05})],[0.8,K({rsx:-1.3,rsz:-0.1,rex:-0.1,ry:0.15,tx:0.1})],[1.4,K({rsx:-0.9,rex:-0.3,hy:-0.3})],[1.9,K({})]]},
   turn_back:{d:2.6,keys:[[0,K({})],[0.7,K({ry:2.6,hx:0.1})],[1.8,K({ry:2.6,hx:0.15,hy:-0.4})],[2.6,K({})]]},
   reach:{d:2.4,keys:[[0,K({})],[0.5,K({rsx:-1.25,rsz:-0.05,rex:-0.15,pz:0.08,tx:0.08,hx:0.08})],[1.9,K({rsx:-1.2,rsz:-0.05,rex:-0.2,pz:0.08,tx:0.08,hx:0.12})],[2.4,K({})]]},
   pat:{d:2.8,keys:[[0,K({})],[0.5,K({rsx:-2.2,rsz:-0.2,rex:-0.75,pz:0.12,tx:0.12,hx:0.1})],[2.3,K({rsx:-2.2,rsz:-0.2,rex:-0.75,pz:0.12,tx:0.12,hx:0.1})],[2.8,K({})]],osc:t=>t>0.5&&t<2.3?{rsz:Math.sin(t*12)*0.12}:{}},
   nod:{d:1.6,keys:[[0,K({})],[1.6,K({})]],osc:t=>({hx:Math.max(0,Math.sin(t*9))*0.3*(1-t/1.6)})},
   laugh:{d:2,keys:[[0,K({})],[0.3,K({hx:-0.3,tx:-0.08,lsz:0.25,rsz:-0.25,lex:-0.6,rex:-0.6})],[1.6,K({hx:-0.2,tx:0.1,lsz:0.2,rsz:-0.2,lex:-0.5,rex:-0.5})],[2,K({})]],osc:t=>t<1.7?{py:Math.abs(Math.sin(t*14))*0.025}:{}},
   step_in:{d:2.4,keys:[[0,K({})],[0.7,K({pz:0.32,tx:0.12,hx:0.1})],[1.8,K({pz:0.32,tx:0.1,hx:0.05,hz:0.12})],[2.4,K({})]],osc:t=>t<0.7?{py:Math.abs(Math.sin(t*9))*0.03}:{}},
   fluster:{d:2,keys:[[0,K({})],[0.25,K({lsx:-1.1,rsx:-1.1,lex:-1.4,rex:-1.4,hx:0.1})],[1.7,K({lsx:-1.1,rsx:-1.1,lex:-1.4,rex:-1.4,hx:0.1})],[2,K({})]],osc:t=>t>0.25&&t<1.7?{lsz:0.3+Math.sin(t*22)*0.25,rsz:-0.3-Math.sin(t*22+1)*0.25,hy:Math.sin(t*10)*0.15}:{}},
   surprise:{d:1.8,keys:[[0,K({})],[0.2,K({pz:-0.12,py:0.04,lsx:-0.6,lsz:0.6,rsx:-0.6,rsz:-0.6,lex:-1.2,rex:-1.2,hx:-0.2})],[1.2,K({pz:-0.1,lsx:-0.5,lsz:0.5,rsx:-0.5,rsz:-0.5,lex:-1.1,rex:-1.1})],[1.8,K({})]]},
   wave:{d:2.2,keys:[[0,K({})],[0.4,K({rsz:-2.5,rex:-0.5,hz:0.1})],[1.8,K({rsz:-2.5,rex:-0.5,hz:0.1})],[2.2,K({})]],osc:t=>t>0.4&&t<1.8?{rex:-0.5+Math.sin(t*12)*0.45}:{}},
   hug:{d:3,keys:[[0,K({})],[0.6,K({pz:0.35,lsx:-1.3,lsz:0.7,rsx:-1.3,rsz:-0.7,lex:-0.3,rex:-0.3,hx:0.1})],[1.2,K({pz:0.42,lsx:-1.35,lsz:0.15,rsx:-1.35,rsz:-0.15,lex:-1.3,rex:-1.3,hx:0.2,hz:0.15})],[2.4,K({pz:0.42,lsx:-1.35,lsz:0.15,rsx:-1.35,rsz:-0.15,lex:-1.3,rex:-1.3,hx:0.2,hz:0.15})],[3,K({})]]},
   heart:{d:4,keys:[[0,K({})],[0.4,K({lsx:-2.6,lsz:-0.35,lex:-1.0,rsx:-2.6,rsz:0.35,rex:-1.0,hx:-0.1})],[1.6,K({lsx:-2.6,lsz:-0.35,lex:-1.0,rsx:-2.6,rsz:0.35,rex:-1.0,hz:0.2})],[2.1,K({lsx:-1.2,lsz:0.2,lex:-1.6,rsx:-1.2,rsz:-0.2,rex:-1.6,ry:0.4})],[3.2,K({lsx:-1.2,lsz:0.2,lex:-1.6,rsx:-1.2,rsz:-0.2,rex:-1.6,ry:-0.4})],[4,K({})]],osc:t=>({py:Math.abs(Math.sin(t*7.5))*0.05,hz:Math.sin(t*7.5)*0.08,tz:Math.sin(t*3.75)*0.06})},
   point:{d:3.2,keys:[[0,K({})],[0.4,K({rsz:-2.2,rex:-0.1,ry:0.3})],[1.0,K({rsx:-1.4,rsz:-0.2,rex:0,ry:-0.3,pz:0.1})],[1.8,K({lsz:2.2,lex:-0.1,ry:-0.3})],[2.6,K({lsx:-1.4,lsz:0.2,lex:0,ry:0.3,pz:0.1})],[3.2,K({})]],osc:t=>({py:Math.abs(Math.sin(t*7.5))*0.045})}
  };
  const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
  function poseAt(m,t){const L=LIB[m]||LIB.idle,ks=L.keys;let p=ks[ks.length-1][1];
    for(let i=0;i<ks.length-1;i++){ if(t>=ks[i][0]&&t<=ks[i+1][0]){const a=ks[i][1],b=ks[i+1][1],u=ease((t-ks[i][0])/(ks[i+1][0]-ks[i][0]||1));p={};for(const k in IDLE)p[k]=a[k]+(b[k]-a[k])*u;break;} }
    if(L.osc){const o=L.osc(t);p=Object.assign({},p);for(const k in o)p[k]=(p[k]||0)+o[k];} return p;}
  const timers={};
  function play(m,opt){
    opt=opt||{}; curMotion=LIB[m]?m:"idle"; mDur=(LIB[curMotion]||LIB.idle).d; mStart=hasGL?clock.getElapsedTime():0;
    const tgt=opt.target||({home:"Hero",record:"Rec",community:"Com"}[view]||"Ov");
    const sub=$("#sub"+tgt),key=$("#key"+tgt);
    if(sub&&opt.sub){sub.textContent=opt.sub;sub.classList.add("on");clearTimeout(timers[tgt+"s"]);timers[tgt+"s"]=setTimeout(()=>sub.classList.remove("on"),Math.max(2800,opt.sub.length*120));}
    if(key){ if(opt.key){key.textContent="결정적 순간 · "+opt.key;key.classList.add("on");clearTimeout(timers[tgt+"k"]);timers[tgt+"k"]=setTimeout(()=>key.classList.remove("on"),mDur*1000+1200);} else key.classList.remove("on"); }
    if(hasGL&&opt.cam){ const close=opt.cam===true||opt.cam==="close";
      camGoal={pos:close?new THREE.Vector3(0.35,1.48,2.55):new THREE.Vector3(0,1.32,3.6),look:new THREE.Vector3(0,close?1.25:1.05,0),until:clock.getElapsedTime()+mDur+0.6}; }
  }
  function apply(p,t){const br=Math.sin(t*2.1)*0.012;
    J.hips.position.y=0.8+p.py+br*0.5; J.g.position.z=p.pz; J.g.rotation.y=p.ry;
    J.torso.rotation.x=p.tx+br; J.torso.rotation.z=p.tz; J.head.rotation.set(p.hx,p.hy,p.hz);
    J.lsh.rotation.set(p.lsx,0,p.lsz+br); J.rsh.rotation.set(p.rsx,0,p.rsz-br); J.lel.rotation.x=p.lex; J.rel.rotation.x=p.rex;}
  function loop(){
    requestAnimationFrame(loop); if(!parentEl||!J) return;
    const t=clock.getElapsedTime(),mt=t-mStart;
    apply(mt<=mDur?poseAt(curMotion,mt):IDLE,t);
    if(orbit&&view==="record") yawGoal+=0.004;
    yaw+=(yawGoal-yaw)*0.12; turn.rotation.y=yaw;
    const goal=camGoal&&t<camGoal.until?camGoal:camBase; if(camGoal&&t>=camGoal.until) camGoal=null;
    camera.position.lerp(goal.pos,0.05);
    const look=(camera.userData.look||camBase.look.clone()).lerp(goal.look,0.05); camera.userData.look=look; camera.lookAt(look);
    renderer.render(scene,camera);
  }
  function resize(){ if(!parentEl||!hasGL) return; const w=parentEl.clientWidth,h=parentEl.clientHeight; if(!w||!h) return;
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.fov=w/h<0.8?42:32; camera.updateProjectionMatrix(); }
  function mount(el){ parentEl=el;
    if(hasGL){ el.insertBefore(canvas,el.firstChild); resize(); }
    else if(!el.querySelector(".fb")) el.insertAdjacentHTML("afterbegin",`<div class="fb" style="position:absolute;inset:0;display:grid;place-items:center;color:#ddd;font-size:13px;padding:20px;text-align:center">3D를 불러오지 못했어요. 대화와 모션 태그는 그대로 동작해요.</div>`); }
  window.addEventListener("resize",e=>resize(e));
  if(window.ResizeObserver) new ResizeObserver(resize).observe(document.body);
  return {mount,setCharacter,setScene,play,decor,dur:m=>(LIB[m]||LIB.idle).d};
})();

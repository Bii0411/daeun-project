/* chat.js — 대화 화면: 검정 바탕 채팅, 온도·긴장 게이지, 결정적 순간 3D 오버레이 */
"use strict";
/* ───────── 대화 ───────── */
function startChat(){
  const st=storyObj(), c=charObj();
  Object.assign(S,{isSample:false,w:c.id==="jihu"?20:0,t:c.id==="doyun"?35:20,turn:0,hist:[],lastMotion:null,lastKeyTurn:-9,replays:0,scriptIdx:0,laughs:0});recCache=null;
  show("chat"); stage.setCharacter(c); stage.setScene(st);
  $("#chatAv").style.backgroundImage=`url('${c.card}')`;
  $("#chatName").textContent=c.name; $("#chatTitle").textContent=st.title;
  $("#chatEyebrow").textContent=`${st.genre} · ${c.name} (${c.arch})`;
  const demo=st.id==="office"&&c.id==="doyun"; $("#scripted").checked=demo; $("#scripted").disabled=!demo;
  $("#drawer").hidden=true;
  $("#log").innerHTML=`<div class="chatintro"><div class="av big" style="background-image:url('${c.card}')"></div><b>${esc(c.name)}</b><small>${esc(c.arch)} · ${esc(st.genre)}</small><p class="note">대화 중에는 광고가 나오지 않아요 · 결정적 순간에만 3D로 움직여요</p></div>`;
  addNarr(st.setting); if(st.open) addNarr(st.open);
  const first=(c.open&&c.open[st.id])||"…처음 보는 얼굴이네. 여기서 뭐 해?";
  addChar(c,first,"");
  S.hist.push({role:"char",text:first,motion:c.sig,w:S.w,t:S.t,dw:0,dt:0,turn:0});
  $("#quick").innerHTML=st.quick.map(q=>`<button>${esc(q)}</button>`).join("");
  renderMotionList(); updateMeters(); updateRecordBtn();
}
function availMotions(c){return c.motions.concat(W.packs.includes(c.id)?PACKS[c.id].motions:[]);}
function renderMotionList(){$("#motionList").innerHTML=availMotions(charObj()).map(m=>`<span class="tag">${esc(MOTIONS[m].cat)} › ${esc(MOTIONS[m].label)}</span>`).join("");}
$("#quick").addEventListener("click",e=>{const b=e.target.closest("button"); if(b){$("#input").value=b.textContent;send();}});
function addNarr(t){const d=document.createElement("div");d.className="narr";d.textContent=t;$("#log").append(d);scrollLog();}
function addMe(t){const d=document.createElement("div");d.className="msg me";d.innerHTML=`<div class="bub"></div>`;d.firstChild.textContent=t;$("#log").append(d);scrollLog();}
function addChar(c,text,nar){const d=document.createElement("div");d.className="msg";
  d.innerHTML=`<div class="av" style="background-image:url('${c.card}')"></div><div class="mcol"><div class="who">${esc(c.name)}</div><div class="bub">${nar?`<span class="nar"></span>`:""}<span class="tx"></span></div></div>`;
  if(nar) d.querySelector(".nar").textContent=nar; d.querySelector(".tx").textContent=text; $("#log").append(d);scrollLog();}
function addKey(h){const d=document.createElement("button");d.className="keyline";
  d.innerHTML=`<span class="kl">결정적 순간</span><b>${esc(h.keyTitle||"관계가 바뀐 순간")}</b><small>XSTAGE · ${esc(MOTIONS[h.motion].label)} · 다시 보기 ▶</small>`;
  d.addEventListener("click",()=>keyMoment(h,true)); $("#log").append(d);scrollLog();}
function scrollLog(){const l=$("#log");l.scrollTop=l.scrollHeight;}
function keyCount(){return S.hist.filter(h=>h.key).length;}
function typeKey(w,t,keys){ if(w>=75&&keys>=3) return "H"; if(w>=40) return t<50?"A":"B"; return t>=50?"C":"D"; }
function updateMeters(){
  const w=S.w,t=S.t,wb=$("#wBar"),half=Math.abs(w)/2;
  wb.style.left=(w>=0?50:50-half)+"%"; wb.style.width=half+"%"; wb.style.background=w>=0?"var(--accent)":"var(--cool)";
  $("#wNum").textContent=(w>0?"+":"")+w;
  const tb=$("#tBar"); tb.style.left="0"; tb.style.width=t+"%"; tb.style.background="var(--cool)"; $("#tNum").textContent=t;
  $("#lean").innerHTML=`지금 흐름이라면 <b>${esc(charObj().types[typeKey(w,t,keyCount())][0])}</b> 쪽으로 기우는 중`;
  $("#keyCount").textContent=`결정적 순간 ${keyCount()}번 · 대화당 2~4번 나오도록 조정`;
}
function updateRecordBtn(){const b=$("#toRecord");b.disabled=S.turn<3;b.textContent=S.turn<3?`기록 ${3-S.turn}`:"변화 기록";b.classList.toggle("pri",S.turn>=3);}
$("#chatMenu").addEventListener("click",()=>{$("#drawer").hidden=!$("#drawer").hidden;});
$("#chatBack").addEventListener("click",()=>{ if(S.story==="custom"){show("make");renderMake();} else openDetail(S.char); });

$("#sendBtn").addEventListener("click",e=>send(e));
$("#input").addEventListener("keydown",e=>{ if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing){e.preventDefault();send();} });
$("#input").addEventListener("input",e=>{const t=e.target;t.style.height="auto";t.style.height=Math.min(120,t.scrollHeight)+"px";});
async function send(){
  if(S.busy) return; const msg=$("#input").value.trim(); if(!msg) return;
  $("#input").value=""; $("#input").style.height=""; S.busy=true; $("#sendBtn").disabled=true;
  addMe(msg); S.hist.push({role:"user",text:msg,turn:S.turn+1});
  const c=charObj(), typing=document.createElement("div");typing.className="msg typing";
  typing.innerHTML=`<div class="av" style="background-image:url('${c.card}')"></div><div class="bub"><i></i><i></i><i></i></div>`;
  $("#log").append(typing);scrollLog();
  const r=await getReply(msg);   /* api.js: 시연 시나리오 → 백엔드 → 규칙 기반 순서로 답을 받아옴 */
  typing.remove(); applyTurn(r);
  S.busy=false; $("#sendBtn").disabled=false; $("#input").focus({preventScroll:true});
}
function applyTurn(r){
  const c=charObj(); S.turn++;
  S.w=clamp(S.w+r.dw,-100,100); S.t=clamp(S.t+r.dt,0,100);
  /* 규칙 검사: AI 후보 + 직전 연출과 2턴 이상 간격 + 세션당 최대 4번 (시연·챌린지는 예외) */
  const key=r.key&&keyCount()<4&&(r.forced||S.turn-S.lastKeyTurn>=2);
  let motion=r.motion; if(!key&&motion===S.lastMotion) motion=c.motions.find(m=>m!==motion)||motion;
  S.lastMotion=motion; if(key) S.lastKeyTurn=S.turn;
  addChar(c,r.reply,r.narration);
  const h={role:"char",text:r.reply,narration:r.narration,emotion:r.emotion,motion,w:S.w,t:S.t,dw:r.dw,dt:r.dt,key,keyTitle:r.keyTitle,turn:S.turn};
  S.hist.push(h);
  if(key){ addKey(h); if(!W.missions.key){W.missions.key=true;earnStep(3,"미션: 결정적 순간 만나기");} if(motion==="heart"&&!W.missions.chal){W.missions.chal=true;earnStep(5,"모션 챌린지 참여");} keyMoment(h,false); }
  else $("#hudMini").innerHTML=`최근 감정 "${esc(r.emotion||"기본")}" · 평소에는 글로만 대화해요`;
  updateMeters(); updateRecordBtn();
}
/* ───────── 결정적 순간: 3D 오버레이 ───────── */
let ovTimer=null,ovHist=null;
function openOv(motion,sub,title,hud){
  const ov=$("#ov"); ov.hidden=false; requestAnimationFrame(()=>ov.classList.add("on"));
  stage.mount($("#stageOv"));
  $("#hudOv").innerHTML=hud;
  setTimeout(()=>stage.play(motion,{sub,key:title,target:"Ov",cam:true}),250);
  clearTimeout(ovTimer); ovTimer=setTimeout(closeOv,(stage.dur(motion)+1.6)*1000);
}
function keyMoment(h,isReplay){
  if(!$("#fx3d").checked&&!isReplay){ $("#hudMini").innerHTML=`3D 연출 꺼짐 · ${esc(MOTIONS[h.motion].label)} 생략`; return; }
  ovHist=h; $("#ovSkip").textContent=view==="chat"?"건너뛰고 대화로":"닫기";
  openOv(h.motion,h.text,h.keyTitle||"결정적 순간",`XSTAGE 태그 매칭 · <b>${esc(MOTIONS[h.motion].cat)} › ${esc(MOTIONS[h.motion].label)}</b>`);
}
function previewMotion(c,motion,sub){
  stage.setCharacter(c); stage.setScene(storyObj()||STORIES[0]);
  ovHist={motion,text:sub,keyTitle:c.name+" 대표 모션"}; $("#ovSkip").textContent="닫기";
  openOv(motion,sub,c.name+" 대표 모션",`XSTAGE 모션 · <b>${esc(MOTIONS[motion].label)}</b>`);
}
function closeOv(){const ov=$("#ov");ov.classList.remove("on");clearTimeout(ovTimer);setTimeout(()=>{ov.hidden=true;const mt={record:"#stageRec",community:"#stageCom"}[view];if(mt)stage.mount($(mt));},350);}
$("#ovSkip").addEventListener("click",e=>closeOv(e));
$("#ovReplay").addEventListener("click",()=>{ if(ovHist) openOv(ovHist.motion,ovHist.text,ovHist.keyTitle||"결정적 순간",$("#hudOv").innerHTML); });
$("#toRecord").addEventListener("click",e=>gateRecord(e));

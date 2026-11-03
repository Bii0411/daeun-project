/* home.js — 홈 화면 + 탭 이동 */
"use strict";
function show(v){
  view=v;
  for(const k of ["home","chat","record","community"]) $("#v-"+k).hidden=k!==v;
  document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.tab===v));
  stage.mount($({home:"#stageHero",chat:"#stageMini",record:"#stageRec",community:"#stageCom"}[v]));
  if(v==="community"){stage.setCharacter(charObj("haram"));stage.setScene(STORIES[2]);}
  if(v==="home"){stage.setCharacter(charObj());stage.setScene(storyObj()||STORIES[0]);}
  window.scrollTo(0,0);
}
$("#tabs").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(!b)return;const v=b.dataset.tab;
  if(v==="chat"){ if(S.hist.length&&!S.isSample){show("chat");stage.setCharacter(charObj());stage.setScene(storyObj());} else startChat(); }
  else if(v==="record"){ if(S.turn>=3&&!S.isSample) gateRecord(); else loadSample(); }
  else if(v==="home"){show("home");renderHome();} else {show("community");renderCommunity();}
});

function storyObj(){ if(S.story==="custom") return S.custom; return STORIES.find(s=>s.id===S.story)||SPECIALS.find(s=>s.id===S.story); }
function charObj(id){return CHARS.find(c=>c.id===(id||S.char));}
function face(c){return `<div class="face" style="background:${c.color}">${c.name.slice(-2,-1)}</div>`;}
function renderHome(){
  $("#charGrid").innerHTML=CHARS.map(c=>`<button class="card${S.char===c.id?" sel":""}" data-char="${c.id}"><div class="row">${face(c)}<div><h3>${esc(c.name)}</h3><span class="tag ${c.hot?"hot":"acc"}">${esc(c.arch)}</span> <span class="tag">${esc(c.mood)}</span></div></div><p>${esc(c.persona)}</p></button>`).join("");
  $("#storyGrid").innerHTML=STORIES.map(s=>`<button class="card${S.story===s.id?" sel":""}" data-story="${s.id}"><div class="swatch" style="background:${s.sw}"><b>${esc(s.genre)}</b></div><h3>${esc(s.title)}</h3><p>${esc(s.open)}</p></button>`).join("")+
   `<button class="card${S.story==="custom"?" sel":""}" data-story="custom"><div class="swatch" style="background:repeating-linear-gradient(45deg,var(--sunk),var(--sunk) 8px,var(--surface) 8px,var(--surface) 16px)"><b style="color:var(--ink);text-shadow:none">직접 쓰기</b></div><h3>내가 쓰는 이야기</h3><p>배경과 첫 장면을 직접 쓰면, 그 위에서 대화가 시작돼요.</p></button>`;
  $("#specialGrid").innerHTML=SPECIALS.map(s=>{const c=charObj(s.char),open=W.unlocked.includes(s.id);
    const cost=[s.cost.step?`스텝 ${s.cost.step}`:"",s.cost.jump?`점프 ${s.cost.jump}`:""].filter(Boolean).join(" 또는 ");
    return `<button class="card${S.story===s.id?" sel":""}" data-special="${s.id}"><div class="swatch" style="background:${s.sw}"><b>${esc(c.name)} 전용</b><span class="lock">${open?"열림":cost}</span></div><h3>${esc(s.title)}</h3><p>${esc(s.open)}</p>${s.dance?'<span class="tag gold" style="align-self:flex-start">XSTAGE 댄스 모션 포함</span>':""}</button>`;}).join("");
  $("#customBox").hidden=S.story!=="custom";
  const ok=S.story!=="custom"||$("#cSet").value.trim().length>4;
  $("#startBtn").disabled=!ok;
  const st=storyObj(),c=charObj();
  $("#pickNote").textContent=ok?`${c.name} × ${st?st.title:"내가 쓰는 이야기"}`:"배경과 첫 장면을 조금 더 써 주세요.";
}
document.addEventListener("click",e=>{
  const st=e.target.closest("[data-story]"); if(st){S.story=st.dataset.story;renderHome();stage.setScene(storyObj()||STORIES[0]);return;}
  const ch=e.target.closest("[data-char]"); if(ch){S.char=ch.dataset.char;renderHome();const c=charObj();stage.setCharacter(c);stage.play(c.sig,{sub:c.open[S.story]||c.open.office,target:"Hero"});$("#hudHero").innerHTML=`대표 모션 · <b>${esc(MOTIONS[c.sig].label)}</b>`;return;}
  const sp=e.target.closest("[data-special]"); if(sp){const s=SPECIALS.find(x=>x.id===sp.dataset.special);
    if(!W.unlocked.includes(s.id)){ if(!spend(s.cost,s.title)) return; W.unlocked.push(s.id); save(); }
    S.story=s.id;S.char=s.char;startChat();return;}
  const op=e.target.closest("[data-open]"); if(op){ openPlus(); return; }
});
$("#cSet").addEventListener("input",e=>renderHome(e));
$("#startBtn").addEventListener("click",()=>{
  if(S.story==="custom") S.custom={id:"custom",title:$("#cTitle").value.trim()||"나만의 이야기",genre:"직접 쓴 이야기",setting:$("#cSet").value.trim(),open:"",bg:0x262330,fog:0x302c3c,sw:"",quick:["여긴 어디야?","너는 누구야?","같이 있어도 돼?"]};
  startChat();
});
$("#demoRecBtn").addEventListener("click",e=>loadSample(e));
$("#recHome").addEventListener("click",()=>{show("home");renderHome();});

/* home.js — 앱 화면 이동 + 홈(배너·캐릭터 카드) + 캐릭터 상세(이야기 고르기) + 만들기 + 대화 목록 + 마이페이지 */
"use strict";
const TAB_VIEWS=["home","community","make","list","my"];
const ALL_VIEWS=["home","detail","chat","record","community","make","list","my"];
function show(v){
  view=v;
  for(const k of ALL_VIEWS) $("#v-"+k).hidden=k!==v;
  $("#tabs").hidden=!TAB_VIEWS.includes(v);
  document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.tab===v));
  const mt={record:"#stageRec",community:"#stageCom"}[v]; if(mt) stage.mount($(mt));
  if(v==="community"){stage.setCharacter(charObj("haram"));stage.setScene(STORIES[2]);}
  const sc=$("#v-"+v+" .scroll"); if(sc) sc.scrollTop=0;
  window.scrollTo(0,0);
}
$("#tabs").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(!b)return;const v=b.dataset.tab;
  if(v==="home"){show("home");renderHome();}
  else if(v==="community"){show("community");renderCommunity();}
  else if(v==="make"){show("make");renderMake();}
  else if(v==="list"){show("list");renderList();}
  else {show("my");renderMy();}
});

function storyObj(){ if(S.story==="custom") return S.custom; return STORIES.find(s=>s.id===S.story)||SPECIALS.find(s=>s.id===S.story); }
function charObj(id){return CHARS.find(c=>c.id===(id||S.char));}
function face(c){return `<div class="face" style="background-image:url('${c.card}')" role="img" aria-label="${esc(c.name)}"></div>`;}
const BUBBLE=`<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 2C4.1 2 1 4.5 1 7.6c0 1.7.9 3.2 2.4 4.2L3 14.5l3-1.6c.6.1 1.3.2 2 .2 3.9 0 7-2.5 7-5.6S11.9 2 8 2z" fill="currentColor"/></svg>`;

/* ───────── 홈 ───────── */
let homeSeg="home", bIdx=0, bTimer=null;
function chatNum(c){return parseFloat(c.chats)||0;}
function renderHome(){
  const list=homeSeg==="rank"?CHARS.slice().sort((a,b)=>chatNum(b)-chatNum(a)):CHARS;
  $("#charGrid").innerHTML=list.map((c,i)=>`<button class="ccard" data-char="${c.id}">
    <div class="cimg" style="background-image:url('${c.card}')">
      <span class="chats">${BUBBLE}${esc(c.chats)}</span>${homeSeg==="rank"?`<span class="rankno">${i+1}</span>`:""}
      ${c.hot?'<span class="hotbadge">강한 맛</span>':""}
    </div>
    <div class="cinfo"><b class="hook">${esc(c.hook)}</b><p>${esc(c.desc)}</p><span class="tags">${c.tags.map(t=>"#"+esc(t)).join(" ")}</span></div>
  </button>`).join("");
  $("#specialGrid").innerHTML=SPECIALS.map(s=>{const c=charObj(s.char),open=W.unlocked.includes(s.id);
    const cost=[s.cost.step?`스텝 ${s.cost.step}`:"",s.cost.jump?`점프 ${s.cost.jump}`:""].filter(Boolean).join(" / ");
    return `<button class="spcard" data-special="${s.id}"><div class="spimg" style="background-image:linear-gradient(180deg,rgba(0,0,0,0) 30%,rgba(0,0,0,.85)),url('${c.card}')"><span class="lock">${open?"열림":cost}</span>${s.dance?'<span class="tag gold">XSTAGE 댄스</span>':""}</div><b>${esc(s.title)}</b><small>${esc(c.name)} 전용 에피소드</small></button>`;}).join("");
  renderBanner();
}
function renderBanner(){
  $("#btrack").innerHTML=BANNERS.map((b,i)=>`<button class="bslide" data-banner="${i}" style="background:linear-gradient(100deg,${b.c1} 35%,transparent 75%),url('${b.img}') right 12% top 18% / 44% auto no-repeat,${b.c1}">
    <span class="be">${esc(b.eyebrow)}</span><b class="bt">${esc(b.title)}</b><span class="bs" style="color:${b.c2}">${esc(b.sub)}</span></button>`).join("");
  setBanner(bIdx);
  clearInterval(bTimer); bTimer=setInterval(()=>{ if(view==="home") setBanner((bIdx+1)%BANNERS.length); },4500);
}
function setBanner(i){bIdx=i;$("#btrack").style.transform=`translateX(${-100*i}%)`;$("#bcount").textContent=`${i+1}/${BANNERS.length}`;}
let bx=null;
$("#banner").addEventListener("pointerdown",e=>{bx=e.clientX;});
$("#banner").addEventListener("pointerup",e=>{ if(bx===null) return; const dx=e.clientX-bx; bx=null;
  if(Math.abs(dx)>40){ e.preventDefault(); setBanner((bIdx+(dx<0?1:BANNERS.length-1))%BANNERS.length); bannerSwiped=true; setTimeout(()=>bannerSwiped=false,50); } });
let bannerSwiped=false;
$("#btrack").addEventListener("click",e=>{ const b=e.target.closest("[data-banner]"); if(!b||bannerSwiped) return;
  const go=BANNERS[+b.dataset.banner].go;
  if(go==="challenge"){show("community");renderCommunity();}
  else if(go==="sample") loadSample();
  else if(go==="plus") openPlus();
  else {show("community");renderCommunity();setTimeout(()=>$("#marketSec").scrollIntoView({behavior:"smooth"}),50);}
});
$("#homeSeg").addEventListener("click",e=>{const b=e.target.closest("[data-hseg]");if(!b)return;homeSeg=b.dataset.hseg;
  document.querySelectorAll("#homeSeg button").forEach(x=>x.classList.toggle("on",x===b)); renderHome();});

/* ───────── 캐릭터 상세: 이야기 고르기 ───────── */
function openDetail(id){
  S.char=id; const c=charObj();
  if(!STORIES.some(s=>s.id===S.story)&&!(SPECIALS.find(s=>s.id===S.story&&s.char===id))) S.story="office";
  show("detail");
  $("#dHero").style.backgroundImage=`linear-gradient(180deg,rgba(11,11,15,0) 45%,rgba(11,11,15,.96) 94%),url('${c.card}')`;
  $("#dChats").innerHTML=`${BUBBLE}${esc(c.chats)}`;
  $("#dName").textContent=c.name;
  $("#dHook").textContent=c.hook;
  $("#dTags").innerHTML=`<span class="tag ${c.hot?"hot":"acc"}">${esc(c.arch)}</span><span class="tag">${esc(c.mood)}</span>`+c.tags.map(t=>`<span class="tag">#${esc(t)}</span>`).join("");
  $("#dPersona").textContent=c.persona;
  $("#dSig").textContent=MOTIONS[c.sig].label;
  stage.setCharacter(c);   /* 3D 캐릭터를 미리 불러 두면 결정적 순간에 바로 나와요 */
  renderStories();
}
function renderStories(){
  const c=charObj();
  const sp=SPECIALS.filter(s=>s.char===c.id);
  $("#storyGrid").innerHTML=STORIES.map(s=>`<button class="srow${S.story===s.id?" sel":""}" data-story="${s.id}"><span class="sw" style="background:${s.sw}"></span><span class="st"><b>${esc(s.title)}</b><small>${esc(s.genre)} · ${esc(s.open)}</small></span><span class="rd"></span></button>`).join("")+
    sp.map(s=>{const open=W.unlocked.includes(s.id),cost=[s.cost.step?`스텝 ${s.cost.step}`:"",s.cost.jump?`점프 ${s.cost.jump}`:""].filter(Boolean).join(" / ");
      return `<button class="srow${S.story===s.id?" sel":""}" data-story="${s.id}"><span class="sw" style="background:${s.sw}"></span><span class="st"><b>${esc(s.title)} <span class="tag gold">특별</span></b><small>${open?"열림":cost} · ${esc(s.open)}</small></span><span class="rd"></span></button>`;}).join("")+
    `<button class="srow" data-goto="make"><span class="sw dashed">＋</span><span class="st"><b>직접 쓰기</b><small>배경과 첫 장면을 내가 써서 시작해요</small></span></button>`;
  const st=storyObj();
  $("#pickNote").textContent=st?`${c.name} × ${st.title}`:"";
}
$("#dMotion").addEventListener("click",()=>{const c=charObj();previewMotion(c,c.sig,c.open[S.story]||c.open.office);});
$("#startBtn").addEventListener("click",()=>{
  const s=SPECIALS.find(x=>x.id===S.story);
  if(s&&!W.unlocked.includes(s.id)){ if(!spend(s.cost,s.title)) return; W.unlocked.push(s.id); save(); }
  startChat();
});

document.addEventListener("click",e=>{
  const bk=e.target.closest("[data-back]"); if(bk){show(bk.dataset.back);if(bk.dataset.back==="home")renderHome();return;}
  const gt=e.target.closest("[data-goto]"); if(gt){ if(gt.dataset.goto==="make"){show("make");renderMake();} else {show("community");renderCommunity();setTimeout(()=>$("#marketSec").scrollIntoView({behavior:"smooth"}),50);} return; }
  const st=e.target.closest("[data-story]"); if(st){S.story=st.dataset.story;renderStories();return;}
  const ch=e.target.closest("[data-char]"); if(ch){openDetail(ch.dataset.char);return;}
  const sp=e.target.closest("[data-special]"); if(sp){const s=SPECIALS.find(x=>x.id===sp.dataset.special);S.story=s.id;openDetail(s.char);S.story=s.id;renderStories();return;}
  const op=e.target.closest("[data-open]"); if(op){ openPlus(); return; }
});

/* ───────── 만들기: 내가 쓰는 이야기 ───────── */
function renderMake(){
  $("#mkChars").innerHTML=CHARS.map(c=>`<button class="avopt${S.char===c.id?" on":""}" data-mkchar="${c.id}">${face(c)}<small>${esc(c.name)}</small></button>`).join("");
  $("#mkStart").disabled=$("#cSet").value.trim().length<5;
}
$("#mkChars").addEventListener("click",e=>{const b=e.target.closest("[data-mkchar]");if(!b)return;S.char=b.dataset.mkchar;renderMake();});
$("#cSet").addEventListener("input",()=>renderMake());
$("#mkStart").addEventListener("click",()=>{
  S.story="custom";
  S.custom={id:"custom",title:$("#cTitle").value.trim()||"나만의 이야기",genre:"직접 쓴 이야기",setting:$("#cSet").value.trim(),open:"",bg:0x262330,fog:0x302c3c,sw:"linear-gradient(135deg,#302c3c,#6b5a8a)",quick:["여긴 어디야?","너는 누구야?","같이 있어도 돼?"]};
  stage.setCharacter(charObj()); startChat();
});

/* ───────── 대화 목록 ───────── */
function renderList(){
  const has=S.hist.length&&!S.isSample;
  if(!has){ $("#convList").innerHTML=`<div class="empty"><p>아직 진행 중인 대화가 없어요.</p><button class="btn pri" data-tab-go="home">캐릭터 고르러 가기</button></div>`; return; }
  const c=charObj(),st=storyObj(),last=S.hist[S.hist.length-1];
  $("#convList").innerHTML=`<button class="convrow" id="resumeChat">${face(c)}<span class="st"><b>${esc(c.name)} <small>${esc(st.title)}</small></b><small>${esc(last.text)}</small></span><span class="note">${S.turn}턴</span></button>`;
  $("#resumeChat").addEventListener("click",()=>{show("chat");stage.setCharacter(c);stage.setScene(st);scrollLog();});
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-tab-go]");if(b){show(b.dataset.tabGo);renderHome();}});
$("#demoRecBtn").addEventListener("click",e=>loadSample(e));

/* ───────── 마이페이지 ───────── */
function renderMy(){
  const ms=[["출석 체크",W.checkin],["결정적 순간 만나기",W.missions.key],["릴스 공유하기",W.missions.share],["이번 주 모션 챌린지",W.missions.chal]];
  $("#myBody").innerHTML=`
   <div class="panel"><h3>내 지갑</h3>
     <div class="row"><span class="coin"><i class="dot step"></i>스텝 <b>${W.step}</b></span><span class="coin"><i class="dot jump"></i>점프 <b>${W.jump}</b></span></div>
     <div class="row" style="margin-top:10px"><button class="btn sm" id="myWallet">스텝 받기 · 점프 충전</button></div></div>
   <div class="panel plusrow"><div><h3>무브로그 PLUS</h3><p class="note">${W.plus?"이용 중이에요":"광고 없이 · 고급 AI + 장기 기억 · 매월 점프 30"}</p></div><button class="btn ${W.plus?"":"gold"} sm" id="myPlus">${W.plus?"관리":"월 13,000원"}</button></div>
   <div class="panel"><h3>미션</h3>${ms.map(m=>`<div class="mrow"><span>${m[0]}</span>${m[1]?'<span class="tag acc">완료</span>':'<span class="tag">진행 전</span>'}</div>`).join("")}</div>
   <div class="panel"><h3>유형 도감</h3><div class="mycodex">${CHARS.map(c=>{const g=(W.codex[c.id]||[]);return `<div class="mcx">${face(c)}<b>${esc(c.name)}</b><small>${g.filter(k=>k!=="H").length}/4${g.includes("H")?" · 히든":""}</small></div>`;}).join("")}</div></div>
   <div class="adbanner" data-ad="banner"${W.plus?" hidden":""}><span>광고 배너 영역 · 유형 도감 하단</span><button class="btn sm ghost" data-open="plus">PLUS면 광고 없음</button></div>`;
  $("#myWallet").addEventListener("click",()=>openWallet());
  $("#myPlus").addEventListener("click",()=>openPlus());
}
$("#recHome").addEventListener("click",()=>{show("home");renderHome();});

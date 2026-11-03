/* main.js — 시작: 모든 파일이 불러와진 뒤 맨 마지막에 실행 */
"use strict";
const today=new Date().toDateString(); if(W.day!==today){W.day=today;W.adsToday=0;W.checkin=false;save();}
renderWallet(); renderHome(); show("home");
setTimeout(()=>{const c=charObj();stage.play(c.sig,{sub:c.open.office,target:"Hero"});$("#hudHero").innerHTML=`대표 모션 · <b>${esc(MOTIONS[c.sig].label)}</b>`;},600);
setAiNote();

/* ui.js — 공통 도구: $(선택), esc(글자 안전 처리), clamp(범위 제한), toast(알림) */
"use strict";
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("on");clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove("on"),2400);}

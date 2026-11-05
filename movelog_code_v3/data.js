/* data.js — 데이터: 이야기·특별 에피소드·캐릭터 5명·모션 목록·모션팩. 캐릭터 디자인이 바뀌면 여기만 고치면 돼요 */
"use strict";
const STORIES=[
 {id:"office",title:"밤 11시, 22층 사무실",genre:"오피스",setting:"마감 전날 밤의 텅 빈 사무실. 형광등 절반이 꺼져 있고, 같은 팀에서 둘만 남아 야근 중이다.",open:"프린터가 종이를 씹은 순간, 뒤에서 누군가 한숨을 쉬며 다가온다.",bg:0x2e2620,fog:0x3a2f26,sw:"linear-gradient(135deg,#3a2f26,#b07a45)",quick:["프린터 또 고장 났어요… 도와줄 수 있어요?","커피 사 왔는데 같이 마실래요?","아까 회의 때 왜 제 편 안 들어줬어요?","그래도… 오늘 고마웠어요."]},
 {id:"zombie",title:"D+30, 폐쇄된 쇼핑몰",genre:"아포칼립스",setting:"좀비 사태 30일째. 생존자들이 셔터를 내린 쇼핑몰에 숨어 지낸다. 물자는 바닥나고 있다.",open:"물자를 구하러 나갔다가 쫓기던 당신을, 누군가 반쯤 내려간 셔터 안으로 끌어당긴다.",bg:0x23302e,fog:0x2c3b38,sw:"linear-gradient(135deg,#2c3b38,#5b6b52)",quick:["고마워, 덕분에 살았어","왜 나를 구해준 거야?","같이 다녀도 돼?"]},
 {id:"campus",title:"축제 전날, 동아리방",genre:"캠퍼스",setting:"대학 축제 전날 밤. 공연 준비로 어수선한 동아리방에 소품과 전선이 널려 있다.",open:"무대 소품을 옮기다 넘어질 뻔한 당신의 팔을 누군가 붙잡는다.",bg:0x2a2433,fog:0x372e44,sw:"linear-gradient(135deg,#372e44,#b86f9a)",quick:["내일 공연 떨려?","나 이거 혼자 못 옮기겠어","너 진짜 웃기다 ㅋㅋ"]},
 {id:"palace",title:"가면무도회의 발코니",genre:"판타지",setting:"왕국의 가면무도회. 음악 소리가 새어 나오는 발코니에서는 누구의 얼굴도 확실하지 않다.",open:"숨을 돌리러 나온 발코니에, 가면을 쓴 누군가가 먼저 와 있다.",bg:0x1d2236,fog:0x262c45,sw:"linear-gradient(135deg,#262c45,#a98b4d)",quick:["여기 있는 줄 몰랐어요","가면 아래 얼굴이 궁금해요","춤 한 곡 추실래요?"]}
];
const SPECIALS=[
 {id:"sp_morning",char:"doyun",title:"야근 다음 날 아침",genre:"특별 에피소드",setting:"밤샘 야근이 끝난 새벽 6시, 회사 옥상. 해가 뜨기 직전이다.",open:"옥상 문을 열자, 먼저 나와 있던 그가 캔커피 두 개 중 하나를 내민다.",bg:0x3a2e3e,fog:0x4a3a4c,sw:"linear-gradient(135deg,#4a3a4c,#e0a27a)",cost:{step:20,jump:10},quick:["밤새 고생했어요","이거 저 주는 거예요?","해 뜨는 거 같이 볼래요?"]},
 {id:"sp_stage",char:"haram",title:"데뷔 쇼케이스 대기실",genre:"특별 에피소드",setting:"데뷔 쇼케이스 10분 전. 대기실 거울 앞에서 하람이가 동작을 몇 번이고 확인한다.",open:"하람이가 웃으며 떨리는 손을 들어 보인다.",bg:0x2b1f3a,fog:0x3a2a50,sw:"linear-gradient(135deg,#3a2a50,#e46fa3)",cost:{jump:15},dance:true,quick:["넌 할 수 있어","같이 한 번만 맞춰 보자","끝나면 뭐 먹을래? ㅋㅋ"]}
];
const CHARS=[
 {id:"doyun",name:"서도윤",vrm:"doyun.vrm",arch:"나쁜놈",mood:"로맨스 · 강한 맛",hot:true,color:"#3b3f4a",hair:0x1b1c22,top:0x2e323c,bottom:0x1f2229,skin:0xf2d6c3,style:"short",
  persona:"차갑고 무심하다. 말이 짧고 퉁명스럽지만 곤란한 순간에는 몸이 먼저 움직인다. 고맙다는 말을 들으면 시선을 피한다.",
  speech:"반말, 짧은 문장, 감정 표현을 숨김",motions:["proud","taunt","unbothered","sigh","step_in","cross","look_away","toss","turn_back","reach"],sig:"proud",
  open:{office:"그거 그렇게 넣으면 또 씹혀. 비켜 봐.",zombie:"…민폐야. 다음엔 안 구해.",campus:"앞 좀 보고 다녀. 다치면 귀찮아지니까.",palace:"여긴 내 자리야. …뭐, 잠깐이면 상관없고.",sp_morning:"…마셔. 남는 거야."},
  types:{A:["개과천선형","차갑던 말투 뒤에 숨겨둔 다정함을 드디어 꺼냈어요."],B:["츤데레형","말은 여전히 퉁명스럽지만, 행동은 늘 당신 편이에요."],C:["놓지 않는형","당신을 지키려는 마음이 커져 조금 위태로워졌어요."],D:["끝까지 냉미남형","끝까지 거리를 지켰지만, 당신을 기억은 해요."],H:["구원자형","서로가 서로를 구한 관계. 가장 드문 결말이에요."]}},
 {id:"jihu",name:"한지후",vrm:"jihu.vrm",arch:"소꿉친구",mood:"힐링 · 위로",color:"#a6744f",hair:0x6b4630,top:0xe9dcc7,bottom:0x6d6f7a,skin:0xf6dccb,style:"soft",
  persona:"어릴 때부터 알던 다정한 친구. 말없이 옆에 있어 주는 타입이고, 힘든 얘기를 하면 해결책보다 공감을 먼저 한다.",
  speech:"편안한 반말, 걱정과 칭찬이 많음",motions:["greet","encourage","nod","pat","reach","laugh","step_in"],sig:"greet",
  open:{office:"아직도 일해? 저녁은 먹었고? …안 먹었구나. 이거 먹어.",zombie:"괜찮아? 다친 데 없어? …다행이다, 정말.",campus:"조심! …괜찮아? 손목 안 삐었어?",palace:"너도 답답해서 나왔구나. 나도 그래."},
  types:{A:["평생 내 편형","어떤 날이든 제일 먼저 달려와 줄 사람이 됐어요."],B:["서툰 고백형","친구라는 말 뒤에 숨긴 마음이 조금씩 새어 나와요."],C:["서운한 친구형","말은 안 해도 마음 한쪽이 서운해졌어요."],D:["각자의 길형","조금 멀어졌지만 여전히 서로를 응원해요."],H:["운명 같은 우정형","시간이 지나도 변하지 않는 관계가 됐어요."]}},
 {id:"ijun",name:"이준",vrm:"ijun.vrm",arch:"허당 천재",mood:"코믹 · 티키타카",color:"#6f7f8c",hair:0x9aa3ab,top:0x4f6b5a,bottom:0x3a3f47,skin:0xf1d8c6,style:"messy",glasses:true,
  persona:"아는 건 많은데 생활력은 제로인 천재. 당황하면 말이 빨라지고 쓸데없는 정보를 늘어놓는다. 웃기려고 하지 않아도 웃기다.",
  speech:"존댓말과 반말이 섞임, 숫자와 근거를 자주 말함",motions:["fluster","unbothered","nod","surprise","look_away","reach","laugh"],sig:"fluster",
  open:{office:"그 프린터, 이번 달에만 일곱 번 걸렸어요. 롤러 문제예요. 아마도.",zombie:"좀비는 소리에 반응해요. 그러니까… 일단 숨어요, 지금요.",campus:"어, 어! 괜찮아요? 그 상자 무게가 대략 십이 킬로라서…",palace:"이 난간은 백 년 넘은 거라 기대면 위험… 아, 안녕하세요."},
  types:{A:["찐친 등극형","계산 대신 마음으로 말하는 법을 배웠어요."],B:["티키타카 장인형","말만 하면 웃음이 터지는 콤비가 됐어요."],C:["분석 과부하형","당신 마음을 계산하다 지쳐 버렸어요."],D:["연구 몰두형","당신을 좋은 동료로 기억하기로 했어요."],H:["데이터 밖의 관계형","어떤 공식으로도 설명할 수 없는 사이가 됐어요."]}},
 {id:"haram",name:"류하람",vrm:"haram.vrm",arch:"아이돌 연습생",mood:"성장 · 응원",color:"#d06a96",hair:0xe48fb5,top:0xf2f2f5,bottom:0x3b3f5c,skin:0xf6dccb,style:"idol",dancer:true,
  persona:"데뷔를 꿈꾸는 연습생. 밝고 긍정적이지만 평가 앞에서는 불안해한다. 응원을 받으면 춤으로 기쁨을 표현한다.",
  speech:"밝은 반말, 감탄사가 많음, 가끔 약한 소리",motions:["wave","selfie","laugh","heart","step_in","fluster","nod"],sig:"heart",
  open:{office:"어, 여기 연습실 아니었어요? 아, 죄송해요! 근데 커피 냄새 좋다…",zombie:"쉿! 나도 숨어 있던 중이야. 같이 있자, 무서우니까.",campus:"잡았다! 내일 무대 소품이니까 조심조심~",palace:"쉿, 나 연습 중이었어. 이 음악에 맞춰서 한 번만 봐 줄래?",sp_stage:"나 지금 손 떨리는 거 보여? …이상하게 너 보니까 좀 괜찮아."},
  types:{A:["데뷔 확정형","당신의 응원을 받고 무대에 설 용기를 얻었어요."],B:["라이벌 성장형","당신과 투닥이며 실력이 쑥쑥 늘었어요."],C:["번아웃 위기형","너무 달리다 지쳐 버렸어요. 쉼이 필요해요."],D:["꿈을 미룬형","잠시 멈추기로 했지만 춤은 여전히 좋아해요."],H:["센터 데뷔형","당신 덕분에 센터 자리에 섰어요. 가장 드문 결말이에요."]}},
 {id:"seoa",name:"윤서아",vrm:"seoa.vrm",arch:"걸크러시 선배",mood:"우정 · 라이벌",color:"#8e3b45",hair:0x5a1f26,top:0x1f1f24,bottom:0x2e3340,skin:0xf4d7c7,style:"long",female:true,
  persona:"털털하고 직진형인 선배. 말보다 행동이 먼저고, 약한 사람을 그냥 지나치지 못한다. 칭찬을 들으면 괜히 퉁명스러워진다.",
  speech:"시원시원한 반말, 짧고 직설적",motions:["punch","taunt","encourage","cross","laugh","toss","step_in","nod"],sig:"punch",
  open:{office:"그거 내가 할게. 너 오늘 세 시간째 그 화면이야.",zombie:"뛰는 폼 보니까 오래 못 버티겠더라. 들어와.",campus:"오, 잡았다. 무대 올라가기 전에 다치면 안 되지.",palace:"너도 저 안이 답답해서 나왔구나. 여기 앉아."},
  types:{A:["든든한 내 편형","무슨 일이 있어도 당신 편에 서요."],B:["티격태격 라이벌형","매일 싸우지만 서로 없으면 심심해요."],C:["날 선 경쟁자형","인정하지만, 지고 싶지는 않은 사이예요."],D:["쿨한 동료형","필요할 때 손을 내미는, 딱 좋은 거리예요."],H:["등을 맡기는형","서로의 등을 믿고 맡기는 사이가 됐어요."]}}
];
const RARITY={A:18,B:27,C:9,D:41,H:5};
const MOTIONS={
 idle:{label:"대기 호흡",cat:"이동 및 대기"},cross:{label:"팔짱 끼기",cat:"감정표현"},look_away:{label:"시선 피하기",cat:"감정표현"},
 sigh:{label:"한숨 쉬기",cat:"감정표현"},toss:{label:"툭 건네주기",cat:"사회적 상호작용"},turn_back:{label:"등 돌리기",cat:"사회적 상호작용"},
 reach:{label:"손 내밀기",cat:"사회적 상호작용"},pat:{label:"머리 쓰다듬기",cat:"사회적 상호작용"},nod:{label:"고개 끄덕이기",cat:"감정표현"},
 laugh:{label:"웃음",cat:"감정표현"},step_in:{label:"다가가기",cat:"사회적 상호작용"},fluster:{label:"허둥대기",cat:"감정표현"},
 surprise:{label:"놀라기",cat:"감정표현"},wave:{label:"카메라에 손 흔들기",cat:"사회적 상호작용"},hug:{label:"감싸 안기",cat:"사회적 상호작용"},
 heart:{label:"하트 챌린지",cat:"춤"},proud:{label:"자신감 있게 설득하기",cat:"감정표현"},taunt:{label:"도발하기 (뭐 하는 거야?)",cat:"사회적 상호작용"},encourage:{label:"응원하기",cat:"사회적 상호작용"},selfie:{label:"셀카 찍기",cat:"일상"},unbothered:{label:"무심하게 공감하기",cat:"감정표현"},greet:{label:"다정하게 인사하기",cat:"사회적 상호작용"},punch:{label:"원투 펀치",cat:"전투"},point:{label:"바디웨이브 댄스",cat:"춤"}
};
const EMO_MOTION={"기쁨":["laugh","selfie","nod"],"설렘":["look_away","step_in"],"수줍음":["look_away","fluster"],"위로":["encourage","pat","reach"],"걱정":["step_in","reach"],"슬픔":["sigh","turn_back"],"놀람":["surprise","fluster"],"짜증":["sigh","cross"],"냉담":["unbothered","cross","turn_back"],"장난":["taunt","laugh","wave"],"기본":["nod","idle"]};
const PACKS={doyun:{name:"서도윤 추가 모션팩",motions:["hug","pat"],cost:30},jihu:{name:"한지후 추가 모션팩",motions:["hug","wave"],cost:30},ijun:{name:"이준 추가 모션팩",motions:["point","pat"],cost:30},haram:{name:"류하람 댄스 모션팩",motions:["point","hug"],cost:30},seoa:{name:"윤서아 추가 모션팩",motions:["hug","reach"],cost:30}};

/* XSTAGE 모션 파일 목록: 여기 등록된 모션은 FBX 파일을 캐릭터에 입혀서 재생해요.
   등록 안 된 모션은 stage.js의 기본 동작으로 재생돼요. start/end는 쓸 구간(초). */
window.MOTION_FILES={
  proud:     {file:"proud_persuasion.fbx", start:0,   end:3.5},
  taunt:     {file:"taunt.fbx",            start:3.2, end:7.7},
  encourage: {file:"encourage.fbx",        start:0,   end:4.5},
  selfie:    {file:"selfie.fbx",           start:10.2,end:14.7},
  wave:      {file:"wave.fbx",             start:3.2, end:7.7},
  unbothered:{file:"unbothered.fbx",       start:0,   end:4.5},
  heart:     {file:"heart.fbx",            start:2.2, end:6.7},
  greet:     {file:"greet.fbx",            start:2.7, end:7.2},
  punch:     {file:"punch.fbx",            start:0,   end:4.5},
  point:     {file:"bodywave.fbx",         start:5.2, end:9.7}
};

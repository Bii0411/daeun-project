# 백엔드 연결 약속 (나중에 백엔드 만들 때 참고)

프론트는 `js/api.js`의 `API_URL`만 채우면 아래 두 주소로 요청을 보냄.

## 1) POST /api/chat — 대화 한 턴
보내는 것
```json
{ "characterId": "doyun", "storyId": "office", "storySetting": "마감 전날 밤의…",
  "state": { "warmth": 20, "tension": 35, "turn": 3, "keyCount": 1 },
  "history": [ { "role": "user", "text": "…" }, { "role": "char", "text": "…" } ],
  "message": "커피 사 왔는데 같이 마실래요?",
  "allowedMotions": ["sigh","step_in","cross","look_away","toss","turn_back","reach"] }
```
받는 것
```json
{ "narration": "커피를 받아 들고 시선을 피한다", "reply": "…단 거 안 마시는데. 뭐, 이번만.",
  "emotion": "수줍음", "motion": "look_away", "warmth": 12, "tension": -2,
  "key": true, "keyTitle": "처음 받아 든 커피" }
```
- emotion: 기쁨, 설렘, 수줍음, 위로, 걱정, 슬픔, 놀람, 짜증, 냉담, 장난, 기본
- motion: allowedMotions 중 하나 / warmth·tension: -15~15 정수
- 서버가 할 일: 캐릭터 페르소나(data.js의 persona·speech) + 상태 + 최근 대화로 프롬프트 조립 → LLM 호출 → 위 JSON으로 반환
- 결정적 순간 최종 판정(간격·최대 횟수)은 프론트 chat.js의 applyTurn에도 규칙이 있음

## 2) POST /api/ending — 변화 기록 문구
보내는 것 `{ "characterId": "doyun", "typeName": "츤데레형", "history": [...], "others": ["jihu","ijun","haram","seoa"] }`
받는 것 `{ "ending": "캐릭터의 한마디", "reactions": { "jihu": "…", "ijun": "…", "haram": "…", "seoa": "…" } }`

## 주의
- LLM API 키는 서버 환경변수에만 저장 (프론트 코드에 넣으면 누구나 볼 수 있음)
- 프론트 주소에서 호출할 수 있게 CORS 허용 필요

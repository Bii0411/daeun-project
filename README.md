# 무브로그 프론트엔드 (프로토타입)

## 실행
- 가장 쉬운 방법: `index.html`을 더블클릭 → 크롬에서 열림
- 추천: VS Code에서 폴더 열기 → 확장 프로그램 "Live Server" 설치 → index.html 오른쪽 클릭 → "Open with Live Server"
  (코드를 저장할 때마다 브라우저가 자동 새로고침됨)

## 폴더 구조
```
movelog/
├─ index.html        화면 뼈대(HTML). 버튼·영역의 id가 여기 있음
├─ css/style.css     디자인(색·글꼴·배치)
└─ js/               기능 (index.html 아래쪽에서 이 순서대로 불러옴)
   ├─ ui.js          공통 도구 ($, toast 등)
   ├─ data.js        이야기·캐릭터·모션 데이터  ← 캐릭터 바뀌면 여기
   ├─ state.js       지갑(스텝·점프·PLUS)·대화 상태
   ├─ stage.js       3D 무대 (임시 캐릭터 → 나중에 VRM으로 교체)
   ├─ api.js         백엔드 통신 (지금은 API_URL 비어 있음 → 규칙 기반)
   ├─ home.js        홈 화면·탭
   ├─ chat.js        대화 화면·결정적 순간 연출
   ├─ record.js      변화 기록
   ├─ shop.js        광고·지갑·PLUS·공유
   ├─ community.js   커뮤니티
   └─ main.js        시작
```

## 규칙
- 새 js 파일을 만들면 index.html 아래 `<script>` 목록에 순서대로 추가
- 데이터(문구, 가격, 캐릭터)는 data.js, 화면 구조는 index.html, 꾸밈은 style.css
- API 키 같은 비밀값은 절대 이 폴더에 넣지 않기 (백엔드에만)

# 무브로그 앱으로 쓰기

웹과 같은 코드로 **홈 화면 설치(PWA)** 와 **Android APK(Capacitor)** 두 가지를 지원합니다.

## 1. PWA — 가장 빠름 (스토어 없이 “앱처럼”)

**조건:** `https://` 로 열려야 합니다 (GitHub Pages, 로컬 `http://127.0.0.1:8877`).

### Android (Chrome)

1. 사이트 접속
2. 메뉴 → **앱 설치** / **홈 화면에 추가**
3. 또는 화면 하단 **「앱으로 설치」** 배너

### iPhone (Safari)

1. **공유** 버튼 → **홈 화면에 추가**
2. 아이콘 이름 **무브로그** 확인 → 추가

설치 후에는 주소창 없이 **standalone** 으로 실행됩니다.

---

## 2. Android APK — Play 스토어 전 단계

Node.js LTS 설치 후, 프로젝트 폴더에서:

```powershell
cd C:\Users\ADMIN\Projects\movelog-main
npm install
npx cap add android
npx cap sync android
npx cap open android
```

Android Studio에서 **Run** 으로 폰/에뮬레이터에 설치하거나 **Build → Generate Signed Bundle/APK** 로 APK를 만듭니다.

`capacitor.config.json` 의 `appId`(`com.movelog.app`)는 스토어 등록 전 본인 도메인에 맞게 바꾸는 것을 권장합니다.

---

## 추가된 파일

| 파일 | 역할 |
|------|------|
| `manifest.webmanifest` | 앱 이름, 아이콘, standalone 표시 |
| `sw.js` | HTML/CSS/JS 셸 오프라인 캐시 |
| `pwa.js` | 서비스 워커 등록, 설치 안내 |
| `icons/icon.svg` | 앱 아이콘 |
| `package.json` / `capacitor.config.json` | Android 네이티브 껍데기 |

VRM·FBX·Three.js CDN은 용량 때문에 **온라인일 때** 로드됩니다.

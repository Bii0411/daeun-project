/* pwa.js — 앱 설치·서비스 워커 */
"use strict";

const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

function hideInstallUi() {
  const el = document.getElementById("installBanner");
  if (el) el.hidden = true;
}

function showInstallUi(html, onPrimary) {
  const el = document.getElementById("installBanner");
  if (!el || isStandalone) return;
  el.innerHTML = html;
  el.hidden = false;
  const btn = el.querySelector("[data-install]");
  if (btn && onPrimary) btn.addEventListener("click", onPrimary, { once: true });
  el.querySelector("[data-dismiss]")?.addEventListener("click", hideInstallUi, { once: true });
}

let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallUi(
    `<p><b>앱으로 설치</b> · 홈 화면에 두면 브라우저 주소창 없이 켤 수 있어요.</p>
     <div class="install-actions">
       <button type="button" class="btn pri sm" data-install>설치</button>
       <button type="button" class="btn ghost sm" data-dismiss>나중에</button>
     </div>`,
    async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      hideInstallUi();
    }
  );
});

const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInBrowser = isIos && !isStandalone && !localStorage.getItem("movelog_ios_hint");
if (isInBrowser) {
  showInstallUi(
    `<p><b>iPhone/iPad</b> · Safari <b>공유</b> → <b>홈 화면에 추가</b>로 앱처럼 쓸 수 있어요.</p>
     <div class="install-actions">
       <button type="button" class="btn ghost sm" data-dismiss>확인</button>
     </div>`,
    null
  );
  localStorage.setItem("movelog_ios_hint", "1");
}

if ("serviceWorker" in navigator) {
  const ok = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if (ok) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(() => {});
    });
  }
}

if (window.Capacitor?.isNativePlatform?.()) {
  document.documentElement.classList.add("native-app");
}

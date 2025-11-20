// Service Worker for Pomodoro Timer PWA
const CACHE_NAME = "pomodoro-v1";

// グローバル変数でタイマーIDを保存
let currentTimerId = null;

// Install
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(clients.claim());
});

// タイマー開始時のメッセージを受け取る
self.addEventListener("message", (event) => {
  if (event.data.type === "START_TIMER") {
    const { duration, mode } = event.data;

    if (currentTimerId) {
      clearTimeout(currentTimerId);
      console.log("Precious timer cleared.");
    }

    // 新しいタイマーをセット
    currentTimerId = setTimeout(() => {
      // 通知を表示
      self.registration.showNotification("Pomodoro Timer", {
        body:
          mode === "work" ? "作業終了！休憩しましょう" : "休憩終了！作業開始",
        icon: "/icons/icon-192.png",
        tag: "pomodoro",
        requireInteraction: true,
      });

      // UI側にタイマー終了を通知
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: "TIMER_COMPLETED",
            mode: mode,
          });
        });
      });

      currentTimerId = null;
    }, duration * 1000);

    console.log(`Timer started for ${duration} seconds in ${mode} mode.`);
  } else if (event.data.type === "STOP_TIMER") {
    // タイマー停止の処理
    if (currentTimerId) {
      clearTimeout(currentTimerId);
      currentTimerId = null;
      console.log("Timer stopped.");
    }
  } else if (event.data.type === "END_TIMER") {
    // 全てのタイマーをクリア
    if (currentTimerId) {
      clearTimeout(currentTimerId);
      currentTimerId = null;
    }

    // 終了通知の表示
    self.registration.showNotification("Pomodoro Timer", {
      body: "全てのポモドーロセッションが終了しました！お疲れ様でした！",
      icon: "/icons/icon-192.png",
      tag: "pomodoro-complete",
      requireInteraction: true,
    });
  }
});

// 通知クリック時
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});

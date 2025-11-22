// Service Worker for Pomodoro Timer PWA
const CACHE_NAME = "pomodoro-v1";

// グローバル変数でタイマー状態を管理
let timerState = {
  isRunning: false,
  mode: 'work',
  startTime: null,
  totalDuration: 0,
  remainingDuration: 0, // 一時停止時の残り時間
  currentLoop: 0,
  settings: {
    loop: 2,
    workDuration: 25,
    breakDuration: 5
  }
};
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

// タイマー状態をUI側に送信
function broadcastTimerState() {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'TIMER_STATE',
        state: {
          isRunning: timerState.isRunning,
          mode: timerState.mode,
          startTime: timerState.startTime,
          totalDuration: timerState.totalDuration,
          currentLoop: timerState.currentLoop,
          totalLoops: timerState.settings.loop
        }
      });
    });
  });
}

// タイマー完了処理
function handleTimerComplete() {
  const completedMode = timerState.mode;

  // 通知を表示
  self.registration.showNotification("Pomodoro Timer", {
    body: completedMode === "work" ? "作業終了！休憩しましょう" : "休憩終了！作業開始",
    icon: "/icons/icon-192.png",
    tag: "pomodoro",
    requireInteraction: true,
  });

  // 次のモードに切り替え
  if (completedMode === 'work') {
    // 休憩モードに切り替え
    startTimer(timerState.settings.breakDuration * 60, 'break');
  } else {
    // 次のループへ
    const nextLoop = timerState.currentLoop + 1;
    timerState.currentLoop = nextLoop;

    if (nextLoop >= timerState.settings.loop) {
      // 全セッション終了
      timerState.isRunning = false;
      timerState.mode = 'work';
      timerState.currentLoop = 0;
      timerState.startTime = null;
      timerState.totalDuration = 0;
      timerState.remainingDuration = 0;

      self.registration.showNotification("Pomodoro Timer", {
        body: "全てのポモドーロセッションが終了しました！お疲れ様でした！",
        icon: "/icons/icon-192.png",
        tag: "pomodoro-complete",
        requireInteraction: true,
      });

      broadcastTimerState();
    } else {
      // 作業モードに切り替え
      startTimer(timerState.settings.workDuration * 60, 'work');
    }
  }
}

// タイマー開始
function startTimer(duration, mode) {
  // 既存のタイマーをクリア
  if (currentTimerId) {
    clearTimeout(currentTimerId);
  }

  timerState.isRunning = true;
  timerState.mode = mode;
  timerState.startTime = Date.now();
  timerState.totalDuration = duration;

  // タイマーをセット
  currentTimerId = setTimeout(() => {
    handleTimerComplete();
  }, duration * 1000);

  console.log(`Timer started for ${duration} seconds in ${mode} mode.`);
  broadcastTimerState();
}

// メッセージ受信
self.addEventListener("message", (event) => {
  const { type, data } = event.data;

  if (type === "INIT_SETTINGS") {
    // 設定の初期化
    timerState.settings = data.settings;
    timerState.currentLoop = 0;
    timerState.mode = 'work';
    timerState.totalDuration = data.settings.workDuration * 60;
    timerState.remainingDuration = 0;
    console.log("Settings initialized:", timerState.settings);
  } else if (type === "START_TIMER") {
    const { duration, mode } = data;
    startTimer(duration, mode);
  } else if (type === "PAUSE_TIMER") {
    // タイマー一時停止
    if (currentTimerId) {
      clearTimeout(currentTimerId);
      currentTimerId = null;
    }
    if (timerState.isRunning && timerState.startTime) {
      // 残り時間を計算して保存
      const elapsedSeconds = Math.floor((Date.now() - timerState.startTime) / 1000);
      timerState.remainingDuration = Math.max(0, timerState.totalDuration - elapsedSeconds);
    }
    timerState.isRunning = false;
    console.log("Timer paused. Remaining:", timerState.remainingDuration);
    broadcastTimerState();
  } else if (type === "RESUME_TIMER") {
    // タイマー再開
    if (timerState.remainingDuration > 0) {
      startTimer(timerState.remainingDuration, timerState.mode);
      console.log("Timer resumed with", timerState.remainingDuration, "seconds remaining.");
    }
  } else if (type === "RESET_TIMER") {
    // タイマーリセット
    if (currentTimerId) {
      clearTimeout(currentTimerId);
      currentTimerId = null;
    }
    timerState.isRunning = false;
    timerState.mode = 'work';
    timerState.currentLoop = 0;
    timerState.startTime = null;
    timerState.totalDuration = 0;
    timerState.remainingDuration = 0;
    console.log("Timer reset.");
    broadcastTimerState();
  } else if (type === "GET_STATE") {
    // 現在の状態を返す
    broadcastTimerState();
  } else if (type === "SKIP_TIMER") {
    // 手動スキップ - タイマー完了処理を即座に実行
    if (currentTimerId) {
      clearTimeout(currentTimerId);
      currentTimerId = null;
    }
    // タイマーが設定されていればスキップ可能（実行中、一時停止中、開始前いずれも）
    if (timerState.isRunning || timerState.remainingDuration > 0 || timerState.totalDuration > 0) {
      handleTimerComplete();
    }
  }
});

// 通知クリック時
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});

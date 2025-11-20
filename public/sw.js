// Service Worker for Pomodoro Timer PWA
const CACHE_NAME = 'pomodoro-v1';

// Install
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(clients.claim());
});

// タイマー開始時のメッセージを受け取る
self.addEventListener('message', (event) => {
    if (event.data.type === "START_TIMER") {
        const {duration, mode}  = event.data;

        // タイマーをリセット
        setTimeout(() => {
            self.registration.showNotification("Pomodoro Timer", {
                body: mode === 'work' ? "作業終了！休憩しましょう" : "休憩終了！作業開始",
                icon: '/icons/icon-192.png',
                tag: 'pomodoro',
                requireInteraction: true,
            });
        }, duration * 1000);
    }
});

// 通知クリック時
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
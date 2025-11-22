'use client';

import { useState } from "react";
import React from "react";
import CircularTimer from "./components/CircularTimer";
import SetupView from "./components/SetupView";
import { FaMoon } from "react-icons/fa6";
import { FaCheck, FaSun } from "react-icons/fa";
import TodoModal from "./components/TodoModal";

type Pomodoro = {
  duration: number;
  isRunning: boolean;
  mode: 'work' | 'break';
};

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export default function Home() {
  const [pomodoro, setPomodoro] = useState<Pomodoro>({
    duration: 25 * 60,
    isRunning: false,
    mode: 'work',
  });
  const [view, setView] = useState<'setup' | 'timer'>('setup');
  const [settings, setSettings] = useState<{ loop: number; workDuration: number; breakDuration: number }>({
    loop: 2,
    workDuration: 25,
    breakDuration: 5
  });
  const [currentLoop, setCurrentLoop] = useState<number>(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  const [showTodoModal, setShowTodoModal] = useState(false);

  // OSのダークモード設定を初期値として設定
  React.useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  // 初回ロード時に通知許可をリクエスト
  React.useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  const startPomodoro = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Service Workerにタイマー開始を通知
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'START_TIMER',
        data: {
          duration: pomodoro.duration,
          mode: pomodoro.mode,
        }
      });
    }
  };

  const stopPomodoro = () => {
    // Service Workerのタイマーを一時停止
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      if (pomodoro.isRunning) {
        // 一時停止
        navigator.serviceWorker.controller.postMessage({
          type: 'PAUSE_TIMER',
        });
      } else {
        // 再開
        navigator.serviceWorker.controller.postMessage({
          type: 'RESUME_TIMER',
        });
      }
    }
  };

  const resetPomodoro = () => {
    setView('setup');

    // Service Workerのタイマーをリセット
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'RESET_TIMER',
      });
    }
  };

  const onStepForward = () => {
    // Service Workerに手動スキップを依頼（現在のタイマーを完了扱いにする）
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SKIP_TIMER',
      });
    }
  }

  // Service Workerからのメッセージ受信
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'TIMER_STATE') {
          const state = event.data.state;
          console.log('Received TIMER_STATE from SW:', state);

          // Service Workerからの状態を反映
          setPomodoro((prev) => ({
            ...prev,
            isRunning: state.isRunning,
            mode: state.mode,
            // 全セッション終了時はdurationもリセット
            duration: state.totalDuration === 0 ? 0 : prev.duration,
          }));
          setCurrentLoop(state.currentLoop);

          // タイマー状態を保存（開始時刻ベースの計算用）
          setSwTimerState({
            startTime: state.startTime,
            totalDuration: state.totalDuration,
            isRunning: state.isRunning,
          });

          // 終了した場合はセットアップ画面に戻る
          if (!state.isRunning && state.currentLoop === 0 && state.totalDuration === 0) {
            console.log('All sessions completed, returning to setup');
            setView('setup');
          }
        }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  // Service Workerからタイマー状態を受け取り、UI側で残り時間を計算
  const [swTimerState, setSwTimerState] = React.useState<{
    startTime: number | null;
    totalDuration: number;
    isRunning: boolean;
  }>({
    startTime: null,
    totalDuration: 0,
    isRunning: false,
  });

  React.useEffect(() => {
    if (!pomodoro.isRunning || swTimerState.startTime === null) return;

    const timer = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - swTimerState.startTime!) / 1000);
      const newDuration = Math.max(0, swTimerState.totalDuration - elapsedSeconds);

      setPomodoro((prev) => ({ ...prev, duration: newDuration }));

      if (newDuration === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [pomodoro.isRunning, swTimerState.startTime, swTimerState.totalDuration]);

  React.useEffect(() => {
    console.log('Theme changed to:', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      console.log('Added dark class');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      console.log('Added light class');
    }
    console.log('Current classes:', document.documentElement.className);
  }, [theme]);

  const totalDuration = pomodoro.mode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60;

  const handleStart = () => {
    setPomodoro({
      duration: settings.workDuration * 60,
      isRunning: false,
      mode: 'work',
    });

    setCurrentLoop(0);
    setView('timer');

    // Service Workerに設定を送信
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'INIT_SETTINGS',
        data: {
          settings: {
            loop: settings.loop,
            workDuration: settings.workDuration,
            breakDuration: settings.breakDuration,
          }
        }
      });
    }
  }

  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) =>
          console.error('Service Worker registration failed:', error)
        );
    }
  }, []);

  return (

    <div className="flex min-h-screen items-center justify-center font-sans">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:scale-110 transition-transform"
      >
        {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
      </button>
      <button
        onClick={() => setShowTodoModal(true)}
        className="fixed top-16 right-4 p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:scale-110 transition-transform"
      >
        <FaCheck size={20} />
      </button>
      {view === 'setup' ? (
        <SetupView
          loop={settings.loop}
          workDuration={settings.workDuration}
          breakDuration={settings.breakDuration}
          onLoopChange={(val) => setSettings({ ...settings, loop: val })}
          onWorkDurationChange={(val) => setSettings({ ...settings, workDuration: val })}
          onBreakDurationChange={(val) => setSettings({ ...settings, breakDuration: val })}
          onStart={handleStart}
        />
      ) : (
        <CircularTimer
          duration={pomodoro.duration}
          totalDuration={totalDuration}
          mode={pomodoro.mode}
          isRunning={pomodoro.isRunning}
          currentLoop={currentLoop}
          totalLoops={settings.loop}
          onStartStop={pomodoro.isRunning ? stopPomodoro : startPomodoro}
          onReset={resetPomodoro}
          onStepForward={onStepForward}
        />)}
      <TodoModal
        isOpen={showTodoModal}
        onClose={() => setShowTodoModal(false)}
      />
    </div>
  );
}

'use client';

import { useState } from "react";
import React from "react";
import { FaPlay, FaStop, FaRedo, FaSyncAlt, FaPause, FaStepForward } from "react-icons/fa";

type Pomodoro = {
  duration: number;
  isRunning: boolean;
  mode: 'work' | 'break';
}

export default function Home() {
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const [pomodoro, setPomodoro] = useState<Pomodoro>({
    duration: 25 * 60,
    isRunning: false,
    mode: 'work',
  });

  const startPomodoro = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    setPomodoro({ ...pomodoro, isRunning: true });
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const stopPomodoro = () => {
    setPomodoro({ ...pomodoro, isRunning: false });
  };

  const resetPomodoro = () => {
    const duration = pomodoro.mode === 'work' ? 25 * 60 : 5 * 60;
    setPomodoro({ duration, isRunning: false, mode: pomodoro.mode });
  };

  const changeMode = () => {
    const newMode = pomodoro.mode === 'work' ? 'break' : 'work';
    const duration = newMode === 'work' ? 25 * 60 : 5 * 60;
    setPomodoro({ duration, isRunning: false, mode: newMode });
  }

  const tick = () => {
    setPomodoro((prev) => {
      if (prev.isRunning && prev.duration > 0) {
        return { ...prev, duration: prev.duration - 1 };
      }
      return prev;
    });
  };

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pomodoro.isRunning) {
      timer = setInterval(tick, 1000); // Decrease duration every minute
    }
    return () => clearInterval(timer);
  }, [pomodoro.isRunning]);

  React.useEffect(() => {
    if (pomodoro.duration === 0) {
      playSound();
      if (pomodoro.mode === 'work') {
        setPomodoro({ duration: 5 * 60, isRunning: false, mode: 'break' })
        if (Notification.permission === 'granted') {
          new Notification("Pomodoro session ended! Take a break.");
        }
      } else {
        setPomodoro({ duration: 25 * 60, isRunning: false, mode: 'work' })
        if (Notification.permission === 'granted') {
          new Notification("Break ended! Time to work.");
        }
      }
    }
  }, [pomodoro.duration]);

  const playSound = async () => {
    try {
      const audioContext = audioContextRef.current;
      if (!audioContext) {
        return;
      }
      if (audioContext.state !== 'running') {
        await audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.3;

      const now = audioContext.currentTime;
      oscillator.start(now);
      oscillator.stop(now + 0.5);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const totalDuration = pomodoro.mode === 'work' ? 25 * 60 : 5 * 60;
  const progress = pomodoro.duration / totalDuration;
  const radius = 180;
  const circumference = 2 * Math.PI * radius; // 半径120の円の周囲長
  const strokeDashoffset = circumference - (progress * circumference);

  return (

    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="relative flex items-center justify-center">
        <svg className="w-96 h-96 transform -rotate-90">
          {/* 背景の円 */}
          <circle
            cx="192"
            cy="192"
            r="180"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-300 dark:text-gray-700"
          />
          {/* 進捗の円 */}
          <circle
            cx="192"
            cy="192"
            r="180"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-red-500 transition-all duration-1000"
          />
        </svg>
        {/* 中央の時間表示 */}
        <div className="absolute flex flex-col items-center">
          <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-white">
            {pomodoro.mode === 'work' ? 'Work Time' : 'Break Time'}
          </h1>
          <div className="mb-6 text-6xl font-mono text-gray-800 dark:text-white">
            {String(Math.floor(pomodoro.duration / 60)).padStart(2, '0')}:{String(Math.floor(pomodoro.duration % 60)).padStart(2, '0')}
          </div>
          {/* コントロールボタン */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={resetPomodoro}
              className="rounded-full p-4 bg-blue-500 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              <FaRedo size={24} />
            </button>
            <button
              onClick={pomodoro.isRunning ? stopPomodoro : startPomodoro}
              className="rounded-full bg-gray-500 p-4 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
            >
              {pomodoro.isRunning ? <FaPause size={24} /> : <FaPlay size={24} />}
            </button>

            <button
              onClick={changeMode}
              className="rounded-full p-4 bg-green-500 font-semibold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            >
              <FaStepForward size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

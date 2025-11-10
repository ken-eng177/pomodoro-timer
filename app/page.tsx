'use client';

import { useState } from "react";
import React from "react";

type Pomodoro = {
  duration: number;
  isRunning: boolean;
  mode: 'work' | 'break';
}

type Interval = {
  intervalId: NodeJS.Timeout | null;
}

export default function Home() {
  const [pomodoro, setPomodoro] = useState<Pomodoro>({
    duration: 25 * 60,
    // duration: 5, // For testing purposes, set to 5 seconds
    isRunning: false,
    mode: 'work',
  });

  const startPomodoro = () => {
    setPomodoro({ ...pomodoro, isRunning: true });

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
      if (pomodoro.mode === 'work') {
        setPomodoro({ duration: 5 * 60, isRunning: false, mode: 'break' })
        alert("Pomodoro session ended! Take a break.");
      } else {
        setPomodoro({ duration: 25 * 60, isRunning: false, mode: 'work' })
        alert("Break ended! Time to work.");
      }
    }
  }, [pomodoro.duration]);

  return (

    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md dark:bg-gray-900">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-white">
          {pomodoro.mode === 'work' ? 'Work Time' : 'Break Time'}
        </h1>
        <div className="mb-6 text-center">
          <span className="text-6xl font-mono text-gray-800 dark:text-white">
            {String(Math.floor(pomodoro.duration / 60)).padStart(2, '0')}:{String(Math.floor(pomodoro.duration % 60)).padStart(2, '0')}
          </span>
        </div>
        <div className="flex justify-center">
          <button
            onClick={startPomodoro}
            className="rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 disabled:opacity-50"
            disabled={pomodoro.isRunning}
          >
            {pomodoro.isRunning ? 'Running...' : 'Start'}
          </button>
          <button
            onClick={stopPomodoro}
            className="ml-2 rounded bg-gray-500 px-4 py-2 font-semibold text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:opacity-50"
            disabled={!pomodoro.isRunning}
          >
            Stop
          </button>
          <button
            onClick={resetPomodoro}
            className="ml-2 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Reset
          </button>

          <button
            onClick={changeMode}
            className="ml-2 rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            Change Mode
          </button>
        </div>
      </div>
    </div>
  );
}

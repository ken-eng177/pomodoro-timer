'use client';

import { useState } from "react";
import React from "react";
import CircularTimer from "./components/CircularTimer";
import SetupView from "./components/SetupView";

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
  const [view, setView] = useState<'setup' | 'timer'>('setup');
  const [settings, setSettings] = useState<{ workDuration: number; breakDuration: number }>({
    workDuration: 25,
    breakDuration: 5
  });

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (!isIOS && !audioContextRef.current) {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  const startPomodoro = () => {
    console.log('startPomodoro called');
    if (!isIOS && Notification.permission === 'default') {
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
    const duration = pomodoro.mode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60;
    setPomodoro({ duration, isRunning: false, mode: pomodoro.mode });
    setView('setup');
  };

  const changeMode = () => {
    const newMode = pomodoro.mode === 'work' ? 'break' : 'work';
    const duration = newMode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60;
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
        setPomodoro({ duration: settings.breakDuration * 60, isRunning: false, mode: 'break' })
        if (Notification.permission === 'granted') {
          new Notification("Pomodoro session ended! Take a break.");
        }
      } else {
        setPomodoro({ duration: settings.workDuration * 60, isRunning: false, mode: 'work' })
        if (Notification.permission === 'granted') {
          new Notification("Break ended! Time to work.");
        }
      }
    }
  }, [pomodoro.duration]);

  const playSound = async () => {
    if (isIOS){
      return;
    }
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


  const totalDuration = pomodoro.mode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60;
  const progress = pomodoro.duration / totalDuration;
  const radius = 180;
  const circumference = 2 * Math.PI * radius; // 半径120の円の周囲長
  const strokeDashoffset = circumference - (progress * circumference);

  const handleStart = () => {
    setPomodoro({
      duration: settings.workDuration * 60,
      isRunning: false,
      mode: 'work',
    });
    setView('timer');
  }

  return (

    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {view === 'setup' ? (
        <SetupView
          workDuration={settings.workDuration}
          breakDuration={settings.breakDuration}
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
          onStartStop={pomodoro.isRunning ? stopPomodoro : startPomodoro}
          onReset={resetPomodoro}
          onStepForward={changeMode}
        />)}
    </div>
  );
}

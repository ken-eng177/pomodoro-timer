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
  const [settings, setSettings] = useState<{ loop: number; workDuration: number; breakDuration: number }>({
    loop: 2,
    workDuration: 25,
    breakDuration: 5
  });
  const [currentLoop, setCurrentLoop] = useState<number>(0);

  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const startPomodoro = () => {
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

  React.useEffect(() => {
    if (pomodoro.duration === 0) {
      playSound();
      if (pomodoro.mode === 'work') {
        setPomodoro({ duration: settings.breakDuration * 60, isRunning: true, mode: 'break' })
        if (!isIOS && Notification.permission === 'granted') {
          new Notification("Pomodoro session ended! Take a break.");
        }
      } else {
        const nextLoop = currentLoop + 1;
        setCurrentLoop(nextLoop);
        if (nextLoop >= settings.loop) {
          resetPomodoro();
          if (!isIOS && Notification.permission === 'granted') {
            new Notification("All Pomodoro sessions completed! Well done.");
          }
          return;
        }
        setPomodoro({ duration: settings.workDuration * 60, isRunning: true, mode: 'work' })
        if (!isIOS && Notification.permission === 'granted') {
          new Notification("Break ended! Time to work.");
        }
      }
      
    }
  }, [pomodoro.duration]);

  React.useEffect(() => {
    if (!pomodoro.isRunning) return;

    const startTime = Date.now();
    const initialDuration = pomodoro.duration;

    const timer = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const newDuration = Math.max(0, initialDuration - elapsedSeconds);

      setPomodoro((prev) => ({ ...prev, duration: newDuration }));
      if (newDuration === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [pomodoro.isRunning, pomodoro.mode]);

  const playSound = async () => {
    console.log('playSound called, isIOS:', isIOS);
    console.log('audioContextRef.current:', audioContextRef.current);
    if (isIOS) {
      return;
    }
    try {
      const audioContext = audioContextRef.current;
      if (!audioContext) {
        console.error("AudioContext is not initialized.");
        return;
      }
      console.log('audioContext.state:', audioContext.state);
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
    setCurrentLoop(0);
  }

  return (

    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
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
          onStepForward={changeMode}
        />)}
    </div>
  );
}

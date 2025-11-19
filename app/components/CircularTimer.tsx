import { FaPlay, FaPause, FaRedo, FaStepForward, FaStop } from 'react-icons/fa';
type CircularTimerProps = {
    duration: number;
    totalDuration: number;
    mode: 'work' | 'break';
    isRunning: boolean;
    currentLoop: number;
    totalLoops: number;
    onStartStop: () => void;
    onReset: () => void;
    onStepForward: () => void;
}

export default function CircularTimer({
    duration,
    totalDuration,
    mode,
    isRunning,
    currentLoop,
    totalLoops,
    onStartStop,
    onReset,
    onStepForward,
}: CircularTimerProps) {
    const progress = duration / totalDuration;
    const radius = 180;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress * circumference);

    return (
        <div className="relative flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-6"
            style={{
                backgroundColor: 'var(--circle-bg)',
                borderWidth: '1px',
                borderColor: 'var(--circle-border)'
            }
            }>
            <svg className="w-96 h-96 transform -rotate-90 scale-y-[-1]">
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
                    className={mode === 'work' ? 'text-pink-500 transition-all duration-1000' : 'text-teal-400 transition-all duration-1000'}
                />
            </svg>
            {/* 中央の時間表示 */}
            <div className="absolute flex flex-col items-center">
                <div className='flex mb-4'>Loop {currentLoop + 1}/{totalLoops}</div>
                <h1 className="mb-4 text-center text-2xl font-bold">
                    {mode === 'work' ? 'Work Time' : 'Break Time'}
                </h1>
                <div className="mb-6 text-6xl font-mono">
                    {String(Math.floor(duration / 60)).padStart(2, '0')}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                </div>
                {/* コントロールボタン */}
                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={onReset}
                        className="rounded-full p-4 font-semibold hover:scale-120"
                    >
                        <FaStop size={24} />
                    </button>
                    <button
                        onClick={onStartStop}
                        className="rounded-full p-4 font-semibold hover:scale-120"
                    >
                        {isRunning ? <FaPause size={24} /> : <FaPlay size={24} />}
                    </button>

                    <button
                        onClick={onStepForward}
                        className="rounded-full p-4 font-semibold hover:scale-120"
                    >
                        <FaStepForward size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
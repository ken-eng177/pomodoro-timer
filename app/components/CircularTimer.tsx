import { FaPlay, FaPause, FaRedo, FaStepForward, FaStop } from 'react-icons/fa';
type CircularTimerProps = {
    duration: number;
    totalDuration: number;
    mode: 'work' | 'break';
    isRunning: boolean;
    onStartStop: () => void;
    onReset: () => void;
    onStepForward: () => void;
}

export default function CircularTimer({
    duration,
    totalDuration,
    mode,
    isRunning,
    onStartStop,
    onReset,
    onStepForward,
}: CircularTimerProps) {
    const progress = duration / totalDuration;
    const radius = 180;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress * circumference);

    return (
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
                    {mode === 'work' ? 'Work Time' : 'Break Time'}
                </h1>
                <div className="mb-6 text-6xl font-mono text-gray-800 dark:text-white">
                    {String(Math.floor(duration / 60)).padStart(2, '0')}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                </div>
                {/* コントロールボタン */}
                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={onReset}
                        className="rounded-full p-4 bg-blue-500 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    >
                        <FaStop size={24} />
                    </button>
                    <button
                        onClick={onStartStop}
                        className="rounded-full bg-gray-500 p-4 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                    >
                        {isRunning ? <FaPause size={24} /> : <FaPlay size={24} />}
                    </button>

                    <button
                        onClick={onStepForward}
                        className="rounded-full p-4 bg-green-500 font-semibold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                    >
                        <FaStepForward size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
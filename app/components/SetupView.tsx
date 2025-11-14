import { FaPlay } from "react-icons/fa";

type SetupViewProps = {
    workDuration: number;
    breakDuration: number;
    onWorkDurationChange: (value: number) => void;
    onBreakDurationChange: (value: number) => void;
    onStart: () => void;
}

export default function SetupView({
    workDuration,
    breakDuration,
    onWorkDurationChange,
    onBreakDurationChange,
    onStart,
}: SetupViewProps) {
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
            </svg>
            {/* 中央の設定UI */}
            <div className="absolute flex flex-col items-center gap-6">
                <h1>PomodoroTimer</h1>

                {/* Work Time入力 */}
                <div>
                    <label>Work Time</label>
                    <input
                        type="number"
                        value={workDuration}
                        onChange={(e) => onWorkDurationChange(Number(e.target.value))}
                        className="ml-2 w-16 rounded border px-2 py-1"
                    />
                </div>
                {/* Break Time入力 */}
                <div>
                    <label>Break Time</label>
                    <input
                        type="number"
                        value={breakDuration}
                        onChange={(e) => onBreakDurationChange(Number(e.target.value))}
                        className="ml-2 w-16 rounded border px-2 py-1"
                    />
                </div>
                {/* Startボタン */}
                <button
                    onClick={onStart}
                    className="rounded-full p-4 bg-blue-500 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                    <FaPlay size={24} />
                </button>
            </div>
        </div>
    );
}

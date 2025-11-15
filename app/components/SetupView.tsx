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
                <div className="flex gap-8 mb-4">
                    {/* Work Time入力 */}
                    <div className="flex flex-col items-center">
                        <label className="mb-2 text-lg font-semibold">Work Time</label>
                        <input
                            type="number"
                            value={workDuration}
                            onChange={(e) => onWorkDurationChange(Number(e.target.value))}
                            className="w-18 rounded border-2 px-2 py-2 text-2xl font-bold text-center"
                        />
                    </div>
                    {/* Break Time入力 */}
                    <div className="flex flex-col items-center">
                        <label className="mb-2 text-lg font-semibold">Break Time</label>
                        <input
                            type="number"

                            value={breakDuration}
                            onChange={(e) => onBreakDurationChange(Number(e.target.value))}
                            className="w-18 rounded border-2 px-2 py-2 text-2xl font-bold text-center"
                        />
                    </div>
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

import { FaAngleDown, FaAngleUp, FaPlay } from "react-icons/fa";

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
            <div className="absolute flex flex-col items-center">
                <h1>PomodoroTimer</h1>
                <div className="flex gap-8 mb-4">
                    {/* Work Time入力 */}
                    <div className="flex flex-col items-center">
                        <label className="mb-2 text-lg font-semibold">Work Time</label>
                        <div className="flex flex-col items-center gap-2">
                            <button onClick={() => onWorkDurationChange(workDuration + 1)}
                                className="hover:scale-120">
                                <FaAngleUp size={32} />
                            </button>
                            <div className="text-5xl font-bold">{workDuration}</div>
                            <button onClick={() => onWorkDurationChange(workDuration - 1)}
                                className="hover:scale-120">
                                <FaAngleDown size={32} />
                            </button>
                        </div>
                    </div>
                    {/* Break Time入力 */}
                    <div className="flex flex-col items-center">
                        <label className="mb-2 text-lg font-semibold">Break Time</label>
                        <div className="flex flex-col items-center gap-2">
                            <button onClick={() => onBreakDurationChange(breakDuration + 1)}
                                className="hover:scale-120">
                                <FaAngleUp size={32} />
                            </button>
                            <div className="text-5xl font-bold">{breakDuration}</div>
                            <button onClick={() => onBreakDurationChange(breakDuration - 1)}
                                className="hover:scale-120">
                                <FaAngleDown size={32} />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Startボタン */}
                <button
                    onClick={onStart}
                    className="rounded-full p-4 font-semibold text-white hover:scale-120"
                >
                    <FaPlay size={32} />
                </button>
            </div>
        </div>
    );
}

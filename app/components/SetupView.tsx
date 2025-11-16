import { FaAngleDown, FaAngleLeft, FaAngleRight, FaAngleUp, FaPlay } from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";

type SetupViewProps = {
    loop: number;
    workDuration: number;
    breakDuration: number;
    onLoopChange: (value: number) => void;
    onWorkDurationChange: (value: number) => void;
    onBreakDurationChange: (value: number) => void;
    onStart: () => void;
}

export default function SetupView({
    loop,
    workDuration,
    breakDuration,
    onLoopChange,
    onWorkDurationChange,
    onBreakDurationChange,
    onStart,
}: SetupViewProps) {
    return (
        <div className="relative flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-6">
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
                <div className="flex flex-col items-center mb-2">
                    <label className="text-lg font-semibold">Loop</label>
                    <div className="flex">
                        <button onClick={() => onLoopChange(Math.max(1, loop - 1))}
                            className="hover:scale-120">
                            <FaAngleLeft size={24} />
                        </button>
                        <div className="mx-4 text-2xl font-bold">{loop}</div>
                        <button onClick={() => onLoopChange(loop + 1)}
                            className="hover:scale-120">
                            <FaAngleRight size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-8 mb-2">
                    {/* Work Time入力 */}
                    <div className="flex flex-col items-center">
                        <label className="mb-2 text-lg font-semibold">Work Time</label>
                        <div className="flex flex-col items-center gap-2">
                            <button onClick={() => onWorkDurationChange(workDuration + 1)}
                                className="hover:scale-120">
                                <FaAngleUp size={32} />
                            </button>
                            <div className="text-5xl font-bold">{workDuration}</div>
                            <button onClick={() => onWorkDurationChange(Math.max(1, workDuration - 1))}
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
                            <button onClick={() => onBreakDurationChange(Math.max(1, breakDuration - 1))}
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
                    <FaCirclePlay size={32} />
                </button>
            </div>
        </div>
    );
}

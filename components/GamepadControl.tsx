import { motion } from "motion/react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  MousePointer2,
} from "lucide-react";

export default function GamepadControl({
  onCommand,
}: {
  onCommand: (cmd: string) => void;
}) {
  return (
    <div className="bg-zinc-900 border border-amber-500/20 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.05)] p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
        <MousePointer2 className="w-16 h-16 text-amber-500" />
      </div>
      <h2 className="text-sm font-bold tracking-widest text-amber-500 uppercase mb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
        Manual ADB Override
      </h2>

      <div className="flex flex-col items-center justify-center gap-2 mt-4 relative z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onCommand("adb shell input keyevent 19")}
          className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-amber-500/50 p-4 rounded-lg text-zinc-300 transition-colors shadow-lg"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>

        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onCommand("adb shell input keyevent 21")}
            className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-amber-500/50 p-4 rounded-lg text-zinc-300 transition-colors shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onCommand("adb shell input keyevent 66")}
            className="bg-amber-500/10 border border-amber-500/50 hover:bg-amber-500/20 p-4 rounded-lg text-amber-500 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.2)]"
          >
            <Circle className="w-6 h-6 fill-current" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onCommand("adb shell input keyevent 22")}
            className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-amber-500/50 p-4 rounded-lg text-zinc-300 transition-colors shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onCommand("adb shell input keyevent 20")}
          className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-amber-500/50 p-4 rounded-lg text-zinc-300 transition-colors shadow-lg"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="mt-6 flex gap-2 relative z-10">
        <button
          onClick={() => onCommand("adb shell input keyevent 4")}
          className="flex-1 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 py-2 rounded-lg text-xs font-bold tracking-widest uppercase text-zinc-400 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => onCommand("adb shell input keyevent 3")}
          className="flex-1 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 py-2 rounded-lg text-xs font-bold tracking-widest uppercase text-zinc-400 transition-colors"
        >
          Home
        </button>
        <button
          onClick={() => onCommand("adb shell input keyevent 187")}
          className="flex-1 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 py-2 rounded-lg text-xs font-bold tracking-widest uppercase text-zinc-400 transition-colors"
        >
          Recent
        </button>
      </div>
    </div>
  );
}

import { motion } from "motion/react";
import { CheckCircle2, Circle, ArrowRight, Activity } from "lucide-react";

export default function LogicTree({
  states,
  currentStep,
  isPaused = false,
}: {
  states: string[];
  currentStep: number;
  isPaused?: boolean;
}) {
  if (!states || states.length === 0) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5 w-full">
      <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
        Autonomous Logic Tree
      </h2>
      <div className="flex flex-col gap-1 relative pl-4">
        {/* Vertical connecting line */}
        <div className="absolute left-[27px] top-[20px] bottom-[20px] w-px bg-zinc-800"></div>

        {states.map((state, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <motion.div
              key={state + index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 relative z-10 py-2"
            >
              <div className="flex-shrink-0 mt-0.5 bg-zinc-900 rounded-full">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : isActive ? (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div
                      className={`w-3 h-3 ${isPaused ? "bg-amber-500" : "bg-blue-500"} rounded-full ${!isPaused && "animate-ping"} absolute`}
                    ></div>
                    <div
                      className={`w-3 h-3 ${isPaused ? "bg-amber-500" : "bg-blue-500"} rounded-full relative`}
                    ></div>
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-zinc-700" />
                )}
              </div>
              <div className="flex-1">
                <div
                  className={`text-sm font-mono ${isActive ? (isPaused ? "text-amber-500 font-bold" : "text-blue-400 font-bold") : isCompleted ? "text-emerald-400/80" : "text-zinc-500"}`}
                >
                  {state.toUpperCase().replace(/_/g, " ")}{" "}
                  {isActive && isPaused && "(PAUSED)"}
                </div>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`text-xs mt-1 ${isPaused ? "text-amber-500/70" : "text-zinc-400"}`}
                  >
                    {isPaused
                      ? "System frozen..."
                      : "Executing cognitive sub-routines..."}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

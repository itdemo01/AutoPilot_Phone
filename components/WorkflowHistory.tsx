import { motion } from "motion/react";
import { History, Clock, CheckCircle } from "lucide-react";

export interface WorkflowHistoryEntry {
  id: string;
  intent: string;
  startTime: Date;
  endTime: Date;
  tasksCompleted: number;
}

export default function WorkflowHistory({
  history,
}: {
  history: WorkflowHistoryEntry[];
}) {
  if (!history || history.length === 0) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5 w-full flex flex-col gap-4">
      <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase flex items-center gap-2">
        <History className="w-4 h-4 text-emerald-400" />
        Execution History
      </h2>
      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {history.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/50 border border-zinc-800 rounded-lg p-3 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="text-sm font-medium text-zinc-300 line-clamp-2">
                {entry.intent || "Autonomous Execution"}
              </div>
              <div className="flex items-center gap-1 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                <CheckCircle className="w-3 h-3" /> {entry.tasksCompleted} Tasks
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {entry.startTime.toLocaleTimeString()} -{" "}
                {entry.endTime.toLocaleTimeString()}
              </div>
              <div>
                {(
                  (entry.endTime.getTime() - entry.startTime.getTime()) /
                  1000
                ).toFixed(1)}
                s
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

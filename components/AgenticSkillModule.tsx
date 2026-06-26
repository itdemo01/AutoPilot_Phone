import { motion, AnimatePresence } from "motion/react";
import {
  BrainCircuit,
  GitMerge,
  Fingerprint,
  Waves,
  Combine,
  Activity,
  AlertCircle,
  Bot,
  MoveRight,
  Cloud,
  Server,
  CloudCog,
} from "lucide-react";
import { useState, useEffect } from "react";

const skills = [
  {
    id: "scout",
    name: "UI Scout",
    icon: <Fingerprint className="w-4 h-4" />,
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
  {
    id: "analyze",
    name: "Context Analyzer",
    icon: <BrainCircuit className="w-4 h-4" />,
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
  },
  {
    id: "execute",
    name: "Local Action",
    icon: <Activity className="w-4 h-4" />,
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
  {
    id: "cloud",
    name: "Cloud Instance",
    icon: <CloudCog className="w-4 h-4" />,
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
  },
];

export default function AgenticSkillModule({
  isAutonomousActive,
  onLog,
  onHandoffStateChange,
}: {
  isAutonomousActive: boolean;
  onLog: (msg: string) => void;
  onHandoffStateChange?: (isHandoff: boolean) => void;
}) {
  const [activeSkill, setActiveSkill] = useState<string>("dormant");
  const [handoffMode, setHandoffMode] = useState<boolean>(false);
  const [mythosActive, setMythosActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutonomousActive && mythosActive) {
      let step = 0;
      interval = setInterval(() => {
        const availableSkills = handoffMode
          ? skills
          : skills.filter((s) => s.id !== "cloud");
        const nextSkill = availableSkills[step % availableSkills.length];

        setActiveSkill((currentActive) => {
          if (nextSkill.id === "cloud") {
            onLog(
              `[MYTHOS-HANDOFF] Pausing local agent. Session transferred to Remote Python Environment (High Compute)...`,
            );
            if (onHandoffStateChange) onHandoffStateChange(true);
          } else if (currentActive === "cloud" && nextSkill.id === "scout") {
            onLog(
              `[MYTHOS-HANDOFF] Remote execution complete. Resuming local agent control...`,
            );
            if (onHandoffStateChange) onHandoffStateChange(false);
          } else if (
            mythosActive &&
            currentActive !== "dormant" &&
            currentActive !== "cloud"
          ) {
            onLog(
              `[MYTHOS] Transferring context from ${currentActive} to ${nextSkill.id}...`,
            );
          }
          return nextSkill.id;
        });

        step++;
      }, 4000);
    } else {
      setActiveSkill("dormant");
      if (onHandoffStateChange) onHandoffStateChange(false);
    }
    return () => clearInterval(interval);
  }, [isAutonomousActive, mythosActive, handoffMode, onLog]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5 overflow-hidden relative">
      {/* Background glow if active */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full mix-blend-screen transition-all duration-1000 ${mythosActive ? "bg-indigo-500/20" : "bg-transparent"}`}
      ></div>

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-zinc-200 uppercase flex items-center gap-2">
            <Combine className="w-4 h-4 text-indigo-400" />
            Agentic Skill Architecture
          </h2>
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            Mythos / Fable v5 Orchestration Model
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setHandoffMode(!handoffMode);
              onLog(
                !handoffMode
                  ? "[MYTHOS] Cloud Handoff enabled - local agent will pause and route complex tasks to Remote Python Instance."
                  : "[MYTHOS] Cloud Handoff disabled - returning to edge-only execution.",
              );
            }}
            className={`px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-colors border ${handoffMode ? "bg-amber-500/10 text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]" : "bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300"}`}
          >
            Cloud Handoff
          </button>
          <button
            onClick={() => {
              setMythosActive(!mythosActive);
              onLog(
                mythosActive
                  ? "[MYTHOS] Architecture deactivated."
                  : "[MYTHOS] Full Mythos v5 autonomous architecture engaged.",
              );
            }}
            className={`px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-colors border ${mythosActive ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300"}`}
          >
            {mythosActive ? "Mythos Active" : "Engage Mythos"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 relative z-10">
        {skills.map((skill, index) => {
          const isActive = activeSkill === skill.id;
          const isAvailable = handoffMode || skill.id !== "cloud";
          if (!isAvailable) return null;

          // Determine the visual array for connectors
          const activeSkillsArray = handoffMode
            ? skills
            : skills.filter((s) => s.id !== "cloud");
          const skillIndexInActive = activeSkillsArray.findIndex(
            (s) => s.id === skill.id,
          );

          return (
            <div
              key={skill.id}
              className="flex-1 flex flex-col items-center relative"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  opacity: mythosActive ? (isActive ? 1 : 0.4) : 0.2,
                }}
                className={`w-14 h-14 rounded-2xl border ${isActive ? skill.border : "border-zinc-800"} ${isActive ? skill.bg : "bg-zinc-950"} flex items-center justify-center transition-colors relative ${skill.id === "cloud" ? "shadow-[0_0_15px_rgba(245,158,11,0.15)]" : ""}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-skill-glow"
                    className={`absolute inset-0 rounded-2xl border-2 shadow-[0_0_20px_currentColor] ${skill.color} pointer-events-none opacity-50`}
                  />
                )}
                <div className={isActive ? skill.color : "text-zinc-600"}>
                  {skill.icon}
                </div>
              </motion.div>

              <motion.div
                animate={{ opacity: mythosActive ? (isActive ? 1 : 0.6) : 0.3 }}
                className={`mt-3 text-[9px] sm:text-xs font-bold tracking-wider ${isActive ? "text-zinc-200" : "text-zinc-600"} uppercase font-mono text-center max-w-full px-1`}
              >
                {skill.name}
              </motion.div>

              {/* Connector line */}
              {skillIndexInActive < activeSkillsArray.length - 1 && (
                <div className="absolute top-7 left-[calc(50%+1.75rem)] right-[calc(-50%+1.75rem)] h-[2px] bg-zinc-800 -translate-y-1/2 overflow-hidden pointer-events-none">
                  {mythosActive && (
                    <div
                      className={`w-full h-full ${activeSkill === activeSkillsArray[skillIndexInActive + 1].id ? "bg-zinc-600" : "bg-zinc-800"}`}
                    />
                  )}
                  {mythosActive && isActive && (
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className={`absolute inset-0 bg-gradient-to-r from-transparent ${skill.id === "execute" && handoffMode ? "via-amber-400" : "via-indigo-400"} to-transparent opacity-50`}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {mythosActive && handoffMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-black/40 border border-amber-500/20 rounded-lg p-3 flex items-center gap-3 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
          <p className="text-xs font-mono text-amber-500/80">
            <span className="text-amber-400 font-bold">
              CLOUD HANDOFF READY:
            </span>{" "}
            Local agent will pause execution and stream contextual state to
            Remote Server for heavy computation when required...
          </p>
        </motion.div>
      )}
    </div>
  );
}

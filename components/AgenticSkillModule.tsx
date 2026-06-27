import { motion, AnimatePresence } from "motion/react";
import {
  BrainCircuit,
  Fingerprint,
  Activity,
  Bot,
  CloudCog,
  Combine,
  Plus,
  X,
  Settings2
} from "lucide-react";
import { useState, useEffect } from "react";

const initialSkills = [
  {
    id: "scout",
    name: "UI Scout",
    icon: "fingerprint",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
  {
    id: "analyze",
    name: "Context Analyzer",
    icon: "brain",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
  },
  {
    id: "execute",
    name: "Local Action",
    icon: "activity",
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
  {
    id: "cloud",
    name: "Cloud Instance",
    icon: "cloud",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
  },
];

const renderIcon = (type: string) => {
  switch (type) {
    case "fingerprint": return <Fingerprint className="w-4 h-4" />;
    case "brain": return <BrainCircuit className="w-4 h-4" />;
    case "activity": return <Activity className="w-4 h-4" />;
    case "cloud": return <CloudCog className="w-4 h-4" />;
    default: return <Bot className="w-4 h-4" />;
  }
};

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
  const [skills, setSkills] = useState(initialSkills);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutonomousActive && mythosActive && skills.length > 0) {
      let step = 0;
      interval = setInterval(() => {
        const availableSkills = handoffMode
          ? skills
          : skills.filter((s) => s.id !== "cloud");
        
        if (availableSkills.length === 0) return;
        
        const nextSkill = availableSkills[step % availableSkills.length];

        setActiveSkill((currentActive) => {
          if (nextSkill.id === "cloud") {
            onLog(
              `[MYTHOS-HANDOFF] Pausing local agent. Session transferred to Remote Server...`,
            );
            if (onHandoffStateChange) onHandoffStateChange(true);
          } else if (currentActive === "cloud" && nextSkill.id === "scout") {
            onLog(
              `[MYTHOS-HANDOFF] Remote execution complete. Resuming local control...`,
            );
            if (onHandoffStateChange) onHandoffStateChange(false);
          } else if (
            mythosActive &&
            currentActive !== "dormant" &&
            currentActive !== "cloud"
          ) {
            onLog(
              `[MYTHOS] Context transferred to module: ${nextSkill.name}...`,
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
  }, [isAutonomousActive, mythosActive, handoffMode, onLog, skills]);

  const removeSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
    if (activeSkill === id) setActiveSkill("dormant");
  };

  const addSkill = () => {
    const newId = `module-${Date.now()}`;
    const newSkill = {
      id: newId,
      name: "Custom Node",
      icon: "bot",
      color: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
    };
    setSkills([...skills, newSkill]);
  };

  const activeSkillsArray = handoffMode
    ? skills
    : skills.filter((s) => s.id !== "cloud");

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/50 p-5 overflow-hidden relative group">
      {/* Background glow if active */}
      <div
        className={`absolute -top-10 -right-10 w-48 h-48 blur-[80px] rounded-full mix-blend-screen transition-all duration-1000 pointer-events-none ${mythosActive ? "bg-indigo-600/20" : "bg-transparent"}`}
      ></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 relative z-10 gap-4">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-zinc-100 uppercase flex items-center gap-2">
            <Combine className="w-4 h-4 text-indigo-400" />
            Agentic Skill Architecture
          </h2>
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            Mythos / Fable v5 Orchestration Model
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-colors border flex items-center gap-1 ${isEditing ? "bg-zinc-800 text-white border-zinc-600" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300"}`}
          >
            <Settings2 className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={() => {
              setHandoffMode(!handoffMode);
              onLog(
                !handoffMode
                  ? "[MYTHOS] Cloud Handoff enabled - local agent will pause and route complex tasks to Remote Python Instance."
                  : "[MYTHOS] Cloud Handoff disabled - returning to edge-only execution.",
              );
            }}
            className={`px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-colors border ${handoffMode ? "bg-amber-500/10 text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300"}`}
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
            className={`px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-colors border ${mythosActive ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300"}`}
          >
            {mythosActive ? "Mythos Active" : "Engage Mythos"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center sm:justify-between mt-10 mb-2 relative z-10 gap-y-10 px-2 sm:px-0">
        <AnimatePresence mode="popLayout">
          {activeSkillsArray.map((skill, index) => {
            const isActive = activeSkill === skill.id;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                key={skill.id}
                className="flex-1 min-w-[70px] flex flex-col items-center relative group/node"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    opacity: mythosActive ? (isActive ? 1 : 0.5) : 0.3,
                  }}
                  className={`w-14 h-14 rounded-2xl border ${isActive ? skill.border : "border-zinc-800"} ${isActive ? skill.bg : "bg-zinc-950"} flex items-center justify-center transition-all duration-300 relative ${skill.id === "cloud" && isActive ? "shadow-[0_0_20px_rgba(245,158,11,0.2)]" : ""}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-skill-glow"
                      className={`absolute inset-0 rounded-2xl border-2 shadow-[0_0_20px_currentColor] ${skill.color} pointer-events-none opacity-50`}
                    />
                  )}
                  <div className={isActive ? skill.color : "text-zinc-500"}>
                    {renderIcon(skill.icon)}
                  </div>
                  
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="absolute -top-2 -right-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50 rounded-full p-1 z-20 transition-colors shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </motion.div>

                <motion.div
                  animate={{ opacity: mythosActive ? (isActive ? 1 : 0.7) : 0.4 }}
                  className={`mt-4 text-[10px] sm:text-xs font-bold tracking-wider ${isActive ? "text-zinc-100" : "text-zinc-500"} uppercase font-mono text-center max-w-[80px] leading-tight`}
                >
                  {skill.name}
                </motion.div>

                {/* Connector line */}
                {index < activeSkillsArray.length - 1 && (
                  <div className="hidden sm:block absolute top-7 left-[calc(50%+1.75rem)] right-[calc(-50%+1.75rem)] h-[2px] bg-zinc-800/50 -translate-y-1/2 overflow-hidden pointer-events-none">
                    {mythosActive && (
                      <div
                        className={`w-full h-full ${activeSkill === activeSkillsArray[index + 1].id ? "bg-zinc-600" : "bg-zinc-800/50"}`}
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
                        className={`absolute inset-0 bg-gradient-to-r from-transparent ${skill.id === "execute" && handoffMode ? "via-amber-400" : "via-indigo-400"} to-transparent opacity-60`}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 min-w-[70px] flex flex-col items-center justify-start relative pt-0"
          >
            <button
              onClick={addSkill}
              className="w-14 h-14 rounded-2xl border border-zinc-700 border-dashed bg-zinc-900/50 hover:bg-zinc-800 flex items-center justify-center transition-colors text-zinc-500 hover:text-zinc-300"
            >
              <Plus className="w-6 h-6" />
            </button>
            <div className="mt-4 text-[10px] sm:text-xs font-bold tracking-wider text-zinc-600 uppercase font-mono text-center">
              Add Node
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {mythosActive && handoffMode && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 32 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="bg-black/40 border border-amber-500/20 rounded-lg p-3 flex items-center gap-3 relative overflow-hidden"
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
      </AnimatePresence>
    </div>
  );
}


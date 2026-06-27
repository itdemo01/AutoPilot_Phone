"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  TerminalIcon,
  Play,
  Trash2,
  GitBranch,
  GitMerge,
  FolderGit2,
  Lock,
  ShieldAlert,
} from "lucide-react";
import { motion } from "framer-motion";

export default function RealTerminal({
  battery = 100,
  session = null,
  onOpenAuth,
}: {
  battery?: number;
  session?: { username: string; email: string; role: string } | null;
  onOpenAuth?: () => void;
}) {
  const [logs, setLogs] = useState<string[]>([
    "Welcome to Real Terminal",
    "Type your commands below or use the Git Pipeline shortcuts.",
  ]);
  const [input, setInput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [cwd, setCwd] = useState("/");
  const [batteryWarningShown, setBatteryWarningShown] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (battery < 15 && !batteryWarningShown) {
      setLogs((prev) => [
        ...prev,
        `\n> [WARNING] CRITICAL: Target device battery is below 15% (${Math.round(battery)}%). Initiating power-saving protocol.`,
      ]);
      setBatteryWarningShown(true);
    } else if (battery >= 15 && batteryWarningShown) {
      setBatteryWarningShown(false);
    }
  }, [battery, batteryWarningShown]);

  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    setLogs((prev) => [...prev, `\n> ${cmd}`]);
    setInput("");
    setIsExecuting(true);

    try {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd, cwd }),
      });

      const data = await res.json();

      if (data.output) {
        setLogs((prev) => [...prev, data.output]);
      } else if (data.error) {
        setLogs((prev) => [...prev, `Error: ${data.error}`]);
      }

      if (data.cwd) {
        setCwd(data.cwd);
      }
    } catch (error: any) {
      setLogs((prev) => [...prev, `Execution failed: ${error.message}`]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Git Pipeline Shortcuts
  const runGitClone = () => {
    const repo = prompt("Enter Git repository URL to clone:");
    if (repo) {
      executeCommand(`git clone ${repo}`);
    }
  };

  const runGitStatus = () => {
    executeCommand("git status");
  };

  const runGitPush = () => {
    const msg = prompt("Enter commit message:");
    if (msg) {
      executeCommand(`git add . && git commit -m "${msg}" && git push`);
    }
  };

  return (
    <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden shadow-lg shadow-black/50 flex flex-col h-full min-h-[400px] relative">
      <div className="bg-zinc-900/80 px-4 py-3 border-b border-zinc-800 flex flex-wrap justify-between items-center gap-3 shrink-0 backdrop-blur-md">
        <h2 className="text-sm font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-2">
          <TerminalIcon className="w-4 h-4" /> Live Terminal & Pipeline
        </h2>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={runGitClone}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono rounded transition-colors whitespace-nowrap border border-zinc-700"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-blue-400" /> Clone
          </button>
          <button
            onClick={runGitStatus}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono rounded transition-colors whitespace-nowrap border border-zinc-700"
          >
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" /> Status
          </button>
          <button
            onClick={runGitPush}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono rounded transition-colors whitespace-nowrap border border-zinc-700"
          >
            <GitMerge className="w-3.5 h-3.5 text-purple-400" /> Push
          </button>
          <div className="w-px h-4 bg-zinc-700 mx-1"></div>
          <button
            onClick={() => setLogs([])}
            className="text-zinc-500 hover:text-red-400 transition-colors p-1.5 rounded hover:bg-zinc-800"
            title="Clear Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs sm:text-sm leading-relaxed text-zinc-300 space-y-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {logs.map((log, index) => {
          let className = "text-zinc-300";
          if (log.includes("[WARNING] CRITICAL:"))
            className =
              "text-red-500 font-bold bg-red-500/10 px-2 py-1.5 rounded border border-red-500/20 my-2";
          else if (log.startsWith("\n>"))
            className = "text-emerald-400 font-bold mt-2";
          else if (log.startsWith("Error:")) className = "text-red-400";

          return (
            <div
              key={index}
              className={`whitespace-pre-wrap break-words ${className}`}
            >
              {log}
            </div>
          );
        })}
        {isExecuting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-emerald-500 italic mt-2"
          >
            Executing...
          </motion.div>
        )}
        <div ref={bottomRef}></div>
      </div>

      <div className="bg-zinc-900 px-4 py-3 border-t border-zinc-800 flex items-center gap-3 shrink-0">
        <span className="text-emerald-500 font-bold">➜</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          className="flex-1 bg-transparent text-white focus:outline-none font-mono text-sm placeholder:text-zinc-600"
          disabled={isExecuting}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          onClick={() => executeCommand(input)}
          disabled={isExecuting || !input.trim()}
          className="p-1.5 text-zinc-500 hover:text-emerald-400 disabled:opacity-50 transition-colors"
        >
          <Play className="w-4 h-4" />
        </button>
      </div>

      {!session && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10 rounded-xl">
          <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.25)] mb-4 animate-bounce">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-zinc-100 font-bold tracking-wider font-mono text-xs uppercase mb-2">
            KORO COMMAND INJECTION PROTECTED
          </h3>
          <p className="text-[11px] text-zinc-500 max-w-xs font-mono mb-5 leading-relaxed">
            Live terminal sessions and system commands are restricted to authenticated Koro Operators.
          </p>
          <button
            onClick={onOpenAuth}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded border border-indigo-500/30 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Establish Operator Credentials
          </button>
        </div>
      )}
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, Battery, Signal, Wifi, Activity, Terminal as TerminalIcon, 
  Play, Pause, Square, Cpu, Code, Zap, Clock, Plus, Trash2, Download, Upload, CheckCircle2,
  Lock, Unlock, ShieldAlert, MonitorPlay, Settings, RotateCw, Power, Camera, Maximize, X,
  Mic, GitMerge, BrainCircuit, GlobeLock, Sparkles, Server
} from 'lucide-react';
import PerformanceChart from '../components/PerformanceChart';
import SwarmFleetDashboard from '../components/SwarmFleetDashboard';

import TopNav from '../components/TopNav';
import SecuritySettings from '../components/SecuritySettings';
import { useWebSocket } from '../hooks/useWebSocket';

export default function Page() {
  const { isConnected, latency, apiKey, saveApiKey } = useWebSocket('SIMULATE_LOCAL');
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isAutonomousActive, setIsAutonomousActive] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '> Initializing connection to target device...',
    '> Secure channel established over proxy.',
    '> Device identified as: Pixel 8 Pro (Android 14)',
  ]);
  const [battery, setBattery] = useState(87);
  const [isVisionExpanded, setIsVisionExpanded] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [scripts, setScripts] = useState([
    { id: 1, name: 'Social Auto-Scout', status: 'Idle', type: 'download' },
    { id: 2, name: 'App Integrity Tester', status: 'Idle', type: 'shield' },
    { id: 3, name: 'Location Spoofer', status: 'Active', type: 'zap' },
  ]);
  const [scheduledTasks, setScheduledTasks] = useState([
    { id: 't1', scriptName: 'Location Spoofer', time: '18:30', status: 'Pending' }
  ]);
  const [scheduleTaskName, setScheduleTaskName] = useState('Social Auto-Scout');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isEdgeMode, setIsEdgeMode] = useState(false);
  const [zeroTouchIntent, setZeroTouchIntent] = useState('');
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [generatedNodes, setGeneratedNodes] = useState<{id: string, label: string}[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const logsEl = document.getElementById('terminal-logs');
    if (logsEl) {
      logsEl.scrollTop = logsEl.scrollHeight;
    }
  }, [logs]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `> ${message}`]);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutonomousActive) {
      interval = setInterval(() => {
        const events = [
          'Navigating to application com.example.app...',
          'Bypassing biometric prompt (simulated)...',
          'Extracting secure token from memory...',
          'Simulating user touch at coordinates (450, 890)...',
          'Autonomous agent awaiting next instruction state...',
          'Intercepting network request payload...'
        ];
        addLog(events[Math.floor(Math.random() * events.length)]);
        setBattery(prev => Math.max(0, prev - Math.random() * 0.5));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutonomousActive]);

  const toggleAutonomous = () => {
    if (!isAutonomousActive) {
      addLog('Activating Autonomous Mode (DeepSight Algorithm)...');
    } else {
      addLog('Autonomous Mode deactivated. Returning to manual control.');
    }
    setIsAutonomousActive(!isAutonomousActive);
  };

  const processZeroTouchIntent = (intentText: string) => {
    if (!intentText.trim()) return;
    setIsOrchestrating(true);
    setGeneratedNodes([]);
    addLog(`[INTENT REGISTRATION] Interpreting: "${intentText}"`);
    setZeroTouchIntent(intentText); // ensure input shows it while processing

    setTimeout(() => {
      setGeneratedNodes([{ id: 'n1', label: 'Extract Invoices' }]);
    }, 600);
    setTimeout(() => {
      setGeneratedNodes(prev => [...prev, { id: 'n2', label: 'Format PDF' }]);
    }, 1200);
    setTimeout(() => {
      setGeneratedNodes(prev => [...prev, { id: 'n3', label: 'WhatsApp Dispatch' }]);
      addLog(`[ORCHESTRATOR] 0-Touch Workflow generated. Executing...`);
      setZeroTouchIntent('');
    }, 1800);
    
    setTimeout(() => setIsOrchestrating(false), 4000);
  };

  const handleZeroTouchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processZeroTouchIntent(zeroTouchIntent);
  };

  const startSpeechRecognition = () => {
    // @ts-expect-error - Web Speech API typing
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addLog('error: Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let currentTranscript = '';

    recognition.onstart = () => {
      setIsRecording(true);
      setZeroTouchIntent('');
      addLog('[MIC] Listening for zero-touch intent...');
    };

    // @ts-expect-error - Web Speech API typing
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      currentTranscript = transcript;
      setZeroTouchIntent(transcript);
    };

    // @ts-expect-error - Web Speech API typing
    recognition.onerror = (event) => {
      addLog(`[MIC] Error occurred: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (currentTranscript.trim()) {
         processZeroTouchIntent(currentTranscript);
      } else {
         addLog('[MIC] No speech detected.');
      }
    };

    recognition.start();
  };

  const executeQuickAction = (actionName: string) => {
    addLog(`Executing administrative action: [${actionName}]...`);
    setTimeout(() => {
      addLog(`Action [${actionName}] completed successfully.`);
    }, 1500);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    setLogs(prev => [...prev, `$ ${cmd}`]); // User command styling

    const lowerCmd = cmd.toLowerCase();
    if (lowerCmd === 'clear') {
       setLogs(['> terminal cleared.']);
    } else if (lowerCmd === 'help') {
       addLog('Available commands: start <name>, stop <name>, clear, help');
    } else if (lowerCmd.startsWith('start ')) {
       const target = lowerCmd.replace('start ', '').trim();
       const scriptIndex = scripts.findIndex(s => s.name.toLowerCase().includes(target));
       if (scriptIndex >= 0) {
           const newScripts = [...scripts];
           newScripts[scriptIndex].status = 'Active';
           setScripts(newScripts);
           addLog(`Starting Routine: ${scripts[scriptIndex].name}...`);
       } else {
           addLog(`error: Script [${target}] not found.`);
       }
    } else if (lowerCmd.startsWith('stop ')) {
       const target = lowerCmd.replace('stop ', '').trim();
       const scriptIndex = scripts.findIndex(s => s.name.toLowerCase().includes(target));
       if (scriptIndex >= 0) {
           const newScripts = [...scripts];
           newScripts[scriptIndex].status = 'Idle';
           setScripts(newScripts);
           addLog(`Halting Routine: ${scripts[scriptIndex].name}...`);
       } else {
           addLog(`error: Script [${target}] not found.`);
       }
    } else {
       addLog(`Command not recognized: ${cmd}. Type 'help'.`);
    }
    setCommandInput('');
  };

  const allCommands = [
    'clear',
    'help',
    ...scripts.map(s => `start ${s.name.toLowerCase()}`),
    ...scripts.map(s => `stop ${s.name.toLowerCase()}`)
  ];

  const matchingSuggestions = commandInput.trim() === ''
    ? []
    : allCommands.filter(c => c.startsWith(commandInput.toLowerCase()) && c !== commandInput.toLowerCase());

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (matchingSuggestions.length > 0) {
        setCommandInput(matchingSuggestions[0] + ' ');
      }
    }
  };

  const handleScheduleTask = () => {
    if (!scheduleTime) {
      addLog('error: Execution time required for scheduling.');
      return;
    }
    const newTask = {
      id: Math.random().toString(36).substring(7),
      scriptName: scheduleTaskName,
      time: scheduleTime,
      status: 'Pending'
    };
    setScheduledTasks(prev => [...prev, newTask].sort((a, b) => a.time.localeCompare(b.time)));
    addLog(`Task queued: ${scheduleTaskName} at ${scheduleTime}`);
    setScheduleTime('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      <TopNav 
        isConnected={isConnected} 
        latency={latency} 
        onOpenSecurity={() => setIsSecurityOpen(true)} 
      />

      <main className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
        
        {/* Left Column: Device Info & Dashboard */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Zero-Touch Orchestration Bar */}
          <div className="bg-zinc-900 border border-zinc-800 p-2 pl-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.05)] focus-within:border-emerald-500/50 transition-colors">
            <form onSubmit={handleZeroTouchSubmit} className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              <input 
                type="text" 
                value={zeroTouchIntent}
                onChange={(e) => setZeroTouchIntent(e.target.value)}
                placeholder="Enter Zero-Touch Intent (e.g. 'Download invoices and send via WhatsApp')..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-100 placeholder-zinc-500 font-mono"
              />
              <button type="submit" className={`p-2 rounded-lg transition-colors ${zeroTouchIntent.length > 0 ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                <Activity className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={startSpeechRecognition}
                disabled={isRecording}
                className={`p-2 rounded-lg transition-colors ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                <div className="relative">
                  <Mic className="w-4 h-4" />
                  {isRecording && <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>}
                </div>
              </button>
            </form>
          </div>

          {/* Orchestrator Node Visualizer */}
          <AnimatePresence>
            {(isOrchestrating || generatedNodes.length > 0) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 border border-dashed border-emerald-500/30 rounded-xl bg-emerald-500/5 flex items-center justify-center gap-4 min-h-[100px]">
                  {generatedNodes.map((node, i) => (
                    <motion.div 
                      key={node.id} 
                      initial={{ scale: 0, x: -20 }} 
                      animate={{ scale: 1, x: 0 }}
                      className="flex items-center gap-4"
                    >
                      <div className="px-4 py-2 bg-zinc-900 border border-emerald-500/50 rounded flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <GitMerge className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono font-bold text-zinc-200">{node.label}</span>
                      </div>
                      {i < generatedNodes.length - 1 && (
                        <div className="w-8 h-px bg-emerald-500/50 relative">
                           <div className="absolute top-1/2 left-full -translate-y-1/2 -translate-x-1 border-4 border-transparent border-l-emerald-500/50"></div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isOrchestrating && generatedNodes.length < 3 && (
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5] }} 
                      transition={{ duration: 1, repeat: Infinity }}
                      className="px-4 py-2 bg-zinc-900/50 border border-zinc-700 border-dashed rounded text-xs font-mono text-zinc-500"
                    >
                      Synthesizing Nodes...
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg">
              <h3 className="text-zinc-400 text-xs tracking-wider mb-2 uppercase">Target Device</h3>
              <p className="text-lg text-white font-medium">Google Pixel 8 Pro</p>
              <p className="text-zinc-500 text-sm mt-1">ID: a7b89-2f22x-c09a</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg relative overflow-hidden">
               {isEdgeMode && <div className="absolute top-0 right-0 p-2"><div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold tracking-widest rounded border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.5)]"><GlobeLock className="w-3 h-3 inline-block mr-1" />ZERO-LATENCY</div></div>}
               <h3 className="text-zinc-400 text-xs tracking-wider mb-2 uppercase flex items-center gap-2"><BrainCircuit className="w-4 h-4"/> AI Inference Engine</h3>
               <div className="flex items-center justify-between mb-2">
                 <button onClick={() => setIsEdgeMode(false)} className={`flex-1 text-xs py-1 text-center font-bold font-mono transition-colors border-b-2 ${!isEdgeMode ? 'border-blue-500 text-blue-400' : 'border-zinc-800 text-zinc-600 hover:text-zinc-400'}`}>CLOUD API</button>
                 <button onClick={() => setIsEdgeMode(true)} className={`flex-1 text-xs py-1 text-center font-bold font-mono transition-colors border-b-2 ${isEdgeMode ? 'border-emerald-500 text-emerald-400' : 'border-zinc-800 text-zinc-600 hover:text-zinc-400'}`}>EDGE SLM</button>
               </div>
               <p className="text-zinc-500 text-sm mt-3 flex justify-between items-end">
                 <span>Execution Time</span>
                 <span className={`font-mono font-bold ${isEdgeMode ? 'text-emerald-400' : 'text-blue-400'}`}>{isEdgeMode ? '< 4ms' : '~240ms'}</span>
               </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg flex flex-col justify-center items-center relative overflow-hidden group">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleAutonomous}
                className={`relative z-10 w-full rounded-lg py-3 font-bold tracking-widest uppercase transition-colors border ${isAutonomousActive ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'}`}
              >
                {isAutonomousActive ? 'Deactivate Auto' : 'Engage Auto'}
              </motion.button>
              {isAutonomousActive && (
                <div className="absolute inset-0 border-2 border-emerald-500/50 rounded-xl animate-pulse pointer-events-none"></div>
              )}
            </div>
          </div>

          <SwarmFleetDashboard isEdgeMode={isEdgeMode} isAutonomousActive={isAutonomousActive} />

          {/* Proactive Suggestions */}
          <div className="bg-zinc-900 border border-emerald-500/20 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.05)] p-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none"><BrainCircuit className="w-16 h-16 text-emerald-500" /></div>
             <h2 className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase mb-2 flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Predictive Action</h2>
             <p className="text-sm text-zinc-300 relative z-10 leading-relaxed font-mono">
               Routine detected: Do you want me to auto-send yesterday's reports?
             </p>
             <div className="mt-3 flex items-center gap-3">
               <button onClick={() => addLog('Executing proactive task: Auto-sending reports...')} className="text-xs bg-emerald-500 text-black font-bold px-4 py-1.5 rounded hover:bg-emerald-400 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                 Execute Now
               </button>
               <button onClick={() => addLog('Dismissing proactive suggestion.')} className="text-xs text-zinc-500 hover:text-zinc-300 hover:underline transition-colors">
                 Dismiss
               </button>
             </div>
          </div>

          <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden shadow-lg shadow-black/50 flex flex-col h-[380px]">
            <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 flex justify-between items-center shrink-0">
              <h2 className="text-sm font-medium text-zinc-300 flex items-center gap-2"><TerminalIcon className="w-4 h-4" /> Agent Logs</h2>
              <button onClick={() => setLogs(['> Logs cleared.'])} className="text-xs text-zinc-500 hover:text-white transition-colors">Clear</button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-1 font-mono text-sm scroll-smooth" id="terminal-logs">
              <AnimatePresence initial={false}>
                {logs.map((log, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${log.includes('successfully') ? 'text-emerald-400' : log.includes('error') ? 'text-red-400' : log.startsWith('$') ? 'text-zinc-100 font-bold tracking-wide mt-2' : 'text-zinc-400'}`}
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <form onSubmit={handleCommand} className="border-t border-zinc-800 shrink-0 flex items-center bg-zinc-900/30 relative">
              <span className="text-emerald-500 font-mono font-bold pl-4 pr-2">»</span>
              <input 
                type="text" 
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleTerminalKeyDown}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                placeholder="Enter command (e.g., start auto-scout)"
                className="flex-1 bg-transparent border-none text-zinc-100 font-mono text-sm py-3 pr-4 focus:ring-0 focus:outline-none placeholder-zinc-700"
              />
              <AnimatePresence>
                {isInputFocused && matchingSuggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-20"
                  >
                    <div className="text-xs text-zinc-500 font-mono px-3 py-1.5 border-b border-zinc-700/50 bg-zinc-900/50 flex justify-between">
                      <span>Suggestions</span>
                      <span>[Tab] to autocomplete</span>
                    </div>
                    <ul className="max-h-40 overflow-y-auto w-full">
                      {matchingSuggestions.map((suggestion, idx) => (
                        <li 
                          key={suggestion} 
                          className={`px-3 py-2 text-sm font-mono cursor-pointer flex items-center gap-2 ${idx === 0 ? 'bg-zinc-700/30 text-zinc-200' : 'text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200'} transition-colors`}
                          onClick={() => {
                            setCommandInput(suggestion + ' ');
                            const inputEl = document.querySelector('input[placeholder*="Enter command"]') as HTMLInputElement;
                            if (inputEl) inputEl.focus();
                          }}
                        >
                          <span className={`${idx === 0 ? 'text-emerald-400 font-bold' : 'text-zinc-500 opacity-50'}`}>»</span> 
                          <span>{suggestion.substring(0, commandInput.length)}</span>
                          <span className={idx === 0 ? 'text-zinc-300' : 'text-zinc-500'}>{suggestion.substring(commandInput.length)}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5">
            <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4 flex items-center gap-2"><Clock className="w-4 h-4" /> Task Scheduler</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative">
               <div className="md:col-span-1">
                 <label className="text-xs text-zinc-500 mb-1 block">automation script</label>
                 <select 
                   value={scheduleTaskName}
                   onChange={(e) => setScheduleTaskName(e.target.value)}
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
                 >
                   {scripts.map(s => (
                     <option key={s.id} value={s.name}>{s.name}</option>
                   ))}
                 </select>
               </div>
               <div className="md:col-span-1">
                 <label className="text-xs text-zinc-500 mb-1 block">execution time</label>
                 <input 
                   type="time" 
                   value={scheduleTime}
                   onChange={(e) => setScheduleTime(e.target.value)}
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50 [color-scheme:dark]"
                 />
               </div>
               <div className="md:col-span-1 flex items-end">
                 <button 
                   onClick={handleScheduleTask}
                   className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                 >
                   <Plus className="w-4 h-4" /> Queue Task
                 </button>
               </div>
            </div>

            <div className="space-y-3">
              {scheduledTasks.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-lg">No tasks queued.</div>
              ) : (
                scheduledTasks.map((task) => (
                  <div key={task.id} className="flex justify-between items-center p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg relative overflow-hidden group">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-800 group-hover:bg-emerald-500/50 transition-colors"></div>
                     <div className="flex items-center gap-4 pl-2">
                        <div className="bg-zinc-900 border border-zinc-800 w-12 h-12 rounded flex flex-col items-center justify-center">
                          <Clock className="w-4 h-4 text-zinc-500 mb-0.5" />
                          <span className="text-[10px] text-zinc-400 font-mono">{task.time}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-zinc-200">{task.scriptName}</div>
                          <div className="text-xs font-mono text-zinc-500 mt-1 flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80 animate-pulse"></div>
                             {task.status}
                          </div>
                        </div>
                     </div>
                     <button 
                       onClick={() => setScheduledTasks(prev => prev.filter(t => t.id !== task.id))}
                       className="text-zinc-500 hover:text-red-400 p-2 transition-colors border border-transparent hover:border-red-500/30 hover:bg-red-500/10 flex items-center justify-center rounded-md"
                     >
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5">
             <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Command Payload</h2>
             <div className="grid grid-cols-2 gap-3">
               <button onClick={() => executeQuickAction('Lock Screen')} className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors text-zinc-300 hover:text-white">
                  <Lock className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-semibold">Lock</span>
               </button>
               <button onClick={() => executeQuickAction('Wipe App Data')} className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors text-zinc-300 hover:text-white">
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <span className="text-xs font-semibold">Wipe Data</span>
               </button>
               <button onClick={() => executeQuickAction('Screen Stream')} className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors text-zinc-300 hover:text-white">
                  <MonitorPlay className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-semibold">Stream</span>
               </button>
               <button onClick={() => executeQuickAction('Reboot Device')} className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors text-zinc-300 hover:text-white">
                  <RotateCw className="w-5 h-5 text-orange-400" />
                  <span className="text-xs font-semibold">Reboot</span>
               </button>
             </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5">
            <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Automation Scripts</h2>
            <div className="space-y-3">
              {scripts.map((script) => (
                <div key={script.id} className="flex items-center justify-between p-3 bg-zinc-800/50 border border-zinc-800 rounded-lg hover:border-zinc-600 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
                      {script.type === 'download' && <Download className="w-4 h-4" />}
                      {script.type === 'shield' && <ShieldAlert className="w-4 h-4" />}
                      {script.type === 'zap' && <Zap className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm text-zinc-200">Routine: {script.name}</div>
                      <div className={`text-[10px] uppercase font-bold tracking-widest transition-colors ${script.status === 'Active' ? 'text-emerald-400' : 'text-zinc-500'}`}>{script.status}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                        const newScripts = [...scripts];
                        const s = newScripts.find(x => x.id === script.id);
                        if (s) {
                            if (s.status === 'Active') {
                                s.status = 'Idle';
                                addLog(`Halting Routine: ${s.name}...`);
                            } else {
                                s.status = 'Active';
                                addLog(`Starting Routine: ${s.name}...`);
                            }
                            setScripts(newScripts);
                        }
                    }} 
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                     {script.status === 'Active' ? <Square className="w-4 h-4 fill-current text-emerald-400" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full border border-dashed border-zinc-700 text-zinc-500 py-3 rounded-lg text-sm font-medium hover:border-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Upload Script
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5">
             <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4 flex items-center justify-between">
               <span>Vision Module</span>
               <div className="flex items-center gap-3">
                 {isAutonomousActive && <span className="flex items-center gap-1 text-[10px] text-emerald-400"><Activity className="w-3 h-3 animate-spin" /> LIVE</span>}
                 <button onClick={() => setIsVisionExpanded(true)} className="text-zinc-500 hover:text-white transition-colors" title="Expand Vision Feed">
                   <Maximize className="w-4 h-4" />
                 </button>
               </div>
             </h2>
             <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-black flex items-center justify-center">
                 {isAutonomousActive ? (
                   <>
                     <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay z-10 pointer-events-none"></div>
                     <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)] animate-scan z-20 pointer-events-none"></div>
                     <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-500 bg-black/60 px-1.5 py-0.5 rounded border border-emerald-500/30 z-20 pointer-events-none flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div> REC
                     </div>
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop" alt="Vision capture feed" className="w-full h-full object-cover translate-y-10 scale-125 opacity-70 grayscale contrast-125" />
                     {/* Simulated Object Detection Box */}
                     <motion.div 
                       animate={{ 
                         left: ['25%', '27%', '24%', '25%'], 
                         top: ['35%', '33%', '36%', '35%'],
                         width: ['45%', '46%', '44%', '45%'],
                         height: ['25%', '26%', '24%', '25%']
                       }}
                       transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                       className="absolute border border-emerald-500 bg-emerald-500/10 z-10 pointer-events-none"
                     >
                        <span className="absolute -top-4 left-[-1px] text-[8px] font-mono bg-emerald-500 text-black font-bold px-1 py-[1px]">ui_element_detected [98%]</span>
                        <div className="absolute top-[-2px] left-[-2px] w-1.5 h-1.5 bg-emerald-500"></div>
                        <div className="absolute top-[-2px] right-[-2px] w-1.5 h-1.5 bg-emerald-500"></div>
                        <div className="absolute bottom-[-2px] left-[-2px] w-1.5 h-1.5 bg-emerald-500"></div>
                        <div className="absolute bottom-[-2px] right-[-2px] w-1.5 h-1.5 bg-emerald-500"></div>
                     </motion.div>
                   </>
                 ) : (
                   <div className="flex flex-col items-center gap-2 text-zinc-600">
                      <Camera className="w-8 h-8 opacity-50" />
                      <span className="text-xs font-mono uppercase tracking-widest opacity-80">Feed Offline</span>
                   </div>
                 )}
             </div>
          </div>

        </div>

      </main>

      {/* Full-screen Vision Modal */}
      <AnimatePresence>
        {isVisionExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="w-full max-w-6xl h-[80vh] flex flex-col lg:flex-row gap-0 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
              <button 
                onClick={() => setIsVisionExpanded(false)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black rounded-lg text-zinc-400 hover:text-white transition-colors border border-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                 {isAutonomousActive ? (
                   <>
                     <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay z-10 pointer-events-none"></div>
                     <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)] animate-scan z-20 pointer-events-none"></div>
                     <div className="absolute top-4 left-4 text-xs font-mono text-emerald-500 bg-black/60 px-2 py-1 rounded border border-emerald-500/30 z-20 pointer-events-none flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> REC - LIVE FEED
                     </div>
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop" alt="Vision capture feed" className="w-full h-full object-cover translate-y-10 scale-[1.3] opacity-70 grayscale contrast-125" />
                     {/* Simulated Object Detection Box */}
                     <motion.div 
                       animate={{ 
                         left: ['25%', '27%', '24%', '25%'], 
                         top: ['35%', '33%', '36%', '35%'],
                         width: ['45%', '46%', '44%', '45%'],
                         height: ['25%', '26%', '24%', '25%']
                       }}
                       transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                       className="absolute border border-emerald-500 bg-emerald-500/10 z-10 pointer-events-none"
                     >
                        <span className="absolute -top-6 left-[-1px] text-[10px] font-mono bg-emerald-500 text-black font-bold px-1.5 py-0.5">ui_element_detected [98%]</span>
                        <div className="absolute top-[-2px] left-[-2px] w-2 h-2 bg-emerald-500"></div>
                        <div className="absolute top-[-2px] right-[-2px] w-2 h-2 bg-emerald-500"></div>
                        <div className="absolute bottom-[-2px] left-[-2px] w-2 h-2 bg-emerald-500"></div>
                        <div className="absolute bottom-[-2px] right-[-2px] w-2 h-2 bg-emerald-500"></div>
                     </motion.div>
                   </>
                 ) : (
                   <div className="flex flex-col items-center gap-4 text-zinc-600">
                      <Camera className="w-12 h-12 opacity-50" />
                      <span className="text-sm font-mono uppercase tracking-widest opacity-80">Feed Offline</span>
                   </div>
                 )}
              </div>
              
              <div className="w-full lg:w-80 bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col">
                <div className="p-4 border-b border-zinc-800">
                  <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase">Detection Logs</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto font-mono text-xs flex flex-col gap-3">
                  {isAutonomousActive ? (
                    <>
                      <div className="text-zinc-500">[17:23:50] Initializing vision module...</div>
                      <div className="text-emerald-400">[17:23:51] Connected to frame buffer</div>
                      <div className="text-zinc-500">[17:23:52] Scanning layout structures</div>
                      <div className="text-blue-400">[17:23:54] Found text node: "Settings"</div>
                      <div className="text-blue-400">[17:23:55] Found text node: "Profile"</div>
                      <div className="text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded border border-emerald-500/20 mt-2">
                        [17:23:58] [MATCH] Target ui_element_detected! Confidence: 98.4%
                      </div>
                      <div className="text-zinc-400 pl-2 border-l-2 border-zinc-700 ml-1">
                        &gt; BBox: x:120 y:340 w:220 h:90<br/>
                        &gt; Action recommended: TAP
                      </div>
                    </>
                  ) : (
                    <div className="text-zinc-500 italic text-center mt-10">Awaiting visual context...</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SecuritySettings 
        isOpen={isSecurityOpen} 
        onClose={() => setIsSecurityOpen(false)} 
        currentKey={apiKey} 
        onSaveKey={saveApiKey}
      />
    </div>
  );
}

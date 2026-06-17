import { motion } from 'motion/react';
import { Smartphone, Activity, Server, Zap, GlobeLock } from 'lucide-react';
import { useState, useEffect } from 'react';

const FLEET_DEVICES = [
  { id: 'DEVICE-Alpha', model: 'Pixel 8 Pro', status: 'Active', latency: '4ms', load: 82 },
  { id: 'DEVICE-Beta', model: 'Galaxy S24', status: 'Active', latency: '12ms', load: 45 },
  { id: 'DEVICE-Gamma', model: 'iPhone 15 Pro', status: 'Awaiting', latency: '22ms', load: 10 },
  { id: 'DEVICE-Delta', model: 'Pixel 7a', status: 'Syncing', latency: '18ms', load: 60 }
];

export default function SwarmFleetDashboard({ 
  isEdgeMode, 
  isAutonomousActive 
}: { 
  isEdgeMode: boolean; 
  isAutonomousActive: boolean; 
}) {
  const [delegatingTasks, setDelegatingTasks] = useState(false);

  useEffect(() => {
    if (isAutonomousActive) {
      const interval = setInterval(() => {
        setDelegatingTasks(true);
        setTimeout(() => setDelegatingTasks(false), 800);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAutonomousActive]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase flex items-center gap-2">
          <Server className="w-4 h-4" /> 
          Fleet Swarm Intelligence
        </h2>
        <div className="text-xs flex items-center gap-2 font-mono">
          {isEdgeMode ? (
            <span className="text-emerald-400 flex items-center gap-1 border border-emerald-500/30 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(16,185,129,0.2)] bg-emerald-500/10">
              <GlobeLock className="w-3 h-3" /> ON-DEVICE SLM
            </span>
          ) : (
            <span className="text-blue-400 flex items-center gap-1 border border-blue-500/30 px-2 py-0.5 rounded bg-blue-500/10">
              <Activity className="w-3 h-3" /> CLOUD HYBRID
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FLEET_DEVICES.map((device, idx) => {
          const isActive = device.status === 'Active' && isAutonomousActive;
          return (
            <div key={device.id} className="relative bg-black border border-zinc-800 p-4 rounded-lg flex flex-col gap-2 overflow-hidden group hover:border-zinc-700 transition-colors">
              {/* Task Delegation Animation */}
              {delegatingTasks && isActive && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-1 right-1 flex items-center"
                >
                  <div className="text-[9px] font-bold text-emerald-400 px-1 py-0.5 bg-emerald-500/20 rounded">TASK RECEIVED</div>
                </motion.div>
              )}

              <div className="flex justify-between items-start">
                <div className={`p-2 rounded ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-mono text-zinc-500 flex flex-col items-end">
                  <span>{device.latency}</span>
                  <span className={isActive ? 'text-emerald-500/80' : ''}>{device.load}% CPU</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-zinc-300">{device.id}</p>
                <p className="text-[10px] text-zinc-500">{device.model}</p>
              </div>

              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : device.status === 'Syncing' ? 'bg-blue-500 animate-bounce' : 'bg-zinc-600'}`}></div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">{isAutonomousActive ? device.status : 'Standby'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { Terminal, Shield, Power } from 'lucide-react';

export default function TopNav({ 
  isConnected, 
  latency, 
  onOpenSecurity 
}: { 
  isConnected: boolean; 
  latency: number | null; 
  onOpenSecurity: () => void;
}) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 border-l border-r border-zinc-900 border-opacity-30">
        <div className="flex items-center gap-3">
           <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
             <Terminal className="w-5 h-5 text-emerald-400" />
           </div>
           <h1 className="text-xl font-bold tracking-tight text-emerald-500 flex items-center gap-2">
             PHONEPILOT 
             <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold tracking-widest text-emerald-400">
               2030 VISION
             </span>
           </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Connection Health & Latency Monitor */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs bg-black border border-zinc-800 px-3 py-1.5 rounded-lg shadow-inner shadow-black/50 overflow-hidden relative">
            {isConnected ? (
              <>
                <div className="absolute top-0 left-0 bottom-0 w-8 bg-emerald-500/5 mix-blend-screen pointer-events-none"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                <span className="text-emerald-400 ml-1">{latency ? `${latency}ms` : '...'} Edge Connection</span>
              </>
            ) : (
              <>
                <div className="absolute top-0 left-0 bottom-0 w-full bg-red-500/5 mix-blend-screen pointer-events-none"></div>
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-ping"></div>
                <span className="text-red-400 ml-1">Device Unreachable - Retrying...</span>
              </>
            )}
          </div>

          <div className="w-px h-6 bg-zinc-800 hidden sm:block"></div>

          {/* Settings & Power */}
          <div className="flex gap-2">
             <button 
               onClick={onOpenSecurity}
               className="bg-black border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 p-2 rounded-lg transition-colors flex items-center gap-2"
               title="Security Vault"
             >
               <Shield className="w-4 h-4" />
             </button>
             <button className="bg-black border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/50 p-2 rounded-lg transition-colors">
               <Power className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </header>
  );
}

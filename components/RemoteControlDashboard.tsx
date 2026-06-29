'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Shield,
  Key,
  Clock,
  Lock,
  Unlock,
  Eye,
  Settings,
  ChevronRight,
  MousePointer,
  Keyboard,
  RefreshCw,
  Power,
  Sliders,
  AlertCircle,
  XCircle,
  CheckCircle,
  HelpCircle,
  Activity,
  Maximize2,
  Minimize2,
  Trash2,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';

interface RemoteControlDashboardProps {
  activeApp: string | null;
  setActiveApp: (app: string | null) => void;
  addLog: (log: string) => void;
  executeTap: (x: number, y: number) => void;
  battery: number;
  devices: Array<{ id: string; name: string; status: string }>;
  selectedDeviceId: string;
}

interface AuditLogEntry {
  timestamp: string;
  action: string;
  details: string;
  status: 'allowed' | 'blocked' | 'warning';
}

export default function RemoteControlDashboard({
  activeApp,
  setActiveApp,
  addLog,
  executeTap,
  battery,
  devices,
  selectedDeviceId,
}: RemoteControlDashboardProps) {
  // Authentication & Security state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionPin, setSessionPin] = useState('');
  const [generatedPin, setGeneratedPin] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Access control settings
  const [allowTaps, setAllowTaps] = useState(true);
  const [allowKeyboard, setAllowKeyboard] = useState(true);
  const [requirePin, setRequirePin] = useState(true);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  
  // Session details & timers
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [timeoutLimit, setTimeoutLimit] = useState(60); // In seconds
  const [timeLeft, setTimeLeft] = useState(60);
  const [isKeyboardCaptured, setIsKeyboardCaptured] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Mirroring feed configurations
  const [streamFps, setStreamFps] = useState(30);
  const [compressionRatio, setCompressionRatio] = useState('Medium (720p)');
  const [latencySim, setLatencySim] = useState(12); // ms
  
  // Interaction coordinates track
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const [visualRipples, setVisualRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [swipeStart, setSwipeStart] = useState<{ x: number; y: number } | null>(null);
  const [dragLine, setDragLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  
  // Keystrokes indicator
  const [recentKey, setRecentKey] = useState<string>('');
  const [typedBuffer, setTypedBuffer] = useState<string>('');
  
  // Audit Ledger log state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setAuditLogs([
      {
        timestamp: new Date(Date.now() - 30000).toLocaleTimeString(),
        action: 'Session Handshake',
        details: 'Computer requested connection authorization from remote client.',
        status: 'allowed',
      },
    ]);
  }, []);

  const activeDevice = devices.find(d => d.id === selectedDeviceId) || {
    id: 'device_pixel_8',
    name: 'Pixel 8 Pro (Android 14)',
    status: 'connected',
  };

  // Generate a random 6-digit session PIN on component mount or session start
  const generateNewPin = useCallback(() => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedPin(pin);
    setSessionPin('');
    setAuthError('');
    // Inject custom notification log
    addLog(`[SECURITY] Generated new 6-digit remote mirroring session authorization PIN: ${pin}`);
  }, [addLog]);

  useEffect(() => {
    generateNewPin();
  }, [selectedDeviceId]);

  // Handle Session PIN Verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirePin) {
      startSession();
      return;
    }
    
    // Check if entered PIN matches
    if (sessionPin.replace(/\s+/g, '') === generatedPin) {
      startSession();
    } else {
      setAuthError('Invalid Authorization PIN. Access Denied.');
      appendAuditLog('Connection Refused', 'PIN authentication challenge failed.', 'blocked');
      addLog(`[SECURITY ERROR] Remote control login failed: Invalid PIN attempt.`);
    }
  };

  const startSession = () => {
    setIsAuthenticated(true);
    setIsSessionActive(true);
    setTimeLeft(timeoutLimit);
    setAuthError('');
    appendAuditLog('Session Authorized', `Secure connection established with ${activeDevice.name}`, 'allowed');
    addLog(`[REMOTE DESKTOP] Mirroring and control session established successfully for ${activeDevice.name}.`);
  };

  const terminateSession = () => {
    setIsAuthenticated(false);
    setIsSessionActive(false);
    setIsKeyboardCaptured(false);
    generateNewPin();
    appendAuditLog('Session Terminated', 'Remote access connection closed safely.', 'warning');
    addLog('[REMOTE DESKTOP] Control session closed. Device secure.');
  };

  // Helper to add log entries to our interactive ledger
  const appendAuditLog = (action: string, details: string, status: 'allowed' | 'blocked' | 'warning') => {
    const newEntry: AuditLogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      action,
      details,
      status,
    };
    setAuditLogs(prev => [newEntry, ...prev].slice(0, 30));
  };

  // Security inactivity self-termination effect
  useEffect(() => {
    if (!isSessionActive || !isAuthenticated) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          terminateSession();
          addLog('[SECURITY ALERT] Session auto-locked due to inactivity.');
          appendAuditLog('Auto-Lockout', 'Session automatically closed due to user inactivity.', 'warning');
          return timeoutLimit;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive, isAuthenticated, timeoutLimit]);

  // Reset inactivity timer on user interaction
  const resetInactivityTimer = useCallback(() => {
    if (isSessionActive) {
      setTimeLeft(timeoutLimit);
    }
  }, [isSessionActive, timeoutLimit]);

  // Coordinate math based on rendering container bounds
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    resetInactivityTimer();
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates in percentages (0 - 100)
    const relX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / width) * 100));
    const relY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / height) * 100));
    
    // Scale to realistic phone standard screen dimensions (e.g. 1080 x 2400)
    const phoneX = Math.round((relX / 100) * 1080);
    const phoneY = Math.round((relY / 100) * 2400);
    
    setHoverCoord({ x: phoneX, y: phoneY });

    if (swipeStart && dragLine) {
      setDragLine({
        ...dragLine,
        x2: e.clientX - rect.left,
        y2: e.clientY - rect.top,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoverCoord(null);
    setSwipeStart(null);
    setDragLine(null);
  };

  // Click & Drag Interaction (Mouse Control)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    resetInactivityTimer();
    if (!allowTaps) {
      appendAuditLog('Interaction Blocked', 'Click injection is disabled in settings.', 'blocked');
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    const relX = (clientX / rect.width) * 100;
    const relY = (clientY / rect.height) * 100;

    setSwipeStart({ x: relX, y: relY });
    setDragLine({
      x1: clientX,
      y1: clientY,
      x2: clientX,
      y2: clientY,
    });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    resetInactivityTimer();
    if (!allowTaps || !swipeStart) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    const relX2 = (clientX / rect.width) * 100;
    const relY2 = (clientY / rect.height) * 100;

    const distanceX = Math.abs(relX2 - swipeStart.x);
    const distanceY = Math.abs(relY2 - swipeStart.y);
    const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    const startPhoneX = Math.round((swipeStart.x / 100) * 1080);
    const startPhoneY = Math.round((swipeStart.y / 100) * 2400);
    const endPhoneX = Math.round((relX2 / 100) * 1080);
    const endPhoneY = Math.round((relY2 / 100) * 2400);

    if (totalDistance > 5) {
      // Swipe operation
      appendAuditLog('Mouse Swipe', `Injected Swipe from (${startPhoneX}, ${startPhoneY}) to (${endPhoneX}, ${endPhoneY})`, 'allowed');
      addLog(`[ADB OVERLAY] adb shell input swipe ${startPhoneX} ${startPhoneY} ${endPhoneX} ${endPhoneY}`);
    } else {
      // Tap / Click operation
      executeTap(swipeStart.x, swipeStart.y);
      
      const newRipple = {
        id: Date.now() + Math.random(),
        x: swipeStart.x,
        y: swipeStart.y,
      };
      setVisualRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setVisualRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 800);

      appendAuditLog('Mouse Click', `Injected Tap Tap at (${startPhoneX}, ${startPhoneY})`, 'allowed');
      addLog(`[ADB OVERLAY] adb shell input tap ${startPhoneX} ${startPhoneY}`);
    }

    setSwipeStart(null);
    setDragLine(null);
  };

  // Physical Keyboard Input capture
  const handlePhysicalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    resetInactivityTimer();
    if (!allowKeyboard || !isKeyboardCaptured) return;
    
    e.preventDefault();
    const key = e.key;
    
    let adbCommand = '';
    let logDetail = '';
    
    if (key.length === 1) {
      // Letter, number or symbol
      adbCommand = `adb shell input text "${key}"`;
      logDetail = `Injected text character: '${key}'`;
      setTypedBuffer(prev => (prev + key).slice(-15));
      setRecentKey(key);
    } else {
      // Functional keys
      switch (key) {
        case 'Enter':
          adbCommand = 'adb shell input keyevent 66';
          logDetail = 'Injected functional key: [Enter]';
          setRecentKey('↵ Enter');
          break;
        case 'Backspace':
          adbCommand = 'adb shell input keyevent 67';
          logDetail = 'Injected functional key: [Backspace]';
          setRecentKey('⌫ Backspace');
          setTypedBuffer(prev => prev.slice(0, -1));
          break;
        case 'ArrowUp':
          adbCommand = 'adb shell input keyevent 19';
          logDetail = 'Injected navigation: [Arrow Up]';
          setRecentKey('↑ Up');
          break;
        case 'ArrowDown':
          adbCommand = 'adb shell input keyevent 20';
          logDetail = 'Injected navigation: [Arrow Down]';
          setRecentKey('↓ Down');
          break;
        case 'ArrowLeft':
          adbCommand = 'adb shell input keyevent 21';
          logDetail = 'Injected navigation: [Arrow Left]';
          setRecentKey('← Left');
          break;
        case 'ArrowRight':
          adbCommand = 'adb shell input keyevent 22';
          logDetail = 'Injected navigation: [Arrow Right]';
          setRecentKey('→ Right');
          break;
        case 'Escape':
          adbCommand = 'adb shell input keyevent 4'; // Android BACK key
          logDetail = 'Injected navigation: [Back / Escape]';
          setRecentKey('⎋ Back');
          break;
        default:
          return; // Ignore other non-character inputs
      }
    }

    if (adbCommand) {
      addLog(`[KEYBOARD OVERLAY] ${adbCommand}`);
      appendAuditLog('Keyboard Input', logDetail, 'allowed');
    }
  };

  // Device navigation button triggers
  const triggerKeyevent = (code: number, label: string) => {
    resetInactivityTimer();
    if (!allowKeyboard) {
      appendAuditLog('Interaction Blocked', 'Keyboard and keyevent injection is disabled.', 'blocked');
      return;
    }
    addLog(`[REMOTE CONTROL] adb shell input keyevent ${code}`);
    appendAuditLog('Device Control', `Triggered system action: ${label}`, 'allowed');
    setRecentKey(label);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl transition-all" id="remote-control-workbench">
      {/* Workbench Header */}
      <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
            <Smartphone className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider text-zinc-100 uppercase">
              Secure Remote Screen Mirroring & Control
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono">
              Target ID: <span className="text-zinc-400 font-semibold">{activeDevice.id}</span> • Status: <span className="text-emerald-400">{activeDevice.status}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          {encryptionEnabled && (
            <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              AES-256 SECURE
            </span>
          )}
          
          {isAuthenticated && (
            <span className="text-[9px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500" />
              Timeout in {timeLeft}s
            </span>
          )}

          {isAuthenticated && (
            <button
              onClick={terminateSession}
              className="text-[10px] font-mono bg-red-950/40 text-red-400 hover:bg-red-900/30 border border-red-500/30 hover:border-red-500/50 px-2.5 py-1 rounded transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3 h-3" />
              Disconnect
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Mirroring Screen Section */}
        <div className="lg:col-span-5 p-6 bg-zinc-950 border-r border-zinc-900 flex flex-col items-center justify-center relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {!isAuthenticated ? (
              /* Authorization Challenge */
              <motion.div
                key="auth-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl text-center flex flex-col items-center justify-center gap-4 relative"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-amber-400 border border-zinc-700/60 shadow-lg">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-zinc-200">
                    Connection Request Pending
                  </h4>
                  <p className="text-[11px] text-zinc-500 font-mono mt-1 max-w-[280px] mx-auto leading-normal">
                    This computer is attempting to establish a secure interactive control session with {activeDevice.name}.
                  </p>
                </div>

                <div className="w-full bg-black/40 border border-zinc-800 p-3 rounded-lg flex flex-col items-center justify-center gap-1 font-mono">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest">
                    Verification Challenge PIN
                  </span>
                  <span className="text-xl font-black text-amber-500 tracking-widest">
                    {generatedPin.substring(0, 3)} {generatedPin.substring(3)}
                  </span>
                  <span className="text-[8px] text-zinc-600">
                    To authorize, enter the PIN displayed above.
                  </span>
                </div>

                <form onSubmit={handleVerifyPin} className="w-full space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={7}
                      placeholder="Enter 6-Digit PIN..."
                      value={sessionPin}
                      onChange={(e) => setSessionPin(e.target.value)}
                      className="w-full bg-black border border-zinc-800 text-center rounded-lg p-2 text-sm text-amber-400 font-mono tracking-widest focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                  
                  {authError && (
                    <p className="text-[10px] text-red-400 font-mono flex items-center gap-1 justify-center">
                      <XCircle className="w-3 h-3 shrink-0" />
                      {authError}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={generateNewPin}
                      className="flex-1 bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs py-2 rounded-lg font-mono hover:bg-zinc-700 transition-colors"
                    >
                      Regenerate
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-amber-500 text-black text-xs py-2 rounded-lg font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/10"
                    >
                      Authorize Control
                    </button>
                  </div>
                </form>

                <div className="text-[9px] text-zinc-600 font-mono text-left w-full border-t border-zinc-800/80 pt-3">
                  <span className="text-red-500 font-bold uppercase">Security Warning:</span> Remote control gives this interface permissions to click and type on the device on your behalf. Ensure this device host is trustworthy.
                </div>
              </motion.div>
            ) : (
              /* Real-time Mirrored Device Frame */
              <motion.div
                key="mirror-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col items-center gap-4 w-full"
              >
                <div
                  className={`relative ${isFullscreen ? 'w-[320px] h-[580px]' : 'w-[240px] h-[440px]'} bg-zinc-950 border-[6px] border-zinc-800 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col select-none transition-all duration-300`}
                  onKeyDown={handlePhysicalKeyDown}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                  onClick={() => setIsKeyboardCaptured(true)}
                >
                  {/* Mirroring Connection Visual Overlay */}
                  <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none z-50"></div>

                  {/* Android Status Bar */}
                  <div className="h-4 w-full bg-zinc-950 flex items-center justify-between px-3 text-[8px] text-zinc-400 font-medium z-40 shrink-0">
                    <span>19:24</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[7px] text-indigo-400/80 uppercase font-mono">Live Mirror</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="scale-75 font-mono">{Math.round(battery)}%</span>
                    </div>
                  </div>

                  {/* Active App Viewport */}
                  <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black p-2 relative overflow-hidden">
                    {activeApp === 'camera' ? (
                      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-30">
                        {/* Camera Viewfinder */}
                        <div className="w-full h-full border border-white/10 flex flex-col justify-between p-4 relative">
                          <div className="flex justify-between text-zinc-400 text-[8px] font-mono">
                            <span>F1.8 • ISO 100</span>
                            <span>RAW 12-BIT</span>
                          </div>
                          
                          {/* Grid Overlay */}
                          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                            <div className="border border-white/20"></div>
                            <div className="border border-white/20"></div>
                            <div className="border border-white/20"></div>
                            <div className="border border-white/20"></div>
                            <div className="border border-white/20"></div>
                            <div className="border border-white/20"></div>
                          </div>

                          <div className="w-12 h-12 border-2 border-white/20 rounded-full flex items-center justify-center self-center my-auto">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            </div>
                          </div>

                          <div className="flex justify-around items-center gap-2">
                            <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[7px] text-zinc-400">0.5x</div>
                            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-black/40">
                              <div className="w-6 h-6 bg-white rounded-full"></div>
                            </div>
                            <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[7px] text-zinc-400">2.0x</div>
                          </div>
                        </div>
                      </div>
                    ) : activeApp === 'chrome' ? (
                      <div className="absolute inset-0 bg-white flex flex-col z-30 text-zinc-800">
                        {/* Browser Bar */}
                        <div className="h-8 bg-zinc-100 border-b border-zinc-200 flex items-center px-2 shrink-0 gap-1 shadow-sm">
                          <div className="flex-1 bg-white border border-zinc-200 rounded-full h-5 px-2 flex items-center text-[7px] text-zinc-500 font-mono truncate">
                            google.com/search?q=space_koro
                          </div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2.5 text-[9px] font-sans">
                          <div className="border-b border-zinc-100 pb-1.5">
                            <span className="text-[7px] text-zinc-400 uppercase tracking-wider font-mono">Searched Query</span>
                            <h4 className="text-xs font-extrabold text-blue-600">Secure Remote Control</h4>
                          </div>
                          <div className="bg-zinc-50 p-2 rounded border border-zinc-100 leading-normal text-zinc-600">
                            Remote device operations have been successfully initialized. Touch, gestures, and keys are successfully piped via connection broker.
                          </div>
                          <div className="space-y-1 mt-1">
                            <div className="w-full h-2 bg-zinc-200 rounded"></div>
                            <div className="w-3/4 h-2 bg-zinc-200 rounded"></div>
                            <div className="w-1/2 h-2 bg-zinc-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ) : activeApp === 'maps' ? (
                      <div className="absolute inset-0 bg-[#e5e3df] flex flex-col z-30">
                        <div className="absolute top-2 left-2 right-2 h-5 bg-white rounded shadow-md flex items-center px-2 z-40">
                          <span className="text-[7px] text-zinc-500 truncate">Latitude: 37.7749° N, Longitude: 122.4194° W</span>
                        </div>
                        <div className="w-full h-full relative overflow-hidden">
                          {/* Map drawings */}
                          <div className="absolute top-8 left-[-10px] w-[180px] h-3 bg-[#f9db8d] rotate-12"></div>
                          <div className="absolute top-24 right-[-10px] w-[180px] h-3 bg-[#f9db8d] -rotate-45"></div>
                          <div className="absolute top-1/2 left-1/3 w-2.5 h-2.5 bg-indigo-500 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                          <div className="absolute bottom-3 left-3 bg-white/90 px-1.5 py-0.5 rounded text-[6px] text-zinc-700 border border-zinc-200 font-mono">
                            3D MAP RENDERING
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Home Screen View with Apps */
                      <div className="flex flex-col h-full justify-between py-2 text-zinc-200">
                        <div className="text-center mt-2">
                          <div className="text-xl font-light tracking-wide text-zinc-100">19:24</div>
                          <div className="text-[8px] text-zinc-400 uppercase font-mono mt-0.5">Saturday, June 27</div>
                        </div>

                        {/* App Rows */}
                        <div className="grid grid-cols-3 gap-y-4 gap-x-2 px-1 text-center">
                          <button
                            onClick={() => setActiveApp('chrome')}
                            className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
                          >
                            <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                              <span className="text-[9px] font-bold">Ch</span>
                            </div>
                            <span className="text-[7px] text-zinc-400 font-mono truncate max-w-full">Chrome</span>
                          </button>
                          
                          <button
                            onClick={() => setActiveApp('maps')}
                            className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
                          >
                            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                              <span className="text-[9px] font-bold">Mp</span>
                            </div>
                            <span className="text-[7px] text-zinc-400 font-mono truncate max-w-full">Maps</span>
                          </button>
                          
                          <button
                            onClick={() => setActiveApp('camera')}
                            className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
                          >
                            <div className="w-7 h-7 bg-zinc-700 rounded-lg flex items-center justify-center text-white shadow-lg">
                              <span className="text-[9px] font-bold">Cam</span>
                            </div>
                            <span className="text-[7px] text-zinc-400 font-mono truncate max-w-full">Camera</span>
                          </button>
                        </div>

                        {/* Dock */}
                        <div className="h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-around px-1 py-1 mx-1">
                          <button onClick={() => setActiveApp(null)} className="w-5 h-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-md flex items-center justify-center text-[7px] font-semibold font-mono">
                            Home
                          </button>
                          <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center text-white text-[7px] font-bold">
                            Ph
                          </div>
                          <div className="w-5 h-5 bg-teal-600 rounded-md flex items-center justify-center text-white text-[7px] font-bold">
                            Msg
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Touch Pointer Ripples */}
                    {visualRipples.map(ripple => (
                      <span
                        key={ripple.id}
                        style={{
                          left: `${ripple.x}%`,
                          top: `${ripple.y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className="absolute w-6 h-6 border border-amber-500 bg-amber-500/10 rounded-full animate-ping z-50 pointer-events-none"
                      ></span>
                    ))}

                    {/* Current Drag / Gesture Line feedback */}
                    {dragLine && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-50">
                        <line
                          x1={dragLine.x1}
                          y1={dragLine.y1}
                          x2={dragLine.x2}
                          y2={dragLine.y2}
                          stroke="#f59e0b"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                        />
                        <circle cx={dragLine.x1} cy={dragLine.y1} r="3" fill="#f59e0b" />
                        <circle cx={dragLine.x2} cy={dragLine.y2} r="3" fill="#f59e0b" />
                      </svg>
                    )}

                    {/* Keyboard Focus / Intercept Active Visual banner */}
                    {isKeyboardCaptured && allowKeyboard && (
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-indigo-600/90 border border-indigo-400 text-[7px] px-2 py-0.5 rounded-full font-mono text-white flex items-center gap-1 z-40 shadow-md">
                        <Keyboard className="w-2.5 h-2.5" />
                        KEYBOARD CAPTURED
                      </div>
                    )}
                  </div>

                  {/* Android Navigation Bar */}
                  <div className="h-6 w-full bg-zinc-950 flex items-center justify-around text-zinc-500 border-t border-zinc-900 shrink-0 z-40">
                    <button
                      onClick={() => triggerKeyevent(187, 'App Switcher')}
                      className="hover:text-zinc-300 transition-colors px-4 py-1"
                      title="App Switcher"
                    >
                      <div className="w-2.5 h-2.5 border border-current rounded-sm"></div>
                    </button>
                    <button
                      onClick={() => {
                        setActiveApp(null);
                        triggerKeyevent(3, 'Home Button');
                      }}
                      className="hover:text-zinc-300 transition-colors px-4 py-1"
                      title="Home"
                    >
                      <div className="w-3 h-3 rounded-full border-2 border-current"></div>
                    </button>
                    <button
                      onClick={() => triggerKeyevent(4, 'Back Button')}
                      className="hover:text-zinc-300 transition-colors px-4 py-1"
                      title="Back"
                    >
                      <span className="text-[9px] font-bold font-mono">◀</span>
                    </button>
                  </div>
                </div>

                {/* Live Stream Telemetry details */}
                <div className="w-full flex justify-between items-center px-4 py-2 bg-zinc-900/40 border border-zinc-800 rounded-lg text-[9px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    {streamFps} FPS
                  </span>
                  <span>Latency: <span className="text-emerald-400">{latencySim}ms</span></span>
                  <span className="truncate max-w-[100px] text-zinc-400">{compressionRatio}</span>
                </div>

                {/* On-Screen Keyboard input trigger helper */}
                <div className="w-full space-y-1">
                  <div className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono font-bold">
                    Interactive Keyboard Capturer
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Click here to capture & type on device..."
                      className="flex-1 bg-black border border-zinc-800 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-200 font-mono focus:outline-none focus:border-indigo-500"
                      value={typedBuffer}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length > typedBuffer.length) {
                          const char = val.slice(-1);
                          addLog(`[KEYBOARD TEXT] adb shell input text "${char}"`);
                          appendAuditLog('Keyboard Input', `Typed text character: '${char}'`, 'allowed');
                          setRecentKey(char);
                        }
                        setTypedBuffer(val);
                      }}
                      onFocus={() => setIsKeyboardCaptured(true)}
                      onBlur={() => setIsKeyboardCaptured(false)}
                    />
                    <button
                      onClick={() => {
                        setTypedBuffer('');
                        setRecentKey('');
                      }}
                      className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[10px] px-2 text-zinc-400 font-mono rounded"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Configurations, Security & Logs Section */}
        <div className="lg:col-span-7 p-6 bg-zinc-950 flex flex-col gap-6">
          {/* Access Security Controls */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-400 tracking-wider font-mono uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              Session Authorization & Permissions
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-zinc-900/30 border border-zinc-800/80 p-3 rounded-lg flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">Require PIN Auth</span>
                  <input
                    type="checkbox"
                    checked={requirePin}
                    onChange={(e) => {
                      setRequirePin(e.target.checked);
                      appendAuditLog('Security Config', `Require PIN updated to: ${e.target.checked}`, 'warning');
                      addLog(`[SECURITY] Config changed: Require session PIN challenge = ${e.target.checked}`);
                    }}
                    className="rounded border-zinc-800 bg-black text-indigo-500 focus:ring-0 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Requires a cryptographically refreshed 6-digit passcode validation before remote access is unlocked.
                </p>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/80 p-3 rounded-lg flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">Enforce Encrypted Channel</span>
                  <input
                    type="checkbox"
                    checked={encryptionEnabled}
                    onChange={(e) => {
                      setEncryptionEnabled(e.target.checked);
                      appendAuditLog('Security Config', `Encryption channel update: ${e.target.checked}`, 'warning');
                      addLog(`[SECURITY] Config changed: Enforce TLS Encryption Tunnel = ${e.target.checked}`);
                    }}
                    className="rounded border-zinc-800 bg-black text-indigo-500 focus:ring-0 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Simulates a dedicated TLS tunnel proxy (handshake and signature hashing verified on connection).
                </p>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/80 p-3 rounded-lg flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">Inject Click Taps</span>
                  <input
                    type="checkbox"
                    checked={allowTaps}
                    onChange={(e) => {
                      setAllowTaps(e.target.checked);
                      appendAuditLog('Permission Changed', `Click Injection approved: ${e.target.checked}`, 'warning');
                    }}
                    className="rounded border-zinc-800 bg-black text-indigo-500 focus:ring-0 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Allows physical mouse clicks and drag swipes on the mirrored desktop viewer to inject commands.
                </p>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/80 p-3 rounded-lg flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">Inject Keyboard Inputs</span>
                  <input
                    type="checkbox"
                    checked={allowKeyboard}
                    onChange={(e) => {
                      setAllowKeyboard(e.target.checked);
                      appendAuditLog('Permission Changed', `Keyboard injection approved: ${e.target.checked}`, 'warning');
                    }}
                    className="rounded border-zinc-800 bg-black text-indigo-500 focus:ring-0 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Allows physical computer typing to inject key events and character strings on the target phone.
                </p>
              </div>
            </div>
          </div>

          {/* Session Timer & Quality Configurations */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-400 tracking-wider font-mono uppercase flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-400" />
              Mirror Stream Performance & Timeout Rules
            </h4>

            <div className="bg-zinc-900/20 border border-zinc-800/80 p-4 rounded-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">
                    Session Inactivity Timeout
                  </label>
                  <select
                    value={timeoutLimit}
                    onChange={(e) => {
                      const limit = Number(e.target.value);
                      setTimeoutLimit(limit);
                      setTimeLeft(limit);
                      appendAuditLog('Timeout Limit Updated', `Session inactivity lock set to ${limit}s`, 'allowed');
                    }}
                    className="w-full bg-black border border-zinc-800 text-zinc-300 rounded p-1.5 text-xs focus:outline-none"
                  >
                    <option value={30}>30 Seconds</option>
                    <option value={60}>1 Minute</option>
                    <option value={300}>5 Minutes</option>
                    <option value={9999}>Never Timeout</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">
                    Stream Quality FPS
                  </label>
                  <select
                    value={streamFps}
                    onChange={(e) => {
                      const fps = Number(e.target.value);
                      setStreamFps(fps);
                      setLatencySim(fps === 60 ? 6 : fps === 30 ? 12 : 24);
                      appendAuditLog('Quality Updated', `Stream rate configured to ${fps} FPS`, 'allowed');
                    }}
                    className="w-full bg-black border border-zinc-800 text-zinc-300 rounded p-1.5 text-xs focus:outline-none"
                  >
                    <option value={15}>15 FPS (Eco Mode)</option>
                    <option value={30}>30 FPS (Standard)</option>
                    <option value={60}>60 FPS (Ultra-Smooth)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">
                    Compression Scale
                  </label>
                  <select
                    value={compressionRatio}
                    onChange={(e) => {
                      setCompressionRatio(e.target.value);
                      appendAuditLog('Quality Updated', `Compression changed to: ${e.target.value}`, 'allowed');
                    }}
                    className="w-full bg-black border border-zinc-800 text-zinc-300 rounded p-1.5 text-xs focus:outline-none"
                  >
                    <option>High (480p - Low Bandwidth)</option>
                    <option>Medium (720p)</option>
                    <option>Lossless (1080p HD)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Input HUD */}
          {isAuthenticated && (
            <div className="bg-indigo-950/20 border border-indigo-500/20 p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/10 rounded border border-indigo-500/20 text-indigo-400">
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-200 uppercase font-mono">
                    Real-time Input Stream Status
                  </h5>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    Interactive inputs are decrypted, parsed, and piped directly into the ADB driver over Proxy.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 font-mono text-right text-[10px] shrink-0">
                <div>
                  <div className="text-zinc-600 uppercase">Hover Coordinates</div>
                  <div className="text-indigo-400 font-bold">
                    {hoverCoord ? `${hoverCoord.x}px, ${hoverCoord.y}px` : 'No Hover'}
                  </div>
                </div>
                <div>
                  <div className="text-zinc-600 uppercase">Last Keyboard Event</div>
                  <div className="text-amber-500 font-bold truncate max-w-[80px]">
                    {recentKey || 'No Input'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Trail Log Ledger */}
          <div className="space-y-3 flex-1 flex flex-col min-h-[160px]">
            <div className="flex justify-between items-center shrink-0">
              <h4 className="text-xs font-bold text-zinc-400 tracking-wider font-mono uppercase flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                Remote Security Audit Ledger
              </h4>
              <button
                onClick={() => setAuditLogs([])}
                className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Clear Ledger
              </button>
            </div>

            <div className="bg-black/60 border border-zinc-900 rounded-xl flex-1 overflow-y-auto max-h-48 p-3 font-mono text-[11px] space-y-2">
              {auditLogs.length === 0 ? (
                <div className="text-center py-6 text-zinc-600 uppercase font-mono">
                  Ledger is empty. No remote events registered.
                </div>
              ) : (
                auditLogs.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-4 border-b border-zinc-900/50 pb-1.5 last:border-0"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-zinc-600">{item.timestamp}</span>
                        <span className="font-bold text-zinc-300">{item.action}</span>
                      </div>
                      <p className="text-zinc-500 text-[10px] leading-relaxed">{item.details}</p>
                    </div>
                    
                    <span
                      className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded shrink-0 ${
                        item.status === 'allowed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.status === 'blocked'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

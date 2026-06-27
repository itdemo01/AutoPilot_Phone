import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Key, X, Lock, Unlock, User, Mail, LogOut, Check, ChevronRight, Fingerprint, RefreshCw } from "lucide-react";

export interface UserSession {
  username: string;
  email: string;
  role: "admin" | "operator" | "guest";
  token: string;
  mfaEnabled: boolean;
  apiKey: string;
}

export default function UserAuthModal({
  isOpen,
  onClose,
  session,
  onLogin,
  onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  session: UserSession | null;
  onLogin: (session: UserSession) => void;
  onLogout: () => void;
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (isRegister) {
        if (!username.trim() || !email.trim() || !password.trim()) {
          setError("All credentials must be fully completed.");
          return;
        }
        if (password.length < 6) {
          setError("Operational passcode must be at least 6 digits/characters.");
          return;
        }

        const newSession: UserSession = {
          username: username.trim(),
          email: email.trim(),
          role: "admin",
          token: "koro_auth_jwt_" + Math.random().toString(36).substring(7),
          mfaEnabled: mfaEnabled,
          apiKey: "koro_live_pk_" + Math.random().toString(36).substring(10),
        };

        onLogin(newSession);
        setSuccess("Koro operational account deployed successfully!");
        setTimeout(() => {
          setSuccess("");
          onClose();
        }, 1200);
      } else {
        // Login Flow
        if (!email.trim() || !password.trim()) {
          setError("Email and passcode are required.");
          return;
        }

        const mockSession: UserSession = {
          username: email.split("@")[0] || "Operator",
          email: email,
          role: "admin",
          token: "koro_auth_jwt_" + Math.random().toString(36).substring(7),
          mfaEnabled: mfaEnabled,
          apiKey: "koro_live_pk_" + Math.random().toString(36).substring(10),
        };

        onLogin(mockSession);
        setSuccess("Koro session established.");
        setTimeout(() => {
          setSuccess("");
          onClose();
        }, 1200);
      }
    }, 1000);
  };

  const simulateQuickAccess = (role: "admin" | "operator") => {
    const quickSession: UserSession = {
      username: role === "admin" ? "Koro Admin" : "System Operator",
      email: role === "admin" ? "admin@koro.engine" : "ops@koro.engine",
      role: role,
      token: "koro_auth_jwt_quick_" + role,
      mfaEnabled: true,
      apiKey: "koro_live_pk_quick_" + role,
    };
    onLogin(quickSession);
    setSuccess(`Bypassed auth: Logged in as ${role.toUpperCase()}`);
    setTimeout(() => {
      setSuccess("");
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative flex flex-col"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-6 border-b border-zinc-850 bg-zinc-900/40 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-100 font-sans tracking-wide">
                  KORO SECURE ACCESS PORTAL
                </h2>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  Workspace Authentication Node
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 overflow-y-auto">
              {session ? (
                // Authenticated Profile View
                <div className="flex flex-col gap-5">
                  <div className="bg-indigo-950/20 border border-indigo-500/15 p-4 rounded-lg flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg uppercase font-mono">
                        {session.username[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-500 font-mono uppercase">Current Session</span>
                        <span className="text-sm font-bold text-zinc-100">{session.username}</span>
                      </div>
                    </div>

                    <div className="border-t border-zinc-850 pt-3 mt-1 space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Security Clearance</span>
                        <span className="text-indigo-400 font-bold uppercase tracking-wider">{session.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Registered Email</span>
                        <span className="text-zinc-300">{session.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Session JWT Token</span>
                        <span className="text-zinc-400 truncate max-w-[180px]">{session.token}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Local MFA Node</span>
                        <span className={session.mfaEnabled ? "text-emerald-400" : "text-amber-400"}>
                          {session.mfaEnabled ? "Active (Bio)" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-zinc-850 p-3 rounded-lg flex flex-col gap-1.5 font-mono text-[11px] text-zinc-400">
                    <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-0.5">Authorization Rights</div>
                    <p className="leading-relaxed text-zinc-500">
                      As an authenticated <strong className="text-zinc-300">Admin/Operator</strong>, full control over the ADB Shell Injector, automation triggers, device parameters, and visual node builders are authorized.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold font-mono tracking-wider uppercase transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Terminate Secure Session
                  </button>
                </div>
              ) : (
                // Login/Register Forms
                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono rounded-lg">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4" /> {success}
                    </div>
                  )}

                  {isRegister && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 uppercase font-mono font-bold tracking-wider">Username</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="e.g. administrator"
                          className="w-full bg-black border border-zinc-800 rounded-lg py-3 pl-10 pr-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-mono font-bold tracking-wider">Operational Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="operator@koro.engine"
                        className="w-full bg-black border border-zinc-800 rounded-lg py-3 pl-10 pr-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-mono font-bold tracking-wider">Terminal Access Passcode</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black border border-zinc-800 rounded-lg py-3 pl-10 pr-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* MFA Toggle */}
                  <div className="flex items-center justify-between bg-black/40 border border-zinc-850 p-3 rounded-lg mt-1">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-zinc-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                        <Fingerprint className="w-3.5 h-3.5 text-indigo-400" />
                        Bio MFA Credentials
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono mt-0.5">Require multi-factor approval on triggers</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMfaEnabled(!mfaEnabled)}
                      className={`text-[9px] px-2 py-1 rounded font-mono uppercase font-bold border transition-colors ${mfaEnabled ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" : "bg-zinc-800 text-zinc-500 border-zinc-700"}`}
                    >
                      {mfaEnabled ? "ENABLED" : "DISABLED"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : isRegister ? (
                      "Create Operational Node"
                    ) : (
                      "Establish Authorized Connection"
                    )}
                  </button>

                  {/* Toggle Link */}
                  <div className="text-center mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegister(!isRegister);
                        setError("");
                      }}
                      className="text-[10px] text-zinc-500 hover:text-indigo-400 transition-colors font-mono uppercase tracking-wider"
                    >
                      {isRegister ? "Already configured? Return to authentication" : "No operational node? Create account"}
                    </button>
                  </div>

                  {/* Quick bypass developer helpers */}
                  <div className="border-t border-zinc-850 pt-4 mt-2">
                    <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2 text-center font-bold">
                      ⚡ Quick Bypass Admin Authentication
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => simulateQuickAccess("admin")}
                        className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-[10px] font-mono py-1.5 rounded-lg transition-colors uppercase font-bold"
                      >
                        Bypass as Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => simulateQuickAccess("operator")}
                        className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-[10px] font-mono py-1.5 rounded-lg transition-colors uppercase font-bold"
                      >
                        Bypass Operator
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

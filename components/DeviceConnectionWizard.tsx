import { motion, AnimatePresence } from "motion/react";
import {
  Smartphone,
  CheckCircle2,
  ChevronRight,
  X,
  RefreshCw,
  Usb,
  AlertTriangle,
  Wifi,
  QrCode,
  Terminal,
  Plus,
} from "lucide-react";
import { useState } from "react";

export default function DeviceConnectionWizard({
  isOpen,
  onClose,
  backendUrl = "http://localhost:8000",
  onAddDevice,
}: {
  isOpen: boolean;
  onClose: () => void;
  backendUrl?: string;
  onAddDevice?: (device: { id: string; name: string; status: string }) => void;
}) {
  const [mode, setMode] = useState<"companion" | "adb" | "manual">("companion");
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [pairingCode, setPairingCode] = useState("");

  const [manualName, setManualName] = useState("");
  const [manualIp, setManualIp] = useState("");

  const handleVerify = async () => {
    if (mode === "manual") {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setVerificationStatus("success");
        if (onAddDevice) {
          onAddDevice({
            id: `device_${Math.random().toString(36).substring(7)}`,
            name: manualName || "Manual Device",
            status: "connected",
          });
        }
        setTimeout(() => onClose(), 1500);
      }, 1000);
      return;
    }

    setIsVerifying(true);
    setVerificationStatus("idle");
    try {
      // Simulate backend delay
      await new Promise((r) => setTimeout(r, 1500));
      setVerificationStatus("success");
      if (onAddDevice) {
        onAddDevice({
          id: `device_adb_${Math.random().toString(36).substring(7)}`,
          name:
            mode === "companion"
              ? "Companion App Device"
              : "ADB Connected Device",
          status: "connected",
        });
      }
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setVerificationStatus("error");
    } finally {
      setIsVerifying(false);
    }
  };

  const nextStep = () => {
    if (mode === "manual" && step === 1) {
      setStep(4);
    } else {
      setStep((s) => Math.min(4, s + 1));
    }
  };
  const prevStep = () => {
    if (mode === "manual" && step === 4) {
      setStep(1);
    } else {
      setStep((s) => Math.max(1, s - 1));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/50 shrink-0">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Wifi className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-emerald-500 font-sans tracking-wide">
                  Device Connection Wizard
                </h2>
                <p className="text-xs font-mono text-zinc-500">
                  Connect your target device to the autonomous orchestrator
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {step === 1 && (
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setMode("companion")}
                    className={`flex-1 py-4 rounded-xl text-sm font-bold flex flex-col items-center gap-3 border transition-colors ${mode === "companion" ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "bg-black border-zinc-800 text-zinc-500 hover:text-zinc-300"}`}
                  >
                    <QrCode className="w-6 h-6" />
                    Companion App
                  </button>
                  <button
                    onClick={() => setMode("adb")}
                    className={`flex-1 py-4 rounded-xl text-sm font-bold flex flex-col items-center gap-3 border transition-colors ${mode === "adb" ? "bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "bg-black border-zinc-800 text-zinc-500 hover:text-zinc-300"}`}
                  >
                    <Terminal className="w-6 h-6" />
                    Termux / ADB
                  </button>
                  <button
                    onClick={() => setMode("manual")}
                    className={`flex-1 py-4 rounded-xl text-sm font-bold flex flex-col items-center gap-3 border transition-colors ${mode === "manual" ? "bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "bg-black border-zinc-800 text-zinc-500 hover:text-zinc-300"}`}
                  >
                    <Plus className="w-6 h-6" />
                    Manual Add
                  </button>
                </div>
              )}

              <div className="flex gap-2 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${i <= step ? (mode === "companion" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : mode === "manual" ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]") : "bg-zinc-800"}`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {mode === "manual" ? (
                  <>
                    {step === 1 && (
                      <motion.div
                        key="manual-step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border border-zinc-700">
                            1
                          </span>
                          Direct Connection (Manual)
                        </h3>
                        <p className="text-sm text-zinc-400 font-mono leading-relaxed">
                          Enter your target device's details to establish a
                          connection directly. Useful if automatic scanning
                          fails.
                        </p>
                      </motion.div>
                    )}
                    {step === 4 && (
                      <motion.div
                        key="manual-step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6 flex flex-col items-center justify-center py-8"
                      >
                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-500/50 flex items-center justify-center bg-blue-500/10">
                          {isVerifying ? (
                            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                          ) : verificationStatus === "success" ? (
                            <CheckCircle2 className="w-8 h-8 text-blue-400" />
                          ) : (
                            <Smartphone className="w-8 h-8 text-blue-400" />
                          )}
                        </div>
                        <div className="w-full max-w-sm space-y-4">
                          <div>
                            <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1 block">
                              Device Name
                            </label>
                            <input
                              type="text"
                              value={manualName}
                              onChange={(e) => setManualName(e.target.value)}
                              placeholder="e.g. Pixel 8 Pro"
                              className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1 block">
                              IP Address (Optional)
                            </label>
                            <input
                              type="text"
                              value={manualIp}
                              onChange={(e) => setManualIp(e.target.value)}
                              placeholder="e.g. 192.168.1.100"
                              className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50"
                            />
                          </div>
                        </div>

                        {verificationStatus === "success" && (
                          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm p-4 rounded-lg w-full max-w-sm flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span>
                              Device successfully added and bridge established!
                            </span>
                          </div>
                        )}
                        <button
                          onClick={handleVerify}
                          disabled={isVerifying || !manualName.trim()}
                          className={`font-bold text-sm px-8 py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2 text-black bg-blue-500 hover:bg-blue-400 shadow-blue-500/30`}
                        >
                          {isVerifying
                            ? "Connecting..."
                            : verificationStatus === "success"
                              ? "Connected!"
                              : "Add & Connect"}
                        </button>
                      </motion.div>
                    )}
                  </>
                ) : mode === "adb" ? (
                  /* ADB MODE CONTENT */
                  <>
                    {step === 1 && (
                      <motion.div
                        key="adb-step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border border-zinc-700">
                            1
                          </span>
                          Enable Developer Options
                        </h3>
                        <p className="text-sm text-zinc-400 font-mono leading-relaxed">
                          First, you need to unlock the hidden Developer Options
                          menu on your Android device.
                        </p>
                        <div className="bg-black border border-zinc-800 rounded-lg p-4 space-y-3 font-mono text-sm">
                          <p className="text-zinc-300">
                            1. Open your phone's{" "}
                            <strong className="text-amber-400">Settings</strong>{" "}
                            app.
                          </p>
                          <p className="text-zinc-300">
                            2. Scroll down and tap on{" "}
                            <strong className="text-amber-400">
                              About phone
                            </strong>
                            .
                          </p>
                          <p className="text-zinc-300">
                            3. Find the{" "}
                            <strong className="text-amber-400">
                              Build number
                            </strong>{" "}
                            entry.
                          </p>
                          <p className="text-zinc-300">
                            4. Tap it{" "}
                            <strong className="text-amber-400">7 times</strong>{" "}
                            rapidly.
                          </p>
                          <p className="text-zinc-500 text-xs italic mt-2 border-l-2 border-zinc-700 pl-2">
                            You may be prompted to enter your PIN or password. A
                            toast message will say "You are now a developer!".
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="adb-step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border border-zinc-700">
                            2
                          </span>
                          Enable USB / Wireless Debugging
                        </h3>
                        <p className="text-sm text-zinc-400 font-mono leading-relaxed">
                          Now, authorize ADB connections so the autonomous agent
                          can send touch and swipe commands.
                        </p>
                        <div className="bg-black border border-zinc-800 rounded-lg p-4 space-y-3 font-mono text-sm">
                          <p className="text-zinc-300">
                            1. Go back to{" "}
                            <strong className="text-amber-400">Settings</strong>
                            .
                          </p>
                          <p className="text-zinc-300">
                            2. Navigate to{" "}
                            <strong className="text-amber-400">System</strong>{" "}
                            &gt;{" "}
                            <strong className="text-amber-400">
                              Developer options
                            </strong>
                            .
                          </p>
                          <p className="text-zinc-300">
                            3. Scroll down and toggle{" "}
                            <strong className="text-amber-400">
                              USB debugging
                            </strong>{" "}
                            to ON.
                          </p>
                          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded mt-2">
                            <p className="text-amber-500 text-xs flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              For a fully wireless setup, enable "Wireless
                              debugging" instead (requires Android 11+ and
                              WiFi).
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="adb-step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border border-zinc-700">
                            3
                          </span>
                          Start the Termux Backend
                        </h3>
                        <p className="text-sm text-zinc-400 font-mono leading-relaxed">
                          Start the FastAPI server inside your Termux
                          environment to handle the ADB commands.
                        </p>
                        <div className="bg-black border border-zinc-800 rounded-lg p-4 space-y-3 font-mono text-sm">
                          <p className="text-zinc-300">
                            1. Open{" "}
                            <strong className="text-amber-400">Termux</strong>{" "}
                            on your phone.
                          </p>
                          <p className="text-zinc-300">
                            2. Pair ADB (if using wireless): <br />
                            <code className="bg-zinc-900 px-2 py-1 rounded text-amber-300 text-xs block mt-1">
                              adb connect 127.0.0.1:5555
                            </code>
                          </p>
                          <p className="text-zinc-300">
                            3. Export your secret API key (matching the Security
                            Vault): <br />
                            <code className="bg-zinc-900 px-2 py-1 rounded text-amber-300 text-xs block mt-1">
                              export APP_SECRET_KEY="your_key_here"
                            </code>
                          </p>
                          <p className="text-zinc-300">
                            4. Run the uvicorn server: <br />
                            <code className="bg-zinc-900 px-2 py-1 rounded text-amber-300 text-xs block mt-1">
                              uvicorn main:app --host 0.0.0.0 --port 8000
                            </code>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </>
                ) : (
                  /* COMPANION APP MODE CONTENT */
                  <>
                    {step === 1 && (
                      <motion.div
                        key="comp-step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4 flex flex-col items-center"
                      >
                        <h3 className="text-xl font-bold text-zinc-100 w-full flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border border-zinc-700">
                            1
                          </span>
                          Install Companion App
                        </h3>
                        <p className="text-sm text-zinc-400 font-mono leading-relaxed w-full">
                          Scan the QR code below to install the PhonePilot Agent
                          on your Android device.
                        </p>
                        <div className="bg-white p-4 rounded-xl mt-4">
                          <QrCode className="w-48 h-48 text-black" />
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="comp-step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border border-zinc-700">
                            2
                          </span>
                          Grant Interactive Permissions
                        </h3>
                        <p className="text-sm text-zinc-400 font-mono leading-relaxed mb-4">
                          For security reasons, Android requires you to
                          explicitly approve remote control capabilities.
                        </p>
                        <div className="bg-black border border-zinc-800 rounded-lg p-4 space-y-4 font-mono text-sm">
                          <div className="border-l-2 border-emerald-500 pl-3">
                            <p className="text-zinc-100 font-bold">
                              1. Accessibility Service
                            </p>
                            <p className="text-zinc-500 text-xs mt-1">
                              Required to perform taps, swipes, and inspect UI
                              elements. The app will prompt you to enable this
                              in Settings.
                            </p>
                          </div>
                          <div className="border-l-2 border-emerald-500 pl-3">
                            <p className="text-zinc-100 font-bold">
                              2. Screen Capture (MediaProjection)
                            </p>
                            <p className="text-zinc-500 text-xs mt-1">
                              Required to stream the live display to this
                              dashboard. You must tap "Start Now" when the
                              system prompt appears.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="comp-step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border border-zinc-700">
                            3
                          </span>
                          Enter Pairing Code
                        </h3>
                        <p className="text-sm text-zinc-400 font-mono leading-relaxed">
                          Enter the 6-digit code displayed on your phone screen
                          to establish the secure WebSocket bridge.
                        </p>
                        <div className="mt-6 flex justify-center">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={pairingCode}
                            onChange={(e) =>
                              setPairingCode(e.target.value.replace(/\D/g, ""))
                            }
                            className="bg-black border-2 border-zinc-800 rounded-lg p-4 text-center text-4xl tracking-[1em] font-mono text-emerald-400 w-full max-w-sm focus:border-emerald-500 outline-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 flex flex-col items-center justify-center py-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 relative">
                      {isVerifying ? (
                        <RefreshCw
                          className={`w-8 h-8 animate-spin ${mode === "companion" ? "text-emerald-500" : mode === "adb" ? "text-amber-500" : "text-blue-500"}`}
                        />
                      ) : verificationStatus === "success" ? (
                        <CheckCircle2
                          className={`w-10 h-10 ${mode === "companion" ? "text-emerald-500" : mode === "adb" ? "text-amber-500" : "text-blue-500"}`}
                        />
                      ) : verificationStatus === "error" ? (
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                      ) : (
                        <Smartphone className="w-10 h-10 text-zinc-500" />
                      )}

                      {verificationStatus === "success" && (
                        <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-pulse pointer-events-none"></div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-zinc-100 text-center">
                      Verify Connection
                    </h3>
                    <p className="text-sm text-zinc-400 font-mono text-center max-w-sm mb-6">
                      Ping the target device to confirm the bridge is active and
                      ready for autonomous commands.
                    </p>

                    {verificationStatus === "error" && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded mb-4 text-center max-w-sm">
                        Failed to connect. Make sure the server is running and
                        the code/setup is correct.
                      </div>
                    )}

                    <button
                      onClick={handleVerify}
                      disabled={
                        isVerifying ||
                        (mode === "companion" && pairingCode.length !== 6) ||
                        (mode === "manual" && (!manualName || !manualIp))
                      }
                      className={`font-bold text-sm px-8 py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2 text-black ${mode === "companion" ? "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/30" : mode === "adb" ? "bg-amber-500 hover:bg-amber-400 shadow-amber-500/30" : "bg-blue-500 hover:bg-blue-400 shadow-blue-500/30"}`}
                    >
                      {isVerifying
                        ? "Connecting..."
                        : verificationStatus === "success"
                          ? "Connection Verified!"
                          : "Connect to Device"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-between shrink-0">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className="px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                Back
              </button>
              {step < 4 ? (
                <button
                  onClick={nextStep}
                  disabled={
                    mode === "companion" &&
                    step === 3 &&
                    pairingCode.length !== 6
                  }
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-sm px-6 py-2 rounded-lg transition-colors border border-zinc-700 disabled:opacity-50"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-sm px-6 py-2 rounded-lg transition-colors border border-zinc-700"
                >
                  Close Wizard
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

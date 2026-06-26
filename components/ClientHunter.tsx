"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target,
  Send,
  Linkedin,
  Twitter,
  UserCheck,
  Sparkles,
  Plus,
  Trash2,
  Users,
  CheckCircle2,
  Smartphone,
  Loader2,
  ExternalLink,
  MessageSquare,
  Globe,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  company: string;
  role: string;
  platform: "LinkedIn" | "Twitter";
  handle: string;
  valuePropKey: string;
  status: "Not Contacted" | "Contacting" | "Contacted";
  sentMessage?: string;
  timestamp?: string;
}

export default function ClientHunter({
  selectedDeviceId,
  deviceName,
  onLog,
}: {
  selectedDeviceId: string;
  deviceName: string;
  onLog: (msg: string) => void;
}) {
  // Pre-seeded high-quality leads
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "lead-1",
      name: "Sarah Jenkins",
      company: "InnovateTech",
      role: "VP of Product",
      platform: "LinkedIn",
      handle: "linkedin.com/in/sarah-j-innovate",
      valuePropKey: "seamless Android automation integration",
      status: "Not Contacted",
    },
    {
      id: "lead-2",
      name: "David Chen",
      company: "CloudScale Systems",
      role: "Founder & CEO",
      platform: "Twitter",
      handle: "@dchen_cloudscale",
      valuePropKey: "real-time vision-based telemetry monitoring",
      status: "Not Contacted",
    },
    {
      id: "lead-3",
      name: "Elena Rostova",
      company: "FinAI Security",
      role: "CTO",
      platform: "LinkedIn",
      handle: "linkedin.com/in/elena-rostova-cto",
      valuePropKey: "high-reliability edge node execution & diagnostics",
      status: "Not Contacted",
    },
  ]);

  // Form states for manual lead addition
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadRole, setNewLeadRole] = useState("");
  const [newLeadPlatform, setNewLeadPlatform] = useState<
    "LinkedIn" | "Twitter"
  >("LinkedIn");
  const [newLeadHandle, setNewLeadHandle] = useState("");
  const [newLeadValuePropKey, setNewLeadValuePropKey] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Value proposition settings
  const [globalValueProp, setGlobalValueProp] = useState(
    "Our zero-touch Android automation orchestrator boosts execution reliability by 400% through local edge vision pipelines.",
  );

  // Bulk outreach execution states
  const [isBulkOutreachRunning, setIsBulkOutreachRunning] = useState(false);
  const [currentProcessingLeadId, setCurrentProcessingLeadId] = useState<
    string | null
  >(null);

  // Add manually defined lead
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadCompany || !newLeadRole || !newLeadHandle) {
      onLog("error: Please complete all required lead fields.");
      return;
    }

    const valuePropKey =
      newLeadValuePropKey ||
      `${newLeadCompany.toLowerCase().replace(/\s+/g, "-")}-scaling`;

    const newLead: Lead = {
      id: `lead-${Math.random().toString(36).substring(7)}`,
      name: newLeadName,
      company: newLeadCompany,
      role: newLeadRole,
      platform: newLeadPlatform,
      handle: newLeadHandle,
      valuePropKey: valuePropKey,
      status: "Not Contacted",
    };

    setLeads((prev) => [...prev, newLead]);
    onLog(
      `[CLIENT HUNTER] Added new target lead: ${newLead.name} (${newLead.role} at ${newLead.company})`,
    );

    // Reset form fields
    setNewLeadName("");
    setNewLeadCompany("");
    setNewLeadRole("");
    setNewLeadHandle("");
    setNewLeadValuePropKey("");
    setShowAddForm(false);
  };

  // Delete lead from list
  const handleDeleteLead = (id: string, name: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    onLog(`[CLIENT HUNTER] Deleted lead: ${name}`);
  };

  // Build outreach message
  const buildMessage = (lead: Lead) => {
    return `Hi ${lead.name},\n\nI was impressed by your work as ${lead.role} at ${lead.company}. I thought of you because we recently implemented a customized solution for ${lead.valuePropKey}.\n\nSpecifically, ${globalValueProp}\n\nWould love to connect briefly. Let me know if you are open to a quick chat!\n\nBest,\n[Automated Agent Pipeline via ${deviceName}]`;
  };

  // Process outreach for a single lead
  const runSingleOutreach = async (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status !== "Not Contacted") return;

    // Set lead status to Contacting
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: "Contacting" } : l)),
    );

    const targetDeviceLabel = `[DEVICE: ${deviceName} (${selectedDeviceId})]`;
    onLog(
      `$ client-hunter --outreach --lead="${lead.name}" --device=${selectedDeviceId}`,
    );
    onLog(`${targetDeviceLabel} Initializing autonomous outreach cycle...`);

    // Step 1: Launch target social application on device
    await new Promise((r) => setTimeout(r, 1200));
    onLog(
      `${targetDeviceLabel} ADB: am start -n com.${lead.platform.toLowerCase()}.android/.MainActivity`,
    );
    onLog(
      `${targetDeviceLabel} Successfully launched ${lead.platform} app on connected phone screen.`,
    );

    // Step 2: Navigate to profile & verify UI via Vision
    await new Promise((r) => setTimeout(r, 1500));
    onLog(`${targetDeviceLabel} ADB: input keyevent KEYCODE_SEARCH`);
    onLog(
      `${targetDeviceLabel} Vision Model: Searching profile matching "${lead.handle}"...`,
    );
    onLog(
      `${targetDeviceLabel} Connected agent successfully located target message trigger overlay.`,
    );

    // Step 3: Craft and paste personalized intro message
    await new Promise((r) => setTimeout(r, 1800));
    const finalMsg = buildMessage(lead);
    onLog(
      `${targetDeviceLabel} Crafting personalized message for ${lead.name} regarding [${lead.valuePropKey}]...`,
    );
    onLog(
      `${targetDeviceLabel} ADB: input text "${finalMsg.split("\n")[0]}..." (personalization complete)`,
    );

    // Step 4: Click Send and verify
    await new Promise((r) => setTimeout(r, 1200));
    onLog(
      `${targetDeviceLabel} Vision Model: Detected active click coordinate for Send button (confidence 97%).`,
    );
    onLog(`${targetDeviceLabel} ADB: input tap 810 1850`);
    onLog(
      `${targetDeviceLabel} Outreach introductory message transmitted successfully to ${lead.name} via ${lead.platform}.`,
    );

    // Complete outreach state update
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              status: "Contacted",
              sentMessage: finalMsg,
              timestamp,
            }
          : l,
      ),
    );
  };

  // Run bulk automated outreach
  const runBulkOutreach = async () => {
    const uncontactedLeads = leads.filter((l) => l.status === "Not Contacted");
    if (uncontactedLeads.length === 0) {
      onLog("info: All target leads have already been contacted.");
      return;
    }

    setIsBulkOutreachRunning(true);
    onLog(
      `[CLIENT HUNTER] Starting Premium Bulk Outreach. Found ${uncontactedLeads.length} leads queueing on ${deviceName}...`,
    );

    for (const lead of uncontactedLeads) {
      setCurrentProcessingLeadId(lead.id);
      await runSingleOutreach(lead.id);
      // Wait between leads for safety simulation
      await new Promise((r) => setTimeout(r, 1000));
    }

    setIsBulkOutreachRunning(false);
    setCurrentProcessingLeadId(null);
    onLog(
      `[CLIENT HUNTER] Premium automated outreach sequence successfully completed! All leads processed.`,
    );
  };

  // Counters
  const totalLeads = leads.length;
  const contactedCount = leads.filter((l) => l.status === "Contacted").length;
  const pendingCount = leads.filter((l) => l.status === "Not Contacted").length;
  const progressPercent =
    totalLeads > 0 ? Math.round((contactedCount / totalLeads) * 100) : 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5 relative overflow-hidden">
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-zinc-200 uppercase flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Client Hunter Agent</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono uppercase tracking-normal">
              Premium Skill
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            Connected:{" "}
            <span className="text-zinc-300 font-semibold">{deviceName}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded text-zinc-400 hover:text-white transition-colors"
            title="Add Custom Lead"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4 bg-zinc-950/40 border border-zinc-800/60 p-3 rounded-lg relative z-10">
        <div className="text-center">
          <div className="text-xs text-zinc-500 uppercase font-mono">Leads</div>
          <div className="text-lg font-bold text-zinc-100 font-mono mt-0.5">
            {totalLeads}
          </div>
        </div>
        <div className="text-center border-x border-zinc-800/80">
          <div className="text-xs text-zinc-400 uppercase font-mono flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Contacted
          </div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
            {contactedCount}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-zinc-500 uppercase font-mono">
            Pending
          </div>
          <div className="text-lg font-bold text-zinc-400 font-mono mt-0.5">
            {pendingCount}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-5 bg-zinc-950/80 border border-zinc-800/50 p-2.5 rounded-lg relative z-10">
        <div className="flex justify-between items-center text-xs font-mono mb-1.5">
          <span className="text-zinc-400">Outreach Progress</span>
          <span className="text-emerald-400 font-semibold">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Custom Global Value Proposition Input */}
      <div className="mb-4 bg-zinc-950/40 border border-zinc-800 p-3.5 rounded-lg">
        <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1 mb-1.5">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          Company Value Proposition
        </label>
        <textarea
          value={globalValueProp}
          onChange={(e) => setGlobalValueProp(e.target.value)}
          rows={2}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/50 placeholder-zinc-600 resize-none font-sans"
          placeholder="State your unique value proposition..."
        />
        <p className="text-[10px] text-zinc-500 font-mono mt-1">
          Automatically compiled with personalized introductory triggers.
        </p>
      </div>

      {/* Manual Add Lead Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddLead}
            className="mb-4 bg-zinc-950 border border-zinc-800 rounded-lg p-3 space-y-3 relative overflow-hidden"
          >
            <div className="text-xs font-bold text-zinc-300 flex items-center justify-between border-b border-zinc-800 pb-1">
              <span>Add Custom Target Lead</span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-zinc-500 hover:text-white"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-mono">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="E.g. Sarah Jenkins"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-mono">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={newLeadCompany}
                  onChange={(e) => setNewLeadCompany(e.target.value)}
                  placeholder="E.g. InnovateTech"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-mono">
                  Role/Title
                </label>
                <input
                  type="text"
                  required
                  value={newLeadRole}
                  onChange={(e) => setNewLeadRole(e.target.value)}
                  placeholder="E.g. VP of Product"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-mono">
                  Platform
                </label>
                <select
                  value={newLeadPlatform}
                  onChange={(e) =>
                    setNewLeadPlatform(e.target.value as "LinkedIn" | "Twitter")
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter">X (Twitter)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-mono">
                  Handle/Username
                </label>
                <input
                  type="text"
                  required
                  value={newLeadHandle}
                  onChange={(e) => setNewLeadHandle(e.target.value)}
                  placeholder="E.g. @sarah_j"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-mono">
                  Outreach Focus Trigger
                </label>
                <input
                  type="text"
                  value={newLeadValuePropKey}
                  onChange={(e) => setNewLeadValuePropKey(e.target.value)}
                  placeholder="E.g. automated workflow testing"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 text-black font-bold text-xs py-2 rounded hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Confirm and Register Lead
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Leads List */}
      <div className="space-y-3 max-h-[280px] overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-zinc-800 pr-1">
        {leads.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-lg">
            No targets configured. Add leads to begin hunting.
          </div>
        ) : (
          leads.map((lead) => {
            const isProcessing = currentProcessingLeadId === lead.id;
            return (
              <div
                key={lead.id}
                className={`relative p-3 rounded-lg border transition-all duration-300 ${
                  lead.status === "Contacted"
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : isProcessing
                      ? "bg-zinc-800/80 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                      : "bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                {/* Horizontal Status Bar */}
                <div
                  className="absolute top-0 bottom-0 left-0 w-1 rounded-l-lg bg-zinc-800"
                  style={{
                    backgroundColor:
                      lead.status === "Contacted"
                        ? "#10b981"
                        : isProcessing
                          ? "#3b82f6"
                          : "#27272a",
                  }}
                />

                <div className="flex items-start justify-between pl-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-200">
                        {lead.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {lead.role} at {lead.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
                      {lead.platform === "LinkedIn" ? (
                        <Linkedin className="w-3 h-3 text-blue-400" />
                      ) : (
                        <Twitter className="w-3 h-3 text-sky-400" />
                      )}
                      <span className="truncate max-w-[150px]">
                        {lead.handle}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span
                        className="text-zinc-500 truncate max-w-[120px]"
                        title={lead.valuePropKey}
                      >
                        {lead.valuePropKey}
                      </span>
                    </div>

                    {lead.sentMessage && (
                      <div className="mt-2 text-[10px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-2 rounded max-h-16 overflow-y-auto font-mono whitespace-pre-wrap">
                        {lead.sentMessage}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {/* Status Badge & Action */}
                    {lead.status === "Contacted" ? (
                      <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />{" "}
                        Contacted {lead.timestamp && `(${lead.timestamp})`}
                      </span>
                    ) : isProcessing || lead.status === "Contacting" ? (
                      <span className="text-[9px] uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin text-blue-400" />{" "}
                        Processing
                      </span>
                    ) : (
                      <button
                        onClick={() => runSingleOutreach(lead.id)}
                        disabled={isBulkOutreachRunning}
                        className="text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2.5 py-1.5 rounded transition-all flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" /> Connect
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteLead(lead.id, lead.name)}
                      disabled={isBulkOutreachRunning || isProcessing}
                      className="p-1.5 hover:bg-zinc-800 text-zinc-500 hover:text-red-400 rounded transition-colors"
                      title="Remove Target"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bulk Action Trigger */}
      <button
        onClick={runBulkOutreach}
        disabled={isBulkOutreachRunning || pendingCount === 0}
        className={`w-full py-3 rounded-lg font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 border text-xs ${
          pendingCount === 0
            ? "bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed"
            : isBulkOutreachRunning
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
        }`}
      >
        {isBulkOutreachRunning ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Outreach Campaign Active...</span>
          </>
        ) : pendingCount === 0 ? (
          <>
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>All Leads Hunted</span>
          </>
        ) : (
          <>
            <Target className="w-4 h-4" />
            <span>Launch Automated Campaign ({pendingCount})</span>
          </>
        )}
      </button>
    </div>
  );
}

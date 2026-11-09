import React, { useState } from 'react';
import { IncidentReport, EvidenceItem } from '../types';
import { EvidenceVault } from './EvidenceVault';
import { 
  Search, 
  ShieldCheck, 
  Lock, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Calendar, 
  MapPin, 
  Building,
  KeyRound,
  Sparkles
} from 'lucide-react';

interface ReportTrackerProps {
  reports: IncidentReport[];
  initialCaseId?: string;
  initialCode?: string;
  onAddFollowupNote: (caseId: string, noteText: string) => void;
  onAddFollowupEvidence: (caseId: string, evidence: EvidenceItem) => void;
}

const STATUS_STEPS = [
  { key: 'submitted', label: '1. Submitted' },
  { key: 'under_review', label: '2. Under Review' },
  { key: 'interim_measures', label: '3. Interim Measures' },
  { key: 'notice_to_accused', label: '4. Notice Issued' },
  { key: 'response_received', label: '5. Response Logged' },
  { key: 'hearing_deliberation', label: '6. Hearing & Inquiry' },
  { key: 'decision', label: '7. Final Decision' },
  { key: 'action_taken', label: '8. Action Taken / Closed' },
];

export const ReportTracker: React.FC<ReportTrackerProps> = ({
  reports,
  initialCaseId = '',
  initialCode = '',
  onAddFollowupNote,
  onAddFollowupEvidence,
}) => {
  const [caseIdInput, setCaseIdInput] = useState(initialCaseId || 'SV-2026-4192');
  const [accessCodeInput, setAccessCodeInput] = useState(initialCode || 'K9X-4M2');
  const [activeReport, setActiveReport] = useState<IncidentReport | null>(() => {
    return reports.find(r => r.id === (initialCaseId || 'SV-2026-4192')) || reports[0] || null;
  });
  const [searchError, setSearchError] = useState(false);
  const [followupMessage, setFollowupMessage] = useState('');
  const [messageSentToast, setMessageSentToast] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = caseIdInput.trim().toUpperCase();
    const cleanCode = accessCodeInput.trim().toUpperCase();

    const found = reports.find(
      r => r.id.toUpperCase() === cleanId && r.accessCode.toUpperCase() === cleanCode
    );

    if (found) {
      setActiveReport(found);
      setSearchError(false);
    } else {
      setSearchError(true);
    }
  };

  const handleQuickLoad = (report: IncidentReport) => {
    setCaseIdInput(report.id);
    setAccessCodeInput(report.accessCode);
    setActiveReport(report);
    setSearchError(false);
  };

  const handleSendFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport || !followupMessage.trim()) return;

    onAddFollowupNote(activeReport.id, followupMessage.trim());
    setFollowupMessage('');
    setMessageSentToast(true);
    setTimeout(() => setMessageSentToast(false), 3000);
  };

  const getStepIndex = (status: string) => {
    if (status === 'closed') return 7;
    const idx = STATUS_STEPS.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Track Incident Report Status
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Complainants track case inquiries completely anonymously without an account using only their Case Reference ID and Secret Access Key.
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Case Reference ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={caseIdInput}
                onChange={e => setCaseIdInput(e.target.value)}
                placeholder="e.g. SV-2026-4192"
                className="w-full text-xs font-mono uppercase px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Secret Access Key
            </label>
            <div className="relative">
              <input
                type="text"
                value={accessCodeInput}
                onChange={e => setAccessCodeInput(e.target.value)}
                placeholder="e.g. K9X-4M2"
                className="w-full text-xs font-mono uppercase px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Case</span>
          </button>
        </form>

        {searchError && (
          <p className="text-xs text-rose-500 font-medium">
            No matching case found with that ID and Access Key. Check characters or select a quick demo case below.
          </p>
        )}

        {/* Quick Demo Pre-load buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-500 font-medium">Demo Pre-sets:</span>
          {reports.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => handleQuickLoad(r)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                activeReport?.id === r.id
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {r.id} ({r.setting.toUpperCase()})
            </button>
          ))}
        </div>
      </div>

      {/* Active Case Details */}
      {activeReport ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-slate-900 dark:text-slate-100">
                  {activeReport.id}
                </span>
                <span className="text-xs uppercase font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {activeReport.mode} Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Filed on {new Date(activeReport.createdAt).toLocaleDateString()} · Setting: {activeReport.setting.replace('_', ' ')}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-medium">
                Assigned Committee Officer
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {activeReport.assignedInvestigator}
              </span>
            </div>
          </div>

          {/* Timeline State Machine */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Inquiry Progression State Machine
            </h3>
            
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[620px] flex items-center justify-between relative">
                {STATUS_STEPS.map((s, index) => {
                  const currentIdx = getStepIndex(activeReport.status);
                  const isDone = index < currentIdx;
                  const isCurrent = index === currentIdx;

                  return (
                    <div key={s.key} className="flex-1 flex flex-col items-center relative text-center">
                      {/* Connecting Line */}
                      {index > 0 && (
                        <div
                          className={`absolute top-3.5 -left-1/2 w-full h-0.5 transition-colors ${
                            index <= currentIdx
                              ? 'bg-emerald-500'
                              : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                        />
                      )}

                      {/* Step Circle */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold z-10 transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isDone ? '✓' : index + 1}
                      </div>

                      <span
                        className={`text-[11px] mt-2 font-medium max-w-[85px] leading-tight ${
                          isCurrent
                            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                            : isDone
                            ? 'text-slate-800 dark:text-slate-200'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.label.split('. ')[1]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Interim Measures if any */}
          {activeReport.interimMeasures.length > 0 && (
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Interim Safety & Protective Orders Active</span>
              </div>
              <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1 list-disc list-inside">
                {activeReport.interimMeasures.map((measure, i) => (
                  <li key={i}>{measure}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Accused Notice & Response Status */}
          {activeReport.accusedNotice.noticeDate && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                  Due Process Notice to Respondent
                </h4>
                <span className="text-[11px] text-slate-400">
                  Served on {new Date(activeReport.accusedNotice.noticeDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                {activeReport.accusedNotice.allegationSummary}
              </p>
              {activeReport.accusedNotice.respondentResponse && (
                <div className="mt-2 p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-1">
                    Formal Written Response from Accused:
                  </span>
                  <p>{activeReport.accusedNotice.respondentResponse}</p>
                </div>
              )}
            </div>
          )}

          {/* Final Decision Record (if decided) */}
          {activeReport.decision && (
            <div className={`p-5 rounded-xl border space-y-3 ${
              activeReport.decision.category === 'substantiated'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Official Committee Decision: {activeReport.decision.category.toUpperCase()}
                  </h4>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {new Date(activeReport.decision.decidedAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>Findings: </strong> {activeReport.decision.rationale}
              </p>

              <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200">
                <strong>Institutional Remediation / Sanctions: </strong>
                {activeReport.decision.actionRecommended}
              </div>

              {activeReport.decision.category === 'unsubstantiated' && (
                <p className="text-[11px] text-slate-500 italic">
                  Note: An unsubstantiated finding denotes insufficient conclusive evidence under legal threshold. It is never treated as a false or malicious claim and carries zero adverse consequence for the reporter.
                </p>
              )}
            </div>
          )}

          {/* Evidence Vault Inspection */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Attached Cryptographic Evidence Artifacts ({activeReport.evidence.length})
            </h3>
            <EvidenceVault
              evidenceList={activeReport.evidence}
              onAddEvidence={ev => onAddFollowupEvidence(activeReport.id, ev)}
              readOnly={false}
            />
          </div>

          {/* Anonymous / Secure Follow-up Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Submit Anonymous Supplementary Note or Inquiry to Committee</span>
              </h4>
              <span className="text-[11px] text-slate-400">Identity Shielded</span>
            </div>

            <form onSubmit={handleSendFollowup} className="space-y-2">
              <textarea
                rows={3}
                value={followupMessage}
                onChange={e => setFollowupMessage(e.target.value)}
                placeholder="Submit additional dates, clarification, or ask the ICC investigator a procedural question..."
                className="w-full text-xs p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Messages are sent directly to the Presiding Officer without revealing IP or contact info.
                </span>

                <button
                  type="submit"
                  disabled={!followupMessage.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Sealed Note</span>
                </button>
              </div>

              {messageSentToast && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Follow-up note sealed and logged to the case file!
                </p>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-500">
          Enter a Case ID and Access Key to track the inquiry.
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  IncidentReport, 
  ReportStatus, 
  DecisionCategory, 
  AuditEvent, 
  CaseNote, 
  EvidenceItem 
} from '../types';
import { EvidenceVault } from './EvidenceVault';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  UserCheck, 
  Clock, 
  History, 
  Send, 
  Scale, 
  AlertCircle, 
  Filter,
  ArrowRight,
  Download,
  Users
} from 'lucide-react';

interface CommitteeDashboardProps {
  reports: IncidentReport[];
  onUpdateReportStatus: (caseId: string, newStatus: ReportStatus, details: string) => void;
  onAddCommitteeNote: (caseId: string, note: CaseNote) => void;
  onIssueInterimMeasure: (caseId: string, measure: string) => void;
  onIssueAccusedNotice: (caseId: string, summary: string) => void;
  onLogRespondentResponse: (caseId: string, responseText: string) => void;
  onFinalizeDecision: (
    caseId: string,
    category: DecisionCategory,
    rationale: string,
    actionRecommended: string,
    unanimous: boolean
  ) => void;
  onDecryptReporterIdentity: (caseId: string, justification: string) => void;
}

type CommitteeRole = 'presiding_officer' | 'external_member' | 'investigator';

export const CommitteeDashboard: React.FC<CommitteeDashboardProps> = ({
  reports,
  onUpdateReportStatus,
  onAddCommitteeNote,
  onIssueInterimMeasure,
  onIssueAccusedNotice,
  onLogRespondentResponse,
  onFinalizeDecision,
  onDecryptReporterIdentity,
}) => {
  const [currentRole, setCurrentRole] = useState<CommitteeRole>('presiding_officer');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(reports[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [settingFilter, setSettingFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'details' | 'evidence' | 'notice_workflow' | 'decision' | 'audit'>('details');

  // Input states
  const [newNoteText, setNewNoteText] = useState('');
  const [isNotePrivate, setIsNotePrivate] = useState(false);
  const [newInterimMeasure, setNewInterimMeasure] = useState('');
  
  // Decryption modal state
  const [showDecryptModal, setShowDecryptModal] = useState(false);
  const [decryptJustification, setDecryptJustification] = useState('');

  // Notice to accused modal state
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeAllegationSummary, setNoticeAllegationSummary] = useState('');

  // Response modal state
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [respondentReplyText, setRespondentReplyText] = useState('');

  // Decision form states
  const [decisionCategory, setDecisionCategory] = useState<DecisionCategory>('substantiated');
  const [decisionRationale, setDecisionRationale] = useState('');
  const [decisionAction, setDecisionAction] = useState('');
  const [isUnanimous, setIsUnanimous] = useState(true);

  // Malicious safeguard checklist
  const [maliciousCheck1, setMaliciousCheck1] = useState(false);
  const [maliciousCheck2, setMaliciousCheck2] = useState(false);
  const [maliciousCheck3, setMaliciousCheck3] = useState(false);
  const [maliciousCheck4, setMaliciousCheck4] = useState(false);

  const selectedCase = reports.find(r => r.id === selectedCaseId) || reports[0];

  const filteredReports = reports.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (settingFilter !== 'all' && r.setting !== settingFilter) return false;
    return true;
  });

  const getRoleName = () => {
    if (currentRole === 'presiding_officer') return 'Prof. Sunita Patil (Presiding Officer)';
    if (currentRole === 'external_member') return 'Adv. Meenakshi Hegde (External NGO/Legal Member)';
    return 'Capt. Ramesh Biradar (ICC Investigator)';
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedCase) return;

    const note: CaseNote = {
      id: `cn-${Date.now()}`,
      author: getRoleName(),
      role: currentRole === 'presiding_officer' ? 'Presiding Officer' : currentRole === 'external_member' ? 'External Member' : 'Investigator',
      note: newNoteText.trim(),
      timestamp: new Date().toISOString(),
      isPrivate: isNotePrivate,
    };

    onAddCommitteeNote(selectedCase.id, note);
    setNewNoteText('');
  };

  const handleAddInterim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterimMeasure.trim() || !selectedCase) return;
    onIssueInterimMeasure(selectedCase.id, newInterimMeasure.trim());
    setNewInterimMeasure('');
  };

  const handleConfirmDecrypt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decryptJustification.trim() || !selectedCase) return;
    onDecryptReporterIdentity(selectedCase.id, decryptJustification.trim());
    setShowDecryptModal(false);
    setDecryptJustification('');
  };

  const handleConfirmNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeAllegationSummary.trim() || !selectedCase) return;
    onIssueAccusedNotice(selectedCase.id, noticeAllegationSummary.trim());
    setShowNoticeModal(false);
    setNoticeAllegationSummary('');
  };

  const handleConfirmResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondentReplyText.trim() || !selectedCase) return;
    onLogRespondentResponse(selectedCase.id, respondentReplyText.trim());
    setShowResponseModal(false);
    setRespondentReplyText('');
  };

  const handleSaveDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionRationale.trim() || !decisionAction.trim() || !selectedCase) return;

    if (decisionCategory === 'found_malicious') {
      if (!maliciousCheck1 || !maliciousCheck2 || !maliciousCheck3 || !maliciousCheck4) {
        alert('All 4 statutory safeguards must be explicitly confirmed before a malicious finding can be logged.');
        return;
      }
    }

    onFinalizeDecision(
      selectedCase.id,
      decisionCategory,
      decisionRationale.trim(),
      decisionAction.trim(),
      isUnanimous
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Header & Role Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Internal Complaints Committee (ICC) Workbench</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compliant with POSH Act 2013 & UGC Regulations 2015 · Mandatory 90-day statutory resolution clock
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <span className="text-[11px] text-slate-500 font-medium pl-2 pr-1">Acting As:</span>
          <button
            onClick={() => setCurrentRole('presiding_officer')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              currentRole === 'presiding_officer'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Presiding Officer
          </button>
          <button
            onClick={() => setCurrentRole('external_member')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              currentRole === 'external_member'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            External Member (Legal/NGO)
          </button>
          <button
            onClick={() => setCurrentRole('investigator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              currentRole === 'investigator'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Investigator
          </button>
        </div>
      </div>

      {/* Main Grid: Left side case roster, Right side case inquiry workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Case Roster (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Active Case Docket ({filteredReports.length})
            </h2>

            {/* Filter */}
            <div className="flex items-center gap-1">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-[11px] px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Stages</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="notice_to_accused">Notice Issued</option>
                <option value="decision">Decision</option>
                <option value="action_taken">Action Taken</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {filteredReports.map(r => {
              const isSelected = r.id === selectedCase?.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedCaseId(r.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                      {r.id}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                      {r.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                    {r.department} · {r.setting.replace('_', ' ')}
                  </p>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {r.narrative}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400">
                    <span className="uppercase font-semibold text-emerald-600 dark:text-emerald-400">
                      {r.mode} Mode
                    </span>
                    <span>{r.evidence.length} artifact(s)</span>
                  </div>

                  {r.patternFlag && (
                    <div className="mt-2 p-1.5 bg-amber-50 dark:bg-amber-950/40 rounded text-[10px] text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="truncate">Pattern Flag: Multiple reports</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Inquiry Workbench (8 cols) */}
        {selectedCase ? (
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              
              {/* Case Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100">
                      {selectedCase.id}
                    </h2>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                      {selectedCase.mode} Mode
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 uppercase">
                      {selectedCase.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Filed: {new Date(selectedCase.createdAt).toLocaleString()} · Location: {selectedCase.location}
                  </p>
                </div>

                {/* Workflow advance controls */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Advance Stage:</span>
                  <select
                    value={selectedCase.status}
                    onChange={e => onUpdateReportStatus(selectedCase.id, e.target.value as ReportStatus, `Status transitioned by ${getRoleName()}`)}
                    className="text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="interim_measures">Interim Measures</option>
                    <option value="notice_to_accused">Notice to Accused</option>
                    <option value="response_received">Response Received</option>
                    <option value="hearing_deliberation">Hearing & Deliberation</option>
                    <option value="decision">Decision</option>
                    <option value="action_taken">Action Taken</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Workbench Tab Navigation */}
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2.5 transition-colors ${
                    activeTab === 'details'
                      ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                      : 'hover:text-slate-800'
                  }`}
                >
                  Intake & Complainant
                </button>
                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`pb-2.5 transition-colors ${
                    activeTab === 'evidence'
                      ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                      : 'hover:text-slate-800'
                  }`}
                >
                  Evidence Vault ({selectedCase.evidence.length})
                </button>
                <button
                  onClick={() => setActiveTab('notice_workflow')}
                  className={`pb-2.5 transition-colors ${
                    activeTab === 'notice_workflow'
                      ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                      : 'hover:text-slate-800'
                  }`}
                >
                  Notice & Accused Response
                </button>
                <button
                  onClick={() => setActiveTab('decision')}
                  className={`pb-2.5 transition-colors ${
                    activeTab === 'decision'
                      ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                      : 'hover:text-slate-800'
                  }`}
                >
                  Statutory Decision
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`pb-2.5 transition-colors ${
                    activeTab === 'audit'
                      ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                      : 'hover:text-slate-800'
                  }`}
                >
                  Immutable Audit Log ({selectedCase.auditTrail.length})
                </button>
              </div>

              {/* TAB 1: Intake & Complainant Privacy */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Complainant Identity Privacy Card */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                          Complainant Identity Shield
                        </h4>
                      </div>

                      {selectedCase.mode === 'confidential' && !selectedCase.isReporterIdentityDecrypted && (
                        <button
                          onClick={() => setShowDecryptModal(true)}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Request Authorized Decryption</span>
                        </button>
                      )}
                    </div>

                    {selectedCase.mode === 'anonymous' ? (
                      <p className="text-xs text-slate-500 font-mono">
                        [ZERO-PII ANONYMOUS REPORT] - No name, email, IP address, or device fingerprint collected.
                      </p>
                    ) : selectedCase.mode === 'confidential' && !selectedCase.isReporterIdentityDecrypted ? (
                      <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                        <div className="text-slate-500 font-mono">
                          Complainant Name: <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-400">██████████ [CONFIDENTIAL]</span>
                        </div>
                        <div className="text-slate-500 font-mono">
                          Email / Phone: <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-400">████████████████ [ENCRYPTED]</span>
                        </div>
                        <p className="text-[11px] text-slate-400 pt-1">
                          Decryption requires documented statutory justification and logs an immutable audit event per DPDP Act standards.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-xs grid grid-cols-2 gap-2">
                        <div>Name: <strong className="text-slate-900 dark:text-slate-100">{selectedCase.reporterInfo?.name}</strong></div>
                        <div>Email: <strong className="text-slate-900 dark:text-slate-100">{selectedCase.reporterInfo?.email}</strong></div>
                        <div>Phone: <strong className="text-slate-900 dark:text-slate-100">{selectedCase.reporterInfo?.phone}</strong></div>
                        <div>Affiliation: <strong className="text-slate-900 dark:text-slate-100">{selectedCase.reporterInfo?.affiliation}</strong></div>
                      </div>
                    )}
                  </div>

                  {/* Accused & Incident narrative */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                        Accused Person Details
                      </h4>
                      <p>Name: <strong className="text-slate-900 dark:text-slate-100">{selectedCase.accusedInfo.name}</strong></p>
                      <p>Designation: <strong className="text-slate-900 dark:text-slate-100">{selectedCase.accusedInfo.designation}</strong></p>
                      <p>Department: <strong className="text-slate-900 dark:text-slate-100">{selectedCase.accusedInfo.department}</strong></p>
                      <p>Relationship: <strong className="text-slate-900 dark:text-slate-100">{selectedCase.accusedInfo.relationToReporter}</strong></p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                        Incident Specifications
                      </h4>
                      <p>Category: <strong className="text-slate-900 dark:text-slate-100 capitalize">{selectedCase.category.replace('_', ' ')}</strong></p>
                      <p>Date & Time: <strong className="text-slate-900 dark:text-slate-100">{selectedCase.incidentDate} at {selectedCase.incidentTime}</strong></p>
                      <p>Witnesses Cited: <strong className="text-slate-900 dark:text-slate-100">{selectedCase.witnesses || 'None cited'}</strong></p>
                      <p>Remedy Desired: <strong className="text-slate-900 dark:text-slate-100 uppercase">{selectedCase.desiredResolution.replace('_', ' ')}</strong></p>
                    </div>
                  </div>

                  {/* Full Incident Narrative */}
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Statement of Allegation
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {selectedCase.narrative}
                    </p>
                  </div>

                  {/* Active Interim Measures & Add new */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Interim Protective Safety Orders
                      </h4>
                      <span className="text-[11px] text-slate-500">POSH Section 12</span>
                    </div>

                    {selectedCase.interimMeasures.length > 0 ? (
                      <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                        {selectedCase.interimMeasures.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400">No interim measures issued yet.</p>
                    )}

                    <form onSubmit={handleAddInterim} className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newInterimMeasure}
                        onChange={e => setNewInterimMeasure(e.target.value)}
                        placeholder="e.g. Issue mutual no-contact order or evaluator reassignment"
                        className="flex-1 text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                      >
                        Issue Order
                      </button>
                    </form>
                  </div>

                  {/* Committee Notes */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Committee Inquiry Notes & Deliberations ({selectedCase.committeeNotes.length})
                    </h4>

                    <div className="space-y-2">
                      {selectedCase.committeeNotes.map(n => (
                        <div
                          key={n.id}
                          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between text-slate-500">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {n.author} ({n.role})
                            </span>
                            <span className="text-[11px]">
                              {new Date(n.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">{n.note}</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                      <textarea
                        rows={2}
                        value={newNoteText}
                        onChange={e => setNewNoteText(e.target.value)}
                        placeholder="Add committee inquiry observation, witness findings, or legal recommendation..."
                        className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                      />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <input
                            type="checkbox"
                            checked={isNotePrivate}
                            onChange={e => setIsNotePrivate(e.target.checked)}
                            className="rounded text-emerald-600"
                          />
                          <span>Private to ICC (Hidden from complainant status view)</span>
                        </label>

                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white rounded-lg text-xs font-semibold"
                        >
                          Log Case Note
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 2: Evidence Vault */}
              {activeTab === 'evidence' && (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300">
                    <p className="font-medium">
                      Cryptographic Evidence Verification: Click &apos;Verify Hash&apos; on any artifact to re-calculate and confirm digital bit-level integrity against the registered SHA-256 fingerprint.
                    </p>
                  </div>

                  <EvidenceVault
                    evidenceList={selectedCase.evidence}
                    onAddEvidence={ev => {
                      selectedCase.evidence.push(ev);
                    }}
                    readOnly={true}
                  />
                </div>
              )}

              {/* TAB 3: Notice & Accused Response */}
              {activeTab === 'notice_workflow' && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Notice to Accused (POSH Section 11 Compliance)
                      </h4>
                      {!selectedCase.accusedNotice.noticeDate ? (
                        <button
                          onClick={() => setShowNoticeModal(true)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white rounded-lg text-xs font-semibold shadow-sm"
                        >
                          Issue Formal Notice
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Notice Dispatched
                        </span>
                      )}
                    </div>

                    {selectedCase.accusedNotice.noticeDate ? (
                      <div className="space-y-2 text-xs">
                        <p className="text-slate-500">
                          Dispatched on: <strong>{new Date(selectedCase.accusedNotice.noticeDate).toLocaleString()}</strong>
                        </p>
                        <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          <strong>Allegation Summary Communicated:</strong>
                          <p className="mt-1">{selectedCase.accusedNotice.allegationSummary}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        No statutory notice has been dispatched yet. The accused must be provided with a copy of allegations with complainant identity redacted.
                      </p>
                    )}
                  </div>

                  {/* Accused Response Log */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Formal Written Defense Reply from Accused
                      </h4>
                      {!selectedCase.accusedNotice.respondentResponse ? (
                        <button
                          onClick={() => setShowResponseModal(true)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white rounded-lg text-xs font-semibold shadow-sm"
                        >
                          Record Respondent Reply
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Response Logged
                        </span>
                      )}
                    </div>

                    {selectedCase.accusedNotice.respondentResponse ? (
                      <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                        <span className="text-[11px] text-slate-400 block">
                          Recorded on {selectedCase.accusedNotice.responseDate ? new Date(selectedCase.accusedNotice.responseDate).toLocaleString() : 'N/A'}
                        </span>
                        <p className="leading-relaxed">{selectedCase.accusedNotice.respondentResponse}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Awaiting respondent formal defense statement (statutory window: 10 working days).
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: Statutory Decision Maker */}
              {activeTab === 'decision' && (
                <form onSubmit={handleSaveDecision} className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      Statutory Outcome Category (Strictly Enforced)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setDecisionCategory('substantiated')}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          decisionCategory === 'substantiated'
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <span className="font-bold text-xs block mb-1">Substantiated</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Evidence supports allegation; formal institutional penalty recommended.
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDecisionCategory('unsubstantiated')}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          decisionCategory === 'unsubstantiated'
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <span className="font-bold text-xs block mb-1">Unsubstantiated</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Insufficient proof. <strong>NOT a finding of falsehood; zero penalty for reporter.</strong>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDecisionCategory('found_malicious')}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          decisionCategory === 'found_malicious'
                            ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <span className="font-bold text-xs block mb-1 text-rose-600 dark:text-rose-400">
                          Found Malicious
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Requires full statutory inquiry proof and explicit anti-abuse safeguards.
                        </span>
                      </button>
                    </div>

                    {/* Malicious Safeguard Checklist */}
                    {decisionCategory === 'found_malicious' && (
                      <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-3 text-xs text-rose-900 dark:text-rose-200">
                        <div className="flex items-center gap-2 font-bold">
                          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          <span>Mandatory Safeguards Against Misclassifying Genuine Reports:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          Under POSH Act Section 14, inability to substantiate a complaint is NEVER grounds for a malicious finding. Malice requires independent conclusive proof of fraudulent fabrication.
                        </p>

                        <div className="space-y-2 pt-1">
                          <label className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={maliciousCheck1}
                              onChange={e => setMaliciousCheck1(e.target.checked)}
                              className="mt-0.5 rounded text-rose-600"
                            />
                            <span>1. Full inquiry with cross-examination of independent evidence completed.</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={maliciousCheck2}
                              onChange={e => setMaliciousCheck2(e.target.checked)}
                              className="mt-0.5 rounded text-rose-600"
                            />
                            <span>2. Deliberate false intent and knowledge of untruth conclusively established.</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={maliciousCheck3}
                              onChange={e => setMaliciousCheck3(e.target.checked)}
                              className="mt-0.5 rounded text-rose-600"
                            />
                            <span>3. Unanimous concurrence from all Internal Complaints Committee members.</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={maliciousCheck4}
                              onChange={e => setMaliciousCheck4(e.target.checked)}
                              className="mt-0.5 rounded text-rose-600"
                            />
                            <span>4. Written concurrence from External Legal / NGO Member (Adv. Meenakshi Hegde).</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      Inquiry Findings & Evidentiary Rationale
                    </label>
                    <textarea
                      rows={3}
                      value={decisionRationale}
                      onChange={e => setDecisionRationale(e.target.value)}
                      placeholder="State the committee's findings based on digital evidence, witness statements, and hearing transcripts..."
                      required
                      className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      Action Recommended / Institutional Sanctions
                    </label>
                    <textarea
                      rows={2}
                      value={decisionAction}
                      onChange={e => setDecisionAction(e.target.value)}
                      placeholder="e.g. Formal disciplinary warning, supervisor transfer, counseling order, campus restriction..."
                      required
                      className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={isUnanimous}
                        onChange={e => setIsUnanimous(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Unanimous committee verdict (All statutory quorum requirements satisfied)</span>
                    </label>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                      Sign & Finalize Statutory Decision
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 5: Immutable Audit Log */}
              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      Immutable Cryptographic Case Ledger
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Tamper-evident log of every view, note, and access
                    </span>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {selectedCase.auditTrail.map(event => (
                      <div key={event.id} className="p-3 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                              [{event.action}]
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {event.actorName} ({event.actorRole})
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                            {event.details}
                          </p>
                        </div>

                        <span className="font-mono text-[11px] text-slate-400 shrink-0">
                          {new Date(event.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-xs text-slate-400">
            No active report selected.
          </div>
        )}
      </div>

      {/* Decrypt Justification Modal */}
      {showDecryptModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 text-slate-900 dark:text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <Unlock className="w-5 h-5" />
              <h3 className="font-bold text-base">Authorized Identity Decryption</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You are requesting to decrypt the complainant&apos;s identity for Case <strong>{selectedCase.id}</strong>.
              Under DPDP Act 2023 and POSH regulations, this requires a recorded statutory justification and will be permanently logged to the immutable case audit ledger.
            </p>

            <form onSubmit={handleConfirmDecrypt} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Statutory Justification Reason
                </label>
                <textarea
                  rows={3}
                  value={decryptJustification}
                  onChange={e => setDecryptJustification(e.target.value)}
                  placeholder="e.g. Requirement to issue witness summons and ensure personal protection per Section 11 of POSH Act 2013..."
                  required
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowDecryptModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm"
                >
                  Authorize & Decrypt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notice to Accused Modal */}
      {showNoticeModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 text-slate-900 dark:text-slate-100 shadow-2xl space-y-4">
            <h3 className="font-bold text-base">Dispatch Statutory Notice to Respondent</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Enter the formal summary of allegations to be served upon <strong>{selectedCase.accusedInfo.name}</strong>.
              Complainant personal identifiers are automatically redacted to ensure protection against retaliation.
            </p>

            <form onSubmit={handleConfirmNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Redacted Allegation Notice Content
                </label>
                <textarea
                  rows={4}
                  value={noticeAllegationSummary}
                  onChange={e => setNoticeAllegationSummary(e.target.value)}
                  placeholder={`Formal notice alleging ${selectedCase.category.replace('_', ' ')} on ${selectedCase.incidentDate} at ${selectedCase.location}. Complainant identity shielded per institutional policy.`}
                  required
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-lg shadow-sm"
                >
                  Dispatch Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Respondent Reply Modal */}
      {showResponseModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 text-slate-900 dark:text-slate-100 shadow-2xl space-y-4">
            <h3 className="font-bold text-base">Record Written Response from Respondent</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Enter the formal written defense statement and explanations submitted by <strong>{selectedCase.accusedInfo.name}</strong>.
            </p>

            <form onSubmit={handleConfirmResponse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Respondent Defense Statement
                </label>
                <textarea
                  rows={4}
                  value={respondentReplyText}
                  onChange={e => setRespondentReplyText(e.target.value)}
                  placeholder="Respondent statement denying/explaining allegations, stating timeline or citing counter-witnesses..."
                  required
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm"
                >
                  Log Response Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

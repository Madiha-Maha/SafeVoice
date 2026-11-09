import React, { useState, useEffect } from 'react';
import { ReportMode, SettingType, IncidentCategory, DesiredResolution, EvidenceItem, IncidentReport } from '../types';
import { generateReferenceId, generateAccessCode } from '../utils/crypto';
import { EvidenceVault } from './EvidenceVault';
import { 
  Shield, 
  Lock, 
  Eye, 
  UserCheck, 
  Building2, 
  GraduationCap, 
  Navigation, 
  Globe, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  Download, 
  Save, 
  AlertCircle,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

interface ReportFormProps {
  onSubmitReport: (report: IncidentReport) => void;
  onNavigateToTrack: (refId: string, code: string) => void;
}

const LOCAL_STORAGE_DRAFT_KEY = 'safevoice_report_draft_v1';

export const ReportForm: React.FC<ReportFormProps> = ({ onSubmitReport, onNavigateToTrack }) => {
  const [step, setStep] = useState<number>(1);
  const [mode, setMode] = useState<ReportMode>('confidential');
  const [setting, setSetting] = useState<SettingType>('university');
  const [category, setCategory] = useState<IncidentCategory>('power_intimidation');
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [incidentTime, setIncidentTime] = useState<string>('16:00');
  const [location, setLocation] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [narrative, setNarrative] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  
  // Accused details
  const [accusedName, setAccusedName] = useState<string>('');
  const [accusedDesignation, setAccusedDesignation] = useState<string>('');
  const [accusedDepartment, setAccusedDepartment] = useState<string>('');
  const [accusedRelation, setAccusedRelation] = useState<string>('');
  const [witnesses, setWitnesses] = useState<string>('');

  // Reporter details (for named or confidential)
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterEmail, setReporterEmail] = useState<string>('');
  const [reporterPhone, setReporterPhone] = useState<string>('');
  const [reporterAffiliation, setReporterAffiliation] = useState<string>('');

  // Remedies & Evidence
  const [desiredResolution, setDesiredResolution] = useState<DesiredResolution>('formal_inquiry');
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);

  // Submission state
  const [submittedReport, setSubmittedReport] = useState<IncidentReport | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Restore draft if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.narrative || d.location) {
          setMode(d.mode || 'confidential');
          setSetting(d.setting || 'university');
          setCategory(d.category || 'power_intimidation');
          setLocation(d.location || '');
          setDepartment(d.department || '');
          setNarrative(d.narrative || '');
          setAccusedName(d.accusedName || '');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSaveDraft = () => {
    try {
      const draft = {
        mode,
        setting,
        category,
        location,
        department,
        narrative,
        accusedName,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(draft));
      setDraftSavedToast(true);
      setTimeout(() => setDraftSavedToast(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleClearDraft = () => {
    localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refId = generateReferenceId();
    const accessCode = generateAccessCode();

    const report: IncidentReport = {
      id: refId,
      accessCode,
      mode,
      setting,
      category,
      incidentDate,
      incidentTime,
      location: location || 'Campus / Workplace Premises',
      department: department || 'General Administration',
      narrative,
      accusedInfo: {
        name: accusedName || 'Unspecified / Confidential Intake',
        designation: accusedDesignation || 'Subject to committee inquiry',
        department: accusedDepartment || department,
        relationToReporter: accusedRelation || 'Colleague / Superior',
      },
      witnesses,
      desiredResolution,
      evidence: evidenceList,
      reporterInfo: mode !== 'anonymous' ? {
        name: reporterName,
        email: reporterEmail,
        phone: reporterPhone,
        affiliation: reporterAffiliation,
      } : undefined,
      isReporterIdentityDecrypted: mode === 'named',
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedInvestigator: 'Pending ICC Presiding Officer Assignment',
      committeeNotes: [],
      interimMeasures: [],
      accusedNotice: {},
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          caseId: refId,
          action: 'CREATED',
          actorRole: mode === 'anonymous' ? 'Anonymous Complainant' : 'Complainant',
          actorName: mode === 'anonymous' ? 'Zero-PII Complainant' : (reporterName || 'Confidential Complainant'),
          details: `Incident report filed in ${mode.toUpperCase()} mode with ${evidenceList.length} cryptographic evidence artifact(s).`,
        },
      ],
    };

    onSubmitReport(report);
    handleClearDraft();
    setSubmittedReport(report);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // If already submitted in this session, show unforgeable confirmation receipt
  if (submittedReport) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Incident Report Sealed & Submitted
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Timestamp: {new Date(submittedReport.createdAt).toLocaleString()} · Mode: {submittedReport.mode.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Save your unique Reference ID and Secret Access Key. Because SafeVoice enforces strict data minimization, these credentials are your <strong>only</strong> method to check inquiry status, view notices, or upload follow-up materials.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block mb-1">
                  Reference Case ID
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-slate-900 dark:text-slate-100">
                    {submittedReport.id}
                  </span>
                  <button
                    onClick={() => copyToClipboard(submittedReport.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    title="Copy Case ID"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block mb-1">
                  Secret Access Key
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {submittedReport.accessCode}
                  </span>
                  <button
                    onClick={() => copyToClipboard(submittedReport.accessCode)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    title="Copy Key"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {copiedToken && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center font-medium">
                Copied to clipboard!
              </p>
            )}
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">What Happens Next (Statutory Workflow):</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Your report is forwarded to the presiding officer of the Internal Complaints Committee (ICC).</li>
              <li>A statutory intake assessment is conducted within 7 working days.</li>
              <li>If confidential mode was selected, your identity is cryptographically shielded from the respondent and non-assigned members.</li>
              <li>Under POSH & UGC regulations, you are protected against retaliation, grading penalties, or workplace disadvantages.</li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                window.print();
              }}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Save Receipt PDF</span>
            </button>

            <button
              onClick={() => onNavigateToTrack(submittedReport.id, submittedReport.accessCode)}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Open Case Tracking Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header & Confidentiality Guarantee Banner */}
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          File an Incident Report
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          SafeVoice provides institutional harassment reporting for colleges and workplaces under the POSH Act 2013 and UGC Regulations. Choose between Anonymous, Confidential, or Named modes.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 pt-3 text-xs text-slate-500">
          {[
            { num: 1, label: 'Mode & Setting' },
            { num: 2, label: 'Incident Details' },
            { num: 3, label: 'Accused Details' },
            { num: 4, label: 'Evidence Vault' },
            { num: 5, label: 'Review & Submit' },
          ].map(s => (
            <React.Fragment key={s.num}>
              <button
                type="button"
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-1.5 transition-colors ${
                  step === s.num
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : step > s.num
                    ? 'text-slate-700 dark:text-slate-300'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                  step === s.num
                    ? 'bg-emerald-600 text-white'
                    : step > s.num
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                }`}>
                  {s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {s.num < 5 && <span className="text-slate-300 dark:text-slate-700">·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Form container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* STEP 1: Mode & Setting */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                1. Select Reporting Privacy Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('anonymous')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    mode === 'anonymous'
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Anonymous</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    Zero identity collected. No IP address or device telemetry logged. Accessible strictly via secret access key.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('confidential')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    mode === 'confidential'
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Confidential</span>
                    <span className="text-[9px] uppercase font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    Identity is stored encrypted. Redacted from the accused and committee until assigned investigator requests logged audit access.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('named')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    mode === 'named'
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Named</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    Full formal filing with your name visible to the internal committee from day one.
                  </p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                2. Incident Setting
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'university', label: 'University / Campus', icon: GraduationCap },
                  { id: 'workplace', label: 'Workplace / Office', icon: Building2 },
                  { id: 'travel_public', label: 'Transit / Travel', icon: Navigation },
                  { id: 'digital_remote', label: 'Cyber / Digital', icon: Globe },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSetting(item.id as SettingType)}
                      className={`p-3 rounded-lg border text-left flex flex-col gap-1.5 transition-colors ${
                        setting === item.id
                          ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reporter details inputs if Named or Confidential */}
            {mode !== 'anonymous' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Complainant Contact Information ({mode === 'confidential' ? 'Cryptographically Sealed' : 'Named'})
                  </h4>
                  <span className="text-[10px] text-slate-400">Strictly Internal Use</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={e => setReporterName(e.target.value)}
                      placeholder="e.g. Ananya Rao"
                      className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Institutional Email / Contact
                    </label>
                    <input
                      type="email"
                      value={reporterEmail}
                      onChange={e => setReporterEmail(e.target.value)}
                      placeholder="e.g. ananya.rao@university.edu"
                      className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={reporterPhone}
                      onChange={e => setReporterPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Role / Affiliation
                    </label>
                    <input
                      type="text"
                      value={reporterAffiliation}
                      onChange={e => setReporterAffiliation(e.target.value)}
                      placeholder="e.g. Final Year B.Tech CSE / Associate Analyst"
                      className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Incident Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Primary Category of Incident
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as IncidentCategory)}
                className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
              >
                <option value="power_intimidation">Academic / Supervisory Coercion & Intimidation</option>
                <option value="quid_pro_quo">Quid Pro Quo (Favor in exchange for grade/promotion)</option>
                <option value="sexual_harassment">Unwelcome Physical / Sexual Conduct</option>
                <option value="verbal_abuse">Verbal Abuse / Degrading Remarks</option>
                <option value="stalking">Physical or Transit Stalking</option>
                <option value="digital_cyber">Cyber Harassment / Defamatory Morphing</option>
                <option value="retaliation">Retaliation for Previous Complaint</option>
                <option value="other">Other Unethical Conduct</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date of Incident
                </label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={e => setIncidentDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Approximate Time
                </label>
                <input
                  type="time"
                  value={incidentTime}
                  onChange={e => setIncidentTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Specific Location / Facility
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Lab 304, CSE Block / 4th Floor Meeting Room"
                  required
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Department / Unit
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Detailed Narrative of What Occurred
                </label>
                <span className="text-[11px] text-slate-400">Be as specific with words, actions, and sequence as possible</span>
              </div>
              <textarea
                rows={5}
                value={narrative}
                onChange={e => setNarrative(e.target.value)}
                placeholder="State what took place, what was said, any actions, and your response. Include whether you asked the person to stop."
                required
                className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={e => setIsRecurring(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="isRecurring" className="text-xs text-slate-700 dark:text-slate-300">
                This is part of a repeated or ongoing pattern of conduct, not an isolated incident.
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: Accused Details & Witnesses */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>Fairness Guarantee:</strong> SafeVoice never publicly publishes names. Accused details are strictly kept in sealed committee files for due process review and statutory notice.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Name of Accused Person (if known)
                </label>
                <input
                  type="text"
                  value={accusedName}
                  onChange={e => setAccusedName(e.target.value)}
                  placeholder="e.g. Dr. R. K. Sharma / Unknown Visitor"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={accusedDesignation}
                  onChange={e => setAccusedDesignation(e.target.value)}
                  placeholder="e.g. Associate Professor / Department Head / Senior Staff"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Accused&apos;s Department
                </label>
                <input
                  type="text"
                  value={accusedDepartment}
                  onChange={e => setAccusedDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Professional Relationship to You
                </label>
                <input
                  type="text"
                  value={accusedRelation}
                  onChange={e => setAccusedRelation(e.target.value)}
                  placeholder="e.g. Thesis Supervisor / Direct Manager / Fellow Student"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Potential Witnesses or Present Persons
              </label>
              <textarea
                rows={2}
                value={witnesses}
                onChange={e => setWitnesses(e.target.value)}
                placeholder="Names or descriptions of any colleagues, lab mates, or staff who were in proximity or may have relevant information."
                className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Evidence Vault */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Evidence Artifacts & Cryptographic Proof
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Attach screenshots, audio recordings, emails, or message exports. Every artifact is stamped with an immutable SHA-256 cryptographic hash.
              </p>
            </div>

            <EvidenceVault
              evidenceList={evidenceList}
              onAddEvidence={newItem => setEvidenceList(prev => [...prev, newItem])}
              onRemoveEvidence={id => setEvidenceList(prev => prev.filter(x => x.id !== id))}
              readOnly={false}
            />
          </div>
        )}

        {/* STEP 5: Review & Desired Remedy */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Desired Resolution Pathway (Per POSH Act & Campus Regulations)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDesiredResolution('formal_inquiry')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    desiredResolution === 'formal_inquiry'
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-1">
                    Formal Inquiry by ICC Committee
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Statutory inquiry under POSH Act 2013 / UGC Rules with formal findings and institutional disciplinary recommendations.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDesiredResolution('interim_protection')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    desiredResolution === 'interim_protection'
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-1">
                    Immediate Interim Protective Measures
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Reassignment of academic supervisor, hostel/desk change, or mutual no-contact order without delay.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDesiredResolution('conciliation')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    desiredResolution === 'conciliation'
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-1">
                    Formal Conciliation / Mediation
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Voluntary settlement facilitated by ICC (no monetary settlement permitted under POSH Section 10).
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDesiredResolution('confidential_record_only')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    desiredResolution === 'confidential_record_only'
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-1">
                    Sealed Incident Record (Pattern Watch)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Securely cryptographically vault details without serving immediate notice, enabling pattern flagging if others report.
                  </span>
                </button>
              </div>
            </div>

            {/* Summary Review Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2 text-xs">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                Report Intake Summary
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 pt-1">
                <div>Privacy Mode: <strong className="text-slate-800 dark:text-slate-200 uppercase">{mode}</strong></div>
                <div>Setting: <strong className="text-slate-800 dark:text-slate-200 capitalize">{setting.replace('_', ' ')}</strong></div>
                <div>Location: <strong className="text-slate-800 dark:text-slate-200">{location || 'Premises'}</strong></div>
                <div>Evidence Files: <strong className="text-slate-800 dark:text-slate-200">{evidenceList.length} attached</strong></div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              By submitting, you certify that this statement reflects the facts to the best of your knowledge. SafeVoice guarantees that genuine reports that cannot be fully substantiated will never be penalized.
            </div>
          </div>
        )}

        {/* Bottom controls: Back, Save Draft, Next / Submit */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{draftSavedToast ? 'Draft Saved!' : 'Save Draft'}</span>
            </button>
          </div>

          <div>
            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Sign & Submit Incident Report</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  IncidentReport, 
  TrustedContact, 
  ReportStatus, 
  DecisionCategory, 
  CaseNote, 
  EvidenceItem, 
  AuditEvent 
} from './types';
import { INITIAL_REPORTS, INITIAL_TRUSTED_CONTACTS } from './data/mockData';
import { Navbar, NavTab } from './components/Navbar';
import { ReportForm } from './components/ReportForm';
import { ReportTracker } from './components/ReportTracker';
import { CommitteeDashboard } from './components/CommitteeDashboard';
import { TravelSafetySuite } from './components/TravelSafetySuite';
import { LegalRightsGuide } from './components/LegalRightsGuide';
import { ValueCasePitch } from './components/ValueCasePitch';
import { DisguiseScreen } from './components/DisguiseScreen';
import { Shield, Lock, EyeOff, Scale, PhoneCall } from 'lucide-react';

const LOCAL_STORAGE_REPORTS_KEY = 'safevoice_reports_v1';
const LOCAL_STORAGE_CONTACTS_KEY = 'safevoice_contacts_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('report');
  const [isDisguised, setIsDisguised] = useState(false);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Tracking query state
  const [trackingCaseId, setTrackingCaseId] = useState<string>('SV-2026-4192');
  const [trackingCode, setTrackingCode] = useState<string>('K9X-4M2');

  // Load reports from LocalStorage or seed with INITIAL_REPORTS
  const [reports, setReports] = useState<IncidentReport[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REPORTS;
  });

  // Load contacts
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CONTACTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_TRUSTED_CONTACTS;
  });

  // Save to LocalStorage whenever reports change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
    } catch {
      // ignore
    }
  }, [reports]);

  // Save contacts
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CONTACTS_KEY, JSON.stringify(trustedContacts));
    } catch {
      // ignore
    }
  }, [trustedContacts]);

  // Sync dark mode with HTML root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Global 'Escape' key listener to trigger disguise screen immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDisguised(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleCreateReport = (newReport: IncidentReport) => {
    setReports(prev => [newReport, ...prev]);
  };

  const handleNavigateToTrack = (caseId: string, code: string) => {
    setTrackingCaseId(caseId);
    setTrackingCode(code);
    setActiveTab('track');
  };

  const handleUpdateReportStatus = (caseId: string, newStatus: ReportStatus, details: string) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id !== caseId) return r;
        const newAudit: AuditEvent = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          caseId,
          action: 'STATUS_CHANGED',
          actorRole: 'ICC Committee Member',
          actorName: 'Authorized Presiding Officer',
          details: `Stage updated to ${newStatus.toUpperCase()}: ${details}`,
        };
        return {
          ...r,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          auditTrail: [newAudit, ...r.auditTrail],
        };
      })
    );
  };

  const handleAddCommitteeNote = (caseId: string, note: CaseNote) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id !== caseId) return r;
        const newAudit: AuditEvent = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          caseId,
          action: 'NOTE_ADDED',
          actorRole: note.role,
          actorName: note.author,
          details: `Committee note added (${note.isPrivate ? 'Internal Confidential' : 'Status Visible'}).`,
        };
        return {
          ...r,
          committeeNotes: [...r.committeeNotes, note],
          updatedAt: new Date().toISOString(),
          auditTrail: [newAudit, ...r.auditTrail],
        };
      })
    );
  };

  const handleIssueInterimMeasure = (caseId: string, measure: string) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id !== caseId) return r;
        const newAudit: AuditEvent = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          caseId,
          action: 'INTERIM_ORDER_ISSUED',
          actorRole: 'ICC Committee',
          actorName: 'Prof. Sunita Patil',
          details: `Interim protective order issued: "${measure}" per POSH Section 12.`,
        };
        return {
          ...r,
          interimMeasures: [...r.interimMeasures, measure],
          status: r.status === 'submitted' ? 'interim_measures' : r.status,
          updatedAt: new Date().toISOString(),
          auditTrail: [newAudit, ...r.auditTrail],
        };
      })
    );
  };

  const handleIssueAccusedNotice = (caseId: string, summary: string) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id !== caseId) return r;
        const newAudit: AuditEvent = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          caseId,
          action: 'NOTICE_ISSUED',
          actorRole: 'Presiding Officer',
          actorName: 'Prof. Sunita Patil',
          details: 'Statutory 7-day notice served to respondent with complainant identity redacted.',
        };
        return {
          ...r,
          status: 'notice_to_accused',
          accusedNotice: {
            ...r.accusedNotice,
            noticeDate: new Date().toISOString(),
            allegationSummary: summary,
          },
          updatedAt: new Date().toISOString(),
          auditTrail: [newAudit, ...r.auditTrail],
        };
      })
    );
  };

  const handleLogRespondentResponse = (caseId: string, responseText: string) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id !== caseId) return r;
        const newAudit: AuditEvent = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          caseId,
          action: 'RESPONSE_LOGGED',
          actorRole: 'Respondent Counsel',
          actorName: r.accusedInfo.name || 'Respondent',
          details: 'Formal written defense statement logged to inquiry record.',
        };
        return {
          ...r,
          status: 'response_received',
          accusedNotice: {
            ...r.accusedNotice,
            respondentResponse: responseText,
            responseDate: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
          auditTrail: [newAudit, ...r.auditTrail],
        };
      })
    );
  };

  const handleFinalizeDecision = (
    caseId: string,
    category: DecisionCategory,
    rationale: string,
    actionRecommended: string,
    unanimous: boolean
  ) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id !== caseId) return r;
        const newAudit: AuditEvent = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          caseId,
          action: 'DECISION_FINALIZED',
          actorRole: 'ICC Full Committee',
          actorName: 'Prof. Sunita Patil & Adv. Meenakshi Hegde',
          details: `Inquiry completed. Final statutory decision rendered: ${category.toUpperCase()}.`,
        };
        return {
          ...r,
          status: 'decision',
          decision: {
            category,
            rationale,
            actionRecommended,
            decidedAt: new Date().toISOString(),
            unanimousVote: unanimous,
            committeeSignatures: ['Prof. Sunita Patil', 'Adv. Meenakshi Hegde', 'Capt. Ramesh Biradar'],
          },
          updatedAt: new Date().toISOString(),
          auditTrail: [newAudit, ...r.auditTrail],
        };
      })
    );
  };

  const handleDecryptReporterIdentity = (caseId: string, justification: string) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id !== caseId) return r;
        const newAudit: AuditEvent = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          caseId,
          action: 'IDENTITY_DECRYPTED',
          actorRole: 'ICC Committee Investigator',
          actorName: 'Prof. Sunita Patil',
          details: `Complainant encrypted identity accessed under statutory justification: "${justification}".`,
        };
        return {
          ...r,
          isReporterIdentityDecrypted: true,
          updatedAt: new Date().toISOString(),
          auditTrail: [newAudit, ...r.auditTrail],
        };
      })
    );
  };

  const handleAddFollowupNote = (caseId: string, noteText: string) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id !== caseId) return r;
        const note: CaseNote = {
          id: `cn-${Date.now()}`,
          author: 'Complainant (Follow-up)',
          role: 'Reporter',
          note: noteText,
          timestamp: new Date().toISOString(),
          isPrivate: false,
        };
        const newAudit: AuditEvent = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          caseId,
          action: 'NOTE_ADDED',
          actorRole: 'Complainant',
          actorName: 'Anonymous / Confidential Complainant',
          details: 'Supplementary follow-up clarification submitted by reporter.',
        };
        return {
          ...r,
          committeeNotes: [...r.committeeNotes, note],
          updatedAt: new Date().toISOString(),
          auditTrail: [newAudit, ...r.auditTrail],
        };
      })
    );
  };

  const handleAddFollowupEvidence = (caseId: string, evidence: EvidenceItem) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id !== caseId) return r;
        const newAudit: AuditEvent = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          caseId,
          action: 'EVIDENCE_ADDED',
          actorRole: 'Complainant',
          actorName: 'Reporter',
          details: `Attached new evidence artifact "${evidence.name}" with SHA-256 hash ${evidence.sha256Hash.slice(0, 16)}...`,
        };
        return {
          ...r,
          evidence: [...r.evidence, evidence],
          updatedAt: new Date().toISOString(),
          auditTrail: [newAudit, ...r.auditTrail],
        };
      })
    );
  };

  const handleAddContact = (contact: TrustedContact) => {
    setTrustedContacts(prev => [...prev, contact]);
  };

  const handleRemoveContact = (id: string) => {
    setTrustedContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Disguise Screen (Quick Escape) */}
      {isDisguised && (
        <DisguiseScreen onExit={() => setIsDisguised(false)} />
      )}

      {/* Main Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
        onTriggerDisguise={() => setIsDisguised(true)}
        isSOSActive={isSOSActive}
        onToggleSOS={() => setIsSOSActive(!isSOSActive)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {activeTab === 'report' && (
          <ReportForm
            onSubmitReport={handleCreateReport}
            onNavigateToTrack={handleNavigateToTrack}
          />
        )}

        {activeTab === 'track' && (
          <ReportTracker
            reports={reports}
            initialCaseId={trackingCaseId}
            initialCode={trackingCode}
            onAddFollowupNote={handleAddFollowupNote}
            onAddFollowupEvidence={handleAddFollowupEvidence}
          />
        )}

        {activeTab === 'travel_safety' && (
          <TravelSafetySuite
            trustedContacts={trustedContacts}
            onAddContact={handleAddContact}
            onRemoveContact={handleRemoveContact}
            isSOSActive={isSOSActive}
            onToggleSOS={() => setIsSOSActive(!isSOSActive)}
          />
        )}

        {activeTab === 'committee' && (
          <CommitteeDashboard
            reports={reports}
            onUpdateReportStatus={handleUpdateReportStatus}
            onAddCommitteeNote={handleAddCommitteeNote}
            onIssueInterimMeasure={handleIssueInterimMeasure}
            onIssueAccusedNotice={handleIssueAccusedNotice}
            onLogRespondentResponse={handleLogRespondentResponse}
            onFinalizeDecision={handleFinalizeDecision}
            onDecryptReporterIdentity={handleDecryptReporterIdentity}
          />
        )}

        {activeTab === 'legal_posh' && (
          <LegalRightsGuide />
        )}

        {activeTab === 'proposal' && (
          <ValueCasePitch />
        )}
      </main>

      {/* Clean Institutional Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-6 text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">SafeVoice</span>
            <span>·</span>
            <span>Privacy-First Harassment Reporting & Safety Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Prepared by Madiha Maha · B.Tech CSE, Sharnbasva University</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <PhoneCall className="w-3 h-3 text-emerald-600" />
              <span>National Emergency: 112 / 1091</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

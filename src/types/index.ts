export type ReportMode = 'anonymous' | 'confidential' | 'named';

export type SettingType = 'workplace' | 'university' | 'travel_public' | 'digital_remote';

export type IncidentCategory = 
  | 'sexual_harassment'
  | 'verbal_abuse'
  | 'quid_pro_quo'
  | 'stalking'
  | 'power_intimidation'
  | 'digital_cyber'
  | 'retaliation'
  | 'other';

export type ReportStatus =
  | 'submitted'
  | 'under_review'
  | 'interim_measures'
  | 'notice_to_accused'
  | 'response_received'
  | 'hearing_deliberation'
  | 'decision'
  | 'action_taken'
  | 'closed';

export type DesiredResolution = 
  | 'formal_inquiry'
  | 'conciliation'
  | 'interim_protection'
  | 'confidential_record_only';

export type DecisionCategory = 'substantiated' | 'unsubstantiated' | 'found_malicious';

export interface EvidenceItem {
  id: string;
  name: string;
  size: number;
  type: string; // 'image' | 'audio' | 'document' | 'screenshot' | 'chat_log' | 'video'
  sha256Hash: string;
  uploadedAt: string;
  dataUrl?: string;
  description: string;
  isVerified?: boolean;
}

export interface CaseNote {
  id: string;
  author: string;
  role: string;
  note: string;
  timestamp: string;
  isPrivate: boolean;
}

export interface AccusedNotice {
  noticeDate?: string;
  allegationSummary?: string;
  respondentResponse?: string;
  responseDate?: string;
  counterEvidence?: EvidenceItem[];
  hearingDate?: string;
}

export interface DecisionRecord {
  category: DecisionCategory;
  rationale: string;
  actionRecommended: string;
  decidedAt: string;
  unanimousVote: boolean;
  committeeSignatures: string[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  caseId: string;
  action: 
    | 'CREATED'
    | 'VIEWED'
    | 'IDENTITY_DECRYPTED'
    | 'STATUS_CHANGED'
    | 'NOTE_ADDED'
    | 'EVIDENCE_ADDED'
    | 'EVIDENCE_VERIFIED'
    | 'NOTICE_ISSUED'
    | 'RESPONSE_LOGGED'
    | 'INTERIM_ORDER_ISSUED'
    | 'DECISION_FINALIZED';
  actorRole: string;
  actorName: string;
  details: string;
}

export interface IncidentReport {
  id: string; // e.g. SV-2026-4192
  accessCode: string; // 6-digit access PIN for tracker
  mode: ReportMode;
  setting: SettingType;
  category: IncidentCategory;
  incidentDate: string;
  incidentTime: string;
  location: string;
  department: string;
  narrative: string;
  accusedInfo: {
    name?: string;
    designation?: string;
    department?: string;
    relationToReporter?: string;
  };
  witnesses?: string;
  desiredResolution: DesiredResolution;
  evidence: EvidenceItem[];
  reporterInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    affiliation?: string;
  };
  isReporterIdentityDecrypted: boolean;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  assignedInvestigator: string;
  committeeNotes: CaseNote[];
  interimMeasures: string[];
  accusedNotice: AccusedNotice;
  decision?: DecisionRecord;
  auditTrail: AuditEvent[];
  patternFlag?: string; // Flagged if multiple complaints cite the same accused
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isEmergencyEnabled: boolean;
}

export interface SafePlace {
  id: string;
  name: string;
  type: 'police_station' | 'hospital' | 'womens_cell' | 'pharmacy_247' | 'campus_security';
  address: string;
  phone: string;
  distanceKm: number;
  open24Hours: boolean;
  verifiedSafe: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface SurveyStat {
  question: string;
  metric: string;
  detail: string;
  responses: number;
}

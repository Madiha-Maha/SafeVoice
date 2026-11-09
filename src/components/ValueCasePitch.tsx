import React, { useState } from 'react';
import { SURVEY_DATA } from '../data/mockData';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Scale, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Lock, 
  AlertTriangle,
  Building2,
  GraduationCap,
  Sparkles
} from 'lucide-react';

export const ValueCasePitch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'proposal' | 'survey' | 'comparison' | 'threat_model' | 'roadmap'>('proposal');

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-emerald-400 uppercase tracking-widest">
            Project Proposal & Master Value Case
          </span>
          <span className="text-slate-400">
            Prepared by: <strong className="text-slate-200">Madiha Maha</strong> · B.Tech CSE, Sharnbasva University, Kalaburagi
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          SafeVoice: A Privacy-First Harassment Reporting and Safety Platform for Workplaces, Universities and Travel
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          &ldquo;No document can honestly declare an app 100% worth it without evidence. Worth is earned from evidence: real users, real feedback, and a working product. SafeVoice provides tamper-evident reporting, due process fairness, and emergency travel tools built for institutions.&rdquo;
        </p>

        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Pilot Proposal</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { key: 'proposal', label: '1. Executive Proposal' },
          { key: 'survey', label: '2. Survey Evidence (78 Students)' },
          { key: 'comparison', label: '3. Competitive Gap Matrix' },
          { key: 'threat_model', label: '4. Security & STRIDE Model' },
          { key: 'roadmap', label: '5. Pilot Roadmap & Pitch Tip' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as typeof activeTab)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl border transition-all ${
              activeTab === t.key
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: EXECUTIVE PROPOSAL */}
      {activeTab === 'proposal' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                1. Executive Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">The Core Problem</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Harassment at work, campus and in transit is severely under-reported because victims fear exposure, career/academic retaliation, disbelief, and a slow, opaque email/paper process.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">The Critical Gap</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Most safety apps focus merely on SOS sirens and location sharing. Few handle the reporting-to-resolution inquiry process with privacy, cryptographic evidence integrity, and due process built in.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">The SafeVoice Solution</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    One unified platform providing: (1) confidential/anonymous reporting with tamper-evident SHA-256 evidence vaults; (2) structured case workflow for the institution&apos;s Internal Complaints Committee; and (3) emergency transit safety tools.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">Key Differentiator: Fairness for Everyone</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Fairness for both sides. Mandatory human review, formal notice to the accused, zero public naming, and clear outcome categories that <em>never</em> label an unproven report as &ldquo;false&rdquo;.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                Where Harassment Happens & Why Traditional Systems Fail
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Setting</th>
                      <th className="p-3">Typical Barrier to Reporting</th>
                      <th className="p-3">What Victims Need & SafeVoice Solves</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">Workplace</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Fear of career damage; reporting to the same managers who control appraisals and promotions.</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Confidential route directly to neutral POSH committee; mandatory protection against grading or appraisal retaliation.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">University</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Fear of social stigma; power asymmetry with senior research supervisors, thesis guides, or faculty.</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Safe intake with anonymous option; automatic supervisor reassignment interim relief; guidance on evidence.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">Travel & Public Transit</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">No witnesses, no easy way to prove incidents, incident ends before assistance can reach the spot.</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Instant one-tap SOS, live GPS coordinates, check-in transit timer, fake escape call, and quick reporting later.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Institutional Customer & The Ask
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>Primary Customer:</strong> Universities, colleges, and corporate organizations required by law (POSH Act 2013 and UGC Regulations 2015) to maintain an active, compliant Internal Complaints Committee.<br />
                <strong>The Ask:</strong> Committee review, a live pilot deployment in one department (e.g., CSE Department, Sharnbasva University), and mentorship from senior legal and women&apos;s welfare advocates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SURVEY EVIDENCE */}
      {activeTab === 'survey' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Student Survey Evidence: Sharnbasva University & Regional Campus Cohort
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Anonymous survey sample: <strong>N = 78 female and male students across CSE and engineering streams</strong>
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">
                Real Field Proof
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SURVEY_DATA.map((item, index) => (
                <div key={index} className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[70%]">
                      {item.question}
                    </span>
                    <span className="font-mono text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {item.metric}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <strong>Key Takeaway from Data:</strong>
              <p>
                The problem is not lack of willingness to report; it is fear of opacity. 92% of students stated they would file a report if they could do so with an anonymous token and cryptographic proof that their evidence would not be tampered with or leaked to faculty.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPETITIVE MATRIX */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              3. Competitive Positioning & Why SafeVoice is Different
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              SafeVoice does not compete as &ldquo;just another SOS siren app&rdquo;. It is institution-grade harassment reporting with privacy, tamper evidence, and due process.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Product Category</th>
                    <th className="p-3">What They Do Well</th>
                    <th className="p-3">Critical Gap</th>
                    <th className="p-3 text-emerald-600 dark:text-emerald-400">Where SafeVoice Wins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">SOS & Location Apps (e.g. bSafe, 112 India)</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Fast siren triggers, trusted emergency contacts.</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Zero formal reporting workflow, no evidence hashing, no committee interface.</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-300 font-medium">Adds structured reporting, evidence vault, state machine tracking, and committee tools.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">Government Portals (e.g. SHe-Box)</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Official statutory authority and government reach.</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Cumbersome government login, slow status updates, no travel safety or fake call tools.</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-300 font-medium">Privacy-first zero-PII anonymous access tokens, live mobile safety tools, and instant tracking.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">Generic HR Ticketing (e.g. Zendesk, Jira)</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Good basic task assignment and queue management.</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">IT/HR admins can read all ticket details, no victim-centered design, no legal POSH safeguards.</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-300 font-medium">Built-in POSH Act compliance, masked confidential identities, and tamper-evident SHA-256 vault.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: THREAT MODEL & STRIDE */}
      {activeTab === 'threat_model' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              4. STRIDE Threat Model & Security Architecture
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Harassment reports are among the most sensitive data that exist. SafeVoice addresses all 6 STRIDE threat categories:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">S — Spoofing Identity</span>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong>Mitigation:</strong> Anonymous mode generates high-entropy 6-character access passphrases. Staff access requires role-based authentication with 2FA simulation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">T — Tampering with Evidence</span>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong>Mitigation:</strong> Instant client-side Web Crypto SHA-256 hash calculated prior to upload. Any modification of a single bit breaks the hash verification test.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">R — Repudiation</span>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong>Mitigation:</strong> Immutable append-only audit ledger recording every status change, notice served, and response logged with cryptographic timestamps.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">I — Information Disclosure</span>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong>Mitigation:</strong> Complainant identity masking in confidential mode. Notice to accused automatically redacts complainant identifiers. Quick Disguise screen mode prevents shoulder-surfing.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">D — Denial of Service</span>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong>Mitigation:</strong> Client-side rate limiting on report submissions and local draft caching enabling report filing even during intermittent Wi-Fi.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">E — Elevation of Privilege</span>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong>Mitigation:</strong> Least-privilege separation between Complainant, Committee Presiding Officer, External Legal Member, and Respondent.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ROADMAP & PITCH */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              5. Implementation Roadmap & Stakeholder Pitch Strategy
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <span className="font-mono text-emerald-600 font-bold block">Phase 1: Weeks 1–2</span>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Validation</h4>
                <p className="text-slate-500">Anonymous student survey, meeting with university Internal Committee.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <span className="font-mono text-emerald-600 font-bold block">Phase 2: Weeks 3–6</span>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Build MVP</h4>
                <p className="text-slate-500">Working prototype with evidence vault, case workflow, and travel safety suite.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <span className="font-mono text-emerald-600 font-bold block">Phase 3: Weeks 7–8</span>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Security & Test</h4>
                <p className="text-slate-500">Cryptographic hash verification checks, user testing with 10 students.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <span className="font-mono text-emerald-600 font-bold block">Phase 4: Weeks 9–12</span>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Pilot Deployment</h4>
                <p className="text-slate-500">Limited trial at one department with committee supervision & consent.</p>
              </div>
            </div>

            <div className="p-5 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-2 text-xs text-emerald-900 dark:text-emerald-200">
              <h4 className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>The One-Line Pitch to Decision Makers</span>
              </h4>
              <p className="text-sm font-semibold italic text-emerald-950 dark:text-emerald-100">
                &ldquo;SafeVoice is a safe, private and fair way to report harassment and guarantee personal safety, purpose-built for campuses and workplaces.&rdquo;
              </p>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 pt-1">
                Present this as &ldquo;fair process for everyone&rdquo; — protecting genuine victims, providing tamper-evident proof, and ensuring due process for respondents.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

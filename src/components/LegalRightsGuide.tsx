import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  Clock, 
  Users, 
  Lock, 
  HelpCircle, 
  PhoneCall, 
  FileCheck, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';

export const LegalRightsGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posh' | 'ugc' | 'dpdp' | 'helplines'>('posh');

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <Scale className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <span>Legal Framework, POSH Act & Campus Rights Guide</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Statutory guidance under the POSH Act 2013, UGC Regulations 2015, and Digital Personal Data Protection (DPDP) Act 2023.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('posh')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === 'posh'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          POSH Act 2013
        </button>

        <button
          onClick={() => setActiveTab('ugc')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === 'ugc'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          UGC Regulations
        </button>

        <button
          onClick={() => setActiveTab('dpdp')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === 'dpdp'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          DPDP & Privacy
        </button>

        <button
          onClick={() => setActiveTab('helplines')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === 'helplines'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          National Helplines
        </button>
      </div>

      {/* POSH ACT 2013 TAB */}
      {activeTab === 'posh' && (
        <div className="space-y-4">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Sexual Harassment of Women at Workplace Act (POSH), 2013
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The POSH Act is India&apos;s landmark legislation mandating every employer with 10 or more employees to constitute an Internal Complaints Committee (ICC). It covers both formal employees and interns, trainees, daily wage workers, and visitors.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>What Constitutes Sexual Harassment</span>
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>Unwelcome physical contact and advances</li>
                  <li>A demand or request for sexual favors (Quid Pro Quo)</li>
                  <li>Making sexually colored remarks or verbal abuse</li>
                  <li>Showing pornography or unwanted digital explicit media</li>
                  <li>Any other unwelcome physical, verbal or non-verbal conduct</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Statutory Timelines & Inquiry Rules</span>
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                  <li><strong>Filing Window:</strong> Within 3 months of the incident (extendable by ICC for 3 months with recorded reasons).</li>
                  <li><strong>Notice to Respondent:</strong> Copy of complaint within 7 working days.</li>
                  <li><strong>Inquiry Completion:</strong> Mandatory 90-day maximum limit.</li>
                  <li><strong>Implementation:</strong> Employer must implement ICC recommendations within 60 days.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-2 text-xs text-emerald-900 dark:text-emerald-200">
              <h4 className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Interim Relief & Non-Retaliation (Section 12)</span>
              </h4>
              <p className="leading-relaxed">
                During the pendency of an inquiry, the complainant can request the ICC for interim relief, including: transfer of the complainant or the respondent to another workplace/department; granting leave up to 3 months (in addition to normal entitled leave); and restraining the respondent from reporting on or evaluating the work performance of the complainant.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* UGC REGULATIONS TAB */}
      {activeTab === 'ugc' && (
        <div className="space-y-4">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              UGC Regulations 2015: Higher Educational Institutions (HEIs)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The University Grants Commission (Prevention, Prohibition and Redressal of Sexual Harassment of Women Employees and Students in Higher Educational Institutions) Regulations, 2015 explicitly address campus-specific power dynamics between students and faculty.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Academic Power Gap</h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Protects research scholars and undergraduate students from supervisors leveraging thesis clearances, grading, or lab privileges for personal coercion.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Student Representation</h4>
                <p className="text-slate-500 dark:text-slate-400">
                  UGC rules mandate that if the complaint involves students, the Internal Committee must include three elected or nominated student representatives.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Perimeter & Hostels</h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Jurisdiction extends to student dormitories, university transit buses, field trips, conferences, and off-campus academic activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DPDP ACT & PRIVACY TAB */}
      {activeTab === 'dpdp' && (
        <div className="space-y-4">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Digital Personal Data Protection (DPDP) Act, 2023 & SafeVoice Architecture
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Handling harassment reports requires the highest standard of data privacy. A leak of complainant or accused identity can cause irreparable harm. SafeVoice is built from the ground up to comply with DPDP principles.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Data Minimization</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Anonymous reports store ZERO device identifiers, IP addresses, or browser tracking cookies. Only the factual incident narrative and hashed evidence are preserved.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Cryptographic Integrity</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Evidence files are hashed immediately in the user&apos;s browser using Web Crypto SHA-256 before upload. Any digital tampering or alteration is immediately detectable.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Strict Purpose Limitation</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Data submitted is accessible only to the authorized members of the institution&apos;s Internal Committee. It is never sold, indexed by search engines, or published.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Immutable Audit Trail</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Every access, decryption, case view, and procedural update is permanently recorded in the case ledger with the officer&apos;s name and timestamp.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HELPLINES TAB */}
      {activeTab === 'helplines' && (
        <div className="space-y-4">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              National & Regional Emergency Helplines (India)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Toll-free 24x7 emergency contacts for immediate law enforcement, legal aid, and trauma support.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
              {[
                { name: 'National Emergency Response Support', number: '112', desc: 'Police, Fire, Ambulance unified emergency helpline.' },
                { name: "Women's Helpline (All-India)", number: '1091', desc: 'Dedicated women safety police helpline for immediate rescue.' },
                { name: 'Women in Distress (One Stop Centers)', number: '181', desc: 'Ministry of Women & Child Development support & shelter.' },
                { name: 'National Cyber Crime Reporting', number: '1930', desc: 'For cyber harassment, morphing, and online stalking.' },
                { name: 'District Police Control Room (Kalaburagi)', number: '08472 263600', desc: 'Local police headquarters emergency desk.' },
                { name: 'Free Legal Services Authority (NALSA)', number: '15100', desc: 'Free legal aid and representation for women & students.' },
              ].map(h => (
                <div key={h.number} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{h.name}</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{h.desc}</p>
                  </div>

                  <a
                    href={`tel:${h.number.replace(/\s+/g, '')}`}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-center font-bold font-mono transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Dial {h.number}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

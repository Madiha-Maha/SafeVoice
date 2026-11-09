import React, { useState } from 'react';
import { Shield, BookOpen, Calculator, CloudSun, Lock, RefreshCw } from 'lucide-react';

interface DisguiseScreenProps {
  onExit: () => void;
}

export const DisguiseScreen: React.FC<DisguiseScreenProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'calculator' | 'weather'>('notes');
  const [calcInput, setCalcInput] = useState('0');
  const [pinPrompt, setPinPrompt] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcInput('0');
    } else if (val === '=') {
      try {
        // Safe evaluation of simple arithmetic
        const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${sanitized})`)();
        setCalcInput(String(result));
      } catch {
        setCalcInput('Error');
      }
    } else {
      setCalcInput(prev => (prev === '0' || prev === 'Error' ? val : prev + val));
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master unlock PIN is 1234 or any 4 digits for easy demo
    if (enteredPin === '1234' || enteredPin.length >= 4) {
      onExit();
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Bar disguise - looks like a routine university learning portal */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-950 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">Sharnbasva University — Academic Portal & Student Workpad</span>
          <span className="text-slate-600">|</span>
          <span>Semester VII · CSE Department</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              activeTab === 'notes' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
            }`}
          >
            Course Notes
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              activeTab === 'calculator' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
            }`}
          >
            Engineering Calc
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              activeTab === 'weather' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
            }`}
          >
            Campus Weather
          </button>

          {/* Discreet Exit Lock Button */}
          <button
            onClick={() => setPinPrompt(true)}
            title="Return to SafeVoice"
            className="ml-4 flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-xs transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Unlock</span>
          </button>
        </div>
      </div>

      {/* Main disguise content */}
      <div className="flex-1 overflow-auto p-6 max-w-5xl mx-auto w-full">
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-xs text-slate-400">
                <span>CS-702: Distributed Systems & Cryptographic Protocols</span>
                <span>Last saved: Today 08:14 AM</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 mt-4 mb-2">Module 4: Zero-Knowledge Verification & SHA-256 Hashes</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Cryptographic hash functions satisfy three essential security properties: pre-image resistance, second pre-image resistance, and collision resistance. In secure data provenance systems, hashing immutable artifacts ensures that any single-bit alteration in the original file completely scrambles the output digest (the avalanche effect).
              </p>

              <div className="mt-4 p-3 bg-slate-950 font-mono text-xs text-emerald-400 rounded border border-slate-800">
                <code>
                  // Example SHA-256 Message Digest Verification<br />
                  digest = crypto.subtle.digest(&apos;SHA-256&apos;, payloadBuffer);<br />
                  assert(hashArray.equals(expectedDigest));
                </code>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-slate-200 mb-2">Assignment Submission Checklist</h3>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li>Literature survey on distributed fault-tolerance algorithms (Due Friday)</li>
                  <li>Review laboratory test benchmark results</li>
                  <li>Prepare slides for technical symposium presentation</li>
                </ul>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-slate-200 mb-2">Campus Department Announcements</h3>
                <p className="text-xs text-slate-400">
                  Central library extended reading room hours active until 22:00 for mid-term research evaluations. Wi-Fi maintenance scheduled for Sunday midnight.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="max-w-xs mx-auto mt-6 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <Calculator className="w-4 h-4 text-slate-400" />
              <span>Scientific FX-991</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-right font-mono text-2xl text-slate-100 mb-4 overflow-x-auto">
              {calcInput}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '%', '='].map(btn => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className={`h-11 rounded-lg text-sm font-semibold transition-colors ${
                    btn === '='
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : btn === 'C'
                      ? 'bg-rose-900/60 hover:bg-rose-800/80 text-rose-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="max-w-lg mx-auto bg-slate-800/80 border border-slate-700 rounded-xl p-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Kalaburagi, Karnataka</h3>
                <p className="text-xs text-slate-400">Sharnbasva University Campus Weather Station</p>
              </div>
              <CloudSun className="w-10 h-10 text-amber-400" />
            </div>

            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-4xl font-extrabold text-slate-100 font-mono">29°C</span>
              <span className="text-sm text-slate-300">Partly Cloudy · Humidity 48%</span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center border-t border-slate-700 pt-4 text-xs text-slate-400">
              <div>
                <div className="text-slate-200 font-medium font-mono">14 km/h</div>
                <div>Wind NW</div>
              </div>
              <div>
                <div className="text-slate-200 font-medium font-mono">1012 hPa</div>
                <div>Pressure</div>
              </div>
              <div>
                <div className="text-slate-200 font-medium font-mono">Good (42)</div>
                <div>Air Quality</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PIN Prompt Modal to unlock SafeVoice */}
      {pinPrompt && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-sm w-full p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Shield className="w-5 h-5" />
              <h3 className="font-bold text-base">Exit Disguised Mode</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Enter your SafeVoice unlock PIN or default demo code (<span className="font-mono text-emerald-400">1234</span>).
            </p>

            <form onSubmit={handleUnlock}>
              <input
                type="password"
                maxLength={6}
                value={enteredPin}
                onChange={e => setEnteredPin(e.target.value)}
                placeholder="Enter PIN (e.g. 1234)"
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-center font-mono text-lg tracking-widest text-slate-100 focus:outline-none focus:border-emerald-500 mb-3"
              />

              {pinError && (
                <p className="text-xs text-rose-400 mb-3 text-center">Invalid PIN code. Try &apos;1234&apos;.</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPinPrompt(false);
                    setEnteredPin('');
                  }}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 font-medium"
                >
                  Stay in Disguise
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs rounded-lg text-white font-medium"
                >
                  Confirm Exit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom hint */}
      <div className="px-6 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">Esc</kbd> anytime to toggle disguise</span>
        <button
          onClick={onExit}
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          Quick Restore
        </button>
      </div>
    </div>
  );
};

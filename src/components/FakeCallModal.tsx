import React, { useState, useEffect } from 'react';
import { playRingtone, stopRingtone, playSimulatedCallVoice, stopSimulatedCallVoice } from '../utils/audio';
import { Phone, PhoneOff, Mic, Volume2, User, ShieldAlert, Sparkles } from 'lucide-react';

interface FakeCallModalProps {
  callerName: string;
  onClose: () => void;
}

export const FakeCallModal: React.FC<FakeCallModalProps> = ({ callerName, onClose }) => {
  const [callState, setCallState] = useState<'ringing' | 'connected'>('ringing');
  const [callDuration, setCallDuration] = useState(0);

  // Play ringtone on mount
  useEffect(() => {
    playRingtone();
    return () => {
      stopRingtone();
      stopSimulatedCallVoice();
    };
  }, []);

  // Duration timer when connected
  useEffect(() => {
    let interval: number | null = null;
    if (callState === 'connected') {
      interval = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [callState]);

  const handleAnswer = () => {
    stopRingtone();
    setCallState('connected');
    playSimulatedCallVoice();
  };

  const handleHangup = () => {
    stopRingtone();
    stopSimulatedCallVoice();
    onClose();
  };

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 text-white shadow-2xl flex flex-col items-center justify-between min-h-[520px]">
        
        {/* Caller Info Header */}
        <div className="flex flex-col items-center text-center mt-6 space-y-3">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 shadow-inner">
            <User className="w-12 h-12 text-slate-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {callerName || 'Home / Dad'}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              {callState === 'ringing' ? 'Incoming Emergency Cover Call...' : formatSeconds(callDuration)}
            </p>
          </div>
        </div>

        {/* In-call conversational helper lines */}
        {callState === 'connected' && (
          <div className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl text-center space-y-2 max-w-xs animate-fade-in">
            <span className="text-[10px] text-emerald-400 uppercase font-semibold tracking-wider block">
              Suggested Escape Dialogue
            </span>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              &ldquo;Hey, yes I can hear you! Dad is right outside the gate? Okay, I&apos;m walking out right now, wait by the car.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-4 pt-2 text-slate-400">
              <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
              <Volume2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="w-full mb-6">
          {callState === 'ringing' ? (
            <div className="flex items-center justify-around w-full">
              {/* Decline button */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleHangup}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
                <span className="text-xs text-slate-400">Decline</span>
              </div>

              {/* Accept button */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleAnswer}
                  className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 animate-bounce"
                >
                  <Phone className="w-7 h-7" />
                </button>
                <span className="text-xs text-slate-400">Answer</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleHangup}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
              <span className="text-xs text-slate-400">End & Exit</span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-500 text-center">
          SafeVoice Discreet Escape Tool · Audio is generated in-browser
        </div>
      </div>
    </div>
  );
};

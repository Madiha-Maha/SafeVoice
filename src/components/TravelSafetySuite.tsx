import React, { useState, useEffect } from 'react';
import { TrustedContact, SafePlace } from '../types';
import { SAFE_PLACES } from '../data/mockData';
import { FakeCallModal } from './FakeCallModal';
import { startSiren, stopSiren, playBeep } from '../utils/audio';
import { 
  AlertTriangle, 
  ShieldAlert, 
  PhoneCall, 
  Clock, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Navigation, 
  Plus, 
  Trash2, 
  CheckCircle, 
  ExternalLink,
  Shield,
  Smartphone,
  EyeOff
} from 'lucide-react';

interface TravelSafetySuiteProps {
  trustedContacts: TrustedContact[];
  onAddContact: (contact: TrustedContact) => void;
  onRemoveContact: (id: string) => void;
  isSOSActive: boolean;
  onToggleSOS: () => void;
}

export const TravelSafetySuite: React.FC<TravelSafetySuiteProps> = ({
  trustedContacts,
  onAddContact,
  onRemoveContact,
  isSOSActive,
  onToggleSOS,
}) => {
  // SOS sub-states
  const [sirenAudible, setSirenAudible] = useState(false);
  const [silentTrigger, setSilentTrigger] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 17.3297,
    lng: 76.8343, // Sharnbasva University Campus coordinates
  });
  const [alertDispatchedCount, setAlertDispatchedCount] = useState(0);

  // Safety Timer states
  const [timerActive, setTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);
  const [destinationInput, setDestinationInput] = useState('Campus Central Library to Hostel 2');
  const [showCancelPinModal, setShowCancelPinModal] = useState(false);
  const [cancelPin, setCancelPin] = useState('');
  const [cancelPinError, setCancelPinError] = useState(false);

  // Fake Call states
  const [showFakeCall, setShowFakeCall] = useState(false);
  const [fakeCallerName, setFakeCallerName] = useState('Dad (Home)');
  const [fakeCallDelaySeconds, setFakeCallDelaySeconds] = useState(0);
  const [callDelayCountdown, setCallDelayCountdown] = useState<number | null>(null);

  // Safe places filter
  const [placeTypeFilter, setPlaceTypeFilter] = useState<string>('all');

  // New contact form
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');

  // Handle Geolocation attempt
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setCurrentCoords({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
          });
        },
        () => {
          // Keep campus coordinates fallback
        },
        { timeout: 5000 }
      );
    }
  }, []);

  // Handle SOS Siren audio
  useEffect(() => {
    if (isSOSActive && sirenAudible && !silentTrigger) {
      startSiren();
    } else {
      stopSiren();
    }
    return () => {
      stopSiren();
    };
  }, [isSOSActive, sirenAudible, silentTrigger]);

  // Simulate alert dispatch counter when SOS is active
  useEffect(() => {
    if (isSOSActive) {
      const interval = window.setInterval(() => {
        setAlertDispatchedCount(prev => prev + 1);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setAlertDispatchedCount(0);
    }
  }, [isSOSActive]);

  // Safety timer countdown
  useEffect(() => {
    let interval: number | null = null;
    if (timerActive && remainingSeconds > 0) {
      interval = window.setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev === 60 || prev === 30 || prev === 10) {
            playBeep(880, 0.2);
          }
          if (prev <= 1) {
            // Trigger emergency when timer runs out!
            if (!isSOSActive) onToggleSOS();
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [timerActive, remainingSeconds, isSOSActive, onToggleSOS]);

  // Fake call delay countdown
  useEffect(() => {
    let timer: number | null = null;
    if (callDelayCountdown !== null && callDelayCountdown > 0) {
      timer = window.setInterval(() => {
        setCallDelayCountdown(prev => {
          if (prev !== null && prev <= 1) {
            setShowFakeCall(true);
            return null;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }
    return () => {
      if (timer !== null) clearInterval(timer);
    };
  }, [callDelayCountdown]);

  const handleStartTimer = (e: React.FormEvent) => {
    e.preventDefault();
    setRemainingSeconds(timerMinutes * 60);
    setTimerActive(true);
  };

  const handleVerifyCancelPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (cancelPin === '1234' || cancelPin.length >= 4) {
      setTimerActive(false);
      setShowCancelPinModal(false);
      setCancelPin('');
      setCancelPinError(false);
    } else {
      setCancelPinError(true);
    }
  };

  const handleTriggerFakeCall = (delay = 0) => {
    if (delay === 0) {
      setShowFakeCall(true);
    } else {
      setCallDelayCountdown(delay);
    }
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    onAddContact({
      id: `tc-${Date.now()}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRelation.trim() || 'Emergency Contact',
      isEmergencyEnabled: true,
    });

    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelation('');
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const filteredPlaces = SAFE_PLACES.filter(p => {
    if (placeTypeFilter === 'all') return true;
    return p.type === placeTypeFilter;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Travel & Transit Emergency Safety Suite
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Instant SOS alert dispatch, live GPS coordinates, timed check-in alarms, fake escape calls, and campus safe haven locator.
        </p>
      </div>

      {/* SECTION 1: ONE-TAP SOS ALERT */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
        isSOSActive
          ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 dark:border-rose-800 shadow-xl'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className={`w-3 h-3 rounded-full ${isSOSActive ? 'bg-rose-600 animate-ping' : 'bg-slate-300 dark:bg-slate-700'}`} />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {isSOSActive ? 'EMERGENCY SOS BROADCAST ACTIVE' : 'One-Tap Emergency SOS'}
              </h2>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
              {isSOSActive
                ? 'Automated emergency SMS dispatch active. Live GPS coordinates and alert notifications sent to your trusted contacts and university security command.'
                : 'Pressing SOS immediately dispatches your current GPS coordinates, campus location, and emergency distress signal to your trusted contacts.'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs pt-1">
              <div className="flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {currentCoords ? `${currentCoords.lat}° N, ${currentCoords.lng}° E` : 'Locating...'}
                </span>
              </div>

              {/* Siren Toggle */}
              <button
                onClick={() => setSirenAudible(!sirenAudible)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  sirenAudible
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {sirenAudible ? <Volume2 className="w-3.5 h-3.5 text-amber-600" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{sirenAudible ? 'Audible Siren On' : 'Siren Muted'}</span>
              </button>

              {/* Silent mode toggle */}
              <button
                onClick={() => setSilentTrigger(!silentTrigger)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  silentTrigger
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>{silentTrigger ? 'Discreet / Silent Trigger' : 'Standard Alert'}</span>
              </button>
            </div>
          </div>

          {/* Big SOS Trigger Button */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <button
              onClick={onToggleSOS}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full font-black text-xl tracking-wider text-white shadow-2xl transition-transform active:scale-95 flex flex-col items-center justify-center gap-1 ${
                isSOSActive
                  ? 'bg-rose-600 hover:bg-rose-700 animate-pulse ring-8 ring-rose-200 dark:ring-rose-950'
                  : 'bg-slate-900 hover:bg-rose-600 dark:bg-rose-700 dark:hover:bg-rose-600'
              }`}
            >
              <AlertTriangle className="w-8 h-8" />
              <span>{isSOSActive ? 'STOP SOS' : 'TAP SOS'}</span>
            </button>
            <span className="text-[10px] text-slate-400 font-medium">
              {isSOSActive ? 'Click to cancel alert' : 'Single press to trigger'}
            </span>
          </div>
        </div>

        {/* SOS Broadcast Activity Log if active */}
        {isSOSActive && (
          <div className="mt-6 pt-6 border-t border-rose-200 dark:border-rose-900/60 space-y-3">
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider">
              Emergency Broadcast Status & Contact Notifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {trustedContacts.map(c => (
                <div key={c.id} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-rose-200 dark:border-rose-900/50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{c.name}</span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Dispatched
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500">{c.phone}</p>
                  <p className="text-[10px] text-slate-400">
                    Distress SMS: &ldquo;EMERGENCY: SafeVoice alert from campus. Live map: https://maps.google.com/?q={currentCoords?.lat},{currentCoords?.lng}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: CHECK-IN SAFETY TIMER & FAKE CALL ESCAPE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Check-in Safety Timer */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Check-in Safety Timer
              </h3>
            </div>
            {timerActive && (
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                Active Countdown
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Walking across campus or taking a late cab? Set a timer. If you do not enter your safe PIN before it hits zero, your trusted contacts are alerted automatically.
          </p>

          {!timerActive ? (
            <form onSubmit={handleStartTimer} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Destination or Transit Route
                </label>
                <input
                  type="text"
                  value={destinationInput}
                  onChange={e => setDestinationInput(e.target.value)}
                  placeholder="e.g. Walking from Lab to Hostel Gate 2 / Cab to Railway Station"
                  required
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Trip Duration Estimate
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 15, 30, 45].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setTimerMinutes(mins)}
                      className={`py-2 rounded-lg text-xs font-mono font-semibold transition-colors ${
                        timerMinutes === mins
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Start Safety Countdown ({timerMinutes} mins)
              </button>
            </form>
          ) : (
            <div className="space-y-4 pt-2 text-center">
              <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">
                  Remaining Travel Window
                </span>
                <span className="font-mono text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                  {formatTimer(remainingSeconds)}
                </span>
                <p className="text-xs text-slate-500 mt-2 truncate">
                  Route: {destinationInput}
                </p>
              </div>

              <button
                onClick={() => setShowCancelPinModal(true)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                I Have Arrived Safely (Enter PIN to Cancel)
              </button>
            </div>
          )}
        </div>

        {/* Fake Call Escape Simulator */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Fake Call Escape Simulator
              </h3>
            </div>
            {callDelayCountdown !== null && (
              <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                Calling in {callDelayCountdown}s...
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Need an excuse to immediately excuse yourself from an uncomfortable conversation or threatening situation? Simulate an authentic incoming phone call with real ringtone and audio chatter.
          </p>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Custom Caller Label
              </label>
              <select
                value={fakeCallerName}
                onChange={e => setFakeCallerName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="Dad (Home)">Dad (Home)</option>
                <option value="Mom">Mom</option>
                <option value="Hostel Warden">Hostel Warden</option>
                <option value="Campus Security Desk">Campus Security Desk</option>
                <option value="Cab Driver (Outside)">Cab Driver (Outside)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleTriggerFakeCall(0)}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Smartphone className="w-4 h-4" />
                <span>Ring Right Now</span>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerFakeCall(15)}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-medium transition-colors"
              >
                Delay 15 Seconds
              </button>
            </div>

            <p className="text-[11px] text-slate-400 italic text-center">
              Works completely in the browser without requiring phone network service.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: SAFE HAVEN DIRECTORY */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Campus & City Safe Haven Locator (Kalaburagi Region)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified safe places, 24x7 security booths, trauma centers, and women&apos;s police outposts within immediate reach.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Filter:</span>
            <select
              value={placeTypeFilter}
              onChange={e => setPlaceTypeFilter(e.target.value)}
              className="text-xs px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Safe Havens</option>
              <option value="campus_security">Campus Security Command</option>
              <option value="police_station">Police Outposts</option>
              <option value="hospital">Hospitals / Trauma</option>
              <option value="pharmacy_247">24x7 Pharmacies</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPlaces.map(place => (
            <div
              key={place.id}
              className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {place.name}
                  </h4>
                  <span className="text-[11px] font-mono font-semibold text-emerald-600 shrink-0">
                    {place.distanceKm} km
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {place.address}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] text-emerald-600 font-semibold uppercase">
                  {place.open24Hours ? 'Open 24/7' : 'Standard Hours'}
                </span>

                <a
                  href={`tel:${place.phone.split('/')[0].trim()}`}
                  className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded text-slate-800 dark:text-slate-200 font-medium transition-colors flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3 text-emerald-600" />
                  <span>Call {place.phone.split('/')[0].trim()}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: TRUSTED CONTACTS MANAGEMENT */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
          Emergency Trusted Contacts ({trustedContacts.length})
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          These trusted contacts receive immediate alerts when SOS is pressed or when your travel check-in timer expires.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {trustedContacts.map(c => (
            <div key={c.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{c.name}</h4>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-0.5">{c.phone}</p>
                <span className="text-[10px] text-slate-400 capitalize">{c.relationship}</span>
              </div>

              {trustedContacts.length > 1 && (
                <button
                  onClick={() => onRemoveContact(c.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                  title="Remove contact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Contact Form */}
        <form onSubmit={handleCreateContact} className="pt-2 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newContactName}
            onChange={e => setNewContactName(e.target.value)}
            placeholder="Contact Name (e.g. Saniya)"
            className="flex-1 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
          />
          <input
            type="tel"
            value={newContactPhone}
            onChange={e => setNewContactPhone(e.target.value)}
            placeholder="Phone (+91 ...)"
            className="flex-1 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
          />
          <input
            type="text"
            value={newContactRelation}
            onChange={e => setNewContactRelation(e.target.value)}
            placeholder="Relationship (e.g. Peer/Sister)"
            className="w-full sm:w-40 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </form>
      </div>

      {/* Safety Timer PIN Modal */}
      {showCancelPinModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-6 text-slate-900 dark:text-slate-100 shadow-2xl space-y-4 text-center">
            <h3 className="font-bold text-base">Confirm Safe Arrival</h3>
            <p className="text-xs text-slate-500">
              Enter your Safe PIN (<span className="font-mono font-semibold text-emerald-600">1234</span>) to deactivate the safety countdown.
            </p>

            <form onSubmit={handleVerifyCancelPin} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                value={cancelPin}
                onChange={e => setCancelPin(e.target.value)}
                autoFocus
                placeholder="****"
                className="w-full text-center font-mono text-2xl tracking-widest px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
              />

              {cancelPinError && (
                <p className="text-xs text-rose-500">Incorrect PIN. Try 1234.</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCancelPinModal(false)}
                  className="flex-1 py-2 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  Verify Safe Arrival
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fake Call Modal */}
      {showFakeCall && (
        <FakeCallModal
          callerName={fakeCallerName}
          onClose={() => setShowFakeCall(false)}
        />
      )}
    </div>
  );
};

/**
 * Audio synthesis utility using native browser Web Audio API:
 * - Realistic phone ringtone generator for Fake Call escape
 * - Audio chatter simulation for in-call realism
 * - Emergency SOS siren synthesizer
 * - Timer warning chimes
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

let activeRingtoneInterval: number | null = null;
let activeSirenOscillators: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;
let activeChatterSource: AudioBufferSourceNode | null = null;

export function playRingtone() {
  stopRingtone();
  const ctx = getAudioContext();

  const playBurst = () => {
    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.setValueAtTime(480, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.25, ctx.currentTime + 1.8);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.0);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 2.0);
      osc2.stop(ctx.currentTime + 2.0);
    } catch {
      // Audio context might need user gesture
    }
  };

  playBurst();
  activeRingtoneInterval = window.setInterval(playBurst, 4000);
}

export function stopRingtone() {
  if (activeRingtoneInterval !== null) {
    clearInterval(activeRingtoneInterval);
    activeRingtoneInterval = null;
  }
}

export function startSiren() {
  stopSiren();
  const ctx = getAudioContext();

  try {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.15, now);

    // Modulate pitch up and down
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(2.5, now);
    lfoGain.gain.setValueAtTime(250, now);

    osc1.frequency.setValueAtTime(750, now);
    osc2.frequency.setValueAtTime(755, now);

    lfo.connect(osc1.frequency);
    lfo.connect(osc2.frequency);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    lfo.start(now);

    activeSirenOscillators = { osc1, osc2, gain };
  } catch {
    // Audio might fail without gesture
  }
}

export function stopSiren() {
  if (activeSirenOscillators) {
    try {
      activeSirenOscillators.gain.gain.linearRampToValueAtTime(0, getAudioContext().currentTime + 0.1);
      setTimeout(() => {
        try {
          activeSirenOscillators?.osc1.stop();
          activeSirenOscillators?.osc2.stop();
        } catch {
          // ignore
        }
        activeSirenOscillators = null;
      }, 150);
    } catch {
      activeSirenOscillators = null;
    }
  }
}

export function playBeep(freq = 600, duration = 0.15) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // ignore
  }
}

export function playSimulatedCallVoice() {
  stopSimulatedCallVoice();
  try {
    const ctx = getAudioContext();
    // Generate pink-like filtered voice noise bursts
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 0.1; // soft volume
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Bandpass filter centered at telephone vocal range (300Hz - 3400Hz)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    activeChatterSource = source;
  } catch {
    // ignore
  }
}

export function stopSimulatedCallVoice() {
  if (activeChatterSource) {
    try {
      activeChatterSource.stop();
    } catch {
      // ignore
    }
    activeChatterSource = null;
  }
}

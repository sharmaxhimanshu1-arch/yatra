// Small synthesized sound effects (no audio files). Muting is remembered per browser.
import { storage } from './dom.js';

let ctx = null;
let muted = storage.getItem('yatra.muted') === '1';

function audio() {
  if (muted) return null;
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq, { at = 0, dur = 0.15, type = 'sine', vol = 0.15, slide = 0 } = {}) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + at;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noise({ at = 0, dur = 0.05, vol = 0.12, freq = 2000 } = {}) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + at;
  const buf = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = a.createBufferSource();
  src.buffer = buf;
  const filter = a.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  const gain = a.createGain();
  gain.gain.value = vol;
  src.connect(filter).connect(gain).connect(a.destination);
  src.start(t);
}

export const sound = {
  get muted() {
    return muted;
  },
  toggle() {
    muted = !muted;
    storage.setItem('yatra.muted', muted ? '1' : '0');
    return muted;
  },
  dice() {
    for (let i = 0; i < 7; i++) noise({ at: i * 0.07 + Math.random() * 0.02, dur: 0.04, freq: 1800 + Math.random() * 1500, vol: 0.18 });
  },
  step() {
    tone(520, { dur: 0.08, type: 'triangle', vol: 0.08, slide: -120 });
  },
  card() {
    noise({ dur: 0.18, freq: 900, vol: 0.08 });
    tone(330, { at: 0.02, dur: 0.25, vol: 0.05 });
  },
  pass() {
    [523, 659, 784].forEach((f, i) => tone(f, { at: i * 0.09, dur: 0.35, vol: 0.12 }));
  },
  fail() {
    tone(196, { dur: 0.35, type: 'sawtooth', vol: 0.06, slide: -80 });
    tone(147, { at: 0.12, dur: 0.4, type: 'sine', vol: 0.1 });
  },
  gain() {
    tone(880, { dur: 0.12, vol: 0.06 });
  },
  fanfare() {
    [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, { at: i * 0.12, dur: 0.5, vol: 0.1, type: 'triangle' }));
  },
  bell() {
    tone(392, { dur: 1.6, vol: 0.12 });
    tone(784, { dur: 1.2, vol: 0.05 });
    tone(1176, { dur: 0.8, vol: 0.03 });
  },
};

/*
 * Opt-in sound for the keyboard shot, synthesised with Web Audio (no files):
 * a soft mechanical "thock + click" per key press, deeper for the spacebar, in
 * a small room; an airy swell and a soft chord as the board wakes; a deep,
 * soft impact with a ringing chord when the word ignites; a whoosh as the
 * camera pulls away; and a very quiet ambient bed. Off by default; the
 * AudioContext is only created after the visitor turns it on (browsers
 * require a gesture).
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambGain: GainNode | null = null;
let noise: AudioBuffer | null = null;
let air: AudioBuffer | null = null;
let verb: ConvolverNode | null = null;
let on = false;

const ensure = () => {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  // a short buffer of white noise, reused for every click
  noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  // three seconds of noise for the swells and the whoosh
  air = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
  const a = air.getChannelData(0);
  for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1;
  // a small room: a generated impulse (decaying noise) gives every sound a short tail
  const len = Math.floor(ctx.sampleRate * 1.8);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const r = ir.getChannelData(ch); for (let i = 0; i < len; i++) r[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
  verb = ctx.createConvolver();
  verb.buffer = ir;
  const wet = ctx.createGain();
  wet.gain.value = 0.25;
  verb.connect(wet).connect(master);
  // ambient bed: two low detuned tones through a slowly breathing low-pass
  ambGain = ctx.createGain();
  ambGain.gain.value = 0;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 520;
  lp.Q.value = 0.6;
  for (const [f, type] of [[55, "sine"], [82.6, "triangle"], [110.4, "sine"]] as [number, OscillatorType][]) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = f > 100 ? 0.12 : 0.3;
    o.connect(g).connect(lp);
    o.start();
  }
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoAmt = ctx.createGain();
  lfoAmt.gain.value = 180;
  lfo.connect(lfoAmt).connect(lp.frequency);
  lfo.start();
  lp.connect(ambGain).connect(master);
  return ctx;
};

// dry to the master, plus a send to the room
const out = (n: AudioNode) => { n.connect(master!); n.connect(verb!); };
// a burst of filtered air: the filter glides through `freqs` over `dur` seconds
const swell = (c: AudioContext, t: number, dur: number, peak: number, freqs: number[], type: BiquadFilterType = "bandpass") => {
  const n = c.createBufferSource();
  n.buffer = air;
  const f = c.createBiquadFilter();
  f.type = type;
  f.Q.value = 0.8;
  freqs.forEach((hz, i) => (i ? f.frequency.exponentialRampToValueAtTime(hz, t + (dur * i) / (freqs.length - 1)) : f.frequency.setValueAtTime(hz, t)));
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + dur * 0.55);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  n.connect(f).connect(g);
  out(g);
  n.start(t);
  n.stop(t + dur + 0.05);
};
// soft sine partials that bloom and ring out
const chord = (c: AudioContext, t: number, hz: number[], peak: number, ring: number) => hz.forEach((f, i) => {
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.value = f;
  const g = c.createGain();
  const t0 = t + i * 0.1;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + ring);
  o.connect(g);
  out(g);
  o.start(t0);
  o.stop(t0 + ring + 0.05);
});

export const sound = {
  get on() { return on; },
  async enable() {
    const c = ensure();
    if (!c || !master) return;
    await c.resume();
    on = true;
    master.gain.setTargetAtTime(0.9, c.currentTime, 0.3);
  },
  disable() {
    if (!ctx || !master) return;
    on = false;
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
  },
  /** 0..1: how present the ambient bed is (it fades out away from the hero) */
  ambient(level: number) {
    if (!ctx || !ambGain) return;
    ambGain.gain.setTargetAtTime(0.05 * level, ctx.currentTime, 0.8);
  },
  click(space = false) {
    if (!on || !ctx || !master || !noise) return;
    const t = ctx.currentTime + 0.005;
    // the "thock": a short sine that drops in pitch
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(space ? 120 : 190 + Math.random() * 25, t);
    o.frequency.exponentialRampToValueAtTime(space ? 55 : 85, t + (space ? 0.09 : 0.06));
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(space ? 0.45 : 0.32, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (space ? 0.14 : 0.09));
    o.connect(g);
    out(g);
    o.start(t);
    o.stop(t + 0.16);
    // the "click": a burst of band-passed noise
    const n = ctx.createBufferSource();
    n.buffer = noise;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = (space ? 1800 : 2800) + Math.random() * 700;
    bp.Q.value = 1.1;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(space ? 0.16 : 0.22, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
    n.connect(bp).connect(ng);
    out(ng);
    n.start(t);
    n.stop(t + 0.06);
  },
  /** the big moments of the shot: "wake", "ignite", "pull" */
  cue(name: string) {
    if (!on || !ctx || !master) return;
    const c = ctx, t = c.currentTime + 0.01;
    if (name === "wake") {
      // air that follows the light across the board, then the backlight's soft open fifth
      swell(c, t, 2.4, 0.09, [300, 2600]);
      chord(c, t + 0.9, [659.25, 987.77, 1318.51], 0.03, 2.6);
    } else if (name === "ignite") {
      // a deep, soft impact; air moving with the shockwave; a bright chord ringing out
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(72, t);
      o.frequency.exponentialRampToValueAtTime(36, t + 1.2);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.5, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
      o.connect(g);
      out(g);
      o.start(t);
      o.stop(t + 2.3);
      swell(c, t, 1.1, 0.12, [900, 220], "lowpass");
      chord(c, t + 0.05, [783.99, 1174.66, 1567.98], 0.028, 3.2);
    } else if (name === "pull") {
      swell(c, t, 3, 0.07, [250, 900, 200]);
    }
  },
};

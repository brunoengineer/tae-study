export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const sameSet = (a: string[], b: string[]) =>
  a.length === b.length && a.every((x) => b.includes(x));

export const pct = (n: number, d: number) => (d === 0 ? 0 : Math.round((n / d) * 100));

export const fmtTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/* ---------- Tiny confetti (no deps) ---------- */
export function confetti(opts: { count?: number; x?: number; y?: number } = {}) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:200';
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const colors = ['#8b6cff', '#22d3ee', '#f72585', '#ffb703', '#34d399', '#ff7a59', '#a3e635'];
  const ox = opts.x ?? innerWidth / 2;
  const oy = opts.y ?? innerHeight / 3;
  const parts = Array.from({ length: opts.count ?? 140 }, () => {
    const ang = Math.random() * Math.PI * 2;
    const sp = 4 + Math.random() * 9;
    return {
      x: ox, y: oy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 6,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3, c: colors[(Math.random() * colors.length) | 0], life: 0,
    };
  });
  let frame = 0;
  const tick = () => {
    frame++;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) {
      p.vy += 0.25; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - frame / 160);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)));
      ctx.restore();
    }
    if (frame < 160) requestAnimationFrame(tick); else canvas.remove();
  };
  requestAnimationFrame(tick);
}

/* ---------- Tiny sound effects via WebAudio ---------- */
let actx: AudioContext | null = null;
export function sfx(kind: 'good' | 'bad' | 'level' | 'click') {
  try {
    if (localStorage.getItem('tae-mute') === '1') return;
    actx ??= new AudioContext();
    const notes: Record<string, number[]> = {
      good: [660, 880], bad: [220, 160], level: [523, 659, 784, 1046], click: [440],
    };
    notes[kind].forEach((f, i) => {
      const o = actx!.createOscillator();
      const g = actx!.createGain();
      o.type = kind === 'bad' ? 'sawtooth' : 'triangle';
      o.frequency.value = f;
      const t = actx!.currentTime + i * 0.09;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(kind === 'bad' ? 0.05 : 0.09, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(actx!.destination);
      o.start(t); o.stop(t + 0.2);
    });
  } catch { /* ignore */ }
}

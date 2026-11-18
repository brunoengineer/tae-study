import { useEffect, useState, type ReactNode } from 'react';
import { BADGES, levelInfo, onGameEvent, setTheme, useStore, type GameEvent } from '../lib/store';
import { confetti, sfx } from '../lib/util';
import { go } from '../lib/router';

const NAV = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/learn', icon: '📖', label: 'Learn' },
  { path: '/map', icon: '🧠', label: 'Mind Map', short: 'Map' },
  { path: '/practice', icon: '🎯', label: 'Practice' },
  { path: '/exam', icon: '🎓', label: 'Mock Exam', short: 'Exam' },
  { path: '/cards', icon: '🃏', label: 'Flashcards', short: 'Cards' },
  { path: '/arcade', icon: '🕹️', label: 'Arcade' },
  { path: '/trophies', icon: '🏆', label: 'Trophies', short: 'Awards' },
];

export function Ring({ value, size = 56, stroke = 6, color = '#8b6cff', children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--panel-2)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(0, Math.min(1, value)))} style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div className="ring-label">{children}</div>
    </div>
  );
}

function TopBar() {
  const s = useStore((s) => s);
  const lv = levelInfo(s.xp);
  const todayXp = s.daily.day === new Date().toISOString().slice(0, 10) ? s.daily.xp : 0;
  const [muted, setMuted] = useState(() => { try { return localStorage.getItem('tae-mute') === '1'; } catch { return false; } });
  return (
    <div className="topbar">
      <div className="level-badge" title={`${s.xp} XP total`}>
        <div className="level-orb">{lv.level}</div>
        <div style={{ minWidth: 0 }}>
          <div className="small" style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{lv.icon} {lv.title}</div>
          <div className="bar xpbar"><i style={{ width: `${lv.pct * 100}%` }} /></div>
          <div className="tiny faint">{lv.next ? `${lv.toNext} XP to ${lv.next.title}` : 'Max level!'}</div>
        </div>
      </div>
      <div className="spacer" />
      <div className="stat-pill" title="Daily study streak"><span className="flame">🔥</span>{s.streak.count}</div>
      <div className="row" title={`Daily goal: ${todayXp}/${s.dailyGoal} XP`} style={{ gap: 6 }}>
        <Ring value={todayXp / s.dailyGoal} size={36} stroke={4} color="#34d399"><span className="tiny">🎯</span></Ring>
      </div>
      <div className="stat-pill hide-sm" title="Total XP">⚡ {s.xp}</div>
      <button className="btn ghost sm hide-sm" title="Sound" onClick={() => { const v = !muted; setMuted(v); try { localStorage.setItem('tae-mute', v ? '1' : '0'); } catch { /* */ } }}>{muted ? '🔇' : '🔊'}</button>
      <button className="btn ghost sm" title="Theme" onClick={() => setTheme(s.theme === 'dark' ? 'light' : 'dark')}>{s.theme === 'dark' ? '🌙' : '☀️'}</button>
    </div>
  );
}

interface Toast { id: number; icon: string; title: string; body?: string }

function Effects() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [floats, setFloats] = useState<{ id: number; amount: number; x: number; y: number }[]>([]);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  useEffect(() => onGameEvent((e: GameEvent) => {
    const id = Math.random();
    if (e.type === 'toast') {
      setToasts((t) => [...t, { id, icon: e.icon, title: e.title, body: e.body }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
    } else if (e.type === 'badge') {
      const b = BADGES.find((x) => x.id === e.id)!;
      setToasts((t) => [...t, { id, icon: b.icon, title: `Badge unlocked: ${b.name}`, body: b.desc }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
      confetti({ count: 70, x: innerWidth - 160, y: innerHeight - 80 });
    } else if (e.type === 'xp') {
      setFloats((f) => [...f, { id, amount: e.amount, x: e.x ?? innerWidth - 140, y: e.y ?? 70 }]);
      setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1100);
    } else if (e.type === 'levelup') {
      setLevelUp(e.level); sfx('level'); confetti({ count: 220 });
    }
  }), []);
  return (
    <>
      <div className="toasts">
        {toasts.map((t) => (
          <div key={t.id} className="toast"><span className="t-ico">{t.icon}</span><div><b>{t.title}</b>{t.body && <span className="small muted">{t.body}</span>}</div></div>
        ))}
      </div>
      {floats.map((f) => <div key={f.id} className="xp-float" style={{ left: f.x, top: f.y }}>+{f.amount} XP</div>)}
      {levelUp && <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />}
    </>
  );
}

function LevelUpModal({ level, onClose }: { level: number; onClose: () => void }) {
  const xp = useStore((s) => s.xp);
  const lv = levelInfo(xp);
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="card modal" onClick={(e) => e.stopPropagation()}>
        <div className="kicker">Level up!</div>
        <div className="big-emoji" style={{ margin: '14px 0' }}>{lv.icon}</div>
        <h2 className="gradient-text" style={{ fontSize: 34 }}>Level {level}</h2>
        <h3 style={{ marginTop: 6 }}>{lv.title}</h3>
        <p className="muted">Your automation journey evolves. {lv.next ? `Next: ${lv.next.icon} ${lv.next.title}` : 'You reached the top. Legend!'}</p>
        <button className="btn primary lg" onClick={onClose}>Keep going 🚀</button>
      </div>
    </div>
  );
}

export function Shell({ route, children }: { route: string[]; children: ReactNode }) {
  const theme = useStore((s) => s.theme);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const cur = '/' + (route[0] ?? '');
  return (
    <div className="app">
      <nav className="sidebar">
        <div className="brand">
          <div className="brand-logo">🤖</div>
          <div><div className="brand-name">TAE Quest</div><div className="brand-sub">ISTQB CTAL-TAE v2.0</div></div>
        </div>
        {NAV.map((n) => (
          <a key={n.path} href={`#${n.path}`} className={`nav-item ${cur === n.path ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); go(n.path); }}>
            <span className="nav-ico">{n.icon}</span><span className="nav-label-text">{n.label}</span>{'short' in n && <span className="nav-label-short">{n.short}</span>}
          </a>
        ))}
        <div className="sidebar-foot">
          <div className="tiny faint" style={{ padding: '0 10px' }}>Based on the ISTQB® CTAL-TAE v2.0 syllabus & Sample Exam A v2.4. Study use only.</div>
        </div>
      </nav>
      <div className="main">
        <TopBar />
        <main className="content">{children}</main>
      </div>
      <Effects />
    </div>
  );
}

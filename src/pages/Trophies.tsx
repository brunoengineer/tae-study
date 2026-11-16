import { useRef, useState } from 'react';
import { BADGES, LEVELS, exportState, importState, levelInfo, resetAll, setDailyGoal, useStore } from '../lib/store';

export function Trophies() {
  const s = useStore((s) => s);
  const lv = levelInfo(s.xp);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const earned = BADGES.filter((b) => s.badges[b.id]).length;

  const download = () => {
    const blob = new Blob([exportState()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `tae-quest-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div>
      <h1 className="page-title">🏆 Trophy room</h1>
      <p className="page-sub">{s.xp} XP · level {lv.level} · {earned}/{BADGES.length} badges · best streak {s.streak.best} days · best combo {s.bestCombo}x</p>

      <div className="card mt2">
        <div className="section-title">🧗 Level path — from manual clicker to automation legend</div>
        <div className="row" style={{ overflowX: 'auto', gap: 0, paddingBottom: 8 }}>
          {LEVELS.map((l, i) => {
            const reached = s.xp >= l.xp;
            const current = i + 1 === lv.level;
            return (
              <div key={l.title} className="col" style={{ alignItems: 'center', minWidth: 92, gap: 4, position: 'relative' }}>
                <div style={{ width: current ? 60 : 46, height: current ? 60 : 46, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: current ? 28 : 22,
                  background: reached ? 'var(--grad)' : 'var(--panel-2)', border: '2px solid var(--border)', filter: reached ? undefined : 'grayscale(1)', opacity: reached ? 1 : 0.5,
                  boxShadow: current ? '0 0 0 5px rgba(139,108,255,.3)' : undefined, transition: 'all .3s' }}>{l.icon}</div>
                <b className="tiny center" style={{ maxWidth: 88 }}>{i + 1}. {l.title}</b>
                <span className="tiny faint">{l.xp} XP</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section-title mt2">🎖️ Badges</div>
      <div className="grid g4">
        {BADGES.map((b) => {
          const got = s.badges[b.id];
          return (
            <div key={b.id} className={`badge-tile ${got ? 'earned' : ''}`} title={b.desc}>
              <div className="b-ico">{b.icon}</div>
              <b>{b.name}</b>
              <div className="tiny muted">{b.desc}</div>
              {got && <div className="tiny" style={{ color: 'var(--warn)', marginTop: 4 }}>✓ {new Date(got).toLocaleDateString()}</div>}
            </div>
          );
        })}
      </div>

      <div className="card mt2">
        <div className="section-title">⚙️ Settings & progress</div>
        <div className="row wrap">
          <span>🎯 Daily XP goal:</span>
          <div className="pill-tabs">{[30, 60, 100, 150].map((g) => <button key={g} className={s.dailyGoal === g ? 'on' : ''} onClick={() => setDailyGoal(g)}>{g}</button>)}</div>
        </div>
        <div className="row wrap mt">
          <button className="btn" onClick={download}>💾 Export progress</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>📂 Import progress</button>
          <input ref={fileRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            try { importState(await f.text()); setMsg('✅ Progress imported'); } catch (err) { setMsg(`❌ ${(err as Error).message}`); }
          }} />
          <span className="spacer" />
          <button className="btn" style={{ borderColor: 'var(--bad)', color: 'var(--bad)' }} onClick={() => { if (confirm('Reset ALL progress (XP, badges, answers, cards)? This cannot be undone.')) resetAll(); }}>🗑️ Reset everything</button>
        </div>
        {msg && <div className="small mt">{msg}</div>}
        <div className="tiny faint mt">Progress is stored in this browser's localStorage. Export it to move between machines.</div>
      </div>
    </div>
  );
}

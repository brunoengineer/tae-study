import { useMemo, useState, type CSSProperties } from 'react';
import { sortGames, seqGames, type SortGame, type SeqGame } from '../data/games';
import { chapterById } from '../data/chapters';
import { awardXP, recordGame, useStore } from '../lib/store';
import { confetti, sfx, shuffle } from '../lib/util';
import { go } from '../lib/router';

export function Arcade({ route }: { route: string[] }) {
  const games = useStore((s) => s.games);
  const [type, id] = [route[1], route[2]];
  if (type === 'sort') { const g = sortGames.find((x) => x.id === id); if (g) return <Sorter key={g.id} g={g} />; }
  if (type === 'seq') { const g = seqGames.find((x) => x.id === id); if (g) return <Sequencer key={g.id} g={g} />; }

  const Tile = ({ kind, g }: { kind: 'sort' | 'seq'; g: SortGame | SeqGame }) => {
    const st = games[`${kind}:${g.id}`];
    const c = chapterById(g.chapter);
    return (
      <div className="card hover" style={{ cursor: 'pointer', borderTop: `4px solid ${c.color}` }} onClick={() => go(`/arcade/${kind}/${g.id}`)}>
        <div className="row"><span style={{ fontSize: 34 }}>{g.icon}</span><span className="spacer" />{st?.perfect ? <span className="chip good">⭐ perfect</span> : st ? <span className="chip">best {st.best}%</span> : <span className="chip">new</span>}</div>
        <h3 style={{ marginTop: 8 }}>{g.title}</h3>
        <div className="small muted">{c.emoji} Ch {c.id} · {g.prompt}</div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="page-title">🕹️ Arcade</h1>
      <p className="page-sub">Hands-on games that turn lists into things you <b>move around</b>. Sorting builds categories in your head; sequencing builds the flow. Perfect runs earn bonus XP and badges.</p>
      <div className="section-title mt2">🧺 Sort it</div>
      <div className="grid g3">{sortGames.map((g) => <Tile key={g.id} kind="sort" g={g} />)}</div>
      <div className="section-title mt2">🔢 Put it in order</div>
      <div className="grid g3">{seqGames.map((g) => <Tile key={g.id} kind="seq" g={g} />)}</div>
    </div>
  );
}

/* ============================ Sorter ============================ */
function Sorter({ g }: { g: SortGame }) {
  const items = useMemo(() => shuffle(g.items.map((it, i) => ({ ...it, id: i }))), [g]);
  const [placed, setPlaced] = useState<Record<number, string>>({});
  const [picked, setPicked] = useState<number | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const place = (itemId: number, bucket: string) => { setPlaced((p) => ({ ...p, [itemId]: bucket })); setPicked(null); sfx('click'); };
  const unplace = (itemId: number) => { if (checked) return; setPlaced((p) => { const n = { ...p }; delete n[itemId]; return n; }); };
  const pool = items.filter((it) => placed[it.id] === undefined);
  const correct = items.filter((it) => placed[it.id] === it.bucket).length;

  const check = () => {
    setChecked(true);
    const score = Math.round((correct / items.length) * 100);
    const perfect = correct === items.length;
    recordGame(`sort:${g.id}`, score, perfect);
    awardXP(correct * 2 + (perfect ? 20 : 0));
    if (perfect) { sfx('level'); confetti(); } else sfx('bad');
  };
  const retry = () => { setPlaced(Object.fromEntries(Object.entries(placed).filter(([k, b]) => items[items.findIndex((x) => x.id === Number(k))].bucket === b))); setChecked(false); };

  return (
    <div>
      <div className="row wrap"><button className="btn ghost sm" onClick={() => go('/arcade')}>← Arcade</button><h2>{g.icon} {g.title}</h2></div>
      <p className="muted">{g.prompt} <span className="small">Drag tokens into buckets — or tap a token, then tap a bucket.</span></p>
      <div className="sort-pool mt">
        {pool.length === 0 && !checked && <span className="muted small">All placed — hit <b>Check</b>!</span>}
        {pool.map((it) => (
          <span key={it.id} className={`token ${picked === it.id ? 'sel' : ''}`} draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', String(it.id))}
            onClick={() => setPicked(picked === it.id ? null : it.id)}>{it.text}</span>
        ))}
      </div>
      <div className="buckets mt" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${g.buckets.length > 4 ? 170 : 220}px, 1fr))` }}>
        {g.buckets.map((b) => (
          <div key={b.id} className={`bucket ${over === b.id ? 'over' : ''}`} style={{ '--c': b.color } as CSSProperties}
            onDragOver={(e) => { e.preventDefault(); setOver(b.id); }} onDragLeave={() => setOver(null)}
            onDrop={(e) => { e.preventDefault(); setOver(null); const id = Number(e.dataTransfer.getData('text/plain')); if (!Number.isNaN(id)) place(id, b.id); }}
            onClick={() => picked !== null && place(picked, b.id)}>
            <h4 style={{ color: b.color }}>{b.icon} {b.label}</h4>
            <div className="tokens">
              {items.filter((it) => placed[it.id] === b.id).map((it) => (
                <span key={it.id} className={`token ${checked ? (it.bucket === b.id ? 'ok' : 'no') : ''}`} onClick={(e) => { e.stopPropagation(); unplace(it.id); }} title={checked ? '' : 'click to remove'}>
                  {it.text}{checked && it.bucket !== b.id && <span className="tiny"> → {g.buckets.find((x) => x.id === it.bucket)!.label}</span>}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="row mt2">
        {checked && <b style={{ fontSize: 18 }}>{correct === items.length ? '🌟 Perfect!' : `✅ ${correct}/${items.length} correct`}</b>}
        <span className="spacer" />
        {!checked ? <button className="btn primary" disabled={pool.length > 0} onClick={check}>Check</button>
          : <>{correct < items.length && <button className="btn" onClick={retry}>Fix mistakes</button>}<button className="btn primary" onClick={() => go('/arcade')}>More games</button></>}
      </div>
    </div>
  );
}

/* ============================ Sequencer ============================ */
function Sequencer({ g }: { g: SeqGame }) {
  const [order, setOrder] = useState(() => {
    let o = shuffle(g.steps);
    while (o.every((x, i) => x === g.steps[i])) o = shuffle(g.steps);
    return o;
  });
  const [drag, setDrag] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length || from === to) return;
    setOrder((o) => { const n = o.slice(); const [x] = n.splice(from, 1); n.splice(to, 0, x); return n; });
  };
  const correct = order.filter((x, i) => x === g.steps[i]).length;
  const check = () => {
    setChecked(true);
    const perfect = correct === order.length;
    recordGame(`seq:${g.id}`, Math.round((correct / order.length) * 100), perfect);
    awardXP(correct * 2 + (perfect ? 15 : 0));
    if (perfect) { sfx('level'); confetti(); } else sfx('bad');
  };
  return (
    <div style={{ maxWidth: 720 }}>
      <div className="row wrap"><button className="btn ghost sm" onClick={() => go('/arcade')}>← Arcade</button><h2>{g.icon} {g.title}</h2></div>
      <p className="muted">{g.prompt} <span className="small">Drag to reorder or use the arrows.</span></p>
      <div className="col mt">
        {order.map((step, i) => (
          <div key={step} className={`seq-item ${drag === i ? 'dragging' : ''} ${checked ? (step === g.steps[i] ? 'ok' : 'no') : ''}`} draggable={!checked}
            onDragStart={() => setDrag(i)} onDragEnd={() => setDrag(null)}
            onDragOver={(e) => { e.preventDefault(); if (drag !== null && drag !== i) { move(drag, i); setDrag(i); } }}>
            <span className="num">{i + 1}</span>
            <span style={{ flex: 1 }}>{step}</span>
            {checked && step !== g.steps[i] && <span className="tiny muted">should be #{g.steps.indexOf(step) + 1}</span>}
            {!checked && <><button className="btn ghost sm" onClick={() => move(i, i - 1)}>▲</button><button className="btn ghost sm" onClick={() => move(i, i + 1)}>▼</button></>}
          </div>
        ))}
      </div>
      <div className="row mt2">
        {checked && <b style={{ fontSize: 18 }}>{correct === order.length ? '🌟 Perfect order!' : `✅ ${correct}/${order.length} in the right spot`}</b>}
        <span className="spacer" />
        {!checked ? <button className="btn primary" onClick={check}>Check order</button>
          : <>{correct < order.length && <button className="btn" onClick={() => setChecked(false)}>Try again</button>}<button className="btn primary" onClick={() => go('/arcade')}>More games</button></>}
      </div>
    </div>
  );
}

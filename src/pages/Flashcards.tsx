import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { flashcards } from '../data/flashcards';
import { chapters, chapterById } from '../data/chapters';
import { reviewCard, useStore, getState } from '../lib/store';
import { shuffle, sfx } from '../lib/util';

export function Flashcards() {
  const s = useStore((s) => s);
  const [deck, setDeck] = useState<number | 'all' | 'keywords'>('all');
  const [mode, setMode] = useState<'due' | 'all'>('due');
  const [sessionKey, setSessionKey] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(0);

  const queue = useMemo(() => {
    const st = getState();
    const now = Date.now();
    const pool = flashcards.filter((c) => deck === 'all' || (deck === 'keywords' ? c.keyword : c.chapter === deck));
    const list = mode === 'due' ? pool.filter((c) => !st.cards[c.id] || st.cards[c.id].due <= now) : pool;
    return shuffle(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, mode, sessionKey]);

  const [pos, setPos] = useState(0);
  useEffect(() => { setPos(0); setFlipped(false); setDone(0); }, [queue]);
  const card = queue[pos];

  const grade = (g: 'again' | 'hard' | 'good' | 'easy') => {
    if (!card) return;
    reviewCard(card.id, g);
    sfx(g === 'again' ? 'bad' : 'click');
    setFlipped(false);
    setDone((d) => d + 1);
    setTimeout(() => setPos((p) => p + 1), 150);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); setFlipped((f) => !f); }
      if (!flipped) return;
      if (e.key === '1') grade('again');
      if (e.key === '2') grade('hard');
      if (e.key === '3') grade('good');
      if (e.key === '4') grade('easy');
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const boxes = [0, 1, 2, 3, 4, 5].map((b) => flashcards.filter((c) => (s.cards[c.id]?.box ?? -1) === b).length);
  const newCount = flashcards.filter((c) => !s.cards[c.id]).length;
  const ch = card ? chapterById(card.chapter) : null;

  return (
    <div>
      <h1 className="page-title">🃏 Flashcards</h1>
      <p className="page-sub">Spaced repetition with Leitner boxes. Try to say the answer <b>before</b> flipping. Cards you know move to higher boxes and come back less often (1 → 2 → 4 → 8 → 16 days).</p>

      <div className="row wrap mt" style={{ gap: 6 }}>
        <button className={`chip click ${deck === 'all' ? 'on' : ''}`} onClick={() => setDeck('all')}>All ({flashcards.length})</button>
        <button className={`chip click ${deck === 'keywords' ? 'on' : ''}`} onClick={() => setDeck('keywords')}>🔑 Syllabus keywords</button>
        {chapters.map((c) => (
          <button key={c.id} className={`chip click ${deck === c.id ? 'on' : ''}`} style={deck === c.id ? { background: c.color } : undefined} onClick={() => setDeck(c.id)}>{c.emoji} {c.id}</button>
        ))}
        <span className="spacer" />
        <div className="pill-tabs"><button className={mode === 'due' ? 'on' : ''} onClick={() => setMode('due')}>Due</button><button className={mode === 'all' ? 'on' : ''} onClick={() => setMode('all')}>Cram all</button></div>
      </div>

      <div className="mt2">
        {card && ch ? (
          <>
            <div className="row" style={{ maxWidth: 640, margin: '0 auto 10px' }}>
              <span className="small muted">{pos + 1} / {queue.length}</span><span className="spacer" />
              <span className="chip" style={{ color: ch.color }}>{ch.emoji} {ch.short}</span>
              {card.keyword && <span className="chip warn">🔑 keyword</span>}
            </div>
            <div className="fc-stage">
              <div className={`fc ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((f) => !f)} style={{ '--c': ch.color } as CSSProperties}>
                <div className="fc-face fc-front">
                  <div style={{ fontSize: 56 }}>{card.icon}</div>
                  <div className="fc-term">{card.front}</div>
                  <div className="tiny muted">click or press <kbd>Space</kbd> to flip</div>
                </div>
                <div className="fc-face fc-back">
                  <div style={{ fontSize: 32 }}>{card.icon}</div>
                  <div>{card.back}</div>
                </div>
              </div>
            </div>
            <div className="row" style={{ justifyContent: 'center', marginTop: 18, gap: 8, opacity: flipped ? 1 : 0.35, pointerEvents: flipped ? 'auto' : 'none', flexWrap: 'wrap' }}>
              <button className="btn" style={{ borderColor: 'var(--bad)' }} onClick={() => grade('again')}>😵 Again <kbd>1</kbd></button>
              <button className="btn" style={{ borderColor: 'var(--warn)' }} onClick={() => grade('hard')}>😬 Hard <kbd>2</kbd></button>
              <button className="btn" style={{ borderColor: 'var(--good)' }} onClick={() => grade('good')}>🙂 Good <kbd>3</kbd></button>
              <button className="btn primary" onClick={() => grade('easy')}>😎 Easy <kbd>4</kbd></button>
            </div>
          </>
        ) : (
          <div className="card center" style={{ maxWidth: 560, margin: '0 auto', padding: 32 }}>
            <div className="big-emoji">{done ? '🎉' : '😴'}</div>
            <h2 style={{ marginTop: 12 }}>{done ? `Session done — ${done} cards reviewed!` : 'Nothing due right now'}</h2>
            <p className="muted">Come back later for due cards, or cram the whole deck.</p>
            <div className="row" style={{ justifyContent: 'center' }}>
              <button className="btn primary" onClick={() => { setMode('all'); setSessionKey((k) => k + 1); }}>🔁 Cram all cards</button>
            </div>
          </div>
        )}
      </div>

      <div className="card mt2">
        <div className="section-title">📦 Leitner boxes</div>
        <div className="leitner" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          {['🔁 Relearn', '1 day', '2 days', '4 days', '8 days', '🏆 16 days'].map((label, b) => (
            <div key={label} className="box" style={{ borderColor: b === 5 ? 'var(--good)' : b === 0 ? 'var(--bad)' : undefined }}>
              <b>{boxes[b]}</b><span className="tiny muted">{label}</span>
            </div>
          ))}
        </div>
        <div className="small muted mt">{newCount} new · {boxes[0]} to relearn · {s.cardReviews} total reviews</div>
      </div>
    </div>
  );
}

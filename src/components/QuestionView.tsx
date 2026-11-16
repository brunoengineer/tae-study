import type { Question } from '../types';
import { chapterById } from '../data/chapters';

const LETTERS = 'abcde';

export function QuestionMeta({ q }: { q: Question }) {
  const ch = chapterById(q.chapter);
  return (
    <div className="row wrap" style={{ gap: 6 }}>
      <span className="chip" style={{ color: ch.color }}>{ch.emoji} Ch {ch.id} · {ch.short}</span>
      <span className="chip">{q.lo}</span>
      <span className="chip">K{q.k}</span>
      <span className="chip">{q.points} pt{q.points > 1 ? 's' : ''}</span>
      {q.source === 'official' ? <span className="chip warn">📜 Official sample</span> : <span className="chip">🧪 Practice</span>}
    </div>
  );
}

export function QuestionView({
  q, selected, onToggle, revealed, showMeta = true,
}: {
  q: Question;
  selected: string[];
  onToggle: (key: string) => void;
  revealed: boolean;
  showMeta?: boolean;
}) {
  const multi = q.correct.length > 1;
  const listItems = q.list ?? [];
  return (
    <div>
      {showMeta && <QuestionMeta q={q} />}
      {(q.scenario || listItems.length > 0) && (
        <div className="q-scenario mt">
          {q.scenario && <div>{q.scenario}</div>}
          {listItems.length > 0 && <ul className="q-list">{listItems.map((l) => <li key={l}>{l}</li>)}</ul>}
        </div>
      )}
      <div className="q-stem" style={{ marginTop: q.scenario || listItems.length ? 0 : 14 }}>{q.stem}</div>
      <div className="small muted" style={{ marginTop: 4 }}>{multi ? `Select ${q.correct.length === 2 ? 'TWO' : q.correct.length} options.` : 'Select ONE option.'}</div>
      <div className="options">
        {q.options.map((o, i) => {
          const isSel = selected.includes(o.key);
          const isRight = q.correct.includes(o.key);
          let cls = 'opt';
          if (revealed) {
            if (isRight) cls += ' right';
            else if (isSel) cls += ' wrong';
          } else if (isSel) cls += ' picked';
          return (
            <button key={o.key} className={cls} disabled={revealed} onClick={() => onToggle(o.key)}>
              <span className="letter">{LETTERS[i]}</span>
              <span style={{ flex: 1 }}>
                {o.text}
                {revealed && (isRight || isSel) && <span className="expl">{q.explanations[o.key]}</span>}
              </span>
              {revealed && isRight && <span>✅</span>}
              {revealed && isSel && !isRight && <span>❌</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function OtherExplanations({ q, selected }: { q: Question; selected: string[] }) {
  const rest = q.options.filter((o) => !q.correct.includes(o.key) && !selected.includes(o.key));
  if (!rest.length) return null;
  return (
    <details className="mt">
      <summary className="small muted" style={{ cursor: 'pointer' }}>Why the other options are wrong</summary>
      <ul className="small" style={{ marginTop: 8 }}>
        {rest.map((o) => <li key={o.key} style={{ margin: '6px 0' }}><b>{o.text}</b> — <span className="muted">{q.explanations[o.key]}</span></li>)}
      </ul>
    </details>
  );
}

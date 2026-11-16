import { useState, type CSSProperties, type ReactNode } from 'react';

export interface Item {
  icon: string;
  title: string;
  sub?: string;
  points?: string[];
  note?: string;
  color?: string;
}

const cssVar = (c?: string) => (c ? ({ '--c': c } as CSSProperties) : undefined);

/** Blurred in recall mode until clicked */
export function Secret({ children, as = 'span' }: { children: ReactNode; as?: 'span' | 'div' | 'li' }) {
  const [shown, setShown] = useState(false);
  const Tag = as;
  return (
    <Tag className={`secret ${shown ? 'shown' : ''}`} onClick={(e) => { e.stopPropagation(); setShown(true); }}>
      {children}
    </Tag>
  );
}

function Detail({ item, color }: { item: Item; color?: string }) {
  if (!item.points?.length && !item.note) return null;
  return (
    <div className="detail" style={cssVar(item.color ?? color)} key={item.title}>
      <h4><span>{item.icon}</span> {item.title}</h4>
      {item.note && <div className="muted"><Secret>{item.note}</Secret></div>}
      {item.points && (
        <ul>
          {item.points.map((p) => <Secret as="li" key={p}>{p}</Secret>)}
        </ul>
      )}
    </div>
  );
}

function NodeBox({ item, sel, onClick, color }: { item: Item; sel: boolean; onClick: () => void; color?: string }) {
  return (
    <div className={`node ${sel ? 'sel' : ''}`} style={cssVar(item.color ?? color)} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}>
      <div className="n-ico">{item.icon}</div>
      <div>
        <div className="n-title">{item.title}</div>
        {item.sub && <div className="n-sub"><Secret>{item.sub}</Secret></div>}
      </div>
    </div>
  );
}

/** Horizontal / vertical step flow with clickable nodes */
export function Flow({ items, vertical, color, arrow = '➜', loopLabel }: { items: Item[]; vertical?: boolean; color?: string; arrow?: string; loopLabel?: string }) {
  const [sel, setSel] = useState(0);
  return (
    <div>
      <div className={`flow ${vertical ? 'vertical' : ''}`}>
        {items.map((it, i) => (
          <div key={it.title} style={{ display: 'contents' }}>
            {i > 0 && <div className="flow-arrow">{vertical ? '⬇' : arrow}</div>}
            <NodeBox item={it} sel={sel === i} onClick={() => setSel(i)} color={color} />
          </div>
        ))}
      </div>
      {loopLabel && <div className="center small muted">↺ {loopLabel}</div>}
      <Detail item={items[sel]} color={color} />
    </div>
  );
}

/** Layered stack (top → bottom) */
export function Stack({ items, color }: { items: Item[]; color?: string }) {
  const [sel, setSel] = useState(0);
  return (
    <div>
      <div className="stack">
        {items.map((it, i) => (
          <NodeBox key={it.title} item={it} sel={sel === i} onClick={() => setSel(i)} color={color} />
        ))}
      </div>
      <Detail item={items[sel]} color={color} />
    </div>
  );
}

/** Center node with satellites around it */
export function Hub({ center, items, color }: { center: Item; items: Item[]; color?: string }) {
  const [sel, setSel] = useState<number>(-1);
  const n = items.length;
  const R = 39; // % radius
  return (
    <div>
      <div className="hub" style={{ position: 'relative', width: '100%', maxWidth: 620, aspectRatio: '1.35', margin: '0 auto' }}>
        <svg viewBox="0 0 100 74" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
          {items.map((_, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            return (
              <line key={i} x1={50} y1={37} x2={50 + Math.cos(a) * R} y2={37 + Math.sin(a) * R * 0.74}
                stroke={sel === i ? (items[i].color ?? color ?? '#8b6cff') : 'rgba(150,150,200,0.35)'}
                strokeWidth={sel === i ? 0.8 : 0.4} strokeDasharray={sel === i ? '0' : '1.5 1'} />
            );
          })}
        </svg>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '28%' }}>
          <div className={`node ${sel === -1 ? 'sel' : ''}`} style={cssVar(center.color ?? color)} onClick={() => setSel(-1)}>
            <div className="n-ico" style={{ fontSize: 40 }}>{center.icon}</div>
            <div className="n-title">{center.title}</div>
          </div>
        </div>
        {items.map((it, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const left = 50 + Math.cos(a) * R;
          const top = 50 + Math.sin(a) * R * 1.0;
          return (
            <div key={it.title} style={{ position: 'absolute', left: `${left}%`, top: `${top}%`, transform: 'translate(-50%,-50%)', width: '24%' }}>
              <NodeBox item={it} sel={sel === i} onClick={() => setSel(i)} color={color} />
            </div>
          );
        })}
      </div>
      <Detail item={sel === -1 ? center : items[sel]} color={color} />
    </div>
  );
}

/** Flip cards: icon+title on front, explanation on the back */
export function FlipGrid({ items, color, min = 160 }: { items: Item[]; color?: string; min?: number }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  return (
    <div>
      <div className="icon-grid" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))` }}>
        {items.map((it, i) => (
          <div key={it.title} className={`flip ${flipped[i] ? 'flipped' : ''}`} style={{ ...cssVar(it.color ?? color), minHeight: 150 }}
            onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}>
            <div className="flip-inner">
              <div className="flip-face">
                <div style={{ fontSize: 34 }}>{it.icon}</div>
                <div className="n-title" style={{ fontWeight: 700, fontFamily: 'var(--display)', marginTop: 6 }}>{it.title}</div>
                {it.sub && <div className="tiny muted" style={{ marginTop: 4 }}>{it.sub}</div>}
              </div>
              <div className="flip-face flip-back">
                {it.note ?? it.points?.join(' • ')}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="tiny faint center mt">Tap a card to flip it. Try to say the back out loud first 🧠</div>
    </div>
  );
}

export interface VsCol { icon: string; title: string; color?: string; pros?: string[]; cons?: string[]; points?: string[]; foot?: string }
/** Side-by-side comparison columns */
export function Versus({ cols }: { cols: VsCol[] }) {
  return (
    <div className="versus" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${cols.length > 3 ? 200 : 240}px, 1fr))` }}>
      {cols.map((c) => (
        <div key={c.title} className="vs-col" style={{ borderTop: `4px solid ${c.color ?? 'var(--accent)'}` }}>
          <h4><span style={{ fontSize: 24 }}>{c.icon}</span>{c.title}</h4>
          {c.points && <ul>{c.points.map((p) => <Secret as="li" key={p}>{p}</Secret>)}</ul>}
          {c.pros && <ul>{c.pros.map((p) => <Secret as="li" key={p}><span className="pro">✚ </span>{p}</Secret>)}</ul>}
          {c.cons && <ul>{c.cons.map((p) => <Secret as="li" key={p}><span className="con">✖ </span>{p}</Secret>)}</ul>}
          {c.foot && <div className="small muted mt">{c.foot}</div>}
        </div>
      ))}
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string }[]; value: T; onChange: (t: T) => void }) {
  return (
    <div className="pill-tabs">
      {tabs.map((t) => (
        <button key={t.id} className={value === t.id ? 'on' : ''} onClick={() => onChange(t.id)}>{t.label}</button>
      ))}
    </div>
  );
}

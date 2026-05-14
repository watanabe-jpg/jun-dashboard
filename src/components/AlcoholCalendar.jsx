import React from 'react';

const DAYS = ['月','火','水','木','金','土','日'];
const SC = {
  none:  { bg:'rgba(52,211,153,0.18)',  bd:'rgba(52,211,153,0.55)',  tx:'var(--green)', lb:'✕' },
  light: { bg:'rgba(251,191,36,0.18)',  bd:'rgba(251,191,36,0.55)',  tx:'var(--amber)', lb:'△' },
  drank: { bg:'rgba(251,113,133,0.18)', bd:'rgba(251,113,133,0.55)', tx:'var(--red)',   lb:'●' },
};

// 今日の日付（動的）
const getToday = () => new Date();

export default function AlcoholCalendar({ year, month, data, onToggle }) {
  const [open, setOpen] = React.useState(false);
  const today = getToday();
  const pad = (new Date(year, month-1, 1).getDay()+6)%7;
  const dim  = new Date(year, month, 0).getDate();
  const counts = { none:0, light:0, drank:0 };
  Object.values(data).forEach(v => { if (counts[v] !== undefined) counts[v]++; });

  return (
    <div className="card" style={{ overflow:'hidden' }}>
      {/* アコーディオンヘッダー */}
      <button onClick={()=>setOpen(o=>!o)}
        style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.5rem', background:'transparent', color:'var(--text)', position:'relative' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:12, letterSpacing:'.07em', textTransform:'uppercase', fontWeight:700, fontFamily:'var(--syne)', color:'var(--text2)' }}>
            飲酒チェッカー {year}/{month}
          </span>
          <div style={{ display:'flex', gap:12, fontSize:12, fontFamily:'var(--mono)', fontWeight:500 }}>
            <span style={{ color:'var(--green)' }}>✕ {counts.none}</span>
            <span style={{ color:'var(--amber)' }}>△ {counts.light}</span>
            <span style={{ color:'var(--red)'   }}>● {counts.drank}</span>
          </div>
        </div>
        <span style={{ color:'var(--text3)', fontSize:12, transition:'transform .2s', transform: open?'rotate(180deg)':'none' }}>▼</span>
      </button>

      {/* アコーディオン本体 */}
      <div style={{ maxHeight: open ? 600 : 0, overflow:'hidden', transition:'max-height .3s ease' }}>
      <div style={{ padding:'0 1.5rem 1.25rem' }}>

      {/* 曜日ヘッダー */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:4, position:'relative' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign:'center', fontSize:11, color:'var(--text2)', fontWeight:700, fontFamily:'var(--syne)', letterSpacing:'.04em', padding:'2px 0' }}>{d}</div>
        ))}
      </div>

      {/* 日付グリッド - 高さを1/3に */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, position:'relative' }}>
        {Array.from({length:pad}).map((_,i) => <div key={`p${i}`}/>)}
        {Array.from({length:dim}).map((_,i) => {
          const d  = i+1;
          const ds = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          const dt = new Date(year, month-1, d);
          const st = data[ds] || '';
          const c  = SC[st];
          const isToday  = dt.getFullYear()===today.getFullYear() && dt.getMonth()===today.getMonth() && dt.getDate()===today.getDate();
          const isFuture = dt > today;

          return (
            <div key={d} onClick={() => !isFuture && onToggle(ds)}
              style={{
                height: 36,
                borderRadius: 7,
                border: isToday
                  ? '2px solid var(--accent)'
                  : `1px solid ${c ? c.bd : 'var(--border)'}`,
                background: c ? c.bg : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isFuture ? 'default' : 'pointer',
                opacity: isFuture ? 0.25 : 1,
                transition: 'var(--transition)',
                gap: 1,
              }}>
              <span style={{ fontSize:13, fontWeight: isToday ? 700 : 500, color: c ? c.tx : isToday ? 'var(--accent)' : 'var(--text2)', fontFamily:'var(--mono)', lineHeight:1 }}>{d}</span>
              {c && <span style={{ fontSize:8, color: c.tx, lineHeight:1 }}>{c.lb}</span>}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop:'.75rem', fontSize:11, color:'var(--text3)', position:'relative', fontFamily:'var(--sans)' }}>
        タップ → ✕なし → △軽め（1-2杯）→ ●飲んだ → 未記録
      </div>
      </div>
      </div>
    </div>
  );
}

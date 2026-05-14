import React from 'react';
import MiniChart from './MiniChart';

export default function MetricCard({ label, value, unit, delta, note, inverse, accent, chartData, chartColor }) {
  const dc = delta==null ? null
    : delta > 0 ? (inverse ? 'var(--red)' : 'var(--green)')
    : delta < 0 ? (inverse ? 'var(--green)' : 'var(--red)')
    : 'var(--text3)';
  const shadow = accent==='green' ? 'var(--glow-green)' : accent==='blue' ? 'var(--glow-blue)' : 'none';

  return (
    <div className="card" style={{ padding:'1rem 1.25rem', display:'flex', flexDirection:'column', gap: chartData ? 4 : 6, boxShadow: shadow }}>
      <span style={{ fontSize:12, color:'var(--text2)', letterSpacing:'.07em', textTransform:'uppercase', fontFamily:'var(--syne)', fontWeight:700, position:'relative' }}>{label}</span>
      <div style={{ display:'flex', alignItems:'baseline', flexWrap:'wrap', gap:4, position:'relative' }}>
        <span style={{ fontFamily:'var(--mono)', fontSize:28, fontWeight:500, color:'var(--text)', lineHeight:1, letterSpacing:'-0.02em' }}>{value ?? '—'}</span>
        {unit && <span style={{ fontSize:12, color:'var(--text2)', fontFamily:'var(--sans)' }}>{unit}</span>}
        {delta != null && (
          <span style={{ fontSize:11, color: dc, fontFamily:'var(--mono)', fontWeight:600 }}>{delta > 0 ? '+' : ''}{typeof delta === 'number' ? delta.toFixed(1) : delta}</span>
        )}
      </div>
      {chartData && chartData.length >= 2 && (
        <div style={{ marginTop:2, position:'relative' }}>
          <MiniChart data={chartData} color={chartColor || 'var(--accent)'} height={32}/>
        </div>
      )}
      {note && <span style={{ fontSize:11, color:'var(--text2)', fontFamily:'var(--sans)', position:'relative' }}>{note}</span>}
    </div>
  );
}

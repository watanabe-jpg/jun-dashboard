import React from 'react';

// SVGベースの超軽量スパークライン
export default function MiniChart({ data, color = 'var(--accent)', height = 40, showDots = false }) {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => d.value).filter(v => v != null);
  if (vals.length < 2) return null;

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const W = 100, H = height;
  const pad = 3;

  const points = vals.map((v, i) => ({
    x: pad + (i / (vals.length - 1)) * (W - pad * 2),
    y: H - pad - ((v - min) / range) * (H - pad * 2),
  }));

  const path = points.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${path} L${points.at(-1).x.toFixed(1)},${H} L${points[0].x.toFixed(1)},${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ overflow:'visible', display:'block' }}>
      <defs>
        <linearGradient id={`grad-${color.replace(/[^a-z0-9]/gi,'')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${color.replace(/[^a-z0-9]/gi,'')})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {showDots && points.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r="2" fill={color}/>
      ))}
      {/* 最後の点を強調 */}
      <circle cx={points.at(-1).x} cy={points.at(-1).y} r="3" fill={color}/>
    </svg>
  );
}

import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg4)', border:'1px solid var(--brd2)', borderRadius:8, padding:'6px 10px', fontSize:11, fontFamily:'var(--mono)' }}>
      <div style={{ color:'var(--text2)', marginBottom:3 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function BpMiniChart({ bodyComp }) {
  if (!bodyComp || bodyComp.length < 2) return null;
  const data = bodyComp.map(b => ({
    date:  b.date.slice(5),
    sys:   b.bpSys,
    dia:   b.bpDia,
  })).filter(d => d.sys);

  if (data.length < 2) return null;

  return (
    <div style={{ height: 60, marginTop: 8 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top:4, right:4, bottom:0, left:0 }}>
          <XAxis dataKey="date" tick={{ fill:'var(--text3)', fontSize:11, fontFamily:'var(--mono)' }} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
          <YAxis domain={[60, 160]} hide/>
          <Tooltip content={<Tip/>}/>
          <ReferenceLine y={130} stroke="rgba(251,191,36,0.4)" strokeDasharray="3 3"/>
          <ReferenceLine y={85}  stroke="rgba(251,191,36,0.3)" strokeDasharray="3 3"/>
          <Line type="monotone" dataKey="sys" stroke="var(--red)"   strokeWidth={1.5} dot={false} activeDot={{ r:3 }} name="収縮期"/>
          <Line type="monotone" dataKey="dia" stroke="var(--accent)" strokeWidth={1.5} dot={false} activeDot={{ r:3 }} name="拡張期"/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

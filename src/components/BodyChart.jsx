import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';

const TABS = ['体重・体脂肪', '骨格筋', '血圧'];

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg4)', border:'1px solid var(--brd2)', borderRadius:8, padding:'8px 12px', fontSize:12, fontFamily:'var(--mono)' }}>
      <div style={{ color:'var(--text2)', marginBottom:4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color:p.color, marginBottom:2 }}>
          {p.name}: <span style={{ color:'var(--text)' }}>{p.value != null ? Number(p.value).toFixed(1) : '—'}{p.unit||''}</span>
        </div>
      ))}
    </div>
  );
};

const ax = { fill:'var(--text2)', fontSize:12, fontFamily:'var(--mono)' };

export default function BodyChart({ bodyComp }) {
  const [tab, setTab] = useState(0);
  const [range, setRange] = useState('all');

  const filtered = useMemo(() => {
    if (!bodyComp || bodyComp.length === 0) return [];
    if (range === 'month') {
      const latest = bodyComp.at(-1)?.date?.slice(0, 7);
      return bodyComp.filter(b => b.date?.startsWith(latest));
    } else if (range === 'year') {
      const latest = bodyComp.at(-1)?.date?.slice(0, 4);
      return bodyComp.filter(b => b.date?.startsWith(latest));
    }
    return bodyComp;
  }, [bodyComp, range]);

  const data = [...filtered].sort((a,b)=>a.date.localeCompare(b.date)).map(b => ({
    date:    b.date?.slice(5),
    weight:  b.weight,
    fat:     b.fatPct,
    muscle:  b.musclePct,
    bpSys:   b.bpSys,
    bpDia:   b.bpDia,
  }));

  if (data.length === 0) return null;

  return (
    <div className="card" style={{ padding:'1rem 0.5rem', marginTop:'1rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', flexWrap:'wrap', gap:8, position:'relative' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ fontSize:12, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--text3)', fontWeight:600, fontFamily:'var(--syne)' }}>体組成・血圧 推移</span>
          <div style={{ display:'flex', gap:3 }}>
            {[['month','月'],['year','年'],['all','全期間']].map(([v,l])=>(
              <button key={v} onClick={()=>setRange(v)} style={{ fontSize:11, padding:'3px 10px', borderRadius:99, border:`1px solid ${range===v?'#a855f7':'var(--border)'}`, background:range===v?'rgba(168,85,247,0.15)':'transparent', color:range===v?'#a855f7':'var(--text3)', fontFamily:'var(--sans)', fontWeight:500, transition:'var(--transition)' }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {TABS.map((t,i)=>(
            <button key={t} onClick={()=>setTab(i)} style={{ fontSize:11, padding:'4px 12px', borderRadius:99, border:`1px solid ${tab===i?'var(--green)':'var(--border)'}`, background:tab===i?'rgba(52,211,153,0.15)':'transparent', color:tab===i?'var(--green)':'var(--text3)', fontFamily:'var(--sans)', fontWeight:500, transition:'var(--transition)' }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ height:380, position:'relative', overflow:'visible' }}>
        {tab === 0 && (
          <ResponsiveContainer width="100%" height="105%">
            <LineChart data={data} margin={{ top:20, right:16, bottom:28, left:0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="date" tick={ax} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={40} dy={8} padding={{ left:10, right:10 }}/>
              <YAxis yAxisId="l" domain={[68,82]} tick={ax} tickLine={false} axisLine={false} unit="kg" width={44}/>
              <YAxis yAxisId="r" orientation="right" domain={[18,28]} tick={ax} tickLine={false} axisLine={false} unit="%" width={36}/>
              <Tooltip content={<Tip/>}/>
              <Legend wrapperStyle={{ fontSize:11, color:'var(--text2)', fontFamily:'var(--mono)', paddingTop:4 }}/>
              <ReferenceLine yAxisId="l" y={70} stroke="rgba(59,130,246,0.4)" strokeDasharray="4 3" label={{ value:'目標70kg', fill:'var(--accent)', fontSize:10 }}/>
              <Line yAxisId="l" type="monotone" dataKey="weight" stroke="var(--accent)" strokeWidth={2} dot={{ r:4, fill:'var(--accent)' }} activeDot={{ r:5 }} name="体重" unit="kg"/>
              <Line yAxisId="r" type="monotone" dataKey="fat"    stroke="var(--amber)"  strokeWidth={2} dot={{ r:4, fill:'var(--amber)' }}  activeDot={{ r:5 }} name="体脂肪率" unit="%"/>
            </LineChart>
          </ResponsiveContainer>
        )}
        {tab === 1 && (
          <ResponsiveContainer width="100%" height="105%">
            <LineChart data={data} margin={{ top:20, right:16, bottom:28, left:0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="date" tick={ax} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={40} dy={8} padding={{ left:10, right:10 }}/>
              <YAxis domain={[28,38]} tick={ax} tickLine={false} axisLine={false} unit="%" width={36}/>
              <Tooltip content={<Tip/>}/>
              <ReferenceLine y={33} stroke="rgba(52,211,153,0.4)" strokeDasharray="4 3" label={{ value:'目標33%', fill:'var(--green)', fontSize:10 }}/>
              <Line type="monotone" dataKey="muscle" stroke="var(--green)" strokeWidth={2} dot={{ r:4, fill:'var(--green)' }} activeDot={{ r:5 }} name="骨格筋率" unit="%"/>
            </LineChart>
          </ResponsiveContainer>
        )}
        {tab === 2 && (
          <ResponsiveContainer width="100%" height="105%">
            <LineChart data={data} margin={{ top:20, right:16, bottom:28, left:0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="date" tick={ax} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={40} dy={8} padding={{ left:10, right:10 }}/>
              <YAxis domain={[60,160]} tick={ax} tickLine={false} axisLine={false} unit=" mmHg" width={48}/>
              <Tooltip content={<Tip/>}/>
              <ReferenceLine y={130} stroke="rgba(251,191,36,0.4)" strokeDasharray="4 3" label={{ value:'130', fill:'var(--amber)', fontSize:10 }}/>
              <ReferenceLine y={85}  stroke="rgba(251,191,36,0.3)" strokeDasharray="4 3" label={{ value:'85',  fill:'var(--amber)', fontSize:10 }}/>
              <Legend wrapperStyle={{ fontSize:11, color:'var(--text2)', fontFamily:'var(--mono)', paddingTop:4 }}/>
              <Line type="monotone" dataKey="bpSys" stroke="var(--red)"    strokeWidth={2} dot={{ r:4, fill:'var(--red)'    }} activeDot={{ r:5 }} name="収縮期" unit="mmHg"/>
              <Line type="monotone" dataKey="bpDia" stroke="var(--accent)" strokeWidth={2} dot={{ r:4, fill:'var(--accent)' }} activeDot={{ r:5 }} name="拡張期" unit="mmHg"/>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Area, AreaChart, ComposedChart } from 'recharts';

const TABS = ['速度・HR','Zone分布','ケイデンス','FTP・パワー'];
const ax = { fill:'var(--text2)', fontSize:12, fontFamily:'var(--mono)' };

const Tip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:'var(--bg4)', backdropFilter:'blur(16px)', border:'1px solid var(--brd2)', borderRadius:12, padding:'10px 14px', fontSize:12, fontFamily:'var(--mono)' }}>
      <div style={{ color:'var(--text2)', marginBottom:6, fontSize:11 }}>{label}</div>
      {payload.map(p=><div key={p.dataKey} style={{ color:p.color, marginBottom:2 }}>{p.name} <span style={{ color:'var(--text)' }}>{p.value!=null?Number(p.value).toFixed(1):'—'}{p.unit||''}</span></div>)}
    </div>
  );
};

export default function RideChart({ rides, viewYear, viewMonth }) {
  const [timeRange, setTimeRange] = React.useState('month'); // month | year | all
  const [tab, setTab] = useState(0);
  // 表示範囲フィルタリング
  const filtered = React.useMemo(() => {
    if (timeRange === 'month' && viewYear && viewMonth) {
      const f = rides.filter(r => r.date.startsWith(`${viewYear}-${String(viewMonth).padStart(2,'0')}`));
      return f.length > 0 ? f : rides.slice(-20);
    } else if (timeRange === 'year' && viewYear) {
      const f = rides.filter(r => r.date.startsWith(`${viewYear}`));
      return f.length > 0 ? f : rides.slice(-50);
    } else {
      return rides; // 全期間
    }
  }, [rides, viewYear, viewMonth, timeRange]);
  const data = [...filtered].sort((a,b)=>a.date.localeCompare(b.date)).map(r => ({ date: timeRange === 'all' ? r.date.slice(0,7) : r.date.slice(5), speed:r.avgSpeed, hr:r.avgHR, z2:r.z2, z3:r.z3, cad:r.cadence, ftp:r.ftpEstimate, power:r.lapAvgPower }));

  return (
    <div style={{ background:'var(--glass)', backdropFilter:'blur(12px)', border:'1px solid var(--border)', borderRadius:'var(--rl)', padding:'1rem 0.5rem', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, var(--glassbr) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', flexWrap:'wrap', gap:8, position:'relative' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ fontSize:12, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--text3)', fontWeight:600, fontFamily:'var(--syne)' }}>走力推移</span>
          <div style={{ display:'flex', gap:3 }}>
            {[['month','月'],['year','年'],['all','全期間']].map(([v,l])=>(
              <button key={v} onClick={()=>setTimeRange(v)} style={{ fontSize:11, padding:'3px 10px', borderRadius:99, border:`1px solid ${timeRange===v?'#a855f7':'var(--border)'}`, background:timeRange===v?'rgba(168,85,247,0.15)':'transparent', color:timeRange===v?'#a855f7':'var(--text3)', fontFamily:'var(--sans)', fontWeight:500, transition:'var(--transition)' }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {TABS.map((t,i)=>(
            <button key={t} onClick={()=>setTab(i)} style={{ fontSize:11, padding:'4px 12px', borderRadius:99, border:`1px solid ${tab===i?'var(--accent)':'var(--border)'}`, background:tab===i?'rgba(59,130,246,0.15)':'transparent', color:tab===i?'var(--accent)':'var(--text3)', fontFamily:'var(--sans)', fontWeight:500, transition:'var(--transition)' }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ height:420, position:'relative', overflow:'visible' }}>
        {tab===0&&(
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top:24, right:16, bottom:32, left:0 }}>
              <defs>
                <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill:'var(--text2)', fontSize:12, fontFamily:'var(--mono)' }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={40} dy={8} padding={{ left:10, right:10 }} />
              <YAxis yAxisId="l" domain={[22,30]} tick={{ fill:'var(--text2)', fontSize:11, fontFamily:'var(--mono)' }} tickLine={false} axisLine={false} unit=" km/h" width={52} />
              <YAxis yAxisId="r" orientation="right" domain={[60,182]} tick={{ fill:'var(--text2)', fontSize:11, fontFamily:'var(--mono)' }} tickLine={false} axisLine={false} unit=" bpm" width={52} />
              <Tooltip content={<Tip/>} />
              <Area yAxisId="l" type="monotone" dataKey="speed" stroke="#3b82f6" strokeWidth={2} fill="url(#speedGrad)" name="速度" unit="km/h" dot={false} activeDot={{ r:5, fill:'#3b82f6' }} />
              <Line yAxisId="r" type="monotone" dataKey="hr" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 3" dot={false} activeDot={{ r:4, fill:'#f43f5e' }} name="HR" unit="bpm" />
            </ComposedChart>
          </ResponsiveContainer>
        )}
        {tab===1&&(
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={2}>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={50}
                tick={({x, y, payload, index, visibleTicksCount}) => {
                  // 最後のticksは右軸と重なるので非表示
                  const isLast = index === visibleTicksCount - 1;
                  return isLast ? <g/> : (
                    <text x={x} y={y+12} textAnchor="middle" fill="var(--text2)" fontSize={12} fontFamily="var(--mono)">{payload.value}</text>
                  );
                }}
              />
              <YAxis tick={ax} tickLine={false} axisLine={false} unit="%" domain={[0,80]} />
              <Tooltip content={<Tip/>} />
              <Legend wrapperStyle={{ fontSize:11, color:'var(--text2)', fontFamily:'var(--mono)', paddingTop:8 }} />
              <Bar dataKey="z2" fill="#10b981" name="Zone 2" radius={[4,4,0,0]} opacity={0.8} maxBarSize={20} />
              <Bar dataKey="z3" fill="#f59e0b" name="Zone 3" radius={[4,4,0,0]} opacity={0.8} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        )}
        {tab===2&&(
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="cadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={50}
                tick={({x, y, payload, index, visibleTicksCount}) => {
                  // 最後のticksは右軸と重なるので非表示
                  const isLast = index === visibleTicksCount - 1;
                  return isLast ? <g/> : (
                    <text x={x} y={y+12} textAnchor="middle" fill="var(--text2)" fontSize={12} fontFamily="var(--mono)">{payload.value}</text>
                  );
                }}
              />
              <YAxis tick={ax} tickLine={false} axisLine={false} unit=" rpm" domain={[70,110]} />
              <Tooltip content={<Tip/>} />
              <ReferenceLine y={95} stroke="rgba(168,85,247,0.5)" strokeDasharray="4 3" label={{ value:'目標 95rpm', fill:'#a855f7', fontSize:10, fontFamily:'var(--mono)' }} />
              <Area type="monotone" dataKey="cad" stroke="#a855f7" strokeWidth={2} fill="url(#cadGrad)" name="CAD" unit="rpm" dot={false} activeDot={{ r:5, fill:'#a855f7' }} connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        )}
        {tab===3&&(
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="ftpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={50}
                tick={({x, y, payload, index, visibleTicksCount}) => {
                  // 最後のticksは右軸と重なるので非表示
                  const isLast = index === visibleTicksCount - 1;
                  return isLast ? <g/> : (
                    <text x={x} y={y+12} textAnchor="middle" fill="var(--text2)" fontSize={12} fontFamily="var(--mono)">{payload.value}</text>
                  );
                }}
              />
              <YAxis tick={ax} tickLine={false} axisLine={false} unit="W" domain={[60,220]} />
              <Tooltip content={<Tip/>} />
              <ReferenceLine y={170} stroke="rgba(245,158,11,0.4)" strokeDasharray="4 3" label={{ value:'FTP基準 170W', fill:'#f59e0b', fontSize:10 }} />
              <Area type="monotone" dataKey="ftp" stroke="#f59e0b" strokeWidth={2} fill="url(#ftpGrad)" name="FTP推定" unit="W" dot={false} activeDot={{ r:5 }} />
              <Line type="monotone" dataKey="power" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 3" dot={false} activeDot={{ r:4 }} name="ラップパワー" unit="W" />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

import React from 'react';

function getMilestones(state) {
  const today = new Date();
  const rides  = state?.rides  || [];
  const bodies = state?.bodyComp || [];

  const latestRide = rides.at(-1);
  const latestBody = bodies.at(-1);
  const recentZ2avg = rides.length
    ? Math.round(rides.slice(-5).reduce((s,r)=>s+(r.z2||0),0) / Math.min(5, rides.length))
    : 0;
  const latestCad = latestRide?.cadence || 0;
  const latestWeight = latestBody?.weight || 999;
  const latestBpSys  = latestBody?.bpSys  || 999;
  const latestBpDia  = latestBody?.bpDia  || 999;
  const latestSpeed  = latestRide?.avgSpeed || 0;

  return [
    {
      id: 1, date:'5/10〜5/24', note:'← 今ここ',
      label:'Week 1-2：Zone 2比率50%以上を安定させる',
      progress: Math.min(100, Math.round((recentZ2avg / 50) * 100)),
      done: recentZ2avg >= 50,
    },
    {
      id: 2, date:'5/25〜5/31',
      label:'Week 3：体重76.4kg・ケイデンス90rpm以上',
      progress: Math.min(100, Math.round(
        ((Math.max(0, 77.4 - latestWeight) / (77.4 - 76.4)) * 50) +
        (latestCad >= 90 ? 50 : (latestCad / 90) * 50)
      )),
      done: latestWeight <= 76.4 && latestCad >= 90,
    },
    {
      id: 3, date:'6/1〜6/10',
      label:'Week 4：血圧135/90以下・体重75.4kg',
      progress: Math.min(100, Math.round(
        ((latestBpSys <= 135 && latestBpDia <= 90 ? 50 : Math.max(0,(160-latestBpSys)/25*50))) +
        (latestWeight <= 75.4 ? 50 : Math.max(0, (77.4-latestWeight)/(77.4-75.4)*50))
      )),
      done: latestBpSys <= 135 && latestBpDia <= 90 && latestWeight <= 75.4,
    },
    {
      id: 4, date:'2026/06/10',
      label:'第1チェック：全指標レビュー・次月計画改訂',
      progress: Math.min(100, Math.round(Math.max(0,(today - new Date('2026-05-10'))/(new Date('2026-06-10')-new Date('2026-05-10')))*100)),
      done: today >= new Date('2026-06-10'),
    },
    {
      id: 5, date:'2026/08/10',
      label:'3ヶ月目標：体重75kg以下・巡航28km/h以上',
      progress: Math.min(100, Math.round(
        (Math.max(0,(77.4-latestWeight)/(77.4-75.0)*50)) +
        (latestSpeed >= 28 ? 50 : Math.max(0,(latestSpeed-24)/4*50))
      )),
      done: latestWeight <= 75 && latestSpeed >= 28,
    },
  ];
}

function ProgressBar({ value, done }) {
  const color = done ? 'var(--green)' : value > 60 ? 'var(--accent)' : 'var(--text3)';
  return (
    <div style={{ marginTop:6 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
        <span style={{ fontSize:10, color:'var(--text3)', fontFamily:'var(--mono)' }}>{value}%</span>
        {done && <span style={{ fontSize:10, color:'var(--green)', fontFamily:'var(--mono)', fontWeight:600 }}>✓ 達成</span>}
      </div>
      <div style={{ height:4, background:'var(--bg4)', borderRadius:99, overflow:'hidden' }}>
        <div style={{ width:`${value}%`, height:'100%', background: color, borderRadius:99, transition:'width .5s ease' }}/>
      </div>
    </div>
  );
}

export default function Milestones({ state }) {
  const milestones = getMilestones(state);
  const COLORS = { done:'var(--green)', active:'var(--accent)', pending:'var(--text3)' };
  const GLOW   = { done:'0 0 10px rgba(52,211,153,0.5)', active:'0 0 10px rgba(91,156,246,0.5)', pending:'none' };

  return (
    <div className="card" style={{ padding:'1.5rem' }}>
      <span style={{ fontSize:12, letterSpacing:'.07em', textTransform:'uppercase', color:'var(--text2)', fontWeight:700, fontFamily:'var(--syne)', display:'block', marginBottom:'1.25rem', position:'relative' }}>
        マイルストーン
      </span>
      {milestones.map((ms, i) => {
        const status = ms.done ? 'done' : i === 0 ? 'active' : 'pending';
        return (
          <div key={ms.id} style={{ display:'flex', gap:14, position:'relative' }}>
            {i < milestones.length-1 && (
              <div style={{ position:'absolute', left:5, top:18, bottom:-4, width:1, background:'var(--border)' }}/>
            )}
            <div style={{ width:11, height:11, borderRadius:'50%', background: COLORS[status], boxShadow: GLOW[status], border:`1px solid ${COLORS[status]}`, flexShrink:0, marginTop:5, position:'relative' }}/>
            <div style={{ paddingBottom:'1.1rem', flex:1, position:'relative' }}>
              <div style={{ fontSize:13, color: status==='pending' ? 'var(--text2)' : 'var(--text)', lineHeight:1.5, fontFamily:'var(--sans)' }}>
                {ms.label}
                {ms.note && <span style={{ fontSize:11, color:'var(--accent)', fontFamily:'var(--mono)', marginLeft:8 }}>{ms.note}</span>}
              </div>
              <div style={{ fontSize:11, color:'var(--text3)', fontFamily:'var(--mono)', marginTop:2 }}>{ms.date}</div>
              <ProgressBar value={ms.progress} done={ms.done}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

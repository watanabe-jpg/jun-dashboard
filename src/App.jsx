import React, { useState, useCallback, useRef } from 'react';
import MetricCard from './components/MetricCard';
import RideChart from './components/RideChart';
import AlcoholCalendar from './components/AlcoholCalendar';
import ActivityCalendar from './components/ActivityCalendar';
import BpMiniChart from './components/BpMiniChart';
import BodyChart from './components/BodyChart';
import LogAnalyzer from './components/LogAnalyzer';
import Milestones from './components/Milestones';
import { loadState, saveState, cycleAlcohol, latestRide, latestBody, prevBody } from './lib/store';

const START = new Date('2026-05-10');

function ThemeToggle({ theme, setTheme }) {
  return (
    <button onClick={()=>setTheme(t=>{const n=t==='dark'?'light':'dark';localStorage.setItem('jun_theme',n);document.documentElement.setAttribute('data-theme',n);return n;})}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', width:32, height:32, borderRadius:99, background:'var(--bg4)', border:'1px solid var(--border)', color:'var(--text2)', fontSize:16, transition:'var(--transition)', cursor:'pointer', flexShrink:0 }}>
      <span>{theme==='dark'?'☀️':'🌙'}</span>
    </button>
  );
}

const SL = ({children, color}) => (
  <div style={{ fontSize:11, letterSpacing:'.07em', textTransform:'uppercase', color:'var(--text2)', fontWeight:700, fontFamily:'var(--syne)', display:'flex', alignItems:'center', gap:8 }}>
    <div style={{ width:3, height:14, background:color||'var(--accent)', borderRadius:2, flexShrink:0 }}/>
    {children}
  </div>
);

function Section({ id, label, labelColor, children, onDragStart, onDragOver, onDrop, isDragging }) {
  return (
    <div draggable onDragStart={e=>onDragStart(e,id)} onDragOver={e=>onDragOver(e,id)} onDrop={e=>onDrop(e,id)}
      style={{ marginBottom:'2.5rem', opacity:isDragging?0.35:1, transition:'opacity .15s' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'.875rem' }}>
        <span style={{ cursor:'grab', color:'var(--text3)', fontSize:15, userSelect:'none' }} title="ドラッグで並び替え">⠿</span>
        <SL color={labelColor}>{label}</SL>
      </div>
      {children}
    </div>
  );
}

// デフォルト順序（⑥.5 の要望通り）
const DEFAULT_ORDER = ['analyzer','ride','calendar','body','alcohol','milestones'];

export default function App() {
  const [state,    setState]    = useState(()=>loadState());
  const [theme,    setTheme]    = useState(()=>{const t=localStorage.getItem('jun_theme')||'dark';document.documentElement.setAttribute('data-theme',t);return t;});
  const [order,    setOrder]    = useState(()=>{try{return JSON.parse(localStorage.getItem('jun_order'))||DEFAULT_ORDER;}catch{return DEFAULT_ORDER;}});
  const [dragging, setDragging] = useState(null);
  const dragItem   = useRef(null);

  // カレンダー・グラフ共通の表示月
  const [viewYear,  setViewYear]  = useState(2026);
  const [viewMonth, setViewMonth] = useState(5);

  const prevMonth = useCallback(()=>{ if(viewMonth===1){setViewYear(y=>y-1);setViewMonth(12);}else setViewMonth(m=>m-1); },[viewMonth]);
  const nextMonth = useCallback(()=>{
    const now = new Date();
    const ny = viewMonth===12 ? viewYear+1 : viewYear;
    const nm = viewMonth===12 ? 1 : viewMonth+1;
    // 今月より先には進めない
    if(ny > now.getFullYear() || (ny === now.getFullYear() && nm > now.getMonth()+1)) return;
    if(viewMonth===12){setViewYear(y=>y+1);setViewMonth(1);}else setViewMonth(m=>m+1);
  },[viewMonth, viewYear]);

  const update = useCallback(s=>{setState(s);saveState(s);},[]);
  const handleSaveNote = useCallback((date,note)=>{ update({...state,notes:{...(state.notes||{}),[date]:note}}); },[state,update]);

  const hds = (e,id)=>{dragItem.current=id;setDragging(id);e.dataTransfer.effectAllowed='move';};
  const hdo = (e)=>e.preventDefault();
  const hdrop = (e,id)=>{
    e.preventDefault();
    if(!dragItem.current||dragItem.current===id){setDragging(null);return;}
    const o=[...order];
    const fi=o.indexOf(dragItem.current),ti=o.indexOf(id);
    o.splice(fi,1);o.splice(ti,0,dragItem.current);
    setOrder(o);localStorage.setItem('jun_order',JSON.stringify(o));
    dragItem.current=null;setDragging(null);
  };

  const ride = latestRide(state);
  const body = latestBody(state);
  const prev = prevBody(state);

  const today = new Date();
  const dayN  = Math.max(1, Math.floor((today-START)/86400000)+1);
  const totalKm = state.rides.reduce((s,r)=>s+(r.distance||0),0);
  const avgZ2   = state.rides.length ? Math.round(state.rides.slice(-5).reduce((s,r)=>s+(r.z2||0),0)/Math.min(5,state.rides.length)) : 0;

  const bpS = body
    ? body.bpSys>=140||body.bpDia>=90?{label:'要注意',color:'var(--red)',glow:'rgba(251,113,133,0.2)'}
    : body.bpSys>=130||body.bpDia>=85?{label:'注意',color:'var(--amber)',glow:'rgba(251,191,36,0.2)'}
    : {label:'良好',color:'var(--green)',glow:'rgba(52,211,153,0.2)'}
    : null;

  // ミニチャート用データ
  const weightChart  = state.bodyComp.map(b=>({date:b.date, value:b.weight}));
  const fatChart     = state.bodyComp.map(b=>({date:b.date, value:b.fatPct}));
  const muscleChart  = state.bodyComp.map(b=>({date:b.date, value:b.musclePct}));

  const sp = id=>({id, onDragStart:hds, onDragOver:hdo, onDrop:hdrop, isDragging:dragging===id});

  const sections = {
    analyzer: (
      <Section key="analyzer" label="ログ入力" {...sp('analyzer')}>
        <LogAnalyzer state={state} onUpdate={update}/>
      </Section>
    ),
    ride: (
      <Section key="ride" label={`最新ライド — ${ride?.date||'—'}`} {...sp('ride')}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:'1rem' }}>
          <MetricCard label="距離" value={ride?.distance?.toFixed(1)} unit="km" accent="blue"/>
          <MetricCard label="平均速度" value={ride?.avgSpeed?.toFixed(1)} unit="km/h"
            delta={state.rides.length>=2?+(ride?.avgSpeed-state.rides.at(-2)?.avgSpeed).toFixed(1):null}/>
          <MetricCard label="平均心拍" value={ride?.avgHR} unit="bpm"
            delta={state.rides.length>=2?+(ride?.avgHR-state.rides.at(-2)?.avgHR).toFixed(0):null} inverse/>
          <MetricCard label="Zone 2" value={ride?.z2} unit="%" note="目標 50%以上"/>
          <MetricCard label="ケイデンス" value={ride?.cadence} unit="rpm" note="目標 95-105"/>
          <MetricCard label="FTP推定" value={ride?.ftpEstimate} unit="W" note="基準 170W"/>
        </div>
      </Section>
    ),
    calendar: (
      <Section key="calendar" label="アクティビティカレンダー＆走力推移" labelColor="var(--purple)" {...sp('calendar')}>
        <ActivityCalendar
          state={state}
          onSaveNote={handleSaveNote}
          viewYear={viewYear} viewMonth={viewMonth}
          onPrevMonth={prevMonth} onNextMonth={nextMonth}
        />
        <div style={{ marginTop:'1rem' }}>
          <RideChart rides={state.rides} viewYear={viewYear} viewMonth={viewMonth}/>
        </div>
      </Section>
    ),
    body: (
      <Section key="body" label={`体組成・血圧 — ${body?.date||'—'}`} labelColor="var(--green)" {...sp('body')}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:'1rem' }}>
          <MetricCard label="体重" value={body?.weight?.toFixed(1)} unit="kg"
            delta={prev?+(body.weight-prev.weight).toFixed(1):null} inverse note="目標 70.0kg"
            accent="green" chartData={weightChart} chartColor="var(--accent)"/>
          <MetricCard label="体脂肪率" value={body?.fatPct?.toFixed(1)} unit="%"
            delta={prev?+(body.fatPct-prev.fatPct).toFixed(1):null} inverse note="目標 20%以下"
            chartData={fatChart} chartColor="var(--amber)"/>
          <MetricCard label="骨格筋率" value={body?.musclePct?.toFixed(1)} unit="%"
            delta={prev?+(body.musclePct-prev.musclePct).toFixed(1):null} note="目標 33%以上"
            chartData={muscleChart} chartColor="var(--green)"/>
        </div>
        <BodyChart bodyComp={state.bodyComp}/>
        {/* 血圧カード */}
        <div className="card" style={{ padding:'1.25rem 1.5rem', marginTop:'1rem', boxShadow:bpS?`0 0 30px ${bpS.glow}`:'none', border:`1px solid ${bpS?.color||'var(--border)'}35` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', marginBottom:4 }}>
            <div>
              <div style={{ fontSize:11, color:'var(--text2)', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:5, fontFamily:'var(--syne)', fontWeight:700 }}>血圧</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
                <span style={{ fontFamily:'var(--mono)', fontSize:30, color:'var(--text)', letterSpacing:'-0.02em', fontWeight:500 }}>{body?.bpSys||'—'}</span>
                <span style={{ color:'var(--text3)', fontFamily:'var(--mono)', fontSize:18 }}>/</span>
                <span style={{ fontFamily:'var(--mono)', fontSize:30, color:'var(--text)', letterSpacing:'-0.02em', fontWeight:500 }}>{body?.bpDia||'—'}</span>
                <span style={{ fontSize:12, color:'var(--text2)', marginLeft:4 }}>mmHg</span>
              </div>
            </div>
            {bpS && <div style={{ padding:'5px 14px', borderRadius:99, fontSize:12, fontWeight:700, background:`${bpS.color}20`, color:bpS.color, border:`1px solid ${bpS.color}45`, fontFamily:'var(--syne)', position:'relative', flexShrink:0 }}>{bpS.label}</div>}
          </div>
          <BpMiniChart bodyComp={state.bodyComp}/>
        </div>
      </Section>
    ),
    alcohol: (
      <Section key="alcohol" label="飲酒ログ" labelColor="var(--amber)" {...sp('alcohol')}>
        <AlcoholCalendar year={2026} month={5} data={state.alcohol} onToggle={date=>update(cycleAlcohol(state,date))}/>
      </Section>
    ),
    milestones: (
      <Section key="milestones" label="1ヶ月計画" labelColor="var(--accent2)" {...sp('milestones')}>
        <Milestones state={state}/>
      </Section>
    ),
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', transition:'background .3s' }}>
      <header style={{ borderBottom:'1px solid var(--border)', padding:'0 2rem', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--bg2)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100, height:'auto', minHeight:56, flexWrap:'wrap', gap:8, paddingTop:8, paddingBottom:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ fontFamily:'var(--syne)', fontSize:19, fontWeight:800, color:'var(--text)', letterSpacing:'-.02em' }}>
            JUN<span style={{ color:'var(--accent)' }}>.</span>
          </div>
          <div style={{ width:1, height:20, background:'var(--border)' }}/>
          <div style={{ fontSize:12, color:'var(--text3)', fontFamily:'var(--sans)', fontWeight:500 }}>FITNESS DASHBOARD</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ display:'flex', gap:18, fontSize:12, fontFamily:'var(--mono)' }}>
            <span style={{ color:'var(--text2)' }}>総走行 <span style={{ color:'var(--accent)', fontWeight:600 }}>{totalKm.toFixed(0)}</span>km</span>
            <span style={{ color:'var(--text2)' }}>直近Z2 <span style={{ color:'var(--green)', fontWeight:600 }}>{avgZ2}</span>%</span>
            <span style={{ color:'var(--text2)' }}>DAY <span style={{ color:'var(--text)', fontWeight:600 }}>{dayN}</span>/31</span>
          </div>
          <div style={{ width:80, height:3, background:'var(--bg4)', borderRadius:99, overflow:'hidden' }}>
            <div style={{ width:`${(dayN/31)*100}%`, height:'100%', background:'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius:99 }}/>
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme}/>
        </div>
      </header>

      <main style={{ maxWidth:1200, margin:'0 auto', padding:'1.5rem 1rem 4rem' }}>
        <div style={{ fontSize:11, color:'var(--text3)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:6 }}>
          <span>⠿</span> セクションはドラッグで並び替え可能
        </div>
        {order.map(id=>sections[id]).filter(Boolean)}
      </main>
    </div>
  );
}

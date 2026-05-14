import React, { useState, useRef } from 'react';

const DAYS_SHORT = ['月','火','水','木','金','土','日'];
const ALC_COLOR  = { none:'var(--green)', light:'var(--amber)', drank:'var(--red)' };
const ALC_LABEL  = { none:'飲まず', light:'軽め（1-2杯）', drank:'飲んだ' };

function BpBlock({ bpSys, bpDia }) {
  if (!bpSys) return null;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const s = bpSys >= 140 || bpDia >= 90
    ? { bg:'rgba(251,113,133,0.18)', bd:'rgba(251,113,133,0.5)', tx: isDark ? '#fb7185' : '#9f1239', label:'要注意' }
    : bpSys >= 130 || bpDia >= 85
    ? { bg:'rgba(251,191,36,0.15)',  bd:'rgba(251,191,36,0.45)', tx: isDark ? '#fbbf24' : '#78350f', label:'注意' }
    : { bg:'rgba(52,211,153,0.15)',  bd:'rgba(52,211,153,0.45)', tx: isDark ? '#34d399' : '#065f46', label:'良好' };

  return (
    <div style={{ background: s.bg, border:`1px solid ${s.bd}`, borderRadius:10, padding:'.75rem 1rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <div>
        <div style={{ fontSize:10, color:'var(--text2)', fontFamily:'var(--syne)', fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:4 }}>血圧</div>
        <div style={{ fontFamily:'var(--mono)', fontSize:22, color: s.tx, fontWeight:600, letterSpacing:'-0.01em' }}>
          {bpSys}<span style={{ color:'var(--text3)', fontSize:16 }}>/</span>{bpDia}
          <span style={{ fontSize:11, color:'var(--text2)', fontFamily:'var(--sans)', marginLeft:5, fontWeight:400 }}>mmHg</span>
        </div>
      </div>
      <span style={{ fontSize:11, padding:'3px 10px', borderRadius:99, background:`${s.bd}`, color: s.tx, fontFamily:'var(--mono)', fontWeight:600 }}>{s.label}</span>
    </div>
  );
}

function DayDetail({ date, ride, body, walk, note, alcohol, onClose, onSaveNote }) {
  const [editNote, setEditNote] = useState(note || '');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSaveNote(date, editNote);
    setSaved(true);
    setTimeout(()=>setSaved(false), 1500);
  }

  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(8px)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background:'var(--bg2)', border:'1px solid var(--brd2)', borderRadius:20, padding:'1.5rem', width:'100%', maxWidth:540, maxHeight:'88vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.5)' }}
      >
        {/* タイトル */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' }}>
          <div>
            <div style={{ fontFamily:'var(--sans)', fontSize:20, fontWeight:700, color:'var(--text)', letterSpacing:'-.01em' }}>{date}</div>
            <div style={{ fontSize:12, color:'var(--text2)', marginTop:3, display:'flex', gap:8, flexWrap:'wrap' }}>
              {ride && <span>🚴 ライド</span>}
              {walk && <span>🐕 散歩</span>}
              {body && <span>⚖️ 体組成</span>}
              {alcohol && <span style={{ color: ALC_COLOR[alcohol] }}>{ALC_LABEL[alcohol]}</span>}
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:99, background:'var(--bg4)', border:'1px solid var(--border)', color:'var(--text2)', fontSize:18, lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>×</button>
        </div>

        {/* ライド */}
        {ride && (
          <div style={{ marginBottom:'1.25rem' }}>
            <div style={{ fontSize:11, color:'var(--text2)', fontFamily:'var(--syne)', fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:3, height:12, background:'var(--accent)', borderRadius:2, display:'inline-block' }}/>ライド
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {[
                ['距離',     ride.distance  != null ? `${Number(ride.distance).toFixed(1)}km` : '—'],
                ['タイム',   ride.duration  || '—'],
                ['速度',     ride.avgSpeed  != null ? `${Number(ride.avgSpeed).toFixed(1)}km/h` : '—'],
                ['心拍',     ride.avgHR     != null ? `${ride.avgHR}bpm` : '—'],
                ['Zone 2',   ride.z2        != null ? `${ride.z2}%` : '—'],
                ['CAD',      ride.cadence   != null ? `${ride.cadence}rpm` : '—'],
                ['FTP推定',  ride.ftpEstimate != null ? `${ride.ftpEstimate}W` : '—'],
                ['パワー推定',ride.lapAvgPower != null ? `${ride.lapAvgPower}W` : '—'],
              ].map(([l,v]) => (
                <div key={l} style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:10, padding:'.625rem .875rem' }}>
                  <div style={{ fontSize:10, color:'var(--text2)', fontFamily:'var(--syne)', fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:3 }}>{l}</div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:15, color:'var(--text)', fontWeight:500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 散歩 */}
        {walk && (
          <div style={{ marginBottom:'1.25rem' }}>
            <div style={{ fontSize:11, color:'var(--text2)', fontFamily:'var(--syne)', fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:3, height:12, background:'var(--green)', borderRadius:2, display:'inline-block' }}/>犬散歩
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {[
                ['時間',     walk.duration   || '—'],
                ['距離',     walk.distance   != null ? `${walk.distance}km` : '—'],
                ['心拍',     walk.avgHR      != null ? `${walk.avgHR}bpm` : '—'],
                ['消費cal',  walk.calories   != null ? `${walk.calories}kcal` : '—'],
              ].map(([l,v]) => (
                <div key={l} style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:10, padding:'.625rem .875rem' }}>
                  <div style={{ fontSize:10, color:'var(--text2)', fontFamily:'var(--syne)', fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:3 }}>{l}</div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:15, color:'var(--text)', fontWeight:500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 体組成・血圧 */}
        {body && (
          <div style={{ marginBottom:'1.25rem' }}>
            <div style={{ fontSize:11, color:'var(--text2)', fontFamily:'var(--syne)', fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:3, height:12, background:'var(--green)', borderRadius:2, display:'inline-block' }}/>体組成
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:8 }}>
              {[
                ['体重',   body.weight     != null ? `${body.weight}kg` : '—'],
                ['体脂肪', body.fatPct     != null ? `${body.fatPct}%` : '—'],
                ['骨格筋', body.musclePct  != null ? `${body.musclePct}%` : '—'],
                ['内臓脂肪',body.visceralFat != null ? `Lv.${body.visceralFat}` : '—'],
              ].map(([l,v]) => (
                <div key={l} style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:10, padding:'.625rem .875rem' }}>
                  <div style={{ fontSize:10, color:'var(--text2)', fontFamily:'var(--syne)', fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:3 }}>{l}</div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:15, color:'var(--text)', fontWeight:500 }}>{v}</div>
                </div>
              ))}
            </div>
            <BpBlock bpSys={body.bpSys} bpDia={body.bpDia} />
          </div>
        )}

        {/* 所感 */}
        <div>
          <div style={{ fontSize:11, color:'var(--text2)', fontFamily:'var(--syne)', fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:3, height:12, background:'var(--purple)', borderRadius:2, display:'inline-block' }}/>所感・体調メモ
          </div>
          <textarea
            value={editNote}
            onChange={e => setEditNote(e.target.value)}
            placeholder="体の調子、感じたこと、気づきなど..."
            style={{ width:'100%', height:80, background:'var(--bg3)', border:'1px solid var(--brd2)', borderRadius:10, color:'var(--text)', fontSize:13, fontFamily:'var(--sans)', padding:'10px 12px', resize:'vertical', outline:'none', lineHeight:1.6 }}
          />
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
            <button onClick={handleSave} style={{ padding:'7px 20px', borderRadius:8, background: saved ? 'var(--green)' : 'var(--accent)', color:'#fff', fontSize:12, fontWeight:700, fontFamily:'var(--syne)', transition:'background .2s' }}>
              {saved ? '保存済み ✓' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActivityCalendar({ state, onSaveNote, viewYear, viewMonth, onPrevMonth, onNextMonth }) {
  const [selected, setSelected] = useState(null);

  const today = new Date();
  const thisYear  = today.getFullYear();
  const thisMonth = today.getMonth() + 1;
  const isCurrentMonth = viewYear === thisYear && viewMonth === thisMonth;
  const pad = (new Date(viewYear, viewMonth-1, 1).getDay()+6)%7;
  const dim  = new Date(viewYear, viewMonth, 0).getDate();

  const rideDates = new Set(state.rides.map(r=>r.date));
  const bodyDates = new Set(state.bodyComp.map(b=>b.date));
  const walkDates = new Set((state.walks||[]).map(w=>w.date));

  // 週間プラン (0=日,1=月,...,6=土)
  const WEEKLY_PLAN = {
    0: { type:'ride',     label:'Z2 60' },
    1: { type:'off',      label:'REST'  },
    2: { type:'ride',     label:'Z2 60' },
    3: { type:'optional', label:'or OFF'},
    4: { type:'ride',     label:'Z2 75' },
    5: { type:'walk',     label:'散歩のみ'},
    6: { type:'long',     label:'LONG 90'},
  };

  const getPlanStatus = (ds, dow) => {
    const plan = WEEKLY_PLAN[dow];
    if (!plan) return null;
    const dt = new Date(ds + 'T00:00:00');
    if (dt > today) return { plan, status:'future' };
    const hasRide = rideDates.has(ds);
    const hasWalk = walkDates.has(ds);
    const ride = state.rides.find(r=>r.date===ds);
    const z3over = ride && ((ride.z3||0)) > 30;
    if (plan.type === 'off')      return { plan, status: !hasRide ? 'rest_ok' : 'extra' };
    if (plan.type === 'optional') return { plan, status: hasRide ? 'done' : 'neutral' };
    if (plan.type === 'walk')     return { plan, status: hasWalk && !hasRide ? 'rest_ok' : hasRide ? 'extra' : 'missed' };
    if (!hasRide) return { plan, status:'missed' };
    if (z3over)   return { plan, status:'over' };
    return { plan, status:'done' };
  };

  const STATUS_ICON = { done:'✅', missed:'❌', rest_ok:'😴', over:'⚠️', extra:'➕', neutral:'—', future:'' };

  const selRide  = selected ? state.rides.find(r=>r.date===selected)||null : null;
  const selBody  = selected ? state.bodyComp.find(b=>b.date===selected)||null : null;
  const selWalk  = selected ? (state.walks||[]).find(w=>w.date===selected)||null : null;
  const selNote  = selected ? (state.notes||{})[selected]||null : null;
  const selAlc   = selected ? (state.alcohol||{})[selected]||null : null;
  const hasDetail = selRide || selBody || selWalk || selNote || selAlc;

  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? (!isCurrentMonth && onNextMonth()) : onPrevMonth(); }
    touchStartX.current = null;
  };
  const mouseStartX = useRef(null);
  const handleMouseDown = (e) => { mouseStartX.current = e.clientX; };
  const handleMouseUp = (e) => {
    if (mouseStartX.current === null) return;
    const dx = e.clientX - mouseStartX.current;
    if (Math.abs(dx) > 60) { dx < 0 ? (!isCurrentMonth && onNextMonth()) : onPrevMonth(); }
    mouseStartX.current = null;
  };

  return (
    <>
      <div className="card" style={{ padding:'1.25rem 1.5rem' }}>
        {/* ヘッダー */}
        <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center', gap:8, marginBottom:'1rem', position:'relative' }}>
          <span style={{ fontFamily:'var(--syne)', fontSize:14, fontWeight:700, color:'var(--text)', marginRight:'auto' }}>{viewYear}年 {viewMonth}月</span>
          <button onClick={onPrevMonth} style={{ width:30, height:30, borderRadius:8, background:'var(--bg4)', border:'1px solid var(--border)', color:'var(--text)', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>‹</button>
          <button onClick={onNextMonth} disabled={isCurrentMonth}
            style={{ width:30, height:30, borderRadius:8, background:'var(--bg4)', border:'1px solid var(--border)', color: isCurrentMonth ? 'var(--text3)' : 'var(--text)', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', cursor: isCurrentMonth ? 'default' : 'pointer', opacity: isCurrentMonth ? 0.3 : 1 }}>›</button>
        </div>

        {/* 凡例 */}
        <div style={{ display:'flex', gap:8, marginBottom:'1rem', flexWrap:'wrap', position:'relative' }}>
          {[
            { icon:'🚴', label:'ライド',  color:'var(--accent)',  bg:'rgba(91,156,246,0.12)',  bd:'rgba(91,156,246,0.3)'  },
            { icon:'🐕', label:'犬散歩',  color:'var(--green)',   bg:'rgba(52,211,153,0.12)',  bd:'rgba(52,211,153,0.3)'  },
            { icon:'⚖️', label:'体組成',  color:'var(--amber)',   bg:'rgba(251,191,36,0.12)',  bd:'rgba(251,191,36,0.3)'  },
            { icon:'🍶', label:'飲酒あり',color:'var(--red)',     bg:'rgba(251,113,133,0.12)', bd:'rgba(251,113,133,0.3)' },
          ].map(({icon,label,color,bg,bd})=>(
            <div key={label} style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 10px', borderRadius:99, background:bg, border:`1px solid ${bd}` }}>
              <span style={{ fontSize:18, lineHeight:1 }}>{icon}</span>
              <span className="legend-label" style={{ fontSize:12, color:color, fontFamily:'var(--syne)', fontWeight:700, letterSpacing:'.03em' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* 曜日 */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:4, position:'relative' }}>
          {DAYS_SHORT.map(d=>(
            <div key={d} style={{ textAlign:'center', fontSize:11, color:'var(--text2)', fontWeight:700, fontFamily:'var(--syne)', letterSpacing:'.04em' }}>{d}</div>
          ))}
        </div>

        {/* 日付グリッド */}
        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, position:'relative', userSelect:'none' }}>
          {Array.from({length:pad}).map((_,i)=><div key={`p${i}`}/>)}
          {Array.from({length:dim}).map((_,i)=>{
            const d   = i+1;
            const ds  = `${viewYear}-${String(viewMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const dt  = new Date(viewYear, viewMonth-1, d);
            const dow = dt.getDay();
            const hasRide = rideDates.has(ds);
            const hasBody = bodyDates.has(ds);
            const hasWalk = walkDates.has(ds);
            const alc = (state.alcohol||{})[ds];
            const isToday = dt.getFullYear()===today.getFullYear() && dt.getMonth()===today.getMonth() && dt.getDate()===today.getDate();
            const isFuture = dt > today;
            const isSel = ds === selected;
            const planInfo = getPlanStatus(ds, dow);
            const hasAny = hasRide||hasBody||hasWalk;

            const planColor = planInfo?.plan.type==='off'||planInfo?.plan.type==='walk' ? 'var(--text2)'
              : planInfo?.plan.type==='long' ? '#a855f7' : 'var(--accent)';

            return (
              <div key={d}
                onClick={()=>{ if(!isFuture) setSelected(isSel ? null : ds); }}
                style={{
                  height:58, borderRadius:8,
                  border: isSel ? '2px solid var(--accent)' : isToday ? '1.5px solid var(--brd2)' : '1px solid var(--border)',
                  background: isSel ? 'rgba(59,130,246,0.18)' : hasAny ? 'var(--bg4)' : 'transparent',
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start',
                  paddingTop:4,
                  cursor: isFuture ? 'default' : 'pointer', opacity: isFuture ? 0.35 : 1,
                  transition:'var(--transition)', gap:1,
                }}>
                {/* 予定ラベル */}
                {planInfo && <span style={{ fontSize:10, color: planColor, fontFamily:'var(--mono)', fontWeight:700, letterSpacing:'.02em', lineHeight:1, textAlign:'center' }}>{planInfo.plan.label}</span>}
                {/* 日付 */}
                <span style={{ fontSize:13, fontWeight: isToday||isSel ? 700 : 500, color: isSel ? 'var(--accent)' : isToday ? 'var(--text)' : hasAny ? 'var(--text)' : 'var(--text2)', fontFamily:'var(--mono)', lineHeight:1 }}>{d}</span>
                {/* 実績アイコン */}
                {planInfo && planInfo.status!=='future' && (
                  <span style={{ fontSize:11, lineHeight:1 }}>{STATUS_ICON[planInfo.status]||''}</span>
                )}
                {/* アクティビティドット */}
                <div style={{ display:'flex', gap:2, marginTop:1 }}>
                  {hasRide && <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--accent)' }}/>}
                  {hasWalk && <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--green)' }}/>}
                  {hasBody && <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--amber)' }}/>}
                  {alc     && <div style={{ width:5, height:5, borderRadius:'50%', background: ALC_COLOR[alc] }}/>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 詳細モーダル - hasDetailがtrueのときだけ */}
      {selected && hasDetail && (
        <DayDetail
          date={selected}
          ride={selRide} body={selBody} walk={selWalk}
          note={selNote} alcohol={selAlc}
          onClose={()=>setSelected(null)}
          onSaveNote={onSaveNote}
        />
      )}
    </>
  );
}

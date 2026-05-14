import React, { useState, useRef } from 'react';
import { parseAndApply, applyJSONEntry, exportJSON, importJSON, saveState } from '../lib/store';

const EXAMPLE = `{"ride":{"date":"2026-05-14","distance":41.19,"duration":"1:36:57","avgSpeed":25.5,"avgHR":135,"cadence":95,"z2":72,"z3":20,"ftpEstimate":170,"lapAvgPower":0},"body":{"date":"2026-05-14","weight":77.2,"fatPct":23.3,"musclePct":32.7,"visceralFat":9,"bpSys":112,"bpDia":89},"walk":{"date":"2026-05-14","duration":"1:21:41","distance":4.51,"avgHR":113,"calories":434}}`;

export default function LogAnalyzer({ state, onUpdate }) {
  const [open,    setOpen]    = useState(false);
  const [text,    setText]    = useState('');
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(null);
  const fileRef = useRef();

  function handleApply() {
    setError(null); setSuccess(null);
    const t = text.trim();
    if (!t) { setError('JSONを貼り付けてください'); return; }
    try {
      const newState = applyJSONEntry(state, t);
      onUpdate(newState);
      saveState(newState);
      setSuccess('✓ 反映しました');
      setText('');
    } catch(err) {
      // JSONパース失敗時はCSVとして試みる（後方互換）
      try {
        const lines = t.split('\n').filter(l=>l.trim()&&!l.startsWith('//'));
        const { state: newState, count } = parseAndApply(state, lines.join('\n'));
        onUpdate(newState);
        saveState(newState);
        setSuccess(`✓ ${count}件を反映しました（CSV）`);
        setText('');
      } catch {
        setError('パースエラー: ' + err.message);
      }
    }
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    setError(null); setSuccess(null);
    importJSON(file,
      (data) => { onUpdate(data); setSuccess('✓ JSONインポート完了'); },
      (msg)  => setError(msg)
    );
    e.target.value = '';
  }

  return (
    <div className="card" style={{ overflow:'hidden' }}>
      <button
        onClick={()=>setOpen(o=>!o)}
        style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.5rem', background:'transparent', color:'var(--text)', position:'relative' }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:12, letterSpacing:'.07em', textTransform:'uppercase', fontWeight:700, fontFamily:'var(--syne)', color:'var(--text2)' }}>ログ入力</span>
          <span style={{ fontSize:10, padding:'2px 9px', borderRadius:99, background:'rgba(52,211,153,0.18)', color:'var(--green)', border:'1px solid rgba(52,211,153,0.4)', fontFamily:'var(--mono)', fontWeight:600 }}>API不要</span>
        </div>
        <span style={{ color:'var(--text3)', fontSize:12, transition:'transform .2s', transform: open?'rotate(180deg)':'none' }}>▼</span>
      </button>

      <div style={{ maxHeight: open ? 700 : 0, overflow:'hidden', transition:'max-height .3s ease' }}>
        <div style={{ padding:'0 1.5rem 1.5rem' }}>
          <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:'var(--r)', padding:'10px 14px', marginBottom:'1rem', fontFamily:'var(--mono)', fontSize:11, color:'var(--text2)', lineHeight:1.9, whiteSpace:'pre-wrap', wordBreak:'break-all' }}>
            {EXAMPLE}
          </div>
          <textarea
            value={text}
            onChange={e=>setText(e.target.value)}
            placeholder="ClaudeのJSON出力をここに貼り付け"
            style={{ width:'100%', height:100, background:'rgba(0,0,0,0.15)', border:'1px solid var(--brd2)', borderRadius:'var(--r)', color:'var(--text)', fontSize:13, fontFamily:'var(--mono)', padding:'10px 14px', resize:'vertical', outline:'none', lineHeight:1.6 }}
          />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'.75rem', gap:8 }}>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>exportJSON(state)}
                style={{ padding:'7px 16px', borderRadius:'var(--r)', background:'transparent', border:'1px solid var(--brd2)', color:'var(--text2)', fontSize:12, fontWeight:600, fontFamily:'var(--syne)', cursor:'pointer' }}>
                ⬇ エクスポート
              </button>
              <button onClick={()=>fileRef.current.click()}
                style={{ padding:'7px 16px', borderRadius:'var(--r)', background:'transparent', border:'1px solid var(--brd2)', color:'var(--text2)', fontSize:12, fontWeight:600, fontFamily:'var(--syne)', cursor:'pointer' }}>
                ⬆ インポート
              </button>
              <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display:'none' }} />
            </div>
            <button onClick={handleApply} disabled={!text.trim()}
              style={{ padding:'8px 22px', borderRadius:'var(--r)', background:'var(--accent)', color:'#fff', fontSize:13, fontWeight:700, fontFamily:'var(--syne)', opacity:!text.trim()?0.4:1, transition:'var(--transition)', cursor:'pointer' }}>
              ダッシュボードに反映
            </button>
          </div>
          {error   && <div style={{ marginTop:'.75rem', padding:'10px 14px', background:'rgba(251,113,133,0.15)', border:'1px solid rgba(251,113,133,0.4)', borderRadius:'var(--r)', fontSize:13, color:'var(--red)', fontFamily:'var(--mono)' }}>⚠ {error}</div>}
          {success && <div style={{ marginTop:'.75rem', padding:'10px 14px', background:'rgba(52,211,153,0.15)', border:'1px solid rgba(52,211,153,0.4)', borderRadius:'var(--r)', fontSize:13, color:'var(--green)', fontFamily:'var(--mono)' }}>{success}</div>}
        </div>
      </div>
    </div>
  );
}

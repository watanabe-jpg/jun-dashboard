import React, { useState } from 'react';
import { parseAndApply, saveState } from '../lib/store';

const EXAMPLE = `// Claudeが出力したCSVをそのまま貼り付け（//行は無視）
// date,距離,タイム,速度,HR,CAD,Z2%,Z3%,体重,体脂肪%,筋肉%,内臓脂肪,収縮期BP,拡張期BP,飲酒,FTP推定,パワー推定,所感
2026-05-13,31.5,1:10:00,27.0,132,95,72,18,77.5,22.6,33.4,9,136,85,none,176,112,調子よかった`;

export default function LogAnalyzer({ state, onUpdate }) {
  const [open,    setOpen]    = useState(false);
  const [text,    setText]    = useState('');
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(null);

  function handleApply() {
    setError(null); setSuccess(null);
    const lines = text.trim().split('\n').filter(l=>l.trim()&&!l.startsWith('//'));
    if (!lines.length) { setError('CSVを貼り付けてください'); return; }
    const { state: newState, count } = parseAndApply(state, lines.join('\n'));
    onUpdate(newState);
    saveState(newState);
    setSuccess(`✓ ${count}件を反映しました`);
    setText('');
  }

  return (
    <div className="card" style={{ overflow:'hidden' }}>
      {/* アコーディオンヘッダー */}
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

      {/* アコーディオン本体 */}
      <div style={{ maxHeight: open ? 600 : 0, overflow:'hidden', transition:'max-height .3s ease' }}>
        <div style={{ padding:'0 1.5rem 1.5rem' }}>
          <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:'var(--r)', padding:'10px 14px', marginBottom:'1rem', fontFamily:'var(--mono)', fontSize:11, color:'var(--text2)', lineHeight:1.9, whiteSpace:'pre-wrap', wordBreak:'break-all', position:'relative' }}>
            {EXAMPLE}
          </div>
          <textarea
            value={text}
            onChange={e=>setText(e.target.value)}
            placeholder="ここにCSVを貼り付けてください（複数行OK）"
            style={{ width:'100%', height:80, background:'rgba(0,0,0,0.15)', border:'1px solid var(--brd2)', borderRadius:'var(--r)', color:'var(--text)', fontSize:13, fontFamily:'var(--mono)', padding:'10px 14px', resize:'vertical', outline:'none', lineHeight:1.6 }}
          />
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'.75rem' }}>
            <button onClick={handleApply} disabled={!text.trim()}
              style={{ padding:'8px 22px', borderRadius:'var(--r)', background:'var(--accent)', color:'#fff', fontSize:13, fontWeight:700, fontFamily:'var(--syne)', opacity:!text.trim()?0.4:1, transition:'var(--transition)' }}>
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

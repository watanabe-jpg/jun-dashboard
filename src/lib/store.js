// ストレージキーは絶対に変えない
const KEY = 'jun_fitness_v1';

export const SEED_RIDES = [
  { date:'2026-05-12',distance:31.17,duration:'1:11:12',avgSpeed:26.3,avgHR:133,cadence:93,z2:70,z3:19,ftpEstimate:175,lapAvgPower:107 },
  { date:'2026-05-10',distance:41.06,duration:'1:32:06',avgSpeed:26.7,avgHR:138,cadence:93,z2:42,z3:35,ftpEstimate:175,lapAvgPower:112 },
  { date:'2026-05-09',distance:41.18,duration:'1:34:01',avgSpeed:26.3,avgHR:137,cadence:93,z2:42,z3:35,ftpEstimate:175,lapAvgPower:107 },
  { date:'2026-04-30',distance:41.42,duration:'1:36:28',avgSpeed:25.8,avgHR:140,cadence:92,z2:25,z3:45,ftpEstimate:170,lapAvgPower:102 },
  { date:'2026-04-22',distance:31.56,duration:'1:12:01',avgSpeed:26.3,avgHR:134,cadence:92,z2:42,z3:35,ftpEstimate:170,lapAvgPower:107 },
  { date:'2026-04-21',distance:32.26,duration:'1:12:18',avgSpeed:26.8,avgHR:134,cadence:91,z2:42,z3:35,ftpEstimate:170,lapAvgPower:113 },
  { date:'2026-04-18',distance:50.7, duration:'1:46:37',avgSpeed:28.5,avgHR:145,cadence:90,z2:15,z3:45,ftpEstimate:170,lapAvgPower:132 },
  { date:'2026-04-17',distance:40.56,duration:'1:27:13',avgSpeed:27.9,avgHR:139,cadence:92,z2:25,z3:45,ftpEstimate:170,lapAvgPower:125 },
  { date:'2026-04-15',distance:41.93,duration:'1:31:57',avgSpeed:27.4,avgHR:138,cadence:89,z2:42,z3:35,ftpEstimate:170,lapAvgPower:119 },
  { date:'2026-04-14',distance:42.43,duration:'1:36:49',avgSpeed:26.3,avgHR:136,cadence:93,z2:42,z3:35,ftpEstimate:170,lapAvgPower:107 },
  { date:'2026-04-11',distance:31.44,duration:'1:17:52',avgSpeed:24.2,avgHR:151,cadence:92,z2:15,z3:45,ftpEstimate:170,lapAvgPower:87  },
  { date:'2026-04-09',distance:41.48,duration:'1:31:54',avgSpeed:27.1,avgHR:139,cadence:90,z2:25,z3:45,ftpEstimate:170,lapAvgPower:116 },
  { date:'2026-04-08',distance:31.87,duration:'1:13:00',avgSpeed:26.2,avgHR:138,cadence:90,z2:42,z3:35,ftpEstimate:170,lapAvgPower:106 },
  { date:'2026-04-07',distance:31.26,duration:'1:09:01',avgSpeed:27.2,avgHR:144,cadence:87,z2:15,z3:45,ftpEstimate:170,lapAvgPower:117 },
  { date:'2026-03-27',distance:31.38,duration:'1:12:25',avgSpeed:26.0,avgHR:142,cadence:85,z2:25,z3:45,ftpEstimate:170,lapAvgPower:104 },
  { date:'2026-03-25',distance:31.48,duration:'1:16:57',avgSpeed:24.5,avgHR:134,cadence:91,z2:42,z3:35,ftpEstimate:168,lapAvgPower:90  },
  { date:'2026-03-22',distance:51.53,duration:'1:52:24',avgSpeed:27.5,avgHR:145,cadence:88,z2:15,z3:45,ftpEstimate:170,lapAvgPower:120 },
  { date:'2026-03-15',distance:40.62,duration:'1:35:44',avgSpeed:25.5,avgHR:139,cadence:90,z2:25,z3:45,ftpEstimate:168,lapAvgPower:99  },
  { date:'2026-03-10',distance:30.98,duration:'1:18:58',avgSpeed:23.5,avgHR:131,cadence:90,z2:55,z3:25,ftpEstimate:165,lapAvgPower:81  },
  { date:'2026-03-08',distance:30.93,duration:'1:18:31',avgSpeed:23.6,avgHR:128,cadence:89,z2:55,z3:25,ftpEstimate:163,lapAvgPower:81  },
  { date:'2026-02-28',distance:51.21,duration:'2:05:35',avgSpeed:24.5,avgHR:141,cadence:94,z2:25,z3:45,ftpEstimate:162,lapAvgPower:90  },
  { date:'2026-02-22',distance:40.78,duration:'1:40:31',avgSpeed:24.3,avgHR:142,cadence:91,z2:25,z3:45,ftpEstimate:160,lapAvgPower:88  },
  { date:'2026-02-14',distance:52.45,duration:'2:04:09',avgSpeed:25.3,avgHR:150,cadence:88,z2:15,z3:45,ftpEstimate:158,lapAvgPower:97  },
  { date:'2026-01-28',distance:38.85,duration:'1:30:08',avgSpeed:25.9,avgHR:148,cadence:92,z2:15,z3:45,ftpEstimate:155,lapAvgPower:103 },
  { date:'2026-01-24',distance:55.68,duration:'2:15:40',avgSpeed:24.6,avgHR:146,cadence:89,z2:15,z3:45,ftpEstimate:153,lapAvgPower:90  },
];

export const SEED_BODY = [
  { date:'2026-04-30',weight:77.70,fatPct:23.8,musclePct:32.2,visceralFat:9,bpSys:134,bpDia:97 },
  { date:'2026-05-10',weight:77.40,fatPct:23.7,musclePct:32.2,visceralFat:9,bpSys:143,bpDia:99 },
  { date:'2026-05-12',weight:77.60,fatPct:22.8,musclePct:33.2,visceralFat:9,bpSys:138,bpDia:87 },
];

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return { rides: SEED_RIDES, bodyComp: SEED_BODY, alcohol:{}, walks:[], notes:{} };
    }
    const saved = JSON.parse(raw);
    // シードデータと保存データをマージ（保存データ優先）
    const savedDates = new Set((saved.rides||[]).map(r=>r.date));
    const mergedRides = [
      ...SEED_RIDES.filter(r=>!savedDates.has(r.date)),
      ...(saved.rides||[])
    ].sort((a,b)=>a.date.localeCompare(b.date));

    const savedBodyDates = new Set((saved.bodyComp||[]).map(b=>b.date));
    const mergedBody = [
      ...SEED_BODY.filter(b=>!savedBodyDates.has(b.date)),
      ...(saved.bodyComp||[])
    ].sort((a,b)=>a.date.localeCompare(b.date));

    return {
      rides:    mergedRides,
      bodyComp: mergedBody,
      alcohol:  saved.alcohol  || {},
      walks:    saved.walks    || [],
      notes:    saved.notes    || {},
    };
  } catch { return { rides: SEED_RIDES, bodyComp: SEED_BODY, alcohol:{}, walks:[], notes:{} }; }
}

export function saveState(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

const FIELDS = ['date','distance','duration','avgSpeed','avgHR','cadence','z2','z3',
                'weight','fatPct','musclePct','visceralFat','bpSys','bpDia',
                'alcohol','ftpEstimate','lapAvgPower','note',
                'walkDuration','walkDistance','walkAvgHR','walkCalories'];

export function parseAndApply(state, csvText) {
  const lines = csvText.trim().split('\n').filter(l=>l.trim()&&!l.startsWith('//'));
  let s = state; let count = 0;
  for (const line of lines) {
    const vals = line.split(',');
    if (vals.length < 2) continue;
    const row = {};
    FIELDS.forEach((f,i) => {
      const v = vals[i]?.trim();
      if (!v) return;
      row[f] = ['date','duration','alcohol','note','walkDuration'].includes(f) ? v : isNaN(v) ? v : Number(v);
    });
    if (!row.date) continue;
    if (row.distance || row.avgSpeed) {
      const keys = ['date','distance','duration','avgSpeed','avgHR','cadence','z2','z3','ftpEstimate','lapAvgPower'];
      const ride = Object.fromEntries(keys.filter(k=>row[k]!=null).map(k=>[k,row[k]]));
      s = { ...s, rides: [...s.rides.filter(r=>r.date!==ride.date), ride].sort((a,b)=>a.date.localeCompare(b.date)) };
    }
    if (row.weight || row.bpSys) {
      const keys = ['date','weight','fatPct','musclePct','visceralFat','bpSys','bpDia'];
      const body = Object.fromEntries(keys.filter(k=>row[k]!=null).map(k=>[k,row[k]]));
      s = { ...s, bodyComp: [...s.bodyComp.filter(b=>b.date!==body.date), body].sort((a,b)=>a.date.localeCompare(b.date)) };
    }
    if (row.alcohol) s = { ...s, alcohol: { ...s.alcohol, [row.date]: row.alcohol } };
    if (row.note)    s = { ...s, notes:   { ...(s.notes||{}), [row.date]: row.note } };
    if (row.walkDuration || row.walkDistance) {
      const walk = { date:row.date, duration:row.walkDuration, distance:row.walkDistance, avgHR:row.walkAvgHR, calories:row.walkCalories };
      s = { ...s, walks: [...(s.walks||[]).filter(w=>w.date!==walk.date), walk].sort((a,b)=>a.date.localeCompare(b.date)) };
    }
    count++;
  }
  return { state: s, count };
}

export function cycleAlcohol(state, date) {
  const cur = state.alcohol[date] || '';
  const next = cur===''?'none':cur==='none'?'light':cur==='light'?'drank':'';
  const alcohol = { ...state.alcohol };
  if (next==='') delete alcohol[date]; else alcohol[date]=next;
  return { ...state, alcohol };
}

export const latestRide = s => s.rides.at(-1) || null;
export const latestBody = s => s.bodyComp.at(-1) || null;
export const prevBody   = s => s.bodyComp.at(-2) || null;

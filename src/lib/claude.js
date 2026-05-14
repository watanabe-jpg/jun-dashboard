const API = 'https://api.anthropic.com/v1/messages';

const SYSTEM = `You are an expert cycling coach and health analyst for Jun, a road cyclist in Yokohama.
Profile: Cannondale SuperSix EVO Gen3, FTP ~170W, VO2MAX ~45, Zone 2 = 127-133bpm (max HR 182bpm).
Goals: lower uric acid, lose weight (target 70kg from ~77kg), increase cruising speed, improve VO2MAX.

You may receive multiple images and/or text from a single session. Treat them all as one ride/day.
Extract all metrics and provide a brief Japanese coaching insight (2-3 sentences, direct and data-driven).
Then return ONLY this JSON block at the end:

\`\`\`json
{
  "ride": { "date":"YYYY-MM-DD","distance":0,"duration":"H:MM:SS","avgSpeed":0,"avgHR":0,"cadence":0,"z2":0,"z3":0 },
  "bodyComp": { "date":"YYYY-MM-DD","weight":0,"fatPct":0,"musclePct":0,"visceralFat":0,"bmi":0,"bmr":0,"bpSys":0,"bpDia":0 },
  "alcohol": { "date":"YYYY-MM-DD","level":"none|light|drank" }
}
\`\`\`

Only include objects where you found actual data. Use null for missing numeric values.
z2/z3 are percentages as numbers (e.g. 41 for 41%).`;

export async function analyzeLog(content, apiKey, mode = false) {
  let messageContent;

  if (mode === 'multi') {
    // 複数画像+テキストの配列をそのまま渡す
    messageContent = content;
  } else if (mode === true) {
    // 単一画像（後方互換）
    messageContent = [
      { type: 'image', source: { type: 'base64', media_type: content.mediaType, data: content.data } },
      { type: 'text', text: 'このライドログ/健康データを解析してください。' }
    ];
  } else {
    messageContent = content;
  }

  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM,
      messages: [{ role: 'user', content: messageContent }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  const text = data.content?.find(b => b.type === 'text')?.text || '';
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
  const insight = text.replace(/```json[\s\S]*?```/g, '').trim();
  let extracted = {};
  if (jsonMatch) { try { extracted = JSON.parse(jsonMatch[1]); } catch {} }
  return { insight, extracted };
}

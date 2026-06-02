// Demo patients used when no Healthie data has been received yet
const DEMO_PATIENTS = [
  {
    id: 'demo-1',
    name: 'L. Thompson',
    fullName: 'Larry Thompson',
    age: 60,
    vhi_score: 75,
    vulnerability_rank: 92,
    diagnostics: [
      { name: 'Echocardiogram 12/5/25', result: 'normal EF 55%', status: 'normal', date: '2025-12-05' },
      { name: '24 HR ABPM', result: 'Normal ABPM', status: 'normal', date: '2025-11-10' },
      { name: 'Zio Patch', result: 'No Afib Detected', status: 'normal', date: '2025-10-22' },
      { name: 'Deep Artery/ABI', result: 'severe PAD, .65', status: 'critical', date: '2025-09-15' }
    ],
    medications: [
      { name: 'Blood thinner', fill_date: '4/15/2025', status: 'gap', status_label: 'Gap 45 Days', pdc: null },
      { name: 'Statin', fill_date: '5/15/2025', status: 'no_fill', status_label: 'No fill detected', pdc: null },
      { name: 'Anticoagulation', fill_date: '6/12/2026', status: 'good', status_label: 'PDC: 98%', pdc: 98 }
    ],
    critical_gaps: [
      { name: 'Deep Artery/ABI', detail: 'severe PAD, .65', severity: 'critical' },
      { name: 'Heart Health – Blood Labs', detail: 'Missing: HbA1C, Lipid Panel, hs-CRP', severity: 'warning' },
      { name: 'Sleep Apnea', detail: 'Notes show snoring and sleep issues', severity: 'warning' }
    ],
    suggested_actions: [
      { name: 'Coronary Calcium Score Referral', type: 'referral' },
      { name: 'Heart Health – Blood Labs', type: 'lab' },
      { name: 'Sleep Apnea – At home test kit', type: 'test' }
    ],
    critical_gap_summary: 'Normal Muscle, Severe Pipe Clogging',
    suggested_action: 'Calcium Score Referral',
    source: 'demo'
  },
  {
    id: 'demo-2',
    name: 'A. Landeson',
    fullName: 'Anna Landeson',
    age: 67,
    vhi_score: 82,
    vulnerability_rank: 90,
    diagnostics: [],
    medications: [],
    critical_gaps: [],
    suggested_actions: [],
    suggested_action: 'Echocardiogram Referral',
    source: 'demo'
  },
  {
    id: 'demo-3',
    name: 'G. Schneider',
    fullName: 'George Schneider',
    age: 71,
    vhi_score: 78,
    vulnerability_rank: 89,
    diagnostics: [],
    medications: [],
    critical_gaps: [],
    suggested_actions: [],
    suggested_action: 'Calcium Score Referral',
    source: 'demo'
  }
]

export async function GET() {
  // TODO: Replace with real database query when Healthie data flows in
  // For now returns demo data — real patients will appear after Keragon webhook fires
  return Response.json({ 
    patients: DEMO_PATIENTS,
    source: 'demo',
    message: 'Connect Keragon to receive live Healthie patient data'
  })
}

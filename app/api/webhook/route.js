// This endpoint receives patient data pushed from Healthie via Keragon
// Set this URL in your Keragon workflow: https://vhi-portal.vercel.app/api/webhook

const patients = new Map() // In production, replace with a real database

export async function POST(request) {
  try {
    const secret = request.headers.get('x-keragon-secret')
    
    // Verify webhook secret (set KERAGON_WEBHOOK_SECRET in Vercel env vars)
    if (process.env.KERAGON_WEBHOOK_SECRET && secret !== process.env.KERAGON_WEBHOOK_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Keragon/Healthie sends patient data - normalize it
    const patient = {
      id: data.patient_id || data.id,
      name: data.patient_name || `${data.first_name} ${data.last_name}`,
      age: data.age || data.dob ? calculateAge(data.dob) : null,
      vhi_score: data.vhi_score || null,
      diagnostics: data.diagnostics || [],
      medications: data.medications || [],
      chart_notes: data.chart_notes || data.notes || '',
      lab_results: data.lab_results || {},
      last_updated: new Date().toISOString(),
      // Raw Healthie data preserved
      raw: data
    }

    patients.set(patient.id, patient)
    console.log(`Received patient data for: ${patient.name}`)

    return Response.json({ success: true, patient_id: patient.id })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

export async function GET() {
  // Return all patients (for the portal to fetch)
  const allPatients = Array.from(patients.values())
  return Response.json({ patients: allPatients })
}

function calculateAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  const now = new Date()
  return Math.floor((now - birth) / (365.25 * 24 * 60 * 60 * 1000))
}

import { NextRequest, NextResponse } from 'next/server'
import { createAppointment, listAppointmentsForPatient } from '@/lib/appointments'

function getSessionUser(req: NextRequest) {
  const raw = req.cookies.get('auth_session')?.value
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export async function GET(req: NextRequest) {
  const session = getSessionUser(req)
  if (!session?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  if (session.role && session.role !== 'patient') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }
  const items = await listAppointmentsForPatient(session.id)
  return NextResponse.json({ success: true, data: { appointments: items } })
}

export async function POST(req: NextRequest) {
  const session = getSessionUser(req)
  if (!session?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  if (session.role && session.role !== 'patient') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }
  const body = await req.json()
  const { doctorId, deadline, notes } = body || {}
  if (!doctorId || !deadline) {
    return NextResponse.json({ success: false, message: 'doctorId and deadline are required' }, { status: 422 })
  }
  const appt = await createAppointment({ patientId: session.id, doctorId, deadline, notes })
  return NextResponse.json({ success: true, data: { appointment: { ...appt, _id: appt._id?.toString() } } }, { status: 201 })
}

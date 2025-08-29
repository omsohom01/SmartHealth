import { NextRequest, NextResponse } from 'next/server'
import { listAppointmentsForDoctor, updateAppointmentStatus } from '@/lib/appointments'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

function getSessionUser(req: NextRequest) {
  const raw = req.cookies.get('auth_session')?.value
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export async function GET(req: NextRequest) {
  const session = getSessionUser(req)
  if (!session?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  // Ensure the session user is a doctor
  const client = await clientPromise
  const db = client.db()
  const me = await db.collection('users').findOne({ _id: new ObjectId(session.id) })
  if (!me || me.role !== 'doctor') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }
  const items = await listAppointmentsForDoctor(session.id)
  return NextResponse.json({ success: true, data: { appointments: items } })
}

export async function PATCH(req: NextRequest) {
  const session = getSessionUser(req)
  if (!session?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  // Ensure the session user is a doctor
  const client = await clientPromise
  const db = client.db()
  const me = await db.collection('users').findOne({ _id: new ObjectId(session.id) })
  if (!me || me.role !== 'doctor') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }
  const { appointmentId, action, scheduledAt } = await req.json()
  if (!appointmentId || !action || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ success: false, message: 'appointmentId and valid action required' }, { status: 422 })
  }
  if (action === 'approve' && !scheduledAt) {
    return NextResponse.json({ success: false, message: 'scheduledAt required when approving' }, { status: 422 })
  }
  // Ensure the appointment belongs to this doctor
  const appt = await db.collection('appointments').findOne({ _id: new ObjectId(appointmentId) })
  if (!appt || String(appt.doctorId) !== String(me._id)) {
    return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404 })
  }
  await updateAppointmentStatus(appointmentId, {
    status: action === 'approve' ? 'approved' : 'rejected',
    scheduledAt: scheduledAt ?? null,
  })
  return NextResponse.json({ success: true })
}

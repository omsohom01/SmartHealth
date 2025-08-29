import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { Appointment, AppointmentStatus, PublicDoctorProfile } from '@/lib/types'

const USERS = 'users'
const APPOINTMENTS = 'appointments'

export async function listDoctors(filter?: { specialization?: string }) {
  const client = await clientPromise
  const db = client.db()
  const query: any = { role: 'doctor' }
  if (filter?.specialization) {
    // Case-insensitive partial match on specialization
    query.specialization = { $regex: filter.specialization, $options: 'i' }
  }
  const docs = await db
    .collection(USERS)
    .find(query, { projection: { password: 0 } })
    .sort({ createdAt: -1 })
    .toArray()
  const result: PublicDoctorProfile[] = docs.map((d: any) => ({
    id: d._id.toString(),
    name: d.name,
    email: d.email,
    location: d.location,
    specialization: d.specialization,
    experience: d.experience,
    achievements: d.achievements,
    profilePicture: d.profilePicture ?? null,
    status: 'active',
  }))
  return result
}

export async function createAppointment(input: {
  patientId: string
  doctorId: string
  deadline: string | Date
  notes?: string
}): Promise<Appointment> {
  const client = await clientPromise
  const db = client.db()
  const now = new Date()
  const doc: Appointment = {
    patientId: new ObjectId(input.patientId),
    doctorId: new ObjectId(input.doctorId),
    requestedAt: now,
    deadline: new Date(input.deadline),
    status: 'pending',
    scheduledAt: null,
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  }
  const res = await db.collection<Appointment>(APPOINTMENTS).insertOne(doc as any)
  return { ...doc, _id: res.insertedId }
}

export async function listAppointmentsForPatient(patientId: string) {
  const client = await clientPromise
  const db = client.db()
  const pipeline = [
    { $match: { patientId: new ObjectId(patientId) } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: USERS,
        localField: 'doctorId',
        foreignField: '_id',
        as: 'doctor',
      },
    },
    { $unwind: '$doctor' },
    {
      $project: {
        _id: 1,
        status: 1,
        deadline: 1,
        scheduledAt: 1,
        requestedAt: 1,
        notes: 1,
        doctor: {
          id: { $toString: '$doctor._id' },
          name: '$doctor.name',
          email: '$doctor.email',
          specialization: '$doctor.specialization',
          location: '$doctor.location',
          profilePicture: '$doctor.profilePicture',
        },
      },
    },
  ]
  return await db.collection(APPOINTMENTS).aggregate(pipeline).toArray()
}

export async function listAppointmentsForDoctor(doctorId: string) {
  const client = await clientPromise
  const db = client.db()
  const pipeline = [
    { $match: { doctorId: new ObjectId(doctorId) } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: USERS,
        localField: 'patientId',
        foreignField: '_id',
        as: 'patient',
      },
    },
    { $unwind: '$patient' },
    {
      $project: {
        _id: 1,
        status: 1,
        deadline: 1,
        scheduledAt: 1,
        requestedAt: 1,
        notes: 1,
        patient: {
          id: { $toString: '$patient._id' },
          name: '$patient.name',
          email: '$patient.email',
        },
      },
    },
  ]
  return await db.collection(APPOINTMENTS).aggregate(pipeline).toArray()
}

export async function updateAppointmentStatus(
  appointmentId: string,
  input: { status: AppointmentStatus; scheduledAt?: string | Date | null }
) {
  const client = await clientPromise
  const db = client.db()
  const updates: any = { status: input.status, updatedAt: new Date() }
  if (input.status === 'approved' && input.scheduledAt) {
    updates.scheduledAt = new Date(input.scheduledAt)
  }
  if (input.status !== 'approved') {
    updates.scheduledAt = null
  }
  await db
    .collection(APPOINTMENTS)
    .updateOne({ _id: new ObjectId(appointmentId) }, { $set: updates })
}

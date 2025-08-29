"use client"

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'

interface DoctorItem {
  id: string
  name: string
  email: string
  location?: string
  specialization: string
  experience?: number
  profilePicture?: string | null
}

function BookAppointmentClient() {
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const [doctors, setDoctors] = useState<DoctorItem[]>([])
  const [specialization, setSpecialization] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<string>('')
  const [deadlineDate, setDeadlineDate] = useState<string>('')
  const [deadlineTime, setDeadlineTime] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    // Initialize from query param if present
    const sp = searchParams?.get('specialization')
    if (sp && sp.trim()) {
      setSpecialization(sp)
    }
    const did = searchParams?.get('doctorId')
    if (did && did.trim()) {
      setSelectedDoctor(did)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const load = async () => {
      const qs = specialization && specialization !== 'all' ? `?specialization=${encodeURIComponent(specialization)}` : ''
      const res = await fetch(`/api/doctors${qs}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setDoctors(data.data.doctors)
    }
    load()
  }, [specialization])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return doctors.filter(d =>
      !term || d.name.toLowerCase().includes(term) || d.specialization.toLowerCase().includes(term) || (d.location||'').toLowerCase().includes(term)
    )
  }, [doctors, search])

  const specializations = useMemo(() => {
    const set = new Set(doctors.map(d => d.specialization).filter(Boolean))
    return Array.from(set).sort()
  }, [doctors])

  const submit = async () => {
    if (!selectedDoctor) return setMessage('Select a doctor')
    if (!deadlineDate || !deadlineTime) return setMessage('Select deadline date and time')
    setLoading(true)
    setMessage(null)
    const deadline = new Date(`${deadlineDate}T${deadlineTime}:00`)
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ doctorId: selectedDoctor, deadline, notes }),
    })
    const data = await res.json()
    if (res.ok && data.success) {
      setMessage('Appointment requested. It will appear as pending until approved by the doctor.')
      setSelectedDoctor('')
      setDeadlineDate('')
      setDeadlineTime('')
      setNotes('')
    } else {
      setMessage(data.message || 'Failed to book appointment')
    }
    setLoading(false)
  }

  if (!isAuthenticated || user?.role !== 'patient') {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Book Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            Please sign in as a patient to book appointments.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Book Appointment</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div className="flex gap-3">
            <Input placeholder="Search doctor or location" value={search} onChange={e => setSearch(e.target.value)} />
            <Select value={specialization} onValueChange={setSpecialization}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {specializations.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(d => (
              <Card key={d.id} className={selectedDoctor === d.id ? 'border-white/70 ring-2 ring-white/50' : ''}>
                <CardHeader>
                  <CardTitle className="text-base">{d.name}</CardTitle>
                  <div className="text-sm text-gray-400">{d.specialization}</div>
                  <div className="text-sm text-gray-500">{d.location}</div>
                </CardHeader>
                <CardContent>
                  <Button variant={selectedDoctor === d.id ? 'default' : 'secondary'} onClick={() => setSelectedDoctor(d.id)}>
                    {selectedDoctor === d.id ? 'Selected' : 'Select Doctor'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Deadline Date</label>
                <Input type="date" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Deadline Time</label>
                <Input type="time" value={deadlineTime} onChange={e => setDeadlineTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Notes (optional)</label>
                <Input placeholder="Brief note" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              {message && <div className="text-sm text-gray-300">{message}</div>}
              <Button onClick={submit} disabled={loading}>
                {loading ? 'Booking...' : 'Book Appointment'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-10">Loading...</div>}>
      <BookAppointmentClient />
    </Suspense>
  )
}

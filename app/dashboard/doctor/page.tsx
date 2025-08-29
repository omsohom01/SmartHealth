"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'

export default function DoctorDashboard() {
  const { isAuthenticated, user } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [scheduleDate, setScheduleDate] = useState<Record<string, string>>({})
  const [scheduleTime, setScheduleTime] = useState<Record<string, string>>({})

  const load = async () => {
    const res = await fetch('/api/doctor/appointments', { credentials: 'include' })
    const data = await res.json()
    if (data.success) setItems(data.data.appointments)
  }

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'doctor') return
    load()
  }, [isAuthenticated, user?.role])

  const act = async (id: string, action: 'approve' | 'reject') => {
    const payload: any = { appointmentId: id, action }
    if (action === 'approve') {
      const d = scheduleDate[id]
      const t = scheduleTime[id]
      if (!d || !t) return
      payload.scheduledAt = new Date(`${d}T${t}:00`)
    }
    await fetch('/api/doctor/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    await load()
  }

  if (!isAuthenticated || user?.role !== 'doctor') {
    return <div className="container mx-auto px-4 py-10">Please sign in as doctor.</div>
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-6 mt-16">
      <h1 className="text-2xl font-semibold">Appointment Requests</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((a) => (
          <Card key={a._id}>
            <CardHeader>
              <CardTitle className="text-base">Patient: {a.patient?.name}</CardTitle>
              <div className="text-sm text-gray-400">Deadline: {a.deadline ? format(new Date(a.deadline), 'PP p') : '-'}</div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>Status: <span className="capitalize">{a.status}</span></div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">Schedule Date</label>
                  <Input type="date" value={scheduleDate[a._id] || ''} onChange={e => setScheduleDate(s => ({ ...s, [a._id]: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Schedule Time</label>
                  <Input type="time" value={scheduleTime[a._id] || ''} onChange={e => setScheduleTime(s => ({ ...s, [a._id]: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => act(a._id, 'approve')} disabled={!scheduleDate[a._id] || !scheduleTime[a._id]}>Accept</Button>
                <Button variant="secondary" onClick={() => act(a._id, 'reject')}>Reject</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

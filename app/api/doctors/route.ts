import { NextRequest, NextResponse } from 'next/server'
import { listDoctors } from '@/lib/appointments'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const specialization = searchParams.get('specialization') || undefined
  const doctors = await listDoctors({ specialization })
  return NextResponse.json({ success: true, data: { doctors } })
}

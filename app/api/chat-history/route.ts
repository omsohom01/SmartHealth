import { NextRequest, NextResponse } from 'next/server'
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
  
  const client = await clientPromise
  const db = client.db()
  
  const sessions = await db
    .collection('chat_sessions')
    .find({ userId: new ObjectId(session.id) })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray()
  
  return NextResponse.json({ success: true, data: { sessions } })
}

export async function POST(req: NextRequest) {
  const session = getSessionUser(req)
  if (!session?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  
  const { symptoms, category, severity, summary, recommendations, source, messagesCount, visitDurationMs, visitId } = await req.json()
  
  const client = await clientPromise
  const db = client.db()
  
  const chatDoc: any = {
    userId: new ObjectId(session.id),
    symptoms,
    category,
    severity,
    summary,
    recommendations,
    source,
    messagesCount,
    visitDurationMs,
    visitId,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  const result = await db.collection('chat_sessions').insertOne(chatDoc)
  
  return NextResponse.json({ 
    success: true, 
    data: { session: { ...chatDoc, _id: result.insertedId } } 
  })
}

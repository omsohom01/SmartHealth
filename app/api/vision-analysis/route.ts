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
  
  const analyses = await db
    .collection('vision_analyses')
    .find({ userId: new ObjectId(session.id) })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray()
  
  return NextResponse.json({ success: true, data: { analyses } })
}

export async function POST(req: NextRequest) {
  const session = getSessionUser(req)
  if (!session?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  
  const { imageUrl, analysis, confidence, recommendation, category } = await req.json()
  
  const client = await clientPromise
  const db = client.db()
  
  const analysisDoc = {
    userId: new ObjectId(session.id),
    imageUrl,
    analysis,
    confidence,
    recommendation,
    category,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  const result = await db.collection('vision_analyses').insertOne(analysisDoc)
  
  return NextResponse.json({ 
    success: true, 
    data: { analysis: { ...analysisDoc, _id: result.insertedId } } 
  })
}

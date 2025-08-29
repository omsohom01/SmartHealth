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
  
  // Calculate mental health metrics based on recent chat sessions and user activity
  const recentChats = await db
    .collection('chat_sessions')
    .find({ 
      userId: new ObjectId(session.id),
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    })
    .toArray()
  
  // Simple scoring algorithm based on symptom severity and frequency
  let overallScore = 80 // Base score
  let stressLevel = 30
  let anxietyLevel = 25
  let moodScore = 85
  let sleepScore = 75
  
  // Adjust scores based on recent symptoms
  if (recentChats.length > 0) {
    const severeCounts = recentChats.filter(chat => chat.severity === 'Severe').length
    const moderateCounts = recentChats.filter(chat => chat.severity === 'Moderate').length
    
    overallScore -= (severeCounts * 15 + moderateCounts * 8)
    stressLevel += (severeCounts * 20 + moderateCounts * 10)
    anxietyLevel += (severeCounts * 15 + moderateCounts * 8)
    
    // Check for specific symptom categories
    const mentalHealthSymptoms = recentChats.filter(chat => 
      chat.category === 'Mental Health' || 
      chat.symptoms?.some((s: string) => ['anxiety', 'stress', 'depression', 'insomnia'].includes(s.toLowerCase()))
    ).length
    
    if (mentalHealthSymptoms > 0) {
      moodScore -= mentalHealthSymptoms * 10
      sleepScore -= mentalHealthSymptoms * 8
    }
  }
  
  // Ensure scores stay within bounds
  overallScore = Math.max(0, Math.min(100, overallScore))
  stressLevel = Math.max(0, Math.min(100, stressLevel))
  anxietyLevel = Math.max(0, Math.min(100, anxietyLevel))
  moodScore = Math.max(0, Math.min(100, moodScore))
  sleepScore = Math.max(0, Math.min(100, sleepScore))
  
  const trend = overallScore > 75 ? '+5% this week' : overallScore > 50 ? 'Stable' : '-3% this week'
  
  return NextResponse.json({ 
    success: true, 
    data: {
      overallScore,
      stress: stressLevel,
      anxiety: anxietyLevel,
      mood: moodScore,
      sleep: sleepScore,
      trend,
      recentSessionsCount: recentChats.length
    }
  })
}

export async function POST(req: NextRequest) {
  const session = getSessionUser(req)
  if (!session?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  
  const { mood, stress, anxiety, sleep, notes } = await req.json()
  
  const client = await clientPromise
  const db = client.db()
  
  const healthRecord = {
    userId: new ObjectId(session.id),
    mood,
    stress,
    anxiety,
    sleep,
    notes,
    recordedAt: new Date(),
    createdAt: new Date()
  }
  
  const result = await db.collection('mental_health_records').insertOne(healthRecord)
  
  return NextResponse.json({ 
    success: true, 
    data: { record: { ...healthRecord, _id: result.insertedId } } 
  })
}

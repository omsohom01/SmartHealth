import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    
    // Test basic connection
    await db.admin().ping()
    
    // Count users
    const userCount = await db.collection('users').countDocuments()
    
    return NextResponse.json({ 
      message: 'Database connection successful', 
      userCount,
      timestamp: new Date().toISOString() 
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ 
      error: 'Database connection failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ message: 'POST API is working', timestamp: new Date().toISOString() })
}

import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Shape expected by hooks/useAuth: { success: boolean, data: { user } }
export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("auth_session")?.value
    if (!sessionCookie) {
      return NextResponse.json({ success: false, message: 'No session' }, { status: 401 })
    }

    let sessionUser: any
    try {
      sessionUser = JSON.parse(sessionCookie)
    } catch {
      return NextResponse.json({ success: false, message: 'Bad session' }, { status: 401 })
    }

    if (!sessionUser?.id) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 })
    }

    // Verify user still exists in database
    const client = await clientPromise
    const db = client.db()
    const user = await db.collection("users").findOne({ _id: new ObjectId(sessionUser.id) })
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Return the session user data (which is already formatted correctly)
    return NextResponse.json({
      success: true,
      data: {
        user: sessionUser
      }
    })
  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 })
  }
}

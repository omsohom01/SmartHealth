import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { comparePassword } from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 422 })
    }

    const client = await clientPromise
    const db = client.db()
    const normalizedEmail = String(email).toLowerCase().trim()
    const user = await db.collection('users').findOne({ email: normalizedEmail })
    if (!user) {
      return NextResponse.json({ success: false, message: 'No user found with this email' }, { status: 404 })
    }

    const valid = await comparePassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 })
    }

    const sessionUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      specialization: user.specialization,
      experience: user.experience,
      achievements: user.achievements,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
    }
    const res = NextResponse.json({ success: true, message: 'Login successful', data: { user: sessionUser } })
    res.cookies.set('auth_session', JSON.stringify(sessionUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return res
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred during login' }, { status: 500 })
  }
}

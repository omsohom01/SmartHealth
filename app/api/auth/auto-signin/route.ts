import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { comparePassword } from '@/lib/models/user'

/**
 * POST /api/auth/auto-signin
 * Automatically re-sign in a user with stored credentials
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await comparePassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    const response = NextResponse.json({
      success: true,
      message: 'Auto sign-in successful',
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        }
      }
    })

    response.cookies.set('auth_session', JSON.stringify({ id: user._id.toString(), email: user.email, name: user.name }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response

  } catch (error) {
  console.error('Auto sign-in error:', error)
  return NextResponse.json({ success: false, message: 'Auto sign-in failed' }, { status: 500 })
  }
}

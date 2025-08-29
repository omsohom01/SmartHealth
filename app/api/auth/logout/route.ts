import { NextResponse } from "next/server"

export async function POST() {
	const res = NextResponse.json({ success: true, message: 'Logout successful' })

	// Clear both possible auth cookies to be safe
	res.cookies.set('auth_session', '', { httpOnly: true, expires: new Date(0), path: '/' })
	res.cookies.set('auth-token', '', { httpOnly: true, expires: new Date(0), path: '/' })

	return res
}


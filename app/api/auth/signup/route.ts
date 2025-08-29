import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword, createDefaultUserData, comparePassword } from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      role,
      location,
      specialization,
      experience,
      achievements,
      profilePicture,
    } = await req.json()

    // Validate input
    if (!name || !email || !password || password.length < 4) {
      return NextResponse.json({ success: false, message: "Invalid input. Password must be at least 4 characters." }, { status: 422 })
    }
    if (!role || (role !== 'doctor' && role !== 'patient')) {
      return NextResponse.json({ success: false, message: "Role must be 'doctor' or 'patient'" }, { status: 422 })
    }
    if (!location || String(location).trim().length === 0) {
      return NextResponse.json({ success: false, message: "Location is required" }, { status: 422 })
    }
    if (role === 'doctor') {
      if (!specialization || String(specialization).trim().length === 0) {
        return NextResponse.json({ success: false, message: "Specialization is required for doctors" }, { status: 422 })
      }
      const expNum = Number(experience ?? 0)
      if (!Number.isFinite(expNum) || expNum < 0) {
        return NextResponse.json({ success: false, message: "Experience must be a non-negative number" }, { status: 422 })
      }
    }

    const client = await clientPromise
    const db = client.db()

    // Check if user already exists
    const normalizedEmail = String(email).toLowerCase().trim()
    const existingUser = await db.collection("users").findOne({ email: normalizedEmail })
    if (existingUser) {
      // If user exists and password matches, treat as login (quality-of-life UX)
      const matches = await comparePassword(password, existingUser.password)
      if (matches) {
        const user = {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
        }
        const response = NextResponse.json({ success: true, message: 'Signed in to existing account', data: { user } })
        response.cookies.set("auth_session", JSON.stringify(user), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          sameSite: 'lax',
        })
        return response
      }
      return NextResponse.json({ success: false, message: "User with this email already exists." }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user with default data
    const userData: any = {
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      location: String(location).trim(),
      // Only set doctor fields when role is doctor
      ...(role === 'doctor'
        ? {
            specialization: String(specialization).trim(),
            experience: Number(experience ?? 0),
            achievements: Array.isArray(achievements)
              ? achievements
              : typeof achievements === 'string'
                ? achievements
                    .split(/\r?\n|,/)
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                : [],
          }
        : {
            specialization: null,
            experience: 0,
            achievements: [],
          }),
      profilePicture: typeof profilePicture === 'string' ? profilePicture : null,
      ...createDefaultUserData(),
    }

    const result = await db.collection("users").insertOne(userData)

    // Create session
    const user = {
      id: result.insertedId.toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
    }

    // Set session cookie
  const response = NextResponse.json({ success: true, message: 'Account created successfully', data: { user } }, { status: 201 })
    response.cookies.set("auth_session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during signup." }, { status: 500 })
  }
}

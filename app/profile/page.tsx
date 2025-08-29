"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Settings, Activity, Calendar, Mail, Shield, MapPin, Award, Briefcase } from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Always show a dark intro loading screen for 2 seconds on mount
  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 2000)
    return () => clearTimeout(t)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (showIntro) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#050506]">
        {/* Subtle grain overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "url('data:image/svg+xml;utf8, %3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\'%3E%3Cfilter id=\\'n\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.9\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3CfeColorMatrix type=\\'saturate\\' values=\\'0\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23n)\\'/%3E%3C/svg%3E')" }} />

        {/* Moving radial glows (neutral grays) */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[45rem] w-[45rem] rounded-full bg-gradient-to-br from-white/5 via-white/0 to-transparent blur-3xl animate-[pulse_9s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[35rem] w-[35rem] rounded-full bg-gradient-to-tl from-white/5 via-white/0 to-transparent blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />

        {/* Centerpiece loader */}
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="relative">
            {/* Rotating conic ring (grayscale) */}
            <div className="relative h-28 w-28 rounded-full">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(255,255,255,0.0)_0%,rgba(255,255,255,0.16)_25%,rgba(200,200,200,0.22)_50%,rgba(255,255,255,0.16)_75%,rgba(255,255,255,0.0)_100%)] animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-[6px] rounded-full bg-[#0a0b0d] border border-white/5" />
              {/* Inner pulsing dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-white/80 shadow-[0_0_18px_3px_rgba(255,255,255,0.25)] animate-[pulse_1.7s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
        </div>

        {/* Subtle animated grid */}
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:36px_36px] animate-[move_30s_linear_infinite]" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
  <div className="min-h-screen bg-[#07080a] relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.85),transparent_65%)]" />
    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%)] bg-[size:64px_64px] animate-[move_25s_linear_infinite]" />
    <div className="absolute -top-20 -left-20 h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)] blur-3xl animate-[pulse_12s_ease-in-out_infinite]" />
    <div className="absolute -bottom-20 -right-20 h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)] blur-3xl animate-[pulse_12s_ease-in-out_infinite_2s]" />
    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url('data:image/svg+xml;utf8, %3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\'%3E%3Cfilter id=\\'n\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.9\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3CfeColorMatrix type=\\'saturate\\' values=\\'0\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23n)\\'/%3E%3C/svg%3E')" }} />
      </div>

      <div className="pt-16">
        <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Card className="w-full max-w-4xl bg-gray-900/95 border border-white/10 backdrop-blur-md shadow-2xl shadow-white/5 transition-all duration-500 hover:shadow-white/10 animate-[fadeIn_0.5s_ease-out]">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="pb-6 pt-8">
                <div className="flex items-center space-x-6">
                  {user?.profilePicture ? (
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-white/10 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                      <img
                        src={user.profilePicture || "/placeholder.svg"}
                        alt="Profile"
                        className="relative w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-lg shadow-black/40 transition-all duration-300 group-hover:border-white/40"
                      />
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-white/10 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative w-20 h-20 bg-gradient-to-br from-gray-700/60 to-gray-600/60 rounded-full flex items-center justify-center shadow-lg shadow-black/40 transition-all duration-300">
                        <User className="w-10 h-10 text-gray-100" />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-semibold text-gray-100 tracking-tight bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent animate-[fadeIn_0.7s_ease-out]">
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-lg animate-[fadeIn_0.9s_ease-out]">
                      Your professional account details
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 px-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 transition-all duration-300 hover:border-white/20 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-black/30 group animate-[fadeIn_1s_ease-out]">
                      <div className="p-2 rounded-lg bg-white/5 transition-all duration-300">
                        <User className="w-5 h-5 text-gray-300" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                          Full Name
                        </label>
                        <p className="text-gray-100 font-medium text-lg">{user?.name || "Demo User"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 transition-all duration-300 hover:border-white/20 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-black/30 group animate-[fadeIn_1.2s_ease-out]">
                      <div className="p-2 rounded-lg bg-white/5 transition-all duration-300">
                        <Mail className="w-5 h-5 text-gray-300" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                          Email Address
                        </label>
                        <p className="text-gray-100 font-medium text-lg">{user?.email || "demo@synaptix.com"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 transition-all duration-300 hover:border-white/20 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-black/30 group animate-[fadeIn_1.4s_ease-out]">
                      <div className="p-2 rounded-lg bg-white/5 transition-all duration-300">
                        <MapPin className="w-5 h-5 text-gray-300" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                          Location
                        </label>
                        <p className="text-gray-100 font-medium text-lg">{user?.location || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 transition-all duration-300 hover:border-white/20 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-black/30 group animate-[fadeIn_1.6s_ease-out]">
                      <div className="p-2 rounded-lg bg-white/5 transition-all duration-300">
                        <Shield className="w-5 h-5 text-gray-300" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Role</label>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-white/10 text-gray-100 border border-white/20 px-3 py-1">
                            {(user?.role || "user").toString()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 transition-all duration-300 hover:border-white/20 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-black/30 group animate-[fadeIn_1.8s_ease-out]">
                      <div className="p-2 rounded-lg bg-white/5 transition-all duration-300">
                        <Calendar className="w-5 h-5 text-gray-300" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                          Member Since
                        </label>
                        <p className="text-gray-100 font-medium text-lg">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Today"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Separator className="bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm" />
                </div>

                {user?.role === "doctor" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 transition-all duration-300 hover:border-white/20 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-black/30 group animate-[fadeIn_2s_ease-out]">
                        <div className="p-2 rounded-lg bg-white/5 transition-all duration-300">
                          <Activity className="w-5 h-5 text-gray-300" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                            Specialization
                          </label>
                          <div>
                            <Badge className="bg-white/10 text-gray-100 border border-white/20">
                              {user?.specialization || "—"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 transition-all duration-300 hover:border-white/20 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-black/30 group animate-[fadeIn_2.2s_ease-out] ">
                        <div className="p-2 rounded-lg bg-white/5 transition-all duration-300">
                          <Briefcase className="w-5 h-5 text-gray-300" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                            Experience
                          </label>
                          <p className="text-gray-100 font-medium text-lg">
                            {typeof user?.experience === "number"
                              ? `${user.experience} year${user.experience === 1 ? "" : "s"}`
                              : "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 animate-[fadeIn_2.4s_ease-out]">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-white/5">
                          <Award className="w-5 h-5 text-gray-300" />
                        </div>
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                          Achievements
                        </label>
                      </div>
                      {Array.isArray(user?.achievements) && user!.achievements!.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2 text-gray-200 ml-4">
                          {user!.achievements!.map((a: string, idx: number) => (
                            <li key={idx} className="transition-colors duration-200 hover:text-gray-100">
                              {a}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 ml-4">No achievements added yet.</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-white/70 rounded-full animate-pulse shadow-lg shadow-black/40" />
                      <div className="absolute inset-0 w-4 h-4 bg-white/60 rounded-full animate-ping opacity-50" />
                    </div>
                    <span className="text-sm text-gray-400 font-medium">Authentication Status:</span>
                    <span className="text-gray-200 font-semibold tracking-wide">Verified</span>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border border-white/20 bg-gradient-to-r from-gray-800/60 to-gray-700/60 text-gray-100 hover:border-white/40 hover:from-gray-700/60 hover:to-gray-600/60 transition-all duration-300 hover:shadow-lg hover:shadow-black/30 group backdrop-blur-sm"
                    onClick={() => router.push("/profile/edit")}
                  >
                    <Settings className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Edit Profile
                  </Button>
                </div>
                <div className="flex gap-4 pt-2">
                  {user?.role === 'patient' && (
                    <a href="/dashboard/patient" className="text-sm underline">Go to Patient Dashboard</a>
                  )}
                  {user?.role === 'doctor' && (
                    <a href="/dashboard/doctor" className="text-sm underline">Go to Doctor Dashboard</a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
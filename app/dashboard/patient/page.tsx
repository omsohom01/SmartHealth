"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { format } from 'date-fns'
import {
    Calendar,
    Clock,
    Heart,
    Activity,
    Brain,
    Eye,
    MessageCircle,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    XCircle,
    User,
    Stethoscope,
    Camera,
    BarChart3,
    PieChart,
    ArrowRight,
    Plus
} from 'lucide-react'

export default function PatientDashboard() {
    const { isAuthenticated, user } = useAuth()
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [mentalHealthData, setMentalHealthData] = useState({
        overallScore: 0,
        stress: 0,
        anxiety: 0,
        mood: 0,
        sleep: 0,
        trend: 'Loading...'
    })
    const [visionAnalysis, setVisionAnalysis] = useState<any[]>([])
    const [chatbotHistory, setChatbotHistory] = useState<any[]>([])

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'patient') return

        const loadData = async () => {
            try {
                // Load appointments
                const appointmentsRes = await fetch('/api/appointments', { credentials: 'include' })
                const appointmentsData = await appointmentsRes.json()
                if (appointmentsData.success) setAppointments(appointmentsData.data.appointments)

                // Load mental health data
                const mentalHealthRes = await fetch('/api/mental-health', { credentials: 'include' })
                const mentalHealthResult = await mentalHealthRes.json()
                if (mentalHealthResult.success) setMentalHealthData(mentalHealthResult.data)

                // Load vision analysis
                const visionRes = await fetch('/api/vision-analysis', { credentials: 'include' })
                const visionData = await visionRes.json()
                if (visionData.success) setVisionAnalysis(visionData.data.analyses || [])

                // Load chat history
                const chatRes = await fetch('/api/chat-history', { credentials: 'include' })
                const chatData = await chatRes.json()
                if (chatData.success) setChatbotHistory(chatData.data.sessions || [])

            } catch (error) {
                console.error('Failed to load dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [isAuthenticated, user?.role])

    if (!isAuthenticated || user?.role !== 'patient') {
        return (
            <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
                <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Access Denied</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400">Please sign in as a patient to view this dashboard.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'text-green-400 border-green-400'
            case 'pending': return 'text-yellow-400 border-yellow-400'
            case 'rejected': return 'text-red-400 border-red-400'
            default: return 'text-gray-400 border-gray-400'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-4 h-4" />
            case 'pending': return <Clock className="w-4 h-4" />
            case 'rejected': return <XCircle className="w-4 h-4" />
            default: return <AlertCircle className="w-4 h-4" />
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0b0d] relative overflow-hidden mt-4">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.02)_50%,rgba(255,255,255,0.02)_75%,transparent_75%)] bg-[size:60px_60px] animate-[move_20s_linear_infinite]" />
                <div className="absolute -top-20 -left-20 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute -bottom-20 -right-20 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent_70%)] blur-3xl animate-[pulse_8s_ease-in-out_infinite_2s]" />
            </div>

            <div className="pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome back, {user?.name?.split(' ')[0] || 'Patient'}
                        </h1>
                        <p className="text-gray-400">Here's your health overview for today</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-700/30 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-300 text-sm font-medium">Total Appointments</p>
                                        <p className="text-2xl font-bold text-white">{appointments.length}</p>
                                    </div>
                                    <Calendar className="w-8 h-8 text-blue-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-green-700/30 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-300 text-sm font-medium">Mental Health Score</p>
                                        <p className="text-2xl font-bold text-white">{mentalHealthData.overallScore}%</p>
                                    </div>
                                    <Heart className="w-8 h-8 text-green-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-700/30 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-300 text-sm font-medium">Vision Scans</p>
                                        <p className="text-2xl font-bold text-white">{visionAnalysis.length}</p>
                                    </div>
                                    <Eye className="w-8 h-8 text-purple-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-orange-700/30 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-300 text-sm font-medium">Chat Sessions</p>
                                        <p className="text-2xl font-bold text-white">{chatbotHistory.length}</p>
                                    </div>
                                    <MessageCircle className="w-8 h-8 text-orange-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Upcoming Appointments */}
                            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-md">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                        Upcoming Appointments
                                    </CardTitle>
                                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Book New
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {loading ? (
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="animate-pulse">
                                                    <div className="h-20 bg-gray-800 rounded-lg" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : appointments.length > 0 ? (
                                        <div className="space-y-3">
                                            {appointments.map((appointment) => (
                                                <div key={appointment._id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center">
                                                                <Stethoscope className="w-5 h-5 text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-white">Dr. {appointment.doctor?.name}</h4>
                                                                <p className="text-sm text-gray-400">{appointment.doctor?.specialization}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <Badge variant="outline" className={`${getStatusColor(appointment.status)} bg-transparent`}>
                                                                {getStatusIcon(appointment.status)}
                                                                <span className="ml-1 capitalize">{appointment.status}</span>
                                                            </Badge>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {appointment.scheduledAt
                                                                    ? format(new Date(appointment.scheduledAt), 'MMM dd, h:mm a')
                                                                    : `Deadline: ${format(new Date(appointment.deadline), 'MMM dd, h:mm a')}`
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                            <p className="text-gray-400">No appointments scheduled</p>
                                            <Button variant="outline" className="mt-3 border-gray-600 text-gray-300 hover:bg-gray-700">
                                                Book Your First Appointment
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Vision Analysis */}
                            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                                        <Camera className="w-5 h-5 text-purple-400" />
                                        Recent Vision Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {visionAnalysis.length > 0 ? (
                                        visionAnalysis.slice(0, 3).map((scan) => (
                                            <div key={scan._id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-purple-900/50 rounded-full flex items-center justify-center">
                                                            <Eye className="w-5 h-5 text-purple-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-white">{scan.analysis}</h4>
                                                            <p className="text-sm text-gray-400">{format(new Date(scan.createdAt), 'MMM dd, yyyy')}</p>
                                                        </div>
                                                    </div>
                                                    <Badge className="bg-purple-900/30 text-purple-300 border-purple-700">
                                                        {scan.confidence}% confidence
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-300">{scan.recommendation}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <Camera className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                            <p className="text-gray-400">No vision analyses yet</p>
                                            <Button variant="outline" className="mt-3 border-gray-600 text-gray-300 hover:bg-gray-700">
                                                Try Synaptix Vision
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Mental Health Overview */}
                            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                                        <Brain className="w-5 h-5 text-green-400" />
                                        Mental Health
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white mb-2">{mentalHealthData.overallScore}%</div>
                                        <p className="text-sm text-gray-400">Overall Wellness Score</p>
                                        <p className="text-xs text-green-400 mt-1">{mentalHealthData.trend}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-300">Stress Level</span>
                                                <span className="text-gray-400">{mentalHealthData.stress}%</span>
                                            </div>
                                            <Progress value={mentalHealthData.stress} className="h-2 bg-gray-800" />
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-300">Anxiety</span>
                                                <span className="text-gray-400">{mentalHealthData.anxiety}%</span>
                                            </div>
                                            <Progress value={mentalHealthData.anxiety} className="h-2 bg-gray-800" />
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-300">Mood</span>
                                                <span className="text-gray-400">{mentalHealthData.mood}%</span>
                                            </div>
                                            <Progress value={mentalHealthData.mood} className="h-2 bg-gray-800" />
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-300">Sleep Quality</span>
                                                <span className="text-gray-400">{mentalHealthData.sleep}%</span>
                                            </div>
                                            <Progress value={mentalHealthData.sleep} className="h-2 bg-gray-800" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Chatbot Interactions */}
                            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5 text-orange-400" />
                                        Recent Symptoms
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {chatbotHistory.length > 0 ? (
                                        chatbotHistory.slice(0, 3).map((session) => (
                                            <div key={session._id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-white">{session.category}</h4>
                                                    <Badge variant="outline" className={`${session.severity === 'Mild' ? 'text-green-400 border-green-400' :
                                                            session.severity === 'Moderate' ? 'text-yellow-400 border-yellow-400' :
                                                                'text-red-400 border-red-400'
                                                        } bg-transparent`}>
                                                        {session.severity}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {session.symptoms?.map((symptom: string, idx: number) => (
                                                        <span key={idx} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                                                            {symptom}
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-500">{format(new Date(session.createdAt), 'MMM dd, yyyy')}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                            <p className="text-gray-400">No chat sessions yet</p>
                                                <Button variant="outline" className="mt-3 border-gray-600 text-gray-300 hover:bg-gray-700">
                                                    <MessageCircle className="w-4 h-4 mr-2" />
                                                    Start Chat
                                                </Button>
                                        </div>
                                    )}

                                    {chatbotHistory.length > 0 && (
                                        <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Start New Chat
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

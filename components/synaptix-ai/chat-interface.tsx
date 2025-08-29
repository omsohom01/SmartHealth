"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Bot, User, MapPin, Stethoscope, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Mic, Send } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [inferredSpec, setInferredSpec] = useState<string | null>(null)
  const [recommendedDoctors, setRecommendedDoctors] = useState<Array<{id:string;name:string;specialization:string;location?:string;profilePicture?:string|null}>>([])
  const [recLoading, setRecLoading] = useState<boolean>(false)
  const [userCoords, setUserCoords] = useState<{lat:number; lon:number} | null>(null)
  const [nearbyClinics, setNearbyClinics] = useState<Array<{name:string; lat:number; lon:number; type:string}>>([])
  const [showMap, setShowMap] = useState(false)

  // Session analytics and persistence on unmount
  const sessionStartRef = useRef<number>(Date.now())
  const msgCountRef = useRef<number>(0)
  const collectedSymptomsRef = useRef<Set<string>>(new Set())
  const severityScoreRef = useRef<number>(0)
  const visitIdRef = useRef<string>(`ai-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`)

  function extractSymptoms(text: string): string[] {
    const corpus = text.toLowerCase()
    const dict = [
      'anxiety','stress','depression','insomnia','panic','sad','hopeless','worthless',
      'headache','nausea','fever','cough','fatigue','dizzy','pain','chest pain','shortness of breath'
    ]
    return Array.from(new Set(dict.filter(k => corpus.includes(k))))
  }

  function updateAnalyticsFromUser(text: string) {
    msgCountRef.current += 1
    extractSymptoms(text).forEach(s => collectedSymptomsRef.current.add(s))
    const t = text.toLowerCase()
    let delta = 0
    if (/(severe|cannot|suicid|self-harm|chest pain|faint|blackout)/.test(t)) delta += 3
    if (/(worse|pain|panic|insomnia|anxiety|depress|breath)/.test(t)) delta += 2
    if (/(mild|slight|okay|better)/.test(t)) delta -= 1
    severityScoreRef.current += delta
  }

  function severityLabel(): 'Mild'|'Moderate'|'Severe' {
    const s = severityScoreRef.current
    if (s >= 6) return 'Severe'
    if (s >= 2) return 'Moderate'
    return 'Mild'
  }

  // Scoring-based specialization inference (reduces misclassification like "bone broke" -> Orthopedist)
  function inferSpecialization(text: string): string | null {
    const t = text.toLowerCase()
    const buckets: Record<string, number> = {
      'Orthopedist': 0,
      'Cardiologist': 0,
      'Dermatologist': 0,
      'Psychiatrist': 0,
      'Endocrinologist': 0,
      'Gastroenterologist': 0,
      'Ophthalmologist': 0,
      'ENT Specialist': 0,
      'General Physician': 0,
    }

    const add = (spec: string, weight = 1) => { buckets[spec] += weight }

    // Orthopedics
    if (/(bone|fracture|broken|break|sprain|dislocation|joint|knee|shoulder|elbow|wrist|ankle|back pain|orthopedic)/.test(t)) add('Orthopedist', 3)
    if (/(cast|plaster|immobilize)/.test(t)) add('Orthopedist', 2)

    // Cardio
    if (/(chest pain|shortness of breath|heart|palpitation|hypertension|bp|blood pressure|angina)/.test(t)) add('Cardiologist', 3)

    // Dermatology
    if (/(skin|rash|acne|dermatitis|eczema|psoriasis|mole|itch|hives)/.test(t)) add('Dermatologist', 2)

    // Psychiatry
    if (/(anxiety|depress|panic|insomnia|mental|mood|stress)/.test(t)) add('Psychiatrist', 2)

    // Endocrine
    if (/(diabetes|thyroid|hormone|pcos|metabolism)/.test(t)) add('Endocrinologist', 2)

    // Gastro
    if (/(stomach|abdomen|gastric|ulcer|acid|ibs|constipation|diarrhea)/.test(t)) add('Gastroenterologist', 2)

    // Ophthalmology
    if (/(eye|vision|blurry|red eye|conjunctivitis|ophthalm)/.test(t)) add('Ophthalmologist', 2)

    // ENT
    if (/(ear|throat|sinus|tonsil|nose|ent)/.test(t)) add('ENT Specialist', 2)

    // General
    if (/(fever|cough|cold|flu|fatigue|general)/.test(t)) add('General Physician', 1)

    // Conflict resolution: if orthopedics keywords present, dampen skin score (e.g., wound on skin from fracture)
    if (buckets['Orthopedist'] >= 3) buckets['Dermatologist'] = Math.max(0, buckets['Dermatologist'] - 2)

    const best = Object.entries(buckets).sort((a,b) => b[1]-a[1])[0]
    if (!best || best[1] <= 0) return null
    return best[0]
  }

  function getSpecAliases(spec: string): string[] {
    const s = spec.toLowerCase()
    if (s.includes('orthop')) return ['Orthopedist', 'Orthopedic', 'Orthopaedic', 'Orthopedic Surgeon', 'Orthopedics']
    if (s.includes('card')) return ['Cardiologist', 'Cardiology', 'Heart Specialist']
    if (s.includes('derma') || s.includes('skin')) return ['Dermatologist', 'Dermatology', 'Skin Specialist']
    if (s.includes('psychi') || s.includes('mental')) return ['Psychiatrist', 'Psychology', 'Mental Health']
    if (s.includes('endo') || s.includes('thyroid') || s.includes('diabet')) return ['Endocrinologist', 'Endocrinology', 'Diabetologist']
    if (s.includes('gastro') || s.includes('stomach')) return ['Gastroenterologist', 'Gastroenterology']
    if (s.includes('ophthal') || s.includes('eye')) return ['Ophthalmologist', 'Ophthalmology', 'Eye Specialist']
    if (s.includes('ent') || s.includes('ear') || s.includes('throat') || s.includes('nose')) return ['ENT Specialist', 'Otolaryngologist']
    if (s.includes('general') || s.includes('fever') || s.includes('cold') || s.includes('flu')) return ['General Physician', 'Internal Medicine']
    return [spec]
  }

  async function fetchDoctorsForSpec(spec: string) {
  setRecLoading(true)
    const aliases = getSpecAliases(spec)
    const seen = new Set<string>()
    const results: Array<{id:string;name:string;specialization:string;location?:string;profilePicture?:string|null}> = []
    for (const a of aliases) {
      try {
        const r = await fetch(`/api/doctors?specialization=${encodeURIComponent(a)}`)
        const j = await r.json()
        if (j?.success && Array.isArray(j.data?.doctors)) {
          for (const d of j.data.doctors) {
            if (!seen.has(d.id)) { seen.add(d.id); results.push(d) }
          }
        }
        if (results.length) break
      } catch { /* continue */ }
    }
    if (!results.length) {
      const partial = spec.slice(0, Math.min(6, spec.length))
      try {
        const r2 = await fetch(`/api/doctors?specialization=${encodeURIComponent(partial)}`)
        const j2 = await r2.json()
        if (j2?.success && Array.isArray(j2.data?.doctors)) {
          for (const d of j2.data.doctors) {
            if (!seen.has(d.id)) { seen.add(d.id); results.push(d) }
          }
        }
      } catch { /* noop */ }
    }
    setRecommendedDoctors(results)
  setRecLoading(false)
  }

  function haversine(lat1:number, lon1:number, lat2:number, lon2:number) {
    const toRad = (d:number) => d * Math.PI / 180
    const R = 6371
    const dLat = toRad(lat2-lat1)
    const dLon = toRad(lon2-lon1)
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  async function fetchNearbyClinics(lat:number, lon:number) {
    try {
      const query = `\n[out:json][timeout:25];\n(\n  node["amenity"~"clinic|hospital"](around:5000,${lat},${lon});\n  way["amenity"~"clinic|hospital"](around:5000,${lat},${lon});\n  relation["amenity"~"clinic|hospital"](around:5000,${lat},${lon});\n);\nout center 20;\n`
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: query,
      })
      const data = await res.json()
      const items: Array<{name:string; lat:number; lon:number; type:string; dist:number}> = []
      for (const el of data.elements || []) {
        const name = el.tags?.name || 'Clinic/Hospital'
        const latc = el.lat || el.center?.lat
        const lonc = el.lon || el.center?.lon
        if (typeof latc === 'number' && typeof lonc === 'number') {
          items.push({ name, lat: latc, lon: lonc, type: el.tags?.amenity || 'clinic', dist: haversine(lat, lon, latc, lonc) })
        }
      }
      items.sort((a,b) => a.dist - b.dist)
      setNearbyClinics(items.slice(0, 10))
    } catch (e) {
      console.error('Overpass error', e)
    }
  }

  function bboxFromCenter(lat:number, lon:number, km=2) {
    const d = km / 111
    return { minLat: lat - d, maxLat: lat + d, minLon: lon - d, maxLon: lon + d }
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initial AI greeting
  useEffect(() => {
    const initialGreeting = {
      id: 0,
      type: "ai" as const,
      content: "Hello! I'm Synaptix AI, your medical assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages([initialGreeting])
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === "") return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

  setMessages((prev) => [...prev, userMessage])
  updateAnalyticsFromUser(userMessage.content)
    // Pre-infer specialization to start fetching immediately
    const preSpec = inferSpecialization(userMessage.content)
    if (preSpec) {
      setInferredSpec(preSpec)
      fetchDoctorsForSpec(preSpec)
    } else {
      setRecommendedDoctors([])
    }
    setInput("")
    setIsTyping(true)

    try {
      // Format messages for Gemini API
      const conversationHistory = messages
        .filter(msg => msg.id !== 0) // Exclude initial greeting
        .map(msg => ({
          role: msg.type === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        }));

      // Add current user message
      const currentUserMessage = {
        role: "user",
        parts: [{ text: userMessage.content }]
      };

      const allMessages = [...conversationHistory, currentUserMessage];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: allMessages
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const aiResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiResponse])

      // Infer specialization from combined user + AI text
      const spec = inferSpecialization(`${userMessage.content}\n${data.response}`)
      setInferredSpec(spec)
      if (spec) {
        fetchDoctorsForSpec(spec)
      } else {
        setRecommendedDoctors([])
      }

      // Geolocation + clinics
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords
          setUserCoords({ lat: latitude, lon: longitude })
          setShowMap(true)
          await fetchNearbyClinics(latitude, longitude)
        }, () => setShowMap(false), { enableHighAccuracy: true, timeout: 8000 })
      }
    } catch (error) {
      console.error("Error fetching AI response:", error)
      const errorMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Persist summarized chat session on unmount
  useEffect(() => {
    return () => {
      try {
        const duration = Date.now() - sessionStartRef.current
        const payload = {
          symptoms: Array.from(collectedSymptomsRef.current),
          category: 'General',
          severity: severityLabel(),
          summary: (msgCountRef.current > 0
            ? 'Synaptix AI chat summary (auto-collected)'
            : 'Synaptix AI visit recorded (no messages)'
          ).concat(
            collectedSymptomsRef.current.size ? `; Key symptoms: ${Array.from(collectedSymptomsRef.current).join(', ')}` : ''
          ),
          recommendations: [],
          source: 'chat',
          messagesCount: msgCountRef.current,
          visitDurationMs: duration,
          visitId: visitIdRef.current
        }
        fetch('/api/chat-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        }).catch(() => {})
      } catch (_) {}
    }
  }, [])

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] bg-gray-950 flex flex-col", // Always fullscreen
      )}
    >
      {/* Chat Interface - Always full height, no rounded corners, no extra borders/shadows from Card */}
      <Card
        className={cn(
          "h-full w-full rounded-none border-0 bg-gray-950/95 shadow-none flex flex-col", // Always fullscreen styling
        )}
      >
        {/* Stylish background effects for the card */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 via-transparent to-gray-700/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />

  {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className={cn(
            "overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 relative flex-grow bg-gray-950/50 mt-16 sm:mt-20",
          )}
        >
          {/* Subtle background pattern */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 sm:gap-4 animate-fade-in relative",
                message.type === "user" ? "flex-row-reverse" : "",
              )}
              style={{ animationDelay: `${index * 0.1}s` }} // Faster animation for smoother flow
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg relative",
                  message.type === "user"
                    ? "bg-gradient-to-br from-gray-600 to-gray-700"
                    : "bg-gradient-to-br from-gray-500 to-gray-600",
                )}
              >
                {message.type === "user" ? (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                ) : (
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                )}
                {/* Subtle glow for avatars */}
                <div className="absolute inset-0 bg-gray-400/10 rounded-xl blur-sm" />
              </div>

              <div
                className={cn(
                  "flex-1 max-w-[calc(100%-3rem)] sm:max-w-[calc(100%-4rem)]",
                  message.type === "user" ? "text-right" : "text-left",
                )}
              >
                <div
                  className={cn(
                    "inline-block rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base leading-relaxed break-words shadow-lg relative overflow-hidden",
                    message.type === "user"
                      ? "bg-gradient-to-br from-gray-700 to-gray-800 text-white border border-gray-600/30"
                      : "bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-gray-100 border border-gray-600/30 backdrop-blur-sm",
                  )}
                >
                  {/* Message background effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    {message.type === "ai" ? (
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown 
                          components={{
                            h1: ({children}) => (
                              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 mt-3 leading-tight">{children}</h1>
                            ),
                            h2: ({children}) => (
                              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 mt-3 leading-tight">{children}</h2>
                            ),
                            h3: ({children}) => (
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-2 mt-2 leading-tight">{children}</h3>
                            ),
                            h4: ({children}) => (
                              <h4 className="text-base sm:text-lg lg:text-xl font-medium text-white mb-2 mt-2">{children}</h4>
                            ),
                            p: ({children}) => (
                              <p className="text-gray-100 mb-3 last:mb-0 leading-relaxed">{children}</p>
                            ),
                            ul: ({children}) => (
                              <ul className="list-disc list-inside text-gray-100 space-y-2 my-3 ml-3">{children}</ul>
                            ),
                            ol: ({children}) => (
                              <ol className="list-decimal list-inside text-gray-100 space-y-2 my-3 ml-3">{children}</ol>
                            ),
                            li: ({children}) => (
                              <li className="text-gray-100 leading-relaxed">{children}</li>
                            ),
                            strong: ({children}) => (
                              <strong className="font-bold text-white">{children}</strong>
                            ),
                            em: ({children}) => (
                              <em className="italic text-gray-200">{children}</em>
                            ),
                            code: ({children}) => (
                              <code className="bg-gray-700/50 text-gray-200 px-2 py-1 rounded text-sm font-mono">{children}</code>
                            ),
                            pre: ({children}) => (
                              <pre className="bg-gray-700/50 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm font-mono my-3">{children}</pre>
                            ),
                            blockquote: ({children}) => (
                              <blockquote className="border-l-4 border-gray-500 pl-4 my-3 text-gray-200 italic">{children}</blockquote>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span>{message.content}</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1 sm:mt-2 font-medium">{message.timestamp}</div>
              </div>
            </div>
          ))}

          {/* Enhanced Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3 sm:gap-4 animate-fade-in">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0 shadow-lg relative">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <div className="absolute inset-0 bg-gray-400/10 rounded-xl blur-sm" />
              </div>
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/30 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-sm shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <div className="flex space-x-1 relative z-10">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />

          {/* Doctor Recommendations & Map */}
          {(inferredSpec || showMap) && (
            <div className="mt-6 space-y-4">
              {inferredSpec && (
                <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="w-5 h-5 text-gray-200" />
                    <div className="text-gray-200 font-semibold">Recommended Specialists</div>
                  </div>
                  <div className="text-sm text-gray-300 mb-3">Suggested specialization: <span className="font-medium text-white">{inferredSpec}</span></div>
                  {recLoading ? (
                    <div className="text-sm text-gray-400">Searching specialists...</div>
                  ) : recommendedDoctors.length > 0 ? (
                    <div className="space-y-2">
            {recommendedDoctors.slice(0,3).map((d) => (
                        <div key={d.id} className="flex items-center justify-between bg-gray-900/40 border border-gray-700/50 rounded-xl px-3 py-2">
                          <div>
                            <div className="text-white font-medium">{d.name}</div>
                            <div className="text-xs text-gray-400">{d.specialization}{d.location ? ` • ${d.location}` : ''}</div>
                          </div>
              <a href={`/appointments/book?specialization=${encodeURIComponent(inferredSpec || '')}&doctorId=${encodeURIComponent(d.id)}`} className="text-sm text-gray-200 hover:underline">Book</a>
                        </div>
                      ))}
                      {recommendedDoctors.length === 0 && (
                        <div className="text-sm text-gray-400">No matching doctors found right now.</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">No matching doctors found right now.</div>
                  )}
                </div>
              )}

              {showMap && userCoords && (
                <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-gray-200" />
                    <div className="text-gray-200 font-semibold">Nearby Clinics & Hospitals</div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl overflow-hidden border border-gray-700/50">
                      {(() => {
                        const target = nearbyClinics[0] || { lat: userCoords.lat, lon: userCoords.lon }
                        const bbox = bboxFromCenter(target.lat, target.lon, 2)
                        const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.minLon}%2C${bbox.minLat}%2C${bbox.maxLon}%2C${bbox.maxLat}&layer=mapnik&marker=${target.lat}%2C${target.lon}`
                        const link = `https://www.openstreetmap.org/?mlat=${target.lat}&mlon=${target.lon}#map=15/${target.lat}/${target.lon}`
                        return (
                          <div className="relative">
                            <iframe className="w-full h-64" src={src} loading="lazy" />
                            <a href={link} target="_blank" className="absolute top-2 right-2 text-xs text-gray-200 bg-gray-900/70 px-2 py-1 rounded flex items-center gap-1"><ExternalLink className="w-3 h-3"/>Open</a>
                          </div>
                        )
                      })()}
                    </div>
                    <div className="space-y-2 max-h-64 overflow-auto pr-1">
                      {nearbyClinics.slice(0,6).map((c, idx) => (
                        <div key={idx} className="flex items-start justify-between bg-gray-900/40 border border-gray-700/50 rounded-xl px-3 py-2">
                          <div>
                            <div className="text-white text-sm font-medium">{c.name}</div>
                            <div className="text-xs text-gray-400 capitalize">{c.type.replace('_',' ')}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a href={`https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lon}#map=16/${c.lat}/${c.lon}`} target="_blank" className="text-xs text-gray-200 hover:underline">Map</a>
                            {userCoords && (
                              <a href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userCoords.lat}%2C${userCoords.lon}%3B${c.lat}%2C${c.lon}`} target="_blank" className="text-xs text-gray-200 hover:underline">Navigate</a>
                            )}
                          </div>
                        </div>
                      ))}
                      {nearbyClinics.length === 0 && (
                        <div className="text-sm text-gray-400">Locating nearby clinics...</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Chat Input */}
        <form
          onSubmit={handleSendMessage}
          className={cn(
            "border-t border-gray-700/40 p-3 sm:p-4 lg:p-5 relative flex-shrink-0 bg-gray-900/90",
          )}
        >
          {/* Input background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/30 via-gray-700/20 to-gray-800/30 pointer-events-none" />

          <div className="flex items-center gap-2 sm:gap-3 relative z-10">
            <div className="flex-1 min-w-0 relative">
              <input
                type="text"
                placeholder="Ask about symptoms, medications, or health concerns..."
                className="w-full bg-gray-700/60 backdrop-blur-sm border border-gray-600/40 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-gray-500/60 focus:bg-gray-700/80 transition-all duration-300 shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
              />
              {/* Input field glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-gray-500/10 rounded-xl sm:rounded-2xl pointer-events-none" />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-xl transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 backdrop-blur-sm border border-gray-600/20 hover:border-gray-500/40"
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <Button
              type="submit"
              size="icon"
              className="bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-xl transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 shadow-lg border border-gray-500/30 hover:border-gray-400/50"
              disabled={isTyping || input.trim() === ""}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

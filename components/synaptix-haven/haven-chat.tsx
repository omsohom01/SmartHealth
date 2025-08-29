"use client"

import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { TherapistAvatar } from "@/components/synaptix-haven/avatar-therapist"

interface Message {
  id: number
  role: "user" | "model"
  text: string
  ts: number
}

const supportsSpeech = typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)

export function HavenChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [needsInteraction, setNeedsInteraction] = useState(false)
  const [interimText, setInterimText] = useState<string>("")
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const autoRestartRef = useRef(true)
  const readyRef = useRef(false)
  const startingRef = useRef(false)
  const streamRef = useRef<MediaStream | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const emotionRef = useRef<string>("calm")
  const analyzeIntervalRef = useRef<number | null>(null)
  const finalBufferRef = useRef<string>("")
  const debounceTimerRef = useRef<number | null>(null)
  const lastAITextRef = useRef<string>("")
  const currentRequestIdRef = useRef<number>(0)
  const currentFetchRef = useRef<AbortController | null>(null)
  const calibratingRef = useRef<boolean>(true)
  const baselineRef = useRef<{ f0: number[]; rms: number[] }>({ f0: [], rms: [] })
  const silenceTimerRef = useRef<number | null>(null)
  const quickFinalTimerRef = useRef<number | null>(null)
  const utteranceBufferRef = useRef<string>("")
  const awaitingReplyRef = useRef<boolean>(false)
  const lastSpeechTsRef = useRef<number>(0)
  const SILENCE_MS = 600

  // Session analytics for dashboard
  const sessionStartRef = useRef<number>(Date.now())
  const msgCountRef = useRef<number>(0)
  const collectedSymptomsRef = useRef<Set<string>>(new Set())
  const severityScoreRef = useRef<number>(0) // accumulate heuristic severity
  const visitIdRef = useRef<string>(`hv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`)

  function extractSymptoms(text: string): string[] {
    const corpus = text.toLowerCase()
    const dict = [
      'anxiety','stress','depression','insomnia','panic','sad','hopeless','worthless',
      'headache','nausea','fever','cough','fatigue','dizzy','pain','chest pain','shortness of breath'
    ]
    const found: string[] = []
    for (const key of dict) {
      if (corpus.includes(key)) found.push(key)
    }
    return Array.from(new Set(found))
  }

  function updateAnalyticsFromUser(text: string) {
    msgCountRef.current += 1
    extractSymptoms(text).forEach(s => collectedSymptomsRef.current.add(s))
    const t = text.toLowerCase()
    // heuristic severity scoring
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

  function resetSilenceTimer() {
    if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current)
    silenceTimerRef.current = window.setTimeout(() => {
  finalizeUtterance()
    }, SILENCE_MS)
  }

  function cleanupTranscript(text: string) {
    // Remove common fillers and tidy spaces/punctuation
    const fillers = /\b(um+|uh+|hmm+|erm+|like)\b/gi
    return text
      .replace(fillers, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([,.!?])/g, "$1")
      .trim()
  }

  function finalizeUtterance() {
    if (awaitingReplyRef.current) return
    const text = cleanupTranscript(utteranceBufferRef.current.trim())
    if (!text) return
    utteranceBufferRef.current = ""
    setInterimText("")
  const userMsg: Message = { id: Date.now(), role: "user", text, ts: Date.now() }
  updateAnalyticsFromUser(text)
    awaitingReplyRef.current = true
    setMessages((m) => {
      const next = [...m, userMsg]
      sendToAPI(next, emotionRef.current, userMsg.id)
      return next
    })
  }

  async function ensureMicPermission() {
    try {
      if (navigator?.mediaDevices?.getUserMedia) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: { ideal: true },
      noiseSuppression: { ideal: true },
      autoGainControl: { ideal: true },
      channelCount: { ideal: 1 },
      sampleRate: { ideal: 44100 },
      sampleSize: { ideal: 16 },
    } as any,
  })
  streamRef.current = stream
  startEmotionAnalyzer(stream)
      }
    } catch (_) {
      // If permission denied, UI hint will guide the user
      setNeedsInteraction(true)
    }
  }

  function safeStartRecognition() {
    const rec = recognitionRef.current
    if (!rec || speaking || startingRef.current) return
    try {
      startingRef.current = true
      rec.start()
      setListening(true)
      setNeedsInteraction(false)
    } catch (_) {
      setNeedsInteraction(true)
    } finally {
      setTimeout(() => {
        startingRef.current = false
      }, 150)
    }
  }

  // Init greeting
  useEffect(() => {
    setMessages([
      {
        id: 0,
        role: "model",
  text: "## Welcome to Synaptix Haven\nI'm here to listen and support you. You can speak whenever you're ready.",
        ts: Date.now(),
      },
    ])
  }, [])

  // Setup speech synthesis + choose a natural-sounding voice
  useEffect(() => {
    if (typeof window === "undefined") return
    synthRef.current = window.speechSynthesis ?? null

    function pickVoice() {
      if (!synthRef.current) return
      const voices = synthRef.current.getVoices()
      const preferredNames = [
        // Windows / Edge
        "Microsoft Aria Online (Natural)",
        "Microsoft Jenny Online (Natural)",
        // Chrome / Google voices
        "Google US English", "Google UK English Female", "Google UK English Male",
        // macOS
        "Samantha", "Alex", "Victoria", "Ava (Enhanced)",
      ]
      let chosen: SpeechSynthesisVoice | undefined
      for (const name of preferredNames) {
        chosen = voices.find((v) => v.name.includes(name))
        if (chosen) break
      }
      voiceRef.current = chosen || voices[0] || null
    }

    if (synthRef.current) {
      pickVoice()
      window.speechSynthesis.onvoiceschanged = pickVoice
    }
  }, [])

  // Setup speech recognition (once) and auto-start
  useEffect(() => {
    if (!supportsSpeech) return
  const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  const rec = new SR()
  rec.lang = (navigator?.language || "en-US").startsWith("en") ? "en-US" : navigator?.language || "en-US"
    rec.continuous = true
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onresult = (e: any) => {
      if (awaitingReplyRef.current) {
        // Ignore incoming results while waiting for the AI reply to enforce turn-taking
        return
      }
      let finalText = ""
      let interim = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i]
        if (res.isFinal) {
          const alt = res[0]
          if (typeof alt?.confidence === "number" && alt.confidence < 0.5) {
            // drop low-confidence final chunks
          } else {
            finalText += alt.transcript
          }
        }
        else interim += res[0].transcript
      }
      // If interim text shows we're still talking, cancel any quick finalize
      if (interim && interim.trim()) {
        if (quickFinalTimerRef.current) {
          window.clearTimeout(quickFinalTimerRef.current)
          quickFinalTimerRef.current = null
        }
      }
      setInterimText(interim)
      // Append final chunks to the utterance buffer
      if (finalText.trim()) {
        utteranceBufferRef.current = (utteranceBufferRef.current + " " + finalText.trim()).trim()
      }
      // Reset silence timer when we get any result (interim or final)
      lastSpeechTsRef.current = Date.now()
      resetSilenceTimer()

      // Fast-path: if we have a final chunk and no interim (user likely paused), flush quickly
      if (!awaitingReplyRef.current && finalText.trim() && !interim.trim()) {
        if (quickFinalTimerRef.current) window.clearTimeout(quickFinalTimerRef.current)
        quickFinalTimerRef.current = window.setTimeout(() => {
          finalizeUtterance()
        }, 250)
      }
    }
    rec.onend = () => {
      setListening(false)
      // Auto-restart if allowed
      if (!document.hidden && autoRestartRef.current) {
        setTimeout(() => {
          safeStartRecognition()
        }, 300)
      }
    }
    rec.onerror = (e: any) => {
      setListening(false)
      const err = e?.error || ""
      // For permission/service errors, require interaction; otherwise try restart
      if (err.includes("not-allowed") || err.includes("service-not-allowed")) {
        setNeedsInteraction(true)
      } else if (autoRestartRef.current && !speaking) {
        setTimeout(() => safeStartRecognition(), 400)
      }
    }

    recognitionRef.current = rec

    // Prime mic permission and try auto start
    ensureMicPermission().finally(() => {
      safeStartRecognition()
    })

    const resumeOnClick = () => {
      if (!recognitionRef.current) return
      ensureMicPermission().finally(() => {
        safeStartRecognition()
      })
    }
    window.addEventListener("click", resumeOnClick)
    window.addEventListener("keydown", resumeOnClick)

    return () => {
      window.removeEventListener("click", resumeOnClick)
      window.removeEventListener("keydown", resumeOnClick)
      try { rec.stop() } catch {}
    }
  }, [])

  // Persist a summarized session when leaving the Haven
  useEffect(() => {
    return () => {
      try {
        const duration = Date.now() - sessionStartRef.current
        const payload = {
          symptoms: Array.from(collectedSymptomsRef.current),
          category: 'Mental Health',
          severity: severityLabel(),
          summary: (msgCountRef.current > 0
            ? 'Synaptix Haven conversation summary (auto-collected)'
            : 'Synaptix Haven visit recorded (no messages)'
          ).concat(
            collectedSymptomsRef.current.size ? `; Key symptoms: ${Array.from(collectedSymptomsRef.current).join(', ')}` : ''
          ),
          recommendations: [],
          source: 'haven',
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
      } catch (e) {
        // ignore
      }
    }
  }, [])

  function shortenAI(text: string) {
    const sentences = text.split(/(?<=[.!?])\s+/).slice(0, 3).join(" ")
    if (sentences.length <= 350) return sentences
    return sentences.slice(0, 350) + "…"
  }

  async function sendToAPI(history: Message[], emotion: string, userMsgId: number) {
    try {
      // Keep last few messages to reduce latency
  const recent = history.slice(-2)
      const contents = recent.map((m, idx) => {
        const isLastUser = idx === recent.length - 1 && m.role === "user" && m.id === userMsgId
        const text = isLastUser ? `${cleanupTranscript(m.text)}\n\n[Emotion: ${emotion}]` : m.text
        return { role: m.role, parts: [{ text }] }
      })

      // Abort any in-flight request to prevent duplicate replies
      currentFetchRef.current?.abort()
      const controller = new AbortController()
      currentFetchRef.current = controller
      const requestId = ++currentRequestIdRef.current

      const res = await fetch("/api/haven-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
        signal: controller.signal,
      })
      const json = await res.json()
      if (requestId !== currentRequestIdRef.current) return
      let aiText: string = json.response || "I'm here with you."
      aiText = shortenAI(aiText)
      if (aiText && aiText === lastAITextRef.current) {
        return
      }
      lastAITextRef.current = aiText
      const aiMsg: Message = { id: Date.now() + 1, role: "model", text: aiText, ts: Date.now() }
      setMessages((m) => [...m, aiMsg])

  // Speak out loud immediately after receiving reply
      if (synthRef.current) {
        // Pause recognition right before speaking to avoid feedback
        autoRestartRef.current = false
        try { recognitionRef.current?.abort() } catch {}
        setListening(false)
        const u = new SpeechSynthesisUtterance(aiText.replace(/[#*_`>\-]/g, " "))
        u.rate = 1.05
        u.pitch = 1.0
        u.volume = 1
        if (voiceRef.current) u.voice = voiceRef.current
        u.onstart = () => setSpeaking(true)
        u.onend = () => {
          setSpeaking(false)
          // resume listening after speak ends
          setTimeout(() => {
            autoRestartRef.current = true
            awaitingReplyRef.current = false
            try {
              recognitionRef.current?.start()
              setListening(true)
            } catch (_) {
              setNeedsInteraction(true)
            }
          }, 200)
        }
        synthRef.current.cancel()
        synthRef.current.speak(u)
      } else {
        // No TTS available: end the turn and allow user to speak again
        awaitingReplyRef.current = false
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        console.error(e)
      }
    }
  }

  // Auto-scroll to newest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, interimText])

  // Emotion analyzer: simplistic pitch/energy-based estimate
  // Emotion analyzer with baseline calibration and mapping
  function startEmotionAnalyzer(stream: MediaStream) {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 2048
      analyserRef.current = analyser
      source.connect(analyser)

      const timeBuf = new Float32Array(analyser.fftSize)

      function estimatePitch(timeData: Float32Array, sampleRate: number) {
        // Autocorrelation-based crude pitch
        let size = timeData.length
        let rms = 0
        for (let i = 0; i < size; i++) rms += timeData[i] * timeData[i]
        rms = Math.sqrt(rms / size)
        if (rms < 0.01) return { f0: 0, rms }

        let r1 = 0, r2 = size - 1, thres = 0.2
        for (let i = 0; i < size / 2; i++) if (Math.abs(timeData[i]) < thres) { r1 = i; break }
        for (let i = 1; i < size / 2; i++) if (Math.abs(timeData[size - i]) < thres) { r2 = size - i; break }
        timeData = timeData.slice(r1, r2)
        size = timeData.length
        const c = new Array(size).fill(0)
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size - i; j++) c[i] = c[i] + timeData[j] * timeData[j + i]
        }
        let d = 0; while (c[d] > c[d + 1]) d++
        let maxval = -1, maxpos = -1
        for (let i = d; i < size; i++) {
          if (c[i] > maxval) { maxval = c[i]; maxpos = i }
        }
        const T0 = maxpos
        const f0 = T0 > 0 ? sampleRate / T0 : 0
        return { f0, rms }
      }

  function tick() {
        try {
          analyser.getFloatTimeDomainData(timeBuf)
          const { f0, rms } = estimatePitch(timeBuf, audioCtx.sampleRate)
          // Baseline calibration for ~3s
          if (calibratingRef.current && baselineRef.current.f0.length < 120) {
            baselineRef.current.f0.push(f0)
            baselineRef.current.rms.push(rms)
            if (baselineRef.current.f0.length >= 120) calibratingRef.current = false
            return
          }

          const mean = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)
          const std = (arr: number[], m: number) => (arr.length ? Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length) : 1)
          const mF0 = mean(baselineRef.current.f0)
          const mR = mean(baselineRef.current.rms)
          const sF0 = std(baselineRef.current.f0, mF0) || 1
          const sR = std(baselineRef.current.rms, mR) || 1
          const zF0 = (f0 - mF0) / sF0
          const zR = (rms - mR) / sR

          // Rolling window smoothing
          baselineRef.current.f0.push(f0); if (baselineRef.current.f0.length > 240) baselineRef.current.f0.shift()
          baselineRef.current.rms.push(rms); if (baselineRef.current.rms.length > 240) baselineRef.current.rms.shift()

          let emotion = "calm"
          if (zF0 > 0.9 && zR > 0.9) emotion = "happy"
          else if (zF0 < -0.8 && zR < -0.6) emotion = "sad"
          else if (zR > 1.0 && zF0 < 0.0) emotion = "angry"
          else if (zF0 > 0.6 && zR > 0.3) emotion = "engaged"
          else if (zF0 < -0.2 && zR < -0.2) emotion = "calm"
          emotionRef.current = emotion

          // Simple VAD to help end-of-speech earlier and more reliably
          const now = Date.now()
          const isSpeech = zR > 0.2 || rms > 0.02
          if (isSpeech) {
            lastSpeechTsRef.current = now
            resetSilenceTimer()
          }
        } catch {}
      }

      if (analyzeIntervalRef.current) window.clearInterval(analyzeIntervalRef.current)
      analyzeIntervalRef.current = window.setInterval(tick, 250)
    } catch (e) {
      // Ignore analyzer failures
    }
  }

  // Cleanup on unmount to avoid background work
  useEffect(() => {
    return () => {
      try { recognitionRef.current?.abort() } catch {}
      try { currentFetchRef.current?.abort() } catch {}
      if (analyzeIntervalRef.current) window.clearInterval(analyzeIntervalRef.current)
      if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current)
  if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current)
  if (quickFinalTimerRef.current) window.clearTimeout(quickFinalTimerRef.current)
      try { synthRef.current?.cancel() } catch {}
      try { audioCtxRef.current?.close() } catch {}
      try { streamRef.current?.getTracks()?.forEach((t) => t.stop()) } catch {}
    }
  }, [])

  return (
    <div className="relative flex h-[100dvh] w-full items-stretch flex-col lg:flex-row">
      {/* Left: Avatar */}
    <section className="relative block w-full h-[38vh] p-3 sm:p-5 lg:p-8 lg:w-[44%] lg:h-full">
        <div className="relative h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Gradient accent ring */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
      <TherapistAvatar speaking={speaking} listening={listening || Boolean(interimText)} />
        </div>
      </section>

      {/* Right: Chat glass panel (no header) */}
      <section className="relative flex-1 h-[62vh] lg:h-full p-3 sm:p-5 lg:p-8">
        <div className="mx-auto flex h-full max-w-3xl flex-col gap-4">
          {/* Messages */}
          <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl shadow-2xl">
            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.35),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.25),transparent_60%)]" />
            <div ref={scrollRef} className="relative h-full overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((m, idx) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl border backdrop-blur-md px-4 py-3 text-sm leading-relaxed shadow-lg animate-fade-in ${
                      m.role === "user"
                        ? "bg-cyan-400/10 border-cyan-300/20 text-cyan-50"
                        : "bg-purple-500/10 border-purple-300/20 text-purple-50"
                    }`}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    {m.role === "model" ? (
                      <div className="prose prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 max-w-none">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <span>{m.text}</span>
                    )}
                  </div>
                </div>
              ))}
              {interimText && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl border border-cyan-300/10 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-100/80 italic">
                    {interimText}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          {/* Listening indicator + permission hint */}
          <div className="relative flex items-center justify-center pt-1">
            {listening && (
              <div className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs text-cyan-100 border border-cyan-300/20 shadow-md">
                Listening… speak naturally
              </div>
            )}
            {!listening && supportsSpeech && needsInteraction && (
              <button
                onClick={() => {
                  ensureMicPermission().finally(() => safeStartRecognition())
                }}
                className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-100 border border-amber-300/20 shadow-md hover:bg-amber-400/15 transition-colors"
              >
                Click to enable voice
              </button>
            )}
            {!supportsSpeech && (
              <div className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-100 border border-amber-300/20 shadow-md">
                Voice input not supported in this browser
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

// Cleanup on unmount
export default () => null

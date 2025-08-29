// Dashboard utility functions for saving user activity

export async function saveVisionAnalysis(data: {
  imageUrl?: string
  analysis: string
  confidence: number
  recommendation: string
  category?: string
}) {
  try {
    const response = await fetch('/api/vision-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return await response.json()
  } catch (error) {
    console.error('Failed to save vision analysis:', error)
    return { success: false, error: 'Failed to save analysis' }
  }
}

export async function saveChatSession(data: {
  symptoms: string[]
  category: string
  severity: 'Mild' | 'Moderate' | 'Severe'
  summary?: string
  recommendations?: string[]
}) {
  try {
    const response = await fetch('/api/chat-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return await response.json()
  } catch (error) {
    console.error('Failed to save chat session:', error)
    return { success: false, error: 'Failed to save session' }
  }
}

export async function saveMentalHealthRecord(data: {
  mood: number
  stress: number
  anxiety: number
  sleep: number
  notes?: string
}) {
  try {
    const response = await fetch('/api/mental-health', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return await response.json()
  } catch (error) {
    console.error('Failed to save mental health record:', error)
    return { success: false, error: 'Failed to save record' }
  }
}

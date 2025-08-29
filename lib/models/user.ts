import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function sanitizeUser(user: any) {
  const { password, ...userWithoutPassword } = user
  return {
    ...userWithoutPassword,
    id: user._id?.toString() || user.id,
  }
}

export function createDefaultUserData() {
  return {
    createdAt: new Date(),
    lastLogin: new Date(),
    progress: {
      ai_chat: 0,
      vision_analysis: 0,
      image_detection: 0,
    },
    stats: {
      totalChatsStarted: 0,
      totalImagesAnalyzed: 0,
      totalTimeSpent: 0,
      featuresUsed: 0,
    },
  }
}

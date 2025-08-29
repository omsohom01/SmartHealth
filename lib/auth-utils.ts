import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Compare password with hashed password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateJWT(payload: { userId: string; email: string }): string {
  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'synaptix-app',
      audience: 'synaptix-users'
    }
  );
}

// Verify JWT token
export function verifyJWT(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'synaptix-app',
      audience: 'synaptix-users'
    }) as { userId: string; email: string };
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password: string): { isValid: boolean; messages: string[] } {
  const messages: string[] = [];
  
  if (password.length < 6) {
    messages.push('Password must be at least 6 characters long');
  }
  
  return {
    isValid: messages.length === 0,
    messages
  };
}

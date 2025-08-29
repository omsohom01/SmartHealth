import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role?: 'doctor' | 'patient';
  location?: string;
  specialization?: string | null;
  experience?: number;
  achievements?: string[];
  profilePicture?: string | null;
}

export interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

// Appointment domain
export type AppointmentStatus = 'pending' | 'approved' | 'rejected';

export interface Appointment {
  _id?: ObjectId;
  patientId: ObjectId;
  doctorId: ObjectId;
  requestedAt: Date;
  deadline: Date; // patient requested to have it before this datetime
  status: AppointmentStatus;
  scheduledAt?: Date | null; // set by doctor when approved
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicDoctorProfile {
  id: string;
  name: string;
  email: string;
  location?: string;
  specialization: string;
  experience?: number;
  achievements?: string[];
  profilePicture?: string | null;
  status?: 'active' | 'offline';
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as '' | 'doctor' | 'patient',
    location: '',
    specialization: '',
    experience: '',
    achievements: '', // comma or newline separated
    profilePicture: '' as string, // base64 data URL for now
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toBase64 = (f: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(f);
      });
    try {
      const dataUrl = await toBase64(file);
      setFormData(prev => ({ ...prev, profilePicture: dataUrl }));
    } catch {
      // ignore
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Full name is required';
    }
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (formData.password.length < 4) {
      return 'Password must be at least 4 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    if (!formData.role) {
      return 'Role is required';
    }
    if (!formData.location.trim()) {
      return 'Location is required';
    }
    if (formData.role === 'doctor') {
      if (!formData.specialization.trim()) return 'Specialization is required for doctors';
      const exp = Number(formData.experience || 0);
      if (!Number.isFinite(exp) || exp < 0) return 'Experience must be a non-negative number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const achievementsArr = formData.achievements
        .split(/\r?\n|,/)
        .map(s => s.trim())
        .filter(Boolean);

      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role as 'doctor' | 'patient',
        location: formData.location.trim(),
        specialization: formData.role === 'doctor' ? formData.specialization.trim() : undefined,
        experience: formData.role === 'doctor' ? Number(formData.experience || 0) : undefined,
        achievements: formData.role === 'doctor' ? achievementsArr : undefined,
        profilePicture: formData.profilePicture || undefined,
      });

      if (result.success) {
        router.push('/profile');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-gray-900 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-white">Create Account</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Sign up to get started with Synaptix
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-500/30">
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-300">Role</Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:border-blue-500"
                  required
                >
                  <option value="" disabled>Select role</option>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-300">Location</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
            </div>

            {formData.role === 'doctor' && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="specialization" className="text-gray-300">Doctor Type / Specialization</Label>
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:border-blue-500"
                      required
                    >
                      <option value="" disabled>Select specialization</option>
                      <option value="Orthopedic">Orthopedic</option>
                      <option value="Chiropractor">Chiropractor</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="General Physician">General Physician</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Psychiatrist">Psychiatrist</option>
                      <option value="Oncologist">Oncologist</option>
                      <option value="Gynecologist">Gynecologist</option>
                      <option value="Orthodontist">Orthodontist</option>
                      <option value="Ophthalmologist">Ophthalmologist</option>
                      <option value="ENT Specialist">ENT Specialist</option>
                      <option value="Urologist">Urologist</option>
                      <option value="Nephrologist">Nephrologist</option>
                      <option value="Gastroenterologist">Gastroenterologist</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-gray-300">Experience (years)</Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      min={0}
                      step={1}
                      placeholder="e.g., 5"
                      value={formData.experience}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievements" className="text-gray-300">Achievements (comma or newline separated)</Label>
                  <Textarea
                    id="achievements"
                    name="achievements"
                    placeholder={'e.g. Best Resident 2021, Published research on ...'}
                    value={formData.achievements}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="min-h-[80px] w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 placeholder-gray-400 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="profilePicture" className="text-gray-300">Profile Picture (optional)</Label>
              <Input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-700 file:text-gray-200"
              />
              {formData.profilePicture && (
                <div className="mt-2 flex items-center gap-3">
                  <img src={formData.profilePicture} alt="Preview" className="h-14 w-14 rounded-full object-cover border border-gray-600" />
                  <Button type="button" variant="secondary" onClick={() => setFormData(p => ({ ...p, profilePicture: '' }))}>Remove</Button>
                </div>
              )}
            </div>

            <div className="text-xs text-gray-400">
              Password must be at least 4 characters long
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <div className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

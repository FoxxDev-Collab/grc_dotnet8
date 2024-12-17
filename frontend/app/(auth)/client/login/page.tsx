'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Api } from '@/lib/api';
import { useClientUser } from '@/stores/useClientUser';
import type { ClientLoginRequest } from '@/types/auth';

export default function ClientLoginPage() {
  const router = useRouter();
  const { setIsClientUser, setClientRole } = useClientUser();
  const [formData, setFormData] = useState<ClientLoginRequest>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await Api.clientLogin(formData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Get user data from response
      const userData = response.data?.user;
      if (!userData?.organizationId) {
        throw new Error('Organization ID not found in response');
      }

      // Set client user information in the store
      setIsClientUser(true);
      setClientRole(userData.clientRole);

      // Use replace instead of push to avoid back button issues
      router.replace(`/organization/${userData.organizationId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
      // Clear client user state on error
      setIsClientUser(false);
      setClientRole(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Client Login
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your client organization account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-destructive text-sm text-center" role="alert">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isLoading}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-input bg-background placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isLoading}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-input bg-background placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-center space-y-2">
            <Link
              href="/provider/login"
              className="block font-medium text-primary hover:text-primary/90"
            >
              Service Provider Login
            </Link>
            <Link
              href="/auth/client/register"
              className="block font-medium text-primary hover:text-primary/90"
            >
              Need a client account? Register
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

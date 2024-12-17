'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useOrganizationStore } from '@/stores/useOrganizationStore'
import { useClientUser } from '@/stores/useClientUser'
import { Api } from '@/lib/api'
import Sidebar from './components/Sidebar'

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const params = useParams()
  const { currentOrganization, fetchOrganization } = useOrganizationStore()
  const { setIsClientUser, setClientRole } = useClientUser()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const organizationId = params?.organizationId as string | undefined

  // Debug logging for params
  console.log('[OrganizationLayout] Params:', params)

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Validate organizationId
        if (!organizationId || typeof organizationId !== 'string') {
          console.error('[OrganizationLayout] Invalid organizationId:', organizationId)
          setError('Invalid organization ID')
          setIsLoading(false)
          return
        }

        setError(null)
        // Get user profile
        const profileResponse = await Api.getProfile();
        if (profileResponse.error) {
          // Only redirect if there's an actual error, not during initial load
          if (!Api.isAuthenticated()) {
            router.push('/provider/login');
            return;
          }
          throw new Error(profileResponse.error);
        }

        const userData = profileResponse.data;
        if (!userData) {
          throw new Error('No user data received');
        }

        if (userData.type === 'client') {
          setIsClientUser(true);
          setClientRole(userData.clientRole);

          // If client user is trying to access a different organization, redirect
          if (userData.organizationId && userData.organizationId !== organizationId) {
            console.log('Redirecting client user to their organization:', userData.organizationId);
            router.push(`/organization/${userData.organizationId}`);
            return;
          }
        } else {
          setIsClientUser(false);
          setClientRole(undefined);
        }

        // Fetch organization details
        console.log('Fetching organization with ID:', organizationId)
        await fetchOrganization(organizationId)
      } catch (error) {
        console.error('Failed to initialize user:', error);
        setError(error instanceof Error ? error.message : 'Failed to load organization');
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [organizationId, fetchOrganization, router, setIsClientUser, setClientRole])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        organizationId={organizationId || ''} 
        organizationName={currentOrganization?.name}
      />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Api from '@/lib/api';
import { useOrganizationStore } from '@/stores/useOrganizationStore';
import type { SystemUser, ClientUser } from '@/types/auth';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProviderNavBar } from '@/components/provider/ProviderNavBar';

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SystemUser | ClientUser | null>(null);
  const { fetchOrganization, setCurrentOrganization } = useOrganizationStore();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await Api.logout();
        localStorage.removeItem('user');
        setCurrentOrganization(null);
        setUser(null);
        router.push('/provider/login');
      } catch (error) {
        console.error('Logout failed:', error);
        localStorage.removeItem('user');
        setCurrentOrganization(null);
        setUser(null);
        router.push('/provider/login');
      }
    };

    const initializeData = async (userData: SystemUser | ClientUser) => {
      try {
        if (userData.type === 'system') {
          // For system users, fetch the provider organization
          const orgResponse = await Api.get<{ data: { id: string } }>('/organizations/provider');
          if (orgResponse.data?.data?.id) {
            await fetchOrganization(orgResponse.data.data.id);
          }
        } else if (userData.type === 'client') {
          // For client users, fetch their organization
          if (userData.organizationId) {
            await fetchOrganization(userData.organizationId);
          }
        }
      } catch (error) {
        console.error('Failed to initialize data:', error);
      }
    };

    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const response = await Api.getProfile();
        
        console.log('Auth response:', response);

        if (response.error) {
      console.log('Auth error, logging out:', response.error);
      handleLogout();
      return;
    }

        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
          setUser(response.data);
          await initializeData(response.data);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, fetchOrganization, setCurrentOrganization]);

  // Handle organization routes separately for client users
  if (user?.type === 'client' && pathname?.includes('/organization/')) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogoutClick = async () => {
    try {
      await Api.logout();
      localStorage.removeItem('user');
      setCurrentOrganization(null);
      setUser(null);
      router.push('/provider/login');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('user');
      setCurrentOrganization(null);
      setUser(null);
      router.push('/provider/login');
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="flex-1">
              {/* Only show navigation for system users */}
              {user.type === 'system' && (
                <ProviderNavBar userRole={user.role} />
              )}
            </div>
            
            {/* User and Logout Section */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogoutClick}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
        <main className="container mx-auto py-6">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}

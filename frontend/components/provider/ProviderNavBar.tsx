'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, DogIcon, IceCreamConeIcon, Shield, Users2 } from 'lucide-react';
import { SystemRole } from '@/types/enums';

interface ProviderNavBarProps {
  userRole?: SystemRole;
}

export function ProviderNavBar({ userRole }: ProviderNavBarProps) {
  const pathname = usePathname();

  // Only show to system users
  if (!userRole) return null;

  const isActive = (path: string) => {
    return pathname.startsWith(path) ? 'text-primary' : 'text-muted-foreground';
  };

  return (
    <nav className="flex items-center space-x-6 lg:space-x-8">
      {/* Organizations - visible to all system users */}
      <Link
        href="/dashboard"
        className={`${isActive('/dashboard')} flex items-center text-sm font-medium transition-colors hover:text-primary`}
      >
        <IceCreamConeIcon className="mr-2 h-4 w-4" />
        Home
      </Link>
      {/* Organizations - visible to all system users */}
      <Link
        href="/organization"
        className={`${isActive('/organization')} flex items-center text-sm font-medium transition-colors hover:text-primary`}
      >
        <Building2 className="mr-2 h-4 w-4" />
        Organizations
      </Link>

      {/* System Users - visible only to GLOBAL_ADMIN */}
      {userRole === SystemRole.GLOBAL_ADMIN && (
        <Link
          href="/user-management"
          className={`${isActive('/user-management')} flex items-center text-sm font-medium transition-colors hover:text-primary`}
        >
          <Users2 className="mr-2 h-4 w-4" />
          System Users
        </Link>
      )}

      {/* Security - visible to GLOBAL_ADMIN and ADMIN */}
      {(userRole === SystemRole.GLOBAL_ADMIN || userRole === SystemRole.ADMIN) && (
        <Link
          href="/rmf-library"
          className={`${isActive('/rmf-library')} flex items-center text-sm font-medium transition-colors hover:text-primary`}
        >
          <Shield className="mr-2 h-4 w-4" />
          RMF Library
        </Link>
      )}

      {/* System Users - visible only to GLOBAL_ADMIN */}
      {userRole === SystemRole.GLOBAL_ADMIN && (
        <Link
          href="/site-settings"
          className={`${isActive('/site-settings')} flex items-center text-sm font-medium transition-colors hover:text-primary`}
        >
          <DogIcon className="mr-2 h-4 w-4" />
          Site Settings
        </Link>
      )}
    </nav>
  );
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Server, 
  FileText, 
  Database, 
  AlertTriangle,
  FileBarChart,
  Settings,
  AlertCircle,
  LogOut,
  FileCheck,
  SmilePlusIcon
} from 'lucide-react'
import { useClientUser } from '@/stores/useClientUser'
import GlowingHeader from '@/components/ui/GlowingHeader'
import { Button } from '@/components/ui/button'
import Api from '@/lib/api'

interface SidebarProps {
  organizationId: string
  organizationName?: string
}

export default function Sidebar({ organizationId, organizationName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { setIsClientUser, setClientRole } = useClientUser()

  const handleLogout = async () => {
    try {
      // Call the API logout endpoint
      await Api.logout();
      
      // Clear client user state
      setIsClientUser(false);
      setClientRole(undefined);
      
      // Redirect to splashpage
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API call fails, clear state and redirect
      setIsClientUser(false);
      setClientRole(undefined);
      router.push('/');
    }
  }

  const navigation = [
    {
      name: 'Overview',
      href: `/organization/${organizationId}`,
      current: pathname === `/organization/${organizationId}`,
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: 'ATOs',
      href: `/organization/${organizationId}/ato-overview`,
      current: pathname.startsWith(`/organization/${organizationId}/ato-overview`),
      icon: <SmilePlusIcon className="h-5 w-5" />
    },
    {
      name: 'Incidents',
      href: `/organization/${organizationId}/incidents`,
      current: pathname.startsWith(`/organization/${organizationId}/incidents`),
      icon: <AlertCircle className="h-5 w-5" />
    },
    {
      name: 'Systems',
      href: `/organization/${organizationId}/systems`,
      current: pathname.startsWith(`/organization/${organizationId}/systems`),
      icon: <Server className="h-5 w-5" />
    },
    {
      name: 'Artifacts',
      href: `/organization/${organizationId}/artifacts`,
      current: pathname.startsWith(`/organization/${organizationId}/artifacts`),
      icon: <FileText className="h-5 w-5" />
    },
    {
      name: 'Assets',
      href: `/organization/${organizationId}/assets`,
      current: pathname.startsWith(`/organization/${organizationId}/assets`),
      icon: <Database className="h-5 w-5" />
    },
    {
      name: 'POA&Ms',
      href: `/organization/${organizationId}/poams`,
      current: pathname.startsWith(`/organization/${organizationId}/poams`),
      icon: <AlertTriangle className="h-5 w-5" />
    },
    {
      name: 'Reports',
      href: `/organization/${organizationId}/reports`,
      current: pathname.startsWith(`/organization/${organizationId}/reports`),
      icon: <FileBarChart className="h-5 w-5" />
    },
    {
      name: 'RMF',
      href: `/organization/${organizationId}/rmf`,
      current: pathname.startsWith(`/organization/${organizationId}/rmf`),
      icon: <FileCheck className="h-5 w-5" />
    },
    {
      name: 'Settings',
      href: `/organization/${organizationId}/settings`,
      current: pathname.startsWith(`/organization/${organizationId}/settings`),
      icon: <Settings className="h-5 w-5" />
    },
  ]

  return (
    <div className="w-64 min-h-screen bg-white shadow-sm flex flex-col">
      <div className="p-4 border-b">
        <GlowingHeader 
          name={organizationName || 'Loading...'} 
        />
      </div>
      <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      <nav className="mt-5 px-2 space-y-1 flex-grow">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`${
              item.current
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            } group flex items-center px-3 py-2 text-sm font-medium border-l-4`}
          >
            <div className={`${
              item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
            } mr-3`}>
              {item.icon}
            </div>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

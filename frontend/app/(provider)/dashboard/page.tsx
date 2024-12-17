'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useOrganizationStore } from '@/stores/useOrganizationStore'
import { Building, Shield, AlertTriangle, Activity, Users, CheckCircle } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const { currentOrganization } = useOrganizationStore()

  const quickActions = [
    {
      title: 'Manage Organizations',
      description: 'Create, configure, and manage your organizations',
      icon: Building,
      action: () => router.push('/organization'),
      primary: !currentOrganization,
    },
    {
      title: 'Risk Assessment',
      description: 'Review and update risk assessments',
      icon: AlertTriangle,
      action: () => currentOrganization 
        ? router.push(`/organization/${currentOrganization.id}/risk-assessment`)
        : router.push('/organization'),
      disabled: !currentOrganization,
    },
    {
      title: 'System Security',
      description: 'Monitor and manage system security',
      icon: Shield,
      action: () => currentOrganization 
        ? router.push(`/organization/${currentOrganization.id}/systems`)
        : router.push('/organization'),
      disabled: !currentOrganization,
    },
    {
      title: 'Activity Monitoring',
      description: 'Track and analyze system activities',
      icon: Activity,
      action: () => currentOrganization 
        ? router.push(`/organization/${currentOrganization.id}/activity`)
        : router.push('/organization'),
      disabled: !currentOrganization,
    },
  ]

  const roleDescriptions = {
    serviceProvider: [
      {
        title: 'AODR (Authorizing Official Designated Representative)',
        description: 'Final authorization authority responsible for reviewing and approving risk assessments, making authorization decisions, and delegating authority as needed.',
        icon: CheckCircle,
      },
      {
        title: 'SCA (Security Control Assessor)',
        description: 'Conducts independent assessments, validates control implementations, documents findings, and reviews security evidence.',
        icon: Shield,
      },
      {
        title: 'SCAR (Security Control Assessor Representative)',
        description: 'Supports the assessment process by preparing documentation, collecting and reviewing evidence, and assisting the SCA.',
        icon: Users,
      },
      {
        title: 'Auditor',
        description: 'Reviews compliance documentation, performs audits, generates comprehensive reports, and tracks findings.',
        icon: Activity,
      },
    ],
    clientOrganization: [
      {
        title: 'ISSM (Information System Security Manager)',
        description: 'Manages the security program, oversees ISSOs, reviews security documentation, and interfaces with service providers.',
        icon: Shield,
      },
      {
        title: 'ISSO (Information System Security Officer)',
        description: 'Implements security controls, maintains documentation, conducts assessments, and reports security incidents.',
        icon: Shield,
      },
    ],
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to GRC Platform</h1>
        <p className="text-gray-600">
          {currentOrganization 
            ? `Managing ${currentOrganization.name}`
            : 'Get started by creating or selecting an organization'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Card 
              key={action.title}
              className={`p-6 cursor-pointer transition-all ${
                action.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-lg'
              } ${
                action.primary 
                  ? 'border-primary border-2' 
                  : ''
              }`}
              onClick={action.disabled ? undefined : action.action}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Role Information */}
      <div className="space-y-8 mb-8">
        <h2 className="text-2xl font-semibold">Organization Roles & Responsibilities</h2>
        
        {/* Service Provider Roles */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Service Provider Roles (Foxx Cyber)
            </h3>
            <p className="text-gray-600">
              Key roles and responsibilities for managing client security assessments and authorizations.
            </p>
          </div>
          <div className="grid gap-4">
            {roleDescriptions.serviceProvider.map((role) => {
              const Icon = role.icon
              return (
                <div key={role.title} className="p-4 bg-secondary/10 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg mt-1">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">{role.title}</h4>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Client Organization Roles */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Client Organization Roles
            </h3>
            <p className="text-gray-600">
              Essential security roles within client organizations for maintaining compliance and security posture.
            </p>
          </div>
          <div className="grid gap-4">
            {roleDescriptions.clientOrganization.map((role) => {
              const Icon = role.icon
              return (
                <div key={role.title} className="p-4 bg-secondary/10 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg mt-1">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">{role.title}</h4>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Getting Started */}
      {!currentOrganization && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-4">
            <p>Welcome to the GRC Platform! To get started:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click on &ldquo;Manage Organizations&rdquo; above</li>
              <li>Create a new organization or select an existing one</li>
              <li>Complete the organization onboarding process</li>
              <li>Begin managing your security and compliance</li>
            </ol>
            <Button 
              className="mt-4"
              onClick={() => router.push('/organization')}
            >
              Go to Organization Management
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrganizationsApi } from '@/lib/api/organizations';
import type { Organization } from '@/types/organizations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Building2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SystemRole } from '@/types/enums';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SystemUserAssignments } from '@/components/provider/SystemUserAssignments';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { RiskLevel } from '@/types/organizations';
import type { MouseEvent } from 'react';

interface JwtPayload {
  sub: string;
  email: string;
  role: SystemRole;
}

// Helper function to get badge variant based on risk level
const getRiskBadgeVariant = (level: RiskLevel | undefined) => {
  switch (level) {
    case RiskLevel.LOW:
      return 'success';
    case RiskLevel.MEDIUM:
      return 'warning';
    case RiskLevel.HIGH:
      return 'error';
    case RiskLevel.CRITICAL:
      return 'destructive';
    default:
      return 'secondary';
  }
};

export default function OrganizationManagement() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<SystemRole | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }

    const fetchOrganizations = async () => {
      try {
        console.log('Fetching organizations...');
        const response = await OrganizationsApi.getAll();
        console.log('Raw API Response:', response);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Check if response.data exists and is an array
        if (!response.data || !Array.isArray(response.data)) {
          console.log('Invalid data format in response:', response);
          throw new Error('Invalid organizations data format');
        }
        
        console.log('Organizations data:', response.data);
        setOrganizations(response.data);
      } catch (err) {
        console.error('Error in fetchOrganizations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleCreateOrganization = () => {
    router.push('/organization/onboarding');
  };

  const handleOrganizationClick = (org: Organization) => {
    router.push(`/organization/${org.id}`);
  };

  const handleDeleteOrganization = async (e: MouseEvent<HTMLButtonElement>, orgId: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this organization?')) {
      return;
    }

    try {
      const response = await OrganizationsApi.deleteOrganization(orgId);
      if (response.error) {
        throw new Error(response.error);
      }
      setOrganizations(orgs => orgs.filter(org => org.id !== orgId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete organization');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organizations and monitor risk levels
          </p>
        </div>
        {userRole === SystemRole.GLOBAL_ADMIN && (
          <Button onClick={handleCreateOrganization} className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Create New Organization
          </Button>
        )}
      </div>

      {organizations.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Organizations Found</h3>
          <p className="text-muted-foreground mb-4">
            No organizations are currently available
          </p>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Organization Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Operational Risk</TableHead>
                <TableHead>Data Security Risk</TableHead>
                <TableHead>Compliance Risk</TableHead>
                <TableHead>Financial Risk</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow
                  key={org.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleOrganizationClick(org)}
                >
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>
                    <Badge variant={org.isActive ? 'active' : 'inactive'}>
                      {org.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(org.riskProfile?.operationalRisk)}>
                      {org.riskProfile?.operationalRisk || 'Not Set'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(org.riskProfile?.dataSecurityRisk)}>
                      {org.riskProfile?.dataSecurityRisk || 'Not Set'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(org.riskProfile?.complianceRisk)}>
                      {org.riskProfile?.complianceRisk || 'Not Set'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(org.riskProfile?.financialRisk)}>
                      {org.riskProfile?.financialRisk || 'Not Set'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => handleDeleteOrganization(e, org.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* System User Assignments Section */}
      {userRole && <SystemUserAssignments userRole={userRole} />}

      {/* Quick Guide Section */}
      <Card className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle>Understanding Risk Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Operational Risk</h4>
                <p className="text-sm text-muted-foreground">
                  Assess risks to business operations and processes
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Data Security Risk</h4>
                <p className="text-sm text-muted-foreground">
                  Evaluate data protection and security measures
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Compliance Risk</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor regulatory compliance and standards
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Financial Risk</h4>
                <p className="text-sm text-muted-foreground">
                  Track financial impacts and exposures
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

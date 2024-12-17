'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientUserManagement } from './components/ClientUserManagement';
import { useOrganizationStore } from '@/stores/useOrganizationStore';

export default function OrganizationSettingsPage() {
  const params = useParams();
  const organizationId = params.organizationId as string;
  const { currentOrganization, fetchOrganization } = useOrganizationStore();

  console.log('[OrganizationSettingsPage] Initializing with organizationId:', organizationId);

  useEffect(() => {
    console.log('[OrganizationSettingsPage] useEffect triggered', {
      organizationId,
      hasCurrentOrg: !!currentOrganization
    });

    if (organizationId) {
      console.log('[OrganizationSettingsPage] Fetching organization');
      fetchOrganization(organizationId);
    }
  }, [organizationId, fetchOrganization]);

  if (!currentOrganization) {
    console.log('[OrganizationSettingsPage] Rendering loading state');
    return <div>Loading...</div>;
  }

  console.log('[OrganizationSettingsPage] Rendering with organization:', {
    id: currentOrganization.id,
    name: currentOrganization.name,
    type: currentOrganization.type
  });

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Organization Settings</h1>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientUserManagement organizationId={organizationId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Organization Name</h3>
                  <p>{currentOrganization.name}</p>
                </div>
                <div>
                  <h3 className="font-medium">Organization ID</h3>
                  <p className="font-mono">{currentOrganization.id}</p>
                </div>
                <div>
                  <h3 className="font-medium">Organization Type</h3>
                  <p>{currentOrganization.type}</p>
                </div>
                <div>
                  <h3 className="font-medium">Created At</h3>
                  <p>{new Date(currentOrganization.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-medium">Last Updated</h3>
                  <p>{new Date(currentOrganization.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

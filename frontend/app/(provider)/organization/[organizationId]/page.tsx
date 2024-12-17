'use client';

import { useEffect, useState } from 'react';
import { OrganizationsApi } from '../../../../lib/api/organizations';
import { notFound } from 'next/navigation';
import OrganizationDashboard from './organization-dashboard';
import type { Organization } from '../../../../types/organizations';

export default function OrganizationPage({
  params,
}: {
  params: { organizationId: string };
}) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrganization() {
      try {
        const response = await OrganizationsApi.getById(params.organizationId);
        console.log('Raw API Response:', JSON.stringify(response, null, 2));
        
        if (response.error) {
          throw new Error(response.error);
        }

        // The organization data is directly in response.data
        const organizationData = response.data;
        console.log('Organization data:', JSON.stringify(organizationData, null, 2));

        if (!organizationData || !organizationData.id) {
          console.log('No valid organization found in response');
          notFound();
          return;
        }

        // Set the organization data
        setOrganization(organizationData);
      } catch (err) {
        console.error('Error loading organization:', err);
        setError(err instanceof Error ? err.message : 'Failed to load organization');
      } finally {
        setLoading(false);
      }
    }

    loadOrganization();
  }, [params.organizationId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!organization) {
    return notFound();
  }

  return <OrganizationDashboard organization={organization} />;
}

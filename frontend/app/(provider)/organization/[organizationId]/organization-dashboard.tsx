'use client';

import React from 'react';
import type { Organization } from '../../../../types/organizations';
import BasicInfoCard from './components/BasicInfoCard';
import RiskProfileCard from './components/RiskProfileCard';
import RiskMatrixCard from './components/RiskMatrixCard';
import MitigationPrioritiesCard from './components/MitigationPrioritiesCard';

interface OrganizationDashboardProps {
  organization: Organization;
}

export default function OrganizationDashboard({ organization: initialOrganization }: OrganizationDashboardProps) {
  const [organization, setOrganization] = React.useState(initialOrganization);

  const handleUpdate = (updatedOrg: Organization) => {
    setOrganization(updatedOrg);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6 w-full">
        {/* Top Row: Organization Info, Risk Profile, and Assigned Users in three columns */}
        <div className="grid gap-3 md:grid-cols-2">
          {/* Basic Info Card */}
          <BasicInfoCard 
            organization={organization} 
            onUpdate={handleUpdate}
          />

          {/* Risk Profile Card */}
          <RiskProfileCard 
            organization={organization} 
            onUpdate={handleUpdate}
          />
        </div>

        {/* Middle Row: Full-width Risk Matrix */}
        <RiskMatrixCard 
          organization={organization} 
          onUpdate={handleUpdate}
        />

        {/* Bottom Row: Full-width Mitigation Priorities */}
        <MitigationPrioritiesCard 
          organization={organization} 
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}

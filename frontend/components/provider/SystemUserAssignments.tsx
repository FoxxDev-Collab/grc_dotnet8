'use client';

import { useState, useEffect } from 'react';
import { OrganizationsApi } from '@/lib/api/organizations';
import { SystemUsersApi } from '@/lib/api/system-users';
import { PaginatedResponse } from '@/types/api';
import { SystemRole } from '@/types/enums';
import { Organization, UserOrganization } from '@/types/organizations';
import { SystemUserResponse } from '@/types/users';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, UserPlus, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SystemUserAssignmentsProps {
  userRole: SystemRole;
}

export function SystemUserAssignments({ userRole }: SystemUserAssignmentsProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationUsers, setOrganizationUsers] = useState<Record<string, UserOrganization[]>>({});
  const [availableUsers, setAvailableUsers] = useState<SystemUserResponse[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch organizations, their users, and available system users
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch organizations
        const orgsResponse = await OrganizationsApi.getAll();
        if (orgsResponse.error) throw new Error(orgsResponse.error);
        
        if (!orgsResponse.data) {
          throw new Error('No organizations data received');
        }
        
        setOrganizations(orgsResponse.data);
    
        // Fetch users for each organization
        const usersData: Record<string, UserOrganization[]> = {};
        await Promise.all(
          orgsResponse.data.map(async (org) => {
            const usersResponse = await OrganizationsApi.getUsers(org.id);
            const paginatedData = usersResponse.data as PaginatedResponse<UserOrganization>;
            usersData[org.id] = paginatedData?.data || [];
          })
        );
        setOrganizationUsers(usersData);

        // Fetch available system users based on role
        if (userRole === SystemRole.GLOBAL_ADMIN) {
          const systemUsersResponse = await SystemUsersApi.getSystemUsers();
          if (systemUsersResponse.error) throw new Error(systemUsersResponse.error);
          if (systemUsersResponse.data) {
            setAvailableUsers(systemUsersResponse.data);
          }
        } else {
          const currentUserResponse = await SystemUsersApi.getCurrentUser();
          if (currentUserResponse.error) throw new Error(currentUserResponse.error);
          if (currentUserResponse.data) {
            setAvailableUsers([currentUserResponse.data]);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userRole]);

  const handleAddUser = async (organizationId: string) => {
    const selectedEmail = selectedUsers[organizationId];
    if (!selectedEmail) return;
  
    try {
      const response = await OrganizationsApi.addUser(organizationId, selectedEmail);
      if (response.error) throw new Error(response.error);
  
      // Refresh users for this organization
      const usersResponse = await OrganizationsApi.getUsers(organizationId);
      const paginatedData = usersResponse.data as PaginatedResponse<UserOrganization>;
      setOrganizationUsers(prev => ({
        ...prev,
        [organizationId]: paginatedData?.data || []
      }));
  
      // Clear selection
      setSelectedUsers(prev => ({
        ...prev,
        [organizationId]: ''
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
    }
  };

  const handleRemoveUser = async (organizationId: string, userId: string) => {
    try {
      const response = await OrganizationsApi.removeUser(organizationId, userId);
      if (response.error) throw new Error(response.error);

      // Update local state
      setOrganizationUsers(prev => ({
        ...prev,
        [organizationId]: prev[organizationId]?.filter(userOrg => 
          userOrg.systemUser?.id !== userId
        ) || []
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove user');
    }
  };

  // Filter out users that are already assigned to the organization
  const getAvailableUsersForOrg = (organizationId: string) => {
    const assignedUserIds = new Set(
      organizationUsers[organizationId]?.map(userOrg => userOrg.systemUser?.id) || []
    );
    return availableUsers.filter(user => !assignedUserIds.has(user.id));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System User Assignments</h2>
        <p className="text-muted-foreground mt-2">
          {userRole === SystemRole.GLOBAL_ADMIN 
            ? 'Manage system user access to organizations'
            : 'View your organization assignments'
          }
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Assigned Users</TableHead>
              {userRole === SystemRole.GLOBAL_ADMIN && (
                <TableHead>Add User</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {organizationUsers[org.id]?.map((userOrg) => {
                      // Only show system users
                      if (!userOrg.systemUser) return null;
                      
                      return (
                        <Badge
                          key={userOrg.id}
                          className="flex items-center gap-1"
                        >
                          {userOrg.systemUser.email}
                          {userRole === SystemRole.GLOBAL_ADMIN && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveUser(org.id, userOrg.systemUser!.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </Badge>
                      );
                    })}
                  </div>
                </TableCell>
                {userRole === SystemRole.GLOBAL_ADMIN && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={selectedUsers[org.id] || ''}
                        onValueChange={(value) => setSelectedUsers(prev => ({
                          ...prev,
                          [org.id]: value
                        }))}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableUsersForOrg(org.id).map((user) => (
                            <SelectItem key={user.id} value={user.email}>
                              {user.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="icon"
                        onClick={() => handleAddUser(org.id)}
                        disabled={!selectedUsers[org.id]}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

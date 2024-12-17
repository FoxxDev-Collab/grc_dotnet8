'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ClientUserResponse } from '@/types/users';
import { ClientUsersApi } from '@/lib/api/client-users';
import { ClientRole } from '@/types/enums';
import { useClientUser } from '@/stores/useClientUser';
import { ClientUserForm } from './ClientUserForm';

interface ClientUserManagementProps {
  organizationId: string;
}

export function ClientUserManagement({ organizationId }: ClientUserManagementProps) {
  console.log('[ClientUserManagement] Initializing with organizationId:', organizationId);

  const [users, setUsers] = useState<ClientUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ClientUserResponse | undefined>(undefined);
  
  // Get client user information
  const { isClientUser, isAdmin } = useClientUser();

  useEffect(() => {
    console.log('[ClientUserManagement] useEffect triggered with organizationId:', organizationId);
    loadUsers();
  }, [organizationId]);

  const loadUsers = async () => {
    console.log('[ClientUserManagement] Loading users for organization:', organizationId);
    try {
      setLoading(true);
      const response = await ClientUsersApi.getAll(organizationId);
      console.log('[ClientUserManagement] API Response:', response);

      if (response.error) {
        console.error('[ClientUserManagement] API Error:', response.error);
        throw new Error(response.error);
      }

      if (response.data) {
        console.log('[ClientUserManagement] Users loaded:', response.data);
        setUsers(response.data);
      }
    } catch (err) {
      console.error('[ClientUserManagement] Error loading users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    console.log('[ClientUserManagement] Opening form to add new user');
    setSelectedUser(undefined);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: ClientUserResponse) => {
    console.log('[ClientUserManagement] Opening form to edit user:', user);
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = async (user: ClientUserResponse) => {
    console.log('[ClientUserManagement] Attempting to delete user:', user.id);

    // Check if this is the last admin user
    if (user.clientRole === ClientRole.ADMIN) {
      const adminUsers = users.filter(u => u.clientRole === ClientRole.ADMIN);
      if (adminUsers.length <= 1) {
        console.log('[ClientUserManagement] Cannot delete last admin user');
        setError('Cannot delete the last admin user');
        return;
      }
    }

    if (!confirm('Are you sure you want to delete this user?')) {
      console.log('[ClientUserManagement] User cancelled deletion');
      return;
    }

    try {
      console.log('[ClientUserManagement] Sending delete request for user:', user.id);
      const response = await ClientUsersApi.deleteUser(organizationId, user.id);
      
      if (response.error) {
        console.error('[ClientUserManagement] Delete error:', response.error);
        throw new Error(response.error);
      }

      console.log('[ClientUserManagement] User deleted successfully:', user.id);
      await loadUsers();
    } catch (err) {
      console.error('[ClientUserManagement] Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleFormSuccess = () => {
    console.log('[ClientUserManagement] Form submitted successfully, reloading users');
    setIsFormOpen(false);
    loadUsers();
  };

  // Check if the current user can manage users
  const canManageUsers = !isClientUser || isAdmin();

  if (loading) {
    console.log('[ClientUserManagement] Rendering loading state');
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('[ClientUserManagement] Rendering error state:', error);
    return <div className="text-red-500">Error: {error}</div>;
  }

  console.log('[ClientUserManagement] Rendering user list, count:', users.length);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Client Users</h2>
        <Button 
          onClick={handleAddUser}
          disabled={!canManageUsers}
          variant={canManageUsers ? "default" : "secondary"}
        >
          Add User
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Client Role</TableHead>
            <TableHead>Organization Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.clientRole}</TableCell>
              <TableCell>{user.organizationRole}</TableCell>
              <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
              <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditUser(user)}
                    disabled={!canManageUsers}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteUser(user)}
                    disabled={!canManageUsers}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <ClientUserForm
            organizationId={organizationId}
            user={selectedUser}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

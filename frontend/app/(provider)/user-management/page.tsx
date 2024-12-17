'use client'

import { useEffect, useState } from 'react';
import { SystemUsersApi } from '@/lib/api/system-users';
import { SystemUserResponse } from '@/types/users';
import { SystemRole } from '@/types/enums';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { SystemUser } from './SystemUser';

export default function UserManagement() {
  const [users, setUsers] = useState<SystemUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUserResponse | undefined>();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    console.log('[UserManagement] Starting to load users');
    try {
      setLoading(true);
      setError('');

      console.log('[UserManagement] Making API request to get users');
      const response = await SystemUsersApi.getSystemUsers();
      console.log('[UserManagement] Received API response:', response);
      
      if (response.error) {
        console.error('[UserManagement] API returned error:', response.error);
        setError(`Failed to load users: ${response.error}`);
        return;
      }

      // Check if response has data property
      if (!response.data) {
        console.error('[UserManagement] No data property in response:', response);
        setError('Failed to load users: No data received');
        return;
      }

      // Check if response.data is an array
      if (!Array.isArray(response.data)) {
        console.error('[UserManagement] Response data is not an array:', response.data);
        setError('Failed to load users: Invalid data format');
        return;
      }

      console.log('[UserManagement] Successfully loaded users:', response.data);
      setUsers(response.data);
    } catch (err) {
      console.error('[UserManagement] Error in loadUsers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    console.log('[UserManagement] Attempting to delete user:', userId);
    if (!window.confirm('Are you sure you want to delete this user?')) {
      console.log('[UserManagement] User cancelled deletion');
      return;
    }
    
    try {
      console.log('[UserManagement] Making API request to delete user');
      const response = await SystemUsersApi.deleteSystemUser(userId);
      console.log('[UserManagement] Delete response:', response);

      if (response.error) {
        console.error('[UserManagement] Delete error:', response.error);
        setError('Failed to delete user: ' + response.error);
      } else {
        console.log('[UserManagement] User deleted successfully, reloading users');
        await loadUsers();
      }
    } catch (err) {
      console.error('[UserManagement] Error in handleDelete:', err);
      setError('Failed to delete user');
    }
  };

  const handleEdit = (user: SystemUserResponse) => {
    console.log('[UserManagement] Editing user:', user);
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleSuccess = async () => {
    console.log('[UserManagement] Operation successful, reloading users');
    setShowUserForm(false);
    setSelectedUser(undefined);
    await loadUsers();
  };

  const handleCancel = () => {
    console.log('[UserManagement] Operation cancelled');
    setShowUserForm(false);
    setSelectedUser(undefined);
  };

  const getRoleBadgeColor = (role: SystemRole) => {
    switch (role) {
      case SystemRole.GLOBAL_ADMIN:
        return 'bg-red-100 text-red-800';
      case SystemRole.ADMIN:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return (
    <div className="p-4">
      <div className="text-red-600 mb-4">Error: {error}</div>
      <Button onClick={loadUsers}>Retry</Button>
    </div>
  );

  if (showUserForm) {
    return (
      <div className="container mx-auto p-4">
        <SystemUser
          user={selectedUser}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div>
      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">System User Management</h2>
          <Button 
            variant="default"
            onClick={() => {
              console.log('[UserManagement] Opening create user form');
              setShowUserForm(true);
            }}
          >
            Add System User
          </Button>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-8">
            No users found
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {`${user.firstName} ${user.lastName}`}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "success" : "secondary"}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}

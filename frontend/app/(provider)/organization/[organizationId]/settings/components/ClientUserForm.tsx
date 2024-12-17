'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientRole, mapClientToOrgRole, OrganizationRole } from '@/types/enums';
import { ClientUserResponse, CreateClientUserDto, UpdateClientUserDto } from '@/types/users';
import { ClientUsersApi } from '@/lib/api/client-users';

interface ClientUserFormProps {
  organizationId: string;
  user?: ClientUserResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
  clientRole: ClientRole;
  organizationRole: OrganizationRole | undefined;
}

export function ClientUserForm({ organizationId, user, onSuccess, onCancel }: ClientUserFormProps) {
  console.log('[ClientUserForm] Initializing form', {
    organizationId,
    isEdit: !!user,
    userId: user?.id
  });

  const [formData, setFormData] = useState<FormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    clientRole: user?.clientRole || ClientRole.USER,
    organizationRole: user?.organizationRole,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClientRoleChange = (role: ClientRole) => {
    console.log('[ClientUserForm] Client role changed', { 
      oldRole: formData.clientRole, 
      newRole: role 
    });

    const orgRole = mapClientToOrgRole(role);
    console.log('[ClientUserForm] Mapped organization role', { 
      clientRole: role, 
      organizationRole: orgRole 
    });

    setFormData(prev => ({
      ...prev,
      clientRole: role,
      organizationRole: orgRole,
    }));
  };

  const validatePasswords = () => {
    if (user) {
      // For existing users, only validate if they're trying to change the password
      if (formData.newPassword || formData.confirmPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (formData.newPassword.length < 8) {
          throw new Error('New password must be at least 8 characters long');
        }
      }
    } else {
      // For new users, validate the initial password
      if (!formData.password) {
        throw new Error('Password is required');
      }
      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[ClientUserForm] Form submission started', {
      isEdit: !!user,
      formData: { 
        ...formData, 
        password: formData.password ? '[REDACTED]' : '',
        newPassword: formData.newPassword ? '[REDACTED]' : '',
        confirmPassword: formData.confirmPassword ? '[REDACTED]' : ''
      }
    });

    setError(null);
    setLoading(true);

    try {
      validatePasswords();

      if (!formData.organizationRole && formData.clientRole !== ClientRole.USER) {
        throw new Error('Invalid role mapping');
      }

      if (user) {
        // Update existing user
        const updatePayload: UpdateClientUserDto = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          clientRole: formData.clientRole,
          organizationRole: formData.organizationRole,
        };

        // Only include password if it's being changed
        if (formData.newPassword) {
          updatePayload.password = formData.newPassword;
        }

        console.log('[ClientUserForm] Preparing update API call', {
          payload: { ...updatePayload, password: updatePayload.password ? '[REDACTED]' : '' }
        });

        const response = await ClientUsersApi.update(organizationId, user.id, updatePayload);
        if (response.error) {
          console.error('[ClientUserForm] Update failed', { error: response.error });
          throw new Error(response.error);
        }
        console.log('[ClientUserForm] Update successful', { userId: user.id });
      } else {
        // Create new user
        // For USER role, we use a default organization role
        const organizationRole = formData.organizationRole || OrganizationRole.ISSO;

        const createPayload: CreateClientUserDto = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          clientRole: formData.clientRole,
          organizationRole,
          organizationId,
        };

        console.log('[ClientUserForm] Preparing create API call', {
          payload: { ...createPayload, password: '[REDACTED]' }
        });

        const response = await ClientUsersApi.create(organizationId, createPayload);
        if (response.error) {
          console.error('[ClientUserForm] Create failed', { error: response.error });
          throw new Error(response.error);
        }
        console.log('[ClientUserForm] Create successful', { newUserId: response.data?.id });
      }

      console.log('[ClientUserForm] Calling onSuccess callback');
      onSuccess();
    } catch (err) {
      console.error('[ClientUserForm] Error in form submission', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  console.log('[ClientUserForm] Rendering form', {
    isEdit: !!user,
    hasError: !!error,
    isLoading: loading
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={e => {
              console.log('[ClientUserForm] First name changed:', e.target.value);
              setFormData(prev => ({ ...prev, firstName: e.target.value }));
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={e => {
              console.log('[ClientUserForm] Last name changed:', e.target.value);
              setFormData(prev => ({ ...prev, lastName: e.target.value }));
            }}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={e => {
            console.log('[ClientUserForm] Email changed:', e.target.value);
            setFormData(prev => ({ ...prev, email: e.target.value }));
          }}
          required
        />
      </div>

      {!user ? (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={e => {
              console.log('[ClientUserForm] Password changed: [REDACTED]');
              setFormData(prev => ({ ...prev, password: e.target.value }));
            }}
            required
            minLength={8}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={e => {
                console.log('[ClientUserForm] New password changed: [REDACTED]');
                setFormData(prev => ({ ...prev, newPassword: e.target.value }));
              }}
              minLength={8}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={e => {
                console.log('[ClientUserForm] Confirm password changed: [REDACTED]');
                setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
              }}
              minLength={8}
              placeholder="Leave blank to keep current password"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="clientRole">Client Role</Label>
        <Select
          value={formData.clientRole}
          onValueChange={value => handleClientRoleChange(value as ClientRole)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ClientRole).map(role => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.organizationRole && (
        <div className="space-y-2">
          <Label>Organization Role (Auto-assigned)</Label>
          <div className="p-2 bg-gray-100 rounded">
            {formData.organizationRole}
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            console.log('[ClientUserForm] Cancel clicked');
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}

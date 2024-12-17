'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Building2, Users, Phone, Mail, MapPin, Edit2, Save, X } from 'lucide-react';
import { Badge } from '../../../../../components/ui/badge';
import { Organization } from '../../../../../types/organizations';
import { OrganizationsApi } from '../../../../../lib/api/organizations';

interface BasicInfoCardProps {
  organization: Organization;
  onUpdate: (updatedOrg: Organization) => void;
}

export default function BasicInfoCard({ organization, onUpdate }: BasicInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: organization.name,
    primaryContact: organization.primaryContact || '',
    email: organization.email || '',
    phone: organization.phone || '',
    address: organization.address || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await OrganizationsApi.update(organization.id, formData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      onUpdate(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: organization.name,
      primaryContact: organization.primaryContact || '',
      email: organization.email || '',
      phone: organization.phone || '',
      address: organization.address || '',
    });
    setError(null);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Organization Information</CardTitle>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="h-8 w-8"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSubmit}
              className="h-8 w-8"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Organization Name</Label>
            {isEditing ? (
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1"
              />
            ) : (
              <div className="mt-1 flex items-center">
                <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                <span>{organization.name}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="primaryContact">Primary Contact</Label>
            {isEditing ? (
              <Input
                id="primaryContact"
                name="primaryContact"
                value={formData.primaryContact}
                onChange={handleInputChange}
                className="mt-1"
              />
            ) : (
              <div className="mt-1 flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                <span>{organization.primaryContact || 'Not specified'}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1"
              />
            ) : (
              <div className="mt-1 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span>{organization.email || 'Not specified'}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            {isEditing ? (
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1"
              />
            ) : (
              <div className="mt-1 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>{organization.phone || 'Not specified'}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            {isEditing ? (
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1"
              />
            ) : (
              <div className="mt-1 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>{organization.address || 'Not specified'}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Badge variant={organization.isActive ? "default" : "secondary"}>
              {organization.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline">
              {organization.type}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

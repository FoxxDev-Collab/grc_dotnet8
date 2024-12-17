'use client';

import { useState, useEffect } from 'react';
import { FormComponentProps, BasicInfoFormData, BasicInfo, ContactInfo } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';

type BasicInfoField = keyof BasicInfo;
type ContactField = keyof ContactInfo;

const MAX_DESCRIPTION_LENGTH = 200;
const MAX_CITY_LENGTH = 20;
const MAX_STATE_LENGTH = 20;
const MAX_ZIP_LENGTH = 10;

export default function BasicInfoForm({ data, onChange }: FormComponentProps<BasicInfoFormData>) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneSegments, setPhoneSegments] = useState({
    areaCode: '',
    prefix: '',
    lineNumber: ''
  });

  // Initialize phone segments when component mounts or data changes
  useEffect(() => {
    const phone = data.contact.phone || '';
    setPhoneSegments({
      areaCode: phone.slice(0, 3),
      prefix: phone.slice(3, 6),
      lineNumber: phone.slice(6, 10)
    });
  }, [data.contact.phone]);

  const validateField = (section: 'basicInfo' | 'contact', field: string, value: string): string => {
    switch (field) {
      case 'name':
        return !value.trim() ? 'Organization name is required' : '';
      case 'description':
        return value.length > MAX_DESCRIPTION_LENGTH 
          ? `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters` 
          : '';
      case 'email':
        return !value.trim() 
          ? 'Email is required' 
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
            ? 'Invalid email format' 
            : '';
      case 'primaryContact':
        return !value.trim() ? 'Primary contact is required' : '';
      case 'phone':
        return value && !/^\d{10}$/.test(value.replace(/\D/g, '')) 
          ? 'Phone number must be 10 digits' 
          : '';
      case 'city':
        return value.length > MAX_CITY_LENGTH 
          ? `City cannot exceed ${MAX_CITY_LENGTH} characters` 
          : '';
      case 'state':
        return value.length > MAX_STATE_LENGTH 
          ? `State cannot exceed ${MAX_STATE_LENGTH} characters` 
          : '';
      case 'zip':
        return value.length > MAX_ZIP_LENGTH 
          ? `ZIP code cannot exceed ${MAX_ZIP_LENGTH} characters` 
          : '';
      default:
        return '';
    }
  };

  const handleChange = (section: 'basicInfo' | 'contact', field: string) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = e.target.value;

      // Handle character limits
      if (field === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
        value = value.slice(0, MAX_DESCRIPTION_LENGTH);
      }

      const newData = {
        ...data,
        [section]: {
          ...data[section],
          [field]: value
        }
      };

      // Validate field if it's been touched
      if (touched[`${section}.${field}`]) {
        const error = validateField(section, field, value);
        setErrors(prev => ({ ...prev, [`${section}.${field}`]: error }));
      }

      onChange(newData);
    };
  };

  const handlePhoneChange = (segment: 'areaCode' | 'prefix' | 'lineNumber') => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '');
      const maxLength = segment === 'lineNumber' ? 4 : 3;
      
      if (value.length <= maxLength) {
        const newSegments = { ...phoneSegments, [segment]: value };
        setPhoneSegments(newSegments);
        
        // Combine segments and update form data
        const fullPhone = `${newSegments.areaCode}${newSegments.prefix}${newSegments.lineNumber}`;
        const newData = {
          ...data,
          contact: {
            ...data.contact,
            phone: fullPhone
          }
        };

        // Validate if touched
        if (touched['contact.phone']) {
          const error = validateField('contact', 'phone', fullPhone);
          setErrors(prev => ({ ...prev, 'contact.phone': error }));
        }

        onChange(newData);
      }
    };
  };

  const handleBlur = (section: 'basicInfo' | 'contact', field: string) => {
    const touchKey = `${section}.${field}`;
    if (!touched[touchKey]) {
      setTouched(prev => ({ ...prev, [touchKey]: true }));
      
      const value = section === 'basicInfo' 
        ? data.basicInfo[field as BasicInfoField]
        : data.contact[field as ContactField];
        
      const error = validateField(section, field, value as string);
      setErrors(prev => ({ ...prev, [touchKey]: error }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Organization Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name *</Label>
            <Input
              id="name"
              value={data.basicInfo.name}
              onChange={handleChange('basicInfo', 'name')}
              onBlur={() => handleBlur('basicInfo', 'name')}
              className={errors['basicInfo.name'] ? 'border-red-500' : ''}
            />
            {errors['basicInfo.name'] && (
              <p className="text-sm text-red-500">{errors['basicInfo.name']}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={data.basicInfo.website}
              onChange={handleChange('basicInfo', 'website')}
              onBlur={() => handleBlur('basicInfo', 'website')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={data.basicInfo.industry}
              onChange={handleChange('basicInfo', 'industry')}
              onBlur={() => handleBlur('basicInfo', 'industry')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description 
              <span className="text-sm text-gray-500 ml-2">
                ({data.basicInfo.description.length}/{MAX_DESCRIPTION_LENGTH})
              </span>
            </Label>
            <Textarea
              id="description"
              value={data.basicInfo.description}
              onChange={handleChange('basicInfo', 'description')}
              onBlur={() => handleBlur('basicInfo', 'description')}
              className={`w-full min-h-[100px] ${errors['basicInfo.description'] ? 'border-red-500' : ''}`}
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            {errors['basicInfo.description'] && (
              <p className="text-sm text-red-500">{errors['basicInfo.description']}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryContact">Primary Contact *</Label>
            <Input
              id="primaryContact"
              value={data.contact.primaryContact}
              onChange={handleChange('contact', 'primaryContact')}
              onBlur={() => handleBlur('contact', 'primaryContact')}
              className={errors['contact.primaryContact'] ? 'border-red-500' : ''}
            />
            {errors['contact.primaryContact'] && (
              <p className="text-sm text-red-500">{errors['contact.primaryContact']}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.contact.email}
              onChange={handleChange('contact', 'email')}
              onBlur={() => handleBlur('contact', 'email')}
              className={errors['contact.email'] ? 'border-red-500' : ''}
            />
            {errors['contact.email'] && (
              <p className="text-sm text-red-500">{errors['contact.email']}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="flex gap-2 items-center">
              <span className="text-gray-500">(</span>
              <Input
                id="phone-area"
                value={phoneSegments.areaCode}
                onChange={handlePhoneChange('areaCode')}
                onBlur={() => handleBlur('contact', 'phone')}
                className="w-16 text-center"
                maxLength={3}
                placeholder="123"
              />
              <span className="text-gray-500">)</span>
              <Input
                id="phone-prefix"
                value={phoneSegments.prefix}
                onChange={handlePhoneChange('prefix')}
                onBlur={() => handleBlur('contact', 'phone')}
                className="w-16 text-center"
                maxLength={3}
                placeholder="456"
              />
              <span className="text-gray-500">-</span>
              <Input
                id="phone-line"
                value={phoneSegments.lineNumber}
                onChange={handlePhoneChange('lineNumber')}
                onBlur={() => handleBlur('contact', 'phone')}
                className="w-20 text-center"
                maxLength={4}
                placeholder="7890"
              />
            </div>
            {errors['contact.phone'] && (
              <p className="text-sm text-red-500">{errors['contact.phone']}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={data.contact.city}
              onChange={handleChange('contact', 'city')}
              onBlur={() => handleBlur('contact', 'city')}
              maxLength={MAX_CITY_LENGTH}
              className={errors['contact.city'] ? 'border-red-500' : ''}
            />
            {errors['contact.city'] && (
              <p className="text-sm text-red-500">{errors['contact.city']}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={data.contact.state}
              onChange={handleChange('contact', 'state')}
              onBlur={() => handleBlur('contact', 'state')}
              maxLength={MAX_STATE_LENGTH}
              className={errors['contact.state'] ? 'border-red-500' : ''}
            />
            {errors['contact.state'] && (
              <p className="text-sm text-red-500">{errors['contact.state']}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              value={data.contact.zip}
              onChange={handleChange('contact', 'zip')}
              onBlur={() => handleBlur('contact', 'zip')}
              maxLength={MAX_ZIP_LENGTH}
              className={errors['contact.zip'] ? 'border-red-500' : ''}
            />
            {errors['contact.zip'] && (
              <p className="text-sm text-red-500">{errors['contact.zip']}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
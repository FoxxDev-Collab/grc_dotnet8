'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Control {
  identifier: string;
  name: string;
  control_text: string;
  discussion: string;
  related: string;
}

// NIST Control Family mapping
const CONTROL_FAMILIES: { [key: string]: string } = {
  'AC': 'Access Control',
  'AT': 'Awareness and Training',
  'AU': 'Audit and Accountability',
  'CA': 'Assessment, Authorization, and Monitoring',
  'CM': 'Configuration Management',
  'CP': 'Contingency Planning',
  'IA': 'Identification and Authentication',
  'IR': 'Incident Response',
  'MA': 'Maintenance',
  'MP': 'Media Protection',
  'PE': 'Physical and Environmental Protection',
  'PL': 'Planning',
  'PM': 'Program Management',
  'PS': 'Personnel Security',
  'RA': 'Risk Assessment',
  'SA': 'System and Services Acquisition',
  'SC': 'System and Communications Protection',
  'SI': 'System and Information Integrity',
  'SR': 'Supply Chain Risk Management'
};

export function NISTFrameworkRev5() {
  const [controls, setControls] = useState<Control[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [expandedControl, setExpandedControl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadControls = async () => {
      try {
        const response = await fetch('/api/nist/rev5');
        if (!response.ok) {
          throw new Error('Failed to fetch controls');
        }
        const data = await response.json();
        setControls(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading controls:', error);
        setError(error instanceof Error ? error.message : 'Failed to load controls');
        setLoading(false);
      }
    };

    loadControls();
  }, []);

  const getControlFamily = (identifier: string): string => {
    const familyCode = identifier.substring(0, 2);
    return CONTROL_FAMILIES[familyCode] || 'Other';
  };

  const filteredControls = controls.filter(control => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      control.identifier?.toLowerCase().includes(searchLower) ||
      control.name?.toLowerCase().includes(searchLower) ||
      control.control_text?.toLowerCase().includes(searchLower);
    
    if (selectedFamily !== 'all') {
      const controlFamilyCode = control.identifier.substring(0, 2);
      return matchesSearch && controlFamilyCode === selectedFamily;
    }
    
    return matchesSearch;
  });

  const handleRowClick = (controlId: string) => {
    setExpandedControl(expandedControl === controlId ? null : controlId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading NIST controls...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>NIST SP 800-53 Rev. 5 Controls</CardTitle>
        <CardDescription>
          Browse and search security controls from the NIST SP 800-53 Rev. 5 catalog
        </CardDescription>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search controls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={selectedFamily}
            onValueChange={setSelectedFamily}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select Control Family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Families</SelectItem>
              {Object.entries(CONTROL_FAMILIES).map(([code, name]) => (
                <SelectItem key={code} value={code}>
                  {name} ({code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Control ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Family</TableHead>
                <TableHead className="hidden md:table-cell">Summary</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredControls.map((control) => (
                <React.Fragment key={control.identifier}>
                  <TableRow>
                    <TableCell className="font-medium">{control.identifier}</TableCell>
                    <TableCell>{control.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getControlFamily(control.identifier)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {control.control_text?.slice(0, 100)}...
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRowClick(control.identifier)}
                      >
                        {expandedControl === control.identifier ? 'Hide' : 'View'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedControl === control.identifier && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-gray-50">
                        <div className="p-4">
                          <h4 className="font-semibold mb-2">Control Text</h4>
                          <p className="whitespace-pre-wrap mb-4">{control.control_text}</p>
                          
                          <h4 className="font-semibold mb-2">Discussion</h4>
                          <p className="mb-4">{control.discussion}</p>
                          
                          <h4 className="font-semibold mb-2">Related Controls</h4>
                          <p>{control.related}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

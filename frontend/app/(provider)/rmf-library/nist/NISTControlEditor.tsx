'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/text-area';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save } from 'lucide-react';
import type { Control, Parameter, Part, ControlUpdate } from '@/types/catalog';

interface NISTControlEditorProps {
  control: Control;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: ControlUpdate) => void;
}

export function NISTControlEditor({
  control,
  isOpen,
  onClose,
  onSave
}: NISTControlEditorProps) {
  const [editedControl, setEditedControl] = useState<ControlUpdate>({
    title: control.title,
    parameters: [...control.parameters],
    parts: [...control.parts]
  });

  useEffect(() => {
    setEditedControl({
      title: control.title,
      parameters: [...control.parameters],
      parts: [...control.parts]
    });
  }, [control]);

  const handleSave = () => {
    onSave(editedControl);
  };

  const addParameter = () => {
    const newParameter: Parameter = {
      id: `param-${Date.now()}`,
      label: ''
    };
    setEditedControl(prev => ({
      ...prev,
      parameters: [...(prev.parameters || []), newParameter]
    }));
  };

  const updateParameter = (index: number, updates: Partial<Parameter>) => {
    setEditedControl(prev => ({
      ...prev,
      parameters: prev.parameters?.map((param, i) =>
        i === index ? { ...param, ...updates } : param
      ) || []
    }));
  };

  const removeParameter = (index: number) => {
    setEditedControl(prev => ({
      ...prev,
      parameters: prev.parameters?.filter((_, i) => i !== index) || []
    }));
  };

  const addPart = () => {
    const newPart: Part = {
      id: `part-${Date.now()}`,
      name: '',
      prose: ''
    };
    setEditedControl(prev => ({
      ...prev,
      parts: [...(prev.parts || []), newPart]
    }));
  };

  const updatePart = (index: number, updates: Partial<Part>) => {
    setEditedControl(prev => ({
      ...prev,
      parts: prev.parts?.map((part, i) =>
        i === index ? { ...part, ...updates } : part
      ) || []
    }));
  };

  const removePart = (index: number) => {
    setEditedControl(prev => ({
      ...prev,
      parts: prev.parts?.filter((_, i) => i !== index) || []
    }));
  };

  const hasChanges = (): boolean => {
    return (
      editedControl.title !== control.title ||
      JSON.stringify(editedControl.parameters) !== JSON.stringify(control.parameters) ||
      JSON.stringify(editedControl.parts) !== JSON.stringify(control.parts)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Control: {control.id}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-1">
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedControl.title}
                  onChange={e => setEditedControl(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
            </TabsContent>

            <TabsContent value="parameters" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Control Parameters</h4>
                <Button onClick={addParameter} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Parameter
                </Button>
              </div>
              <div className="space-y-4">
                {editedControl.parameters?.map((param, index) => (
                  <div key={param.id} className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <Label>Parameter ID</Label>
                      <Input
                        value={param.id}
                        onChange={e => updateParameter(index, { id: e.target.value })}
                      />
                    </div>
                    <div className="flex-[2] space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={param.label}
                        onChange={e => updateParameter(index, { label: e.target.value })}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={() => removeParameter(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="implementation" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Implementation Parts</h4>
                <Button onClick={addPart} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Part
                </Button>
              </div>
              <div className="space-y-6">
                {editedControl.parts?.map((part, index) => (
                  <div key={part.id} className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="flex-1 space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={part.name}
                          onChange={e => updatePart(index, { name: e.target.value })}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePart(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Implementation</Label>
                      <Textarea
                        value={part.prose}
                        onChange={e => updatePart(index, { prose: e.target.value })}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges()}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

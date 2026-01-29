'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Trash2, Pill, Star, StarOff } from 'lucide-react';
import { toast } from 'sonner';

// Mock templates data
const mockTemplates = [
  {
    id: '1',
    name: 'Common Cold',
    specialty: 'General',
    isFavorite: true,
    items: [
      { drug_name: 'Paracetamol 500mg', frequency: 'thrice daily', duration: '3 days' },
      { drug_name: 'Cetirizine 10mg', frequency: 'once daily', duration: '5 days' },
      { drug_name: 'Cough Syrup', frequency: 'thrice daily', duration: '5 days' }
    ]
  },
  {
    id: '2',
    name: 'URTI with Fever',
    specialty: 'General',
    isFavorite: true,
    items: [
      { drug_name: 'Amoxicillin 500mg', frequency: 'thrice daily', duration: '5 days' },
      { drug_name: 'Paracetamol 500mg', frequency: 'thrice daily', duration: '3 days' },
      { drug_name: 'Pantoprazole 40mg', frequency: 'once daily', duration: '5 days' }
    ]
  },
  {
    id: '3',
    name: 'Gastritis',
    specialty: 'General',
    isFavorite: false,
    items: [
      { drug_name: 'Pantoprazole 40mg', frequency: 'twice daily', duration: '14 days' },
      { drug_name: 'Domperidone 10mg', frequency: 'thrice daily', duration: '7 days' },
      { drug_name: 'Antacid Syrup', frequency: 'thrice daily', duration: '7 days' }
    ]
  },
  {
    id: '4',
    name: 'Hypertension - Initial',
    specialty: 'Cardiology',
    isFavorite: false,
    items: [
      { drug_name: 'Amlodipine 5mg', frequency: 'once daily', duration: 'continue' },
      { drug_name: 'Aspirin 75mg', frequency: 'once daily', duration: 'continue' }
    ]
  }
];

interface Template {
  id: string;
  name: string;
  specialty: string;
  isFavorite: boolean;
  items: Array<{
    drug_name: string;
    frequency: string;
    duration: string;
  }>;
}

export default function PrescriptionTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleFavorite = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
    );
    toast.success('Template updated');
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast.success('Template deleted');
  };

  const duplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: crypto.randomUUID(),
      name: `${template.name} (Copy)`,
      isFavorite: false
    };
    setTemplates((prev) => [...prev, newTemplate]);
    toast.success('Template duplicated');
  };

  const favorites = templates.filter((t) => t.isFavorite);
  const others = templates.filter((t) => !t.isFavorite);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Heading
          title="Prescription Templates"
          description="Save time with reusable prescription templates"
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>
                Start a new prescription template. You can add medications after creating it.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Common Cold, URTI, Diabetes Initial"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (newTemplateName.trim()) {
                    const newTemplate: Template = {
                      id: crypto.randomUUID(),
                      name: newTemplateName.trim(),
                      specialty: 'General',
                      isFavorite: false,
                      items: []
                    };
                    setTemplates((prev) => [...prev, newTemplate]);
                    setNewTemplateName('');
                    setDialogOpen(false);
                    toast.success('Template created');
                  }
                }}
              >
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="my-4" />

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            Favorites
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteTemplate}
                onDuplicate={duplicateTemplate}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Templates Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">All Templates</h3>
        {others.length === 0 && favorites.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No templates yet. Create your first template to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {others.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteTemplate}
                onDuplicate={duplicateTemplate}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

function TemplateCard({
  template,
  onToggleFavorite,
  onDelete,
  onDuplicate
}: {
  template: Template;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (template: Template) => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{template.name}</CardTitle>
            <CardDescription>
              <Badge variant="secondary" className="mt-1">
                {template.specialty}
              </Badge>
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite(template.id)}
          >
            {template.isFavorite ? (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Medication Preview */}
        <div className="space-y-1 mb-4">
          {template.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Pill className="h-3 w-3 text-muted-foreground" />
              <span className="truncate">{item.drug_name}</span>
            </div>
          ))}
          {template.items.length > 3 && (
            <p className="text-xs text-muted-foreground">
              +{template.items.length - 3} more medications
            </p>
          )}
          {template.items.length === 0 && (
            <p className="text-sm text-muted-foreground">No medications yet</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="default" size="sm" className="flex-1">
            Use Template
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDuplicate(template)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(template.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

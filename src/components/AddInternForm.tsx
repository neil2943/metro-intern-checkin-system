
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddInternFormProps {
  onInternAdded: () => void;
  onCancel: () => void;
}

const departments = [
  'Engineering',
  'Operations',
  'IT',
  'HR',
  'Finance',
  'Safety',
  'Maintenance',
  'Project Management'
];

export const AddInternForm = ({ onInternAdded, onCancel }: AddInternFormProps) => {
  const [formData, setFormData] = useState({
    intern_id: '',
    name: '',
    email: '',
    department: '',
    phone: '',
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.intern_id || !formData.name || !formData.email || !formData.department || !formData.start_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const internData = {
        intern_id: formData.intern_id,
        name: formData.name,
        email: formData.email,
        department: formData.department,
        phone: formData.phone || null,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        is_active: true
      };

      const { error } = await supabase
        .from('interns')
        .insert([internData]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Error",
            description: "Intern ID or email already exists. Please use unique values.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      onInternAdded();
      
      // Reset form
      setFormData({
        intern_id: '',
        name: '',
        email: '',
        department: '',
        phone: '',
        start_date: '',
        end_date: ''
      });

    } catch (error) {
      console.error('Error adding intern:', error);
      toast({
        title: "Error",
        description: "Failed to add intern. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Intern
        </CardTitle>
        <CardDescription>
          Enter the details of the new intern to add them to the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="intern_id">Intern ID *</Label>
              <Input
                id="intern_id"
                value={formData.intern_id}
                onChange={(e) => handleChange('intern_id', e.target.value)}
                placeholder="e.g., DMRC005"
                required
              />
            </div>
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g., 9876543210"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="department">Department *</Label>
              <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date (Optional)</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Intern'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

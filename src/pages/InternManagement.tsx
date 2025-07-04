
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, ArrowLeft } from 'lucide-react';
import { AddInternForm } from '@/components/AddInternForm';
import { InternsTable } from '@/components/InternsTable';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const InternManagement = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInterns(data || []);
    } catch (error) {
      console.error('Error fetching interns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch interns. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInternAdded = () => {
    setShowAddForm(false);
    fetchInterns();
    toast({
      title: "Success",
      description: "Intern added successfully!",
    });
  };

  const handleToggleActive = async (internId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('interns')
        .update({ is_active: !currentStatus })
        .eq('id', internId);

      if (error) throw error;
      
      fetchInterns();
      toast({
        title: "Success",
        description: `Intern ${!currentStatus ? 'activated' : 'deactivated'} successfully!`,
      });
    } catch (error) {
      console.error('Error updating intern status:', error);
      toast({
        title: "Error",
        description: "Failed to update intern status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading interns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                Intern Management
              </h1>
            </div>
            <p className="text-gray-600">
              Manage DMRC interns - add new interns and update existing ones
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {showAddForm ? 'Cancel' : 'Add Intern'}
          </Button>
        </div>

        {/* Add Intern Form */}
        {showAddForm && (
          <div className="mb-8">
            <AddInternForm
              onInternAdded={handleInternAdded}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Interns Table */}
        <InternsTable
          interns={interns}
          onToggleActive={handleToggleActive}
        />
      </div>
    </div>
  );
};

export default InternManagement;

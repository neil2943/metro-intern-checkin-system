
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AttendanceForm } from '@/components/AttendanceForm';
import { InternsList } from '@/components/InternsList';
import { AttendanceStats } from '@/components/AttendanceStats';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [interns, setInterns] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch interns
      const { data: internsData, error: internsError } = await supabase
        .from('interns')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (internsError) throw internsError;

      // Fetch today's attendance
      const today = new Date().toISOString().split('T')[0];
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select(`
          *,
          interns (
            name,
            intern_id,
            department
          )
        `)
        .eq('date', today);

      if (attendanceError) throw attendanceError;

      setInterns(internsData || []);
      setAttendanceData(attendanceData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTodayStats = () => {
    const total = interns.length;
    const present = attendanceData.filter(record => record.status === 'present').length;
    const late = attendanceData.filter(record => record.status === 'late').length;
    const absent = total - present - late;

    return { total, present, late, absent };
  };

  const stats = getTodayStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            DMRC Intern Attendance System
          </h1>
          <p className="text-gray-600">
            Welcome to the Delhi Metro Rail Corporation intern attendance portal
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Today</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendance Form */}
          <div className="lg:col-span-1">
            <AttendanceForm onAttendanceMarked={fetchData} />
          </div>

          {/* Interns List & Stats */}
          <div className="lg:col-span-2 space-y-6">
            <AttendanceStats attendanceData={attendanceData} />
            <InternsList interns={interns} attendanceData={attendanceData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

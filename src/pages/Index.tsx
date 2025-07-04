
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Settings, UserPlus, LogIn } from 'lucide-react';
import { InternsList } from '@/components/InternsList';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [interns, setInterns] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch active interns
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
        .select('*')
        .eq('date', today);

      if (attendanceError) throw attendanceError;

      setInterns(internsData || []);
      setAttendanceData(attendanceData || []);

      // Calculate stats
      const totalInterns = internsData?.length || 0;
      const presentCount = attendanceData?.filter(record => record.status === 'present').length || 0;
      const lateCount = attendanceData?.filter(record => record.status === 'late').length || 0;
      const absentCount = totalInterns - presentCount - lateCount;

      setStats({
        total: totalInterns,
        present: presentCount,
        absent: absentCount,
        late: lateCount
      });

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              DMRC Intern Check-in System
            </h1>
            <p className="text-gray-600">
              Today's Date: {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
            <Button
              onClick={() => navigate('/manage-interns')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Manage Interns
            </Button>
          </div>
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
              <p className="text-xs text-muted-foreground">Active interns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <Badge variant="default" className="bg-green-500">
                {stats.present}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              <p className="text-xs text-muted-foreground">On time today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late</CardTitle>
              <Badge variant="default" className="bg-yellow-500">
                {stats.late}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
              <p className="text-xs text-muted-foreground">Late arrivals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <Badge variant="destructive">
                {stats.absent}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              <p className="text-xs text-muted-foreground">Not checked in</p>
            </CardContent>
          </Card>
        </div>

        {/* Interns List */}
        <InternsList interns={interns} attendanceData={attendanceData} />
      </div>
    </div>
  );
};

export default Index;

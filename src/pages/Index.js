
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Clock, CheckCircle, AlertTriangle, UserPlus } from 'lucide-react';
import { AttendanceForm } from '@/components/AttendanceForm';
import { InternsList } from '@/components/InternsList';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [interns, setInterns] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterns();
    fetchTodayAttendance();
  }, []);

  const fetchInterns = async () => {
    try {
      const { data, error } = await supabase
        .from('interns')
        .select('*')
        .eq('is_active', true)
        .order('intern_id');

      if (error) throw error;
      setInterns(data || []);
    } catch (error) {
      console.error('Error fetching interns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch interns. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', today);

      if (error) throw error;
      setAttendanceData(data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceMarked = () => {
    fetchTodayAttendance();
    toast({
      title: "Success",
      description: "Attendance marked successfully!",
    });
  };

  const getAttendanceStats = () => {
    const totalInterns = interns.length;
    const presentCount = attendanceData.filter(record => record.status === 'present').length;
    const lateCount = attendanceData.filter(record => record.status === 'late').length;
    const absentCount = totalInterns - presentCount - lateCount;

    return { totalInterns, presentCount, lateCount, absentCount };
  };

  const getDepartmentStats = () => {
    const departmentCounts = {};
    
    // Initialize department counts
    interns.forEach(intern => {
      if (!departmentCounts[intern.department]) {
        departmentCounts[intern.department] = { total: 0, present: 0 };
      }
      departmentCounts[intern.department].total++;
    });

    // Count present interns by department
    attendanceData.forEach(record => {
      const intern = interns.find(i => i.id === record.intern_id);
      if (intern && record.status === 'present') {
        departmentCounts[intern.department].present++;
      }
    });

    return departmentCounts;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = getAttendanceStats();
  const departmentStats = getDepartmentStats();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              DMRC Intern Attendance Dashboard
            </h1>
            <p className="text-gray-600">
              Today's date: {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button
            onClick={() => navigate('/manage-interns')}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Manage Interns
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInterns}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.presentCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.lateCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absentCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Department Stats */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Attendance</CardTitle>
              <CardDescription>Today's attendance breakdown by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(departmentStats).map(([department, data]) => (
                  <div key={department} className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-lg">{department}</div>
                    <div className="text-sm text-gray-600">
                      {data.present} / {data.total} present
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(data.present / data.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendance Form */}
          <div className="lg:col-span-1">
            <AttendanceForm 
              interns={interns} 
              onAttendanceMarked={handleAttendanceMarked}
            />
          </div>

          {/* Interns List */}
          <div className="lg:col-span-2">
            <InternsList 
              interns={interns} 
              attendanceData={attendanceData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

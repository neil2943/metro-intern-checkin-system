
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface AttendanceRecord {
  intern_id: string;
  status: 'present' | 'late' | 'absent';
  check_in_time?: string;
  check_out_time?: string;
  interns?: {
    name: string;
    intern_id: string;
    department: string;
  };
}

interface AttendanceStatsProps {
  attendanceData: AttendanceRecord[];
}

export const AttendanceStats = ({ attendanceData }: AttendanceStatsProps) => {
  const getStatsData = () => {
    const total = attendanceData.length;
    const present = attendanceData.filter(record => record.status === 'present').length;
    const late = attendanceData.filter(record => record.status === 'late').length;
    const absent = attendanceData.filter(record => record.status === 'absent').length;

    const presentPercentage = total > 0 ? (present / total) * 100 : 0;
    const latePercentage = total > 0 ? (late / total) * 100 : 0;
    const absentPercentage = total > 0 ? (absent / total) * 100 : 0;

    return {
      total,
      present,
      late,
      absent,
      presentPercentage,
      latePercentage,
      absentPercentage
    };
  };

  const getDepartmentStats = () => {
    const departments: { [key: string]: { present: number; late: number; absent: number } } = {};
    
    attendanceData.forEach(record => {
      if (record.interns?.department) {
        const dept = record.interns.department;
        if (!departments[dept]) {
          departments[dept] = { present: 0, late: 0, absent: 0 };
        }
        departments[dept][record.status]++;
      }
    });

    return Object.entries(departments).map(([department, stats]) => ({
      department,
      ...stats,
      total: stats.present + stats.late + stats.absent
    }));
  };

  const stats = getStatsData();
  const departmentStats = getDepartmentStats();

  const pieData = [
    { name: 'Present', value: stats.present, color: '#10b981' },
    { name: 'Late', value: stats.late, color: '#f59e0b' },
    { name: 'Absent', value: stats.absent, color: '#ef4444' },
  ].filter(item => item.value > 0);

  if (attendanceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Attendance Analytics
          </CardTitle>
          <CardDescription>No attendance data available for today</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Start marking attendance to see analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overall Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Today's Overview
          </CardTitle>
          <CardDescription>Attendance breakdown for {new Date().toLocaleDateString('en-IN')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Present ({stats.present})</span>
              <span>{stats.presentPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={stats.presentPercentage} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Late ({stats.late})</span>
              <span>{stats.latePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={stats.latePercentage} className="h-2 bg-yellow-100" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Absent ({stats.absent})</span>
              <span>{stats.absentPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={stats.absentPercentage} className="h-2 bg-red-100" />
          </div>
        </CardContent>
      </Card>

      {/* Department-wise Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Department-wise Attendance</CardTitle>
          <CardDescription>Attendance by department</CardDescription>
        </CardHeader>
        <CardContent>
          {departmentStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={departmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#10b981" name="Present" />
                <Bar dataKey="late" fill="#f59e0b" name="Late" />
                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No department data available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

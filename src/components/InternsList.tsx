
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Intern {
  id: string;
  intern_id: string;
  name: string;
  department: string;
}

interface AttendanceRecord {
  intern_id: string;
  status: 'present' | 'absent' | 'late';
  check_in_time?: string;
  check_out_time?: string;
}

interface InternsListProps {
  interns: Intern[];
  attendanceData: AttendanceRecord[];
}

export const InternsList = ({ interns, attendanceData }: InternsListProps) => {
  const getAttendanceStatus = (internId: string) => {
    const record = attendanceData.find(record => record.intern_id === internId);
    return record ? record.status : 'absent';
  };

  const getAttendanceRecord = (internId: string) => {
    return attendanceData.find(record => record.intern_id === internId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Present
          </Badge>
        );
      case 'late':
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Late
          </Badge>
        );
      case 'absent':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Unknown
          </Badge>
        );
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '--';
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Today's Attendance
        </CardTitle>
        <CardDescription>
          Current status of all active interns for {new Date().toLocaleDateString('en-IN')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Intern ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interns.map((intern) => {
                const status = getAttendanceStatus(intern.id);
                const record = getAttendanceRecord(intern.id);
                
                return (
                  <TableRow key={intern.id}>
                    <TableCell className="font-medium">{intern.intern_id}</TableCell>
                    <TableCell>{intern.name}</TableCell>
                    <TableCell>{intern.department}</TableCell>
                    <TableCell>{getStatusBadge(status)}</TableCell>
                    <TableCell>{formatTime(record?.check_in_time)}</TableCell>
                    <TableCell>{formatTime(record?.check_out_time)}</TableCell>
                  </TableRow>
                );
              })}
              {interns.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No active interns found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

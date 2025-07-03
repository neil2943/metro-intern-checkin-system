
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle } from 'lucide-react';

interface AttendanceFormProps {
  onAttendanceMarked: () => void;
}

export const AttendanceForm = ({ onAttendanceMarked }: AttendanceFormProps) => {
  const [internId, setInternId] = useState('');
  const [status, setStatus] = useState('present');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const markAttendance = async (type: 'check-in' | 'check-out') => {
    if (!internId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an intern ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // First, find the intern by intern_id
      const { data: intern, error: internError } = await supabase
        .from('interns')
        .select('id')
        .eq('intern_id', internId.toUpperCase())
        .single();

      if (internError || !intern) {
        toast({
          title: "Error",
          description: "Intern ID not found",
          variant: "destructive",
        });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();

      if (type === 'check-in') {
        // Create or update attendance record for check-in
        const { error } = await supabase
          .from('attendance')
          .upsert({
            intern_id: intern.id,
            date: today,
            check_in_time: now,
            status: status as 'present' | 'late' | 'absent',
            notes: notes || null,
          }, {
            onConflict: 'intern_id,date'
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: `Check-in recorded successfully for ${internId}`,
        });
      } else {
        // Update existing record with check-out time
        const { error } = await supabase
          .from('attendance')
          .update({
            check_out_time: now,
            notes: notes || null,
          })
          .eq('intern_id', intern.id)
          .eq('date', today);

        if (error) throw error;

        toast({
          title: "Success",
          description: `Check-out recorded successfully for ${internId}`,
        });
      }

      // Reset form
      setInternId('');
      setNotes('');
      onAttendanceMarked();

    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Mark Attendance
        </CardTitle>
        <CardDescription>
          Record check-in and check-out times for interns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="internId">Intern ID</Label>
          <Input
            id="internId"
            placeholder="Enter intern ID (e.g., DMRC001)"
            value={internId}
            onChange={(e) => setInternId(e.target.value)}
            className="uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => markAttendance('check-in')}
            disabled={loading}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Check In
          </Button>
          <Button
            onClick={() => markAttendance('check-out')}
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            Check Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

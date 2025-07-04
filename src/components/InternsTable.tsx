
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Mail, Phone, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';

interface Intern {
  id: string;
  intern_id: string;
  name: string;
  email: string;
  department: string;
  phone?: string;
  start_date: string;
  is_active: boolean;
}

interface InternsTableProps {
  interns: Intern[];
  onToggleActive: (internId: string, currentStatus: boolean) => void;
}

export const InternsTable = ({ interns, onToggleActive }: InternsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
        Inactive
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          All Interns ({interns.length})
        </CardTitle>
        <CardDescription>
          Complete list of all interns registered in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Intern ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interns.map((intern) => (
                <TableRow key={intern.id}>
                  <TableCell className="font-medium">{intern.intern_id}</TableCell>
                  <TableCell>{intern.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-gray-400" />
                      {intern.email}
                    </div>
                  </TableCell>
                  <TableCell>{intern.department}</TableCell>
                  <TableCell>
                    {intern.phone ? (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {intern.phone}
                      </div>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      {formatDate(intern.start_date)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(intern.is_active)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleActive(intern.id, intern.is_active)}
                      className="flex items-center gap-1"
                    >
                      {intern.is_active ? (
                        <>
                          <ToggleRight className="h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4" />
                          Activate
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {interns.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No interns found. Add your first intern using the form above.
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

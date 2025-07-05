
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Award, Users, Clock, PlayCircle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const LearningDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [badges, setBadges] = useState([]);
  const [userScores, setUserScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch available courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      // Fetch user enrollments (mock intern for now)
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            title,
            description,
            thumbnail_url,
            duration_hours
          )
        `)
        .limit(10);

      if (enrollmentsError) throw enrollmentsError;

      // Fetch certificates
      const { data: certificatesData, error: certificatesError } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (title)
        `)
        .limit(10);

      if (certificatesError) throw certificatesError;

      // Fetch badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .order('points', { ascending: false });

      if (badgesError) throw badgesError;

      setCourses(coursesData || []);
      setEnrollments(enrollmentsData || []);
      setCertificates(certificatesData || []);
      setBadges(badgesData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollCourse = async (courseId: string) => {
    try {
      // Mock intern ID - in real app, get from auth
      const internId = 'mock-intern-id';
      
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          intern_id: internId,
          course_id: courseId,
          status: 'enrolled'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully enrolled in course!",
      });
      
      fetchDashboardData();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: "Error",
        description: "Failed to enroll in course. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Learning Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome to your DMRC Learning Management System
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              Back to Main
            </Button>
            <Button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Browse Courses
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.length}</div>
              <p className="text-xs text-muted-foreground">Active enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certificates.length}</div>
              <p className="text-xs text-muted-foreground">Earned certificates</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userScores?.total_points || 0}</div>
              <p className="text-xs text-muted-foreground">Learning points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24h</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* My Courses */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">My Courses</h2>
          {enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{enrollment.courses?.title}</CardTitle>
                    </div>
                    <CardDescription>
                      {enrollment.courses?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{enrollment.progress_percentage}%</span>
                        </div>
                        <Progress value={enrollment.progress_percentage} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={enrollment.status === 'completed' ? 'default' : 'secondary'}>
                          {enrollment.status}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/course/${enrollment.course_id}`)}
                          className="flex items-center gap-2"
                        >
                          <PlayCircle className="h-4 w-4" />
                          Continue
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No enrolled courses yet</h3>
                <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
                <Button onClick={() => navigate('/courses')}>
                  Browse Available Courses
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Available Courses */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Available Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </div>
                  <CardDescription>
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration_hours}h
                      </span>
                      <Badge variant="outline">{course.difficulty_level}</Badge>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleEnrollCourse(course.id)}
                    >
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Gamification Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((badge) => (
              <Card key={badge.id} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-2">{badge.icon_url}</div>
                  <h3 className="font-semibold">{badge.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                  <Badge variant="secondary">{badge.points} points</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningDashboard;


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Clock, Users, PlayCircle, FileText, HelpCircle, MessageSquare, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (modulesError) throw modulesError;

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select(`
          *,
          course_modules (
            title
          )
        `)
        .in('module_id', modulesData.map(m => m.id))
        .order('order_index');

      if (lessonsError) throw lessonsError;

      // Check enrollment
      const { data: enrollmentData } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('course_id', courseId)
        .single();

      // Fetch progress if enrolled
      let progressData = [];
      if (enrollmentData) {
        const { data: prog } = await supabase
          .from('lesson_progress')
          .select('*')
          .in('lesson_id', lessonsData.map(l => l.id));
        progressData = prog || [];
      }

      setCourse(courseData);
      setModules(modulesData || []);
      setLessons(lessonsData || []);
      setEnrollment(enrollmentData);
      setProgress(progressData);

    } catch (error) {
      console.error('Error fetching course data:', error);
      toast({
        title: "Error",
        description: "Failed to load course details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
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
      
      fetchCourseData();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: "Error",
        description: "Failed to enroll in course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startLesson = async (lessonId: string) => {
    try {
      const internId = 'mock-intern-id';
      
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          intern_id: internId,
          lesson_id: lessonId,
          is_completed: false,
          time_spent_minutes: 0
        });

      if (error) throw error;

      navigate(`/lesson/${lessonId}`);
    } catch (error) {
      console.error('Error starting lesson:', error);
      toast({
        title: "Error",
        description: "Failed to start lesson. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/courses')}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const completedLessons = progress.filter(p => p.is_completed).length;
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600">{course.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Comprehensive understanding of metro operations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Safety protocols and emergency procedures</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Customer service best practices</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Technical system maintenance knowledge</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  {modules.map((module, moduleIndex) => {
                    const moduleLessons = lessons.filter(l => l.module_id === module.id);
                    const completedInModule = moduleLessons.filter(l => 
                      progress.some(p => p.lesson_id === l.id && p.is_completed)
                    ).length;

                    return (
                      <AccordionItem key={module.id} value={`module-${moduleIndex}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center justify-between w-full mr-4">
                            <div>
                              <h3 className="font-semibold">{module.title}</h3>
                              <p className="text-sm text-gray-600">{module.description}</p>
                            </div>
                            <Badge variant="outline">
                              {completedInModule}/{moduleLessons.length} lessons
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-4">
                            {moduleLessons.map((lesson) => {
                              const isCompleted = progress.some(p => p.lesson_id === lesson.id && p.is_completed);
                              const canAccess = enrollment || lesson.content_type === 'text';

                              return (
                                <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    {lesson.content_type === 'video' && <PlayCircle className="h-5 w-5 text-blue-600" />}
                                    {lesson.content_type === 'pdf' && <FileText className="h-5 w-5 text-red-600" />}
                                    {lesson.content_type === 'quiz' && <HelpCircle className="h-5 w-5 text-purple-600" />}
                                    <div>
                                      <h4 className="font-medium">{lesson.title}</h4>
                                      <p className="text-sm text-gray-600">{lesson.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {lesson.duration_minutes && (
                                      <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {lesson.duration_minutes}m
                                      </span>
                                    )}
                                    {isCompleted && (
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    )}
                                    <Button
                                      size="sm"
                                      onClick={() => startLesson(lesson.id)}
                                      disabled={!canAccess}
                                    >
                                      {isCompleted ? 'Review' : 'Start'}
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </TabsContent>

              <TabsContent value="discussions">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Course Discussions
                    </CardTitle>
                    <CardDescription>
                      Connect with fellow learners and instructors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No discussions yet. Be the first to start a conversation!</p>
                      <Button className="mt-4" disabled={!enrollment}>
                        Start Discussion
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    Duration
                  </span>
                  <span className="text-sm font-medium">{course.duration_hours} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    Modules
                  </span>
                  <span className="text-sm font-medium">{modules.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4" />
                    Lessons
                  </span>
                  <span className="text-sm font-medium">{totalLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Level</span>
                  <Badge variant="outline">{course.difficulty_level}</Badge>
                </div>
              </CardContent>
            </Card>

            {enrollment ? (
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Course Progress</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                  </div>
                  <div className="text-sm text-gray-600">
                    {completedLessons} of {totalLessons} lessons completed
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      const nextLesson = lessons.find(l => !progress.some(p => p.lesson_id === l.id && p.is_completed));
                      if (nextLesson) {
                        startLesson(nextLesson.id);
                      }
                    }}
                  >
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <Button className="w-full" size="lg" onClick={handleEnroll}>
                    Enroll in Course
                  </Button>
                  <p className="text-sm text-gray-600 text-center mt-4">
                    Free for DMRC interns
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

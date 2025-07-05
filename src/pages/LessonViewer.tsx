
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { PlayCircle, FileText, HelpCircle, CheckCircle, ArrowLeft, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LessonViewer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (lessonId) {
      fetchLessonData();
      // Start timer
      const interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      
      // Fetch lesson details
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select(`
          *,
          course_modules (
            *,
            courses (
              title
            )
          )
        `)
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;

      // Fetch progress
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('lesson_id', lessonId)
        .single();

      setLesson(lessonData);
      setProgress(progressData);
      setNotes(progressData?.notes || '');

    } catch (error) {
      console.error('Error fetching lesson data:', error);
      toast({
        title: "Error",
        description: "Failed to load lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (isCompleted = false) => {
    try {
      const internId = 'mock-intern-id';
      
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          intern_id: internId,
          lesson_id: lessonId,
          is_completed: isCompleted,
          time_spent_minutes: (progress?.time_spent_minutes || 0) + timeSpent,
          notes: notes,
          completed_at: isCompleted ? new Date().toISOString() : null
        });

      if (error) throw error;

      if (isCompleted) {
        toast({
          title: "Lesson Completed!",
          description: "Great job! You've completed this lesson.",
        });
      }

      fetchLessonData();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveNotes = async () => {
    await updateProgress(progress?.is_completed || false);
    toast({
      title: "Notes Saved",
      description: "Your notes have been saved successfully.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Lesson Not Found</h2>
          <p className="text-gray-600 mb-4">The lesson you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/learning-dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (lesson.content_type) {
      case 'video':
        return (
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <PlayCircle className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg">Video Content</p>
                  <p className="text-sm opacity-75">Duration: {lesson.duration_minutes} minutes</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">{lesson.description}</p>
              </div>
            </CardContent>
          </Card>
        );

      case 'pdf':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">PDF Document</h3>
              <p className="text-gray-600 mb-4">{lesson.description}</p>
              <Button>
                Open PDF
              </Button>
            </CardContent>
          </Card>
        );

      case 'text':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {lesson.description}
                </p>
                {lesson.content_data && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Learning Content:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>This is where the detailed lesson content would be displayed.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'quiz':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Quiz</h3>
              <p className="text-gray-600 mb-4">{lesson.description}</p>
              <Button>
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lesson Content</h3>
              <p className="text-gray-600">{lesson.description}</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/course/${lesson.course_modules?.course_id}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              <p className="text-gray-600">{lesson.course_modules?.courses?.title}</p>
            </div>
          </div>
          {progress?.is_completed && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Completed</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {renderContent()}

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle>My Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Take notes while learning..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                />
                <Button onClick={saveNotes}>
                  Save Notes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Status</span>
                  <span className={progress?.is_completed ? 'text-green-600' : 'text-gray-600'}>
                    {progress?.is_completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                
                {lesson.duration_minutes && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Duration
                    </span>
                    <span>{lesson.duration_minutes} min</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span>Time Spent</span>
                  <span>{(progress?.time_spent_minutes || 0) + timeSpent} min</span>
                </div>

                {!progress?.is_completed && (
                  <Button 
                    className="w-full" 
                    onClick={() => updateProgress(true)}
                  >
                    Mark as Complete
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous Lesson
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Next Lesson
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;

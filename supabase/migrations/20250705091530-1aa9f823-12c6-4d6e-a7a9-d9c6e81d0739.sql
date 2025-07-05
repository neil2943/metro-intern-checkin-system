
-- Create enum types for various statuses
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE enrollment_status AS ENUM ('enrolled', 'completed', 'dropped');
CREATE TYPE content_type AS ENUM ('video', 'pdf', 'quiz', 'assignment', 'text');
CREATE TYPE quiz_question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer');

-- Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration_hours INTEGER,
  difficulty_level VARCHAR(50) DEFAULT 'beginner',
  status course_status DEFAULT 'draft',
  instructor_id UUID REFERENCES public.interns(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course modules table
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type content_type NOT NULL,
  content_url TEXT,
  content_data JSONB,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course enrollments
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id UUID REFERENCES public.interns(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status enrollment_status DEFAULT 'enrolled',
  progress_percentage INTEGER DEFAULT 0,
  UNIQUE(intern_id, course_id)
);

-- Lesson progress tracking
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id UUID REFERENCES public.interns(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  notes TEXT,
  UNIQUE(intern_id, lesson_id)
);

-- Quizzes
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  time_limit_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type quiz_question_type NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL
);

-- Quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id UUID REFERENCES public.interns(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attempt_number INTEGER NOT NULL
);

-- Certificates
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id UUID REFERENCES public.interns(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_url TEXT,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(intern_id, course_id)
);

-- Discussion forums
CREATE TABLE public.discussion_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.interns(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussion replies
CREATE TABLE public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.discussion_topics(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.interns(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gamification: Badges
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url TEXT,
  criteria JSONB NOT NULL,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges earned
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id UUID REFERENCES public.interns(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(intern_id, badge_id)
);

-- User points/scores
CREATE TABLE public.user_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id UUID REFERENCES public.interns(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  quizzes_passed INTEGER DEFAULT 0,
  badges_earned INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(intern_id)
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (will be restricted after auth implementation)
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Anyone can view course_modules" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can view enrollments" ON public.course_enrollments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert enrollments" ON public.course_enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update enrollments" ON public.course_enrollments FOR UPDATE USING (true);
CREATE POLICY "Anyone can view progress" ON public.lesson_progress FOR SELECT USING (true);
CREATE POLICY "Anyone can insert progress" ON public.lesson_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update progress" ON public.lesson_progress FOR UPDATE USING (true);
CREATE POLICY "Anyone can view quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Anyone can view quiz_questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert quiz_attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view quiz_attempts" ON public.quiz_attempts FOR SELECT USING (true);
CREATE POLICY "Anyone can view certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Anyone can insert certificates" ON public.certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Anyone can view user_badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Anyone can insert user_badges" ON public.user_badges FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view user_scores" ON public.user_scores FOR SELECT USING (true);
CREATE POLICY "Anyone can insert user_scores" ON public.user_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update user_scores" ON public.user_scores FOR UPDATE USING (true);

-- Insert sample data
INSERT INTO public.courses (title, description, duration_hours, difficulty_level, status) VALUES
('Metro Systems and Operations', 'Comprehensive course covering all aspects of metro operations and systems', 40, 'intermediate', 'published'),
('Safety Protocols and Emergency Management', 'Learn essential safety procedures and emergency response protocols', 25, 'beginner', 'published'),
('Customer Service Excellence', 'Master customer service skills for metro operations', 20, 'beginner', 'published'),
('Technical Maintenance and Engineering', 'Advanced technical training for metro systems maintenance', 60, 'advanced', 'published');

-- Insert sample modules for the first course
INSERT INTO public.course_modules (course_id, title, description, order_index) 
SELECT id, 'Introduction to DMRC', 'Overview of Delhi Metro Rail Corporation and its operations', 1
FROM public.courses WHERE title = 'Metro Systems and Operations';

INSERT INTO public.course_modules (course_id, title, description, order_index) 
SELECT id, 'Metro Rail Signaling Systems', 'Understanding signaling systems and their importance', 2
FROM public.courses WHERE title = 'Metro Systems and Operations';

INSERT INTO public.course_modules (course_id, title, description, order_index) 
SELECT id, 'Operations & Safety Protocols', 'Day-to-day operations and safety procedures', 3
FROM public.courses WHERE title = 'Metro Systems and Operations';

INSERT INTO public.course_modules (course_id, title, description, order_index) 
SELECT id, 'Customer Service and Management', 'Managing customer interactions and service quality', 4
FROM public.courses WHERE title = 'Metro Systems and Operations';

-- Insert sample badges
INSERT INTO public.badges (name, description, icon_url, criteria, points) VALUES
('First Course Complete', 'Complete your first course', '🎓', '{"courses_completed": 1}', 100),
('Quiz Master', 'Score 90% or above in 5 quizzes', '🏆', '{"quiz_high_scores": 5}', 200),
('Discussion Leader', 'Start 5 discussion topics', '💬', '{"topics_created": 5}', 150),
('Learning Streak', 'Complete lessons for 7 consecutive days', '🔥', '{"consecutive_days": 7}', 250);

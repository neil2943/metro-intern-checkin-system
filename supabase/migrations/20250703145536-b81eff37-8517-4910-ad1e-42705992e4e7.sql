
-- Create enum for attendance status
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');

-- Create interns table
CREATE TABLE public.interns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  department VARCHAR(50) NOT NULL,
  phone VARCHAR(15),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id UUID REFERENCES public.interns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  status attendance_status NOT NULL DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(intern_id, date)
);

-- Create admins table for supervisors
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'supervisor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interns (public read for now, will be restricted after auth)
CREATE POLICY "Anyone can view interns" ON public.interns FOR SELECT USING (true);
CREATE POLICY "Anyone can insert interns" ON public.interns FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update interns" ON public.interns FOR UPDATE USING (true);

-- RLS Policies for attendance
CREATE POLICY "Anyone can view attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Anyone can insert attendance" ON public.attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update attendance" ON public.attendance FOR UPDATE USING (true);

-- RLS Policies for admins
CREATE POLICY "Anyone can view admins" ON public.admins FOR SELECT USING (true);
CREATE POLICY "Anyone can insert admins" ON public.admins FOR INSERT WITH CHECK (true);

-- Insert sample data
INSERT INTO public.interns (intern_id, name, email, department, phone, start_date) VALUES
('DMRC001', 'Rahul Sharma', 'rahul.sharma@example.com', 'Engineering', '9876543210', '2024-01-15'),
('DMRC002', 'Priya Singh', 'priya.singh@example.com', 'Operations', '9876543211', '2024-01-15'),
('DMRC003', 'Amit Kumar', 'amit.kumar@example.com', 'IT', '9876543212', '2024-01-20'),
('DMRC004', 'Sneha Gupta', 'sneha.gupta@example.com', 'HR', '9876543213', '2024-01-20');

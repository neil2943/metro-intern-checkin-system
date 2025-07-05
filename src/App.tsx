
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InternManagement from "./pages/InternManagement";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import LearningDashboard from "./pages/LearningDashboard";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import LessonViewer from "./pages/LessonViewer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/manage-interns" element={<InternManagement />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/learning-dashboard" element={<LearningDashboard />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/lesson/:lessonId" element={<LessonViewer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

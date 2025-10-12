import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import UserManagement from "./pages/UserManagement";
import ContentModeration from "./pages/ContentModeration";
import ReportGeneration from "./pages/ReportGeneration";
import FeedbackAnalysis from "./pages/FeedbackAnalysis";
import ProductManagement from "./pages/ProductManagement";
import DailyActivity from "./pages/DailyActivity";
import GoalTracking from "./pages/GoalTracking";
import WorkoutRoutine from "./pages/WorkoutRoutine";
import TrainerAssignment from "./pages/TrainerAssignment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
                <SidebarTrigger />
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Health & Fitness Platform
                </h1>
              </header>
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/user-management" element={<UserManagement />} />
                  <Route path="/content-moderation" element={<ContentModeration />} />
                  <Route path="/report-generation" element={<ReportGeneration />} />
                  <Route path="/feedback-analysis" element={<FeedbackAnalysis />} />
                  <Route path="/product-management" element={<ProductManagement />} />
                  <Route path="/daily-activity" element={<DailyActivity />} />
                  <Route path="/goal-tracking" element={<GoalTracking />} />
                  <Route path="/workout-routine" element={<WorkoutRoutine />} />
                  <Route path="/trainer-assignment" element={<TrainerAssignment />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

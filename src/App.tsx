
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { MainApp } from "@/components/MainApp";
import { AuthPage } from "@/components/AuthPage";
import { AccessPending } from "@/components/AccessPending";

const queryClient = new QueryClient();

// Enable demo mode for local development without authentication
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || window.location.hostname === 'localhost';

const AppContent = () => {
  const { user, profile, loading, signOut, isApproved } = useAuth();

  // In demo mode, skip authentication and go directly to main app
  if (DEMO_MODE) {
    return <MainApp />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (!isApproved) {
    return <AccessPending onSignOut={signOut} userEmail={user.email || ''} />;
  }

  return <MainApp />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

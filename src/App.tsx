
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { TaxCalculator } from "@/components/TaxCalculator";
import { AuthPage } from "@/components/AuthPage";
import { AccessPending } from "@/components/AccessPending";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, profile, loading, signOut, isApproved } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (!isApproved) {
    return <AccessPending onSignOut={signOut} userEmail={user.email || ''} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaxCalculator />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
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

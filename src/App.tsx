import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { RequireAuth } from "./hooks/useAuth";

// Lazy load pages for code splitting
const Today = lazy(() => import("./pages/Today"));
const Timetable = lazy(() => import("./pages/Timetable"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Subjects = lazy(() => import("./pages/Subjects"));
const Settings = lazy(() => import("./pages/Settings"));
const Diagnostics = lazy(() => import("./pages/Diagnostics"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component for lazy routes
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Layout />}>
              <Route index element={
                <RequireAuth>
                  <Suspense fallback={<PageLoader />}>
                    <Today />
                  </Suspense>
                </RequireAuth>
              } />
              <Route path="timetable" element={
                <RequireAuth>
                  <Suspense fallback={<PageLoader />}>
                    <Timetable />
                  </Suspense>
                </RequireAuth>
              } />
              <Route path="calendar" element={
                <RequireAuth>
                  <Suspense fallback={<PageLoader />}>
                    <Calendar />
                  </Suspense>
                </RequireAuth>
              } />
              <Route path="subjects" element={
                <RequireAuth>
                  <Suspense fallback={<PageLoader />}>
                    <Subjects />
                  </Suspense>
                </RequireAuth>
              } />
              <Route path="settings" element={
                <RequireAuth>
                  <Suspense fallback={<PageLoader />}>
                    <Settings />
                  </Suspense>
                </RequireAuth>
              } />
              <Route path="diagnostics" element={
                <RequireAuth>
                  <Suspense fallback={<PageLoader />}>
                    <Diagnostics />
                  </Suspense>
                </RequireAuth>
              } />
            </Route>
            <Route path="*" element={
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './stores/authStore';
import { useTheme } from './hooks/useTheme'; // Import useTheme to ensure it runs
import Home from './pages/Home';
import Login from './pages/Login';
import Course from './pages/Course';

function App() {
  const { setUser, setLoading, loading } = useAuthStore();
  useTheme(); // Initialize theme

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-zinc-100">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/course/*" element={<Course />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

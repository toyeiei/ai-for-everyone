import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LessonContent from '../components/LessonContent';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { LogOut, Sun, Moon, Languages, Home } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useLanguageStore } from '../stores/languageStore';

const Course = () => {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguageStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 overflow-hidden">
      {/* Sidebar - 30% width on large screens, collapsible/stack on mobile */}
      <div className="w-full lg:w-[30%] h-[40vh] lg:h-full flex-shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800">
        <Sidebar />
      </div>

      {/* Main Content - 70% width on large screens */}
      <div className="flex-1 flex flex-col h-full relative min-h-0">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur z-10">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                aria-label="Back to Home"
              >
                <Home className="w-4 h-4" />
              </Link>
              <h2 className="font-bold text-lg">
                {language === 'en' ? 'AI for Everyone' : 'AI สำหรับทุกคน'}
              </h2>
            </div>
            <div className="flex items-center gap-4 ml-auto">
                <button
                    onClick={toggleLanguage}
                    className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center gap-1 px-3"
                    aria-label="Toggle language"
                >
                    <Languages className="w-4 h-4" />
                    <span className="text-sm font-medium">{language.toUpperCase()}</span>
                </button>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
                {user && (
                  <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
                  >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                  </button>
                )}
            </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-white dark:bg-zinc-900 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            <Routes>
                <Route path=":lessonId" element={<LessonContent />} />
                <Route path="/" element={
                    <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-500">
                        {language === 'en' ? 'Select a lesson from the sidebar to begin' : 'เลือกบทเรียนจากแถบด้านข้างเพื่อเริ่มเรียน'}
                    </div>
                } />
            </Routes>
        </main>
      </div>
    </div>
  );
};

export default Course;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BookOpen, Cpu, Lightbulb, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const Home = () => {
  const [lessonCount, setLessonCount] = useState(0);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      const { count } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true });
      setLessonCount(count || 0);
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      {/* Header with Theme Switcher */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-end">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
          AI for Everyone
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
          A minimalist, beginner-friendly guide to understanding Artificial Intelligence. 
          Demystifying the technology that is shaping our future.
        </p>
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 rounded-full text-lg font-semibold text-white hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/25"
        >
          Start Learning Now
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Stats/Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 backdrop-blur">
            <BookOpen className="w-10 h-10 text-blue-500 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Concise Lessons</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {lessonCount > 0 ? `${lessonCount}` : '10'} bite-sized lessons designed to be read in just a few minutes each.
            </p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 backdrop-blur">
            <Cpu className="w-10 h-10 text-indigo-500 dark:text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Modern AI Tech</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Learn about Neural Networks, LLMs, and Generative AI in simple, plain English.
            </p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 backdrop-blur">
            <Lightbulb className="w-10 h-10 text-yellow-500 dark:text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Practical Insights</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Understand how AI affects your daily life and what it means for the future of work.
            </p>
          </div>
        </div>
      </div>

      {/* Course Content Preview */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Curriculum Overview</h2>
        <div className="space-y-4">
            {[
                "What is AI? - Concepts and Definition",
                "Machine Learning - How AI learns from data",
                "Neural Networks - The architecture of modern AI",
                "Generative AI - Creating new content",
                "Large Language Models - How tools like ChatGPT work",
                "AI Ethics - Bias, privacy, and safety",
                "AI in Everyday Life - From recommendations to assistants",
                "Future of Work - Augmentation and new roles",
                "AI and Creativity - Art, music, and design",
                "Getting Started - Tools and next steps"
            ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="flex-shrink-0 w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 font-mono text-sm">
                        {index + 1}
                    </div>
                    <span className="text-lg text-zinc-700 dark:text-zinc-300">{item}</span>
                </div>
            ))}
        </div>
      </div>

       <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-zinc-500">
        <p>© 2024 AI for Everyone. Built with React & Supabase.</p>
      </footer>
    </div>
  );
};

export default Home;

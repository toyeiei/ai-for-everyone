import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BookOpen, CheckCircle, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Lesson {
  id: string;
  title: string;
  order: number;
}

const Sidebar = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, completedLessons, setCompletedLessons } = useAuthStore();
  const { language } = useLanguageStore();

  // Simple translation map for lesson titles (In a real app, this would be in the DB)
  const translations: Record<string, { en: string; th: string }> = {
    'What is AI?': { en: 'What is AI?', th: 'AI คืออะไร?' },
    'Machine Learning vs. AI': { en: 'Machine Learning vs. AI', th: 'Machine Learning กับ AI' },
    'Neural Networks': { en: 'Neural Networks', th: 'โครงข่ายประสาทเทียม' },
    'Generative AI': { en: 'Generative AI', th: 'Generative AI' },
    'LLMs (Large Language Models)': { en: 'LLMs (Large Language Models)', th: 'LLMs (โมเดลภาษาขนาดใหญ่)' },
    'AI Ethics': { en: 'AI Ethics', th: 'จริยธรรม AI' },
    'AI in Everyday Life': { en: 'AI in Everyday Life', th: 'AI ในชีวิตประจำวัน' },
    'The Future of Work': { en: 'The Future of Work', th: 'อนาคตของการทำงาน' },
    'AI and Creativity': { en: 'AI and Creativity', th: 'AI และความคิดสร้างสรรค์' },
    'Getting Started with AI': { en: 'Getting Started with AI', th: 'เริ่มต้นใช้งาน AI' },
    'Final Exam': { en: 'Final Exam', th: 'แบบทดสอบความรู้' },
    'Certificate': { en: 'Download Your Certificate', th: 'ดาวน์โหลดใบประกาศนียบัตร' },
  };

  const getTranslatedTitle = (title: string) => {
    // Exact match
    if (translations[title]) {
        return translations[title][language];
    }
    // Partial match or fallback (to handle potential trailing spaces or case differences)
    const key = Object.keys(translations).find(k => k.trim() === title.trim());
    return key ? translations[key][language] : title;
  };

  const isExamPassed = () => {
      // In a real app, we would check the score from the backend
      // For now, we'll check if the exam lesson is marked as completed
      // And we'll rely on the Quiz component to only mark it complete if passed
      const examLesson = lessons.find(l => l.title === 'Final Exam');
      return examLesson ? completedLessons.has(examLesson.id) : false;
  };

  const fetchLessons = async () => {
    const { data: lessonsData, error } = await supabase
      .from('lessons')
      .select('id, title, order')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching lessons:', error);
      setLoading(false);
      return;
    }

    setLessons(lessonsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        // If no user, we might want to load from local storage or just keep it empty
        // For now, let's keep it empty or rely on the store state if it persists
        return; 
      }
      
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('completed', true);
        
      if (progressData) {
        setCompletedLessons(progressData.map(p => p.lesson_id));
      }
    };

    fetchProgress();
    
    // Subscribe to progress changes if user is logged in
    let subscription: RealtimeChannel | null = null;
    
    if (user) {
        subscription = supabase
        .channel('public:user_progress')
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'user_progress',
            filter: `user_id=eq.${user.id}`
        }, () => {
            fetchProgress();
        })
        .subscribe();
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [user, setCompletedLessons]);

  if (loading) {
    return (
      <div className="w-full h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-4 text-zinc-400">
        {language === 'en' ? 'Loading lessons...' : 'กำลังโหลดบทเรียน...'}
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          {language === 'en' ? 'Curriculum' : 'หลักสูตร'}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {lessons.map((lesson) => {
          const isCompleted = completedLessons.has(lesson.id);
          const isCertificate = lesson.title === 'Certificate';
          const isLocked = isCertificate && !isExamPassed();

          if (isLocked) {
              return (
                <div
                    key={lesson.id}
                    className="block p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-600 cursor-not-allowed border-l-4 border-l-transparent"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono w-5">
                            {String(lesson.order).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-medium flex-1 truncate">
                            {getTranslatedTitle(lesson.title)}
                        </span>
                        <Lock className="w-4 h-4 flex-shrink-0" />
                    </div>
                </div>
              )
          }

          return (
            <NavLink
                key={lesson.id}
                to={`/course/${lesson.id}`}
                className={({ isActive }) =>
                clsx(
                    'block p-4 border-b border-zinc-100 dark:border-zinc-800 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800',
                    isActive ? 'bg-zinc-50 dark:bg-zinc-800 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
                )
                }
            >
                <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 w-5">
                    {String(lesson.order).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex-1 truncate">
                    {getTranslatedTitle(lesson.title)}
                </span>
                {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                )}
                </div>
            </NavLink>
          );
        })}
      </div>
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-500 text-center">
        {language === 'en' ? 'AI for Everyone' : 'AI สำหรับทุกคน'}
      </div>
    </div>
  );
};

export default Sidebar;

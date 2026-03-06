import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BookOpen, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface Lesson {
  id: string;
  title: string;
  order: number;
  completed?: boolean;
}

const Sidebar = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

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

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && lessonsData) {
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id);
        
      const merged = lessonsData.map(l => ({
        ...l,
        completed: progressData?.some(p => p.lesson_id === l.id && p.completed)
      }));
      setLessons(merged);
    } else {
      setLessons(lessonsData || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLessons();
    
    // Subscribe to progress changes
    const subscription = supabase
      .channel('public:user_progress')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_progress' }, () => {
        fetchLessons();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-4 text-zinc-400">
        Loading lessons...
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          Curriculum
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {lessons.map((lesson) => (
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
                {lesson.title}
              </span>
              {lesson.completed && (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
            </div>
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-500 text-center">
        AI for Everyone
      </div>
    </div>
  );
};

export default Sidebar;

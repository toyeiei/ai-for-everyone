import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../lib/supabase';
import { Loader2, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url: string | null;
}

interface LessonNav {
  id: string;
  title: string;
}

const LessonContent = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [prevLesson, setPrevLesson] = useState<LessonNav | null>(null);
  const [nextLesson, setNextLesson] = useState<LessonNav | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) {
        console.error('Error fetching lesson:', error);
      } else {
        setLesson(data);
      }
      setLoading(false);
    };

    const fetchNavigation = async () => {
        const { data: allLessons } = await supabase
            .from('lessons')
            .select('id, title, order')
            .order('order', { ascending: true });
    
        if (allLessons) {
            const currentIndex = allLessons.findIndex(l => l.id === lessonId);
            if (currentIndex !== -1) {
                setPrevLesson(allLessons[currentIndex - 1] || null);
                setNextLesson(allLessons[currentIndex + 1] || null);
            }
        }
    }

    const checkProgress = async () => {
       const { data: { user } } = await supabase.auth.getUser();
       if (!user) return;

       const { data } = await supabase
         .from('user_progress')
         .select('completed')
         .eq('user_id', user.id)
         .eq('lesson_id', lessonId)
         .single();
       
       setCompleted(data?.completed || false);
    }

    fetchLesson();
    fetchNavigation();
    checkProgress();
  }, [lessonId]);

  const handleComplete = async () => {
    if (!lessonId) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
        .from('user_progress')
        .upsert({ 
            user_id: user.id, 
            lesson_id: lessonId, 
            completed: !completed,
            completed_at: !completed ? new Date().toISOString() : null
        }, { onConflict: 'user_id,lesson_id' });

    if (!error) {
        setCompleted(!completed);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      let videoId = urlObj.searchParams.get('v');
      if (!videoId && urlObj.hostname === 'youtu.be') {
          videoId = urlObj.pathname.slice(1);
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (e) {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        Select a lesson to start learning
      </div>
    );
  }

  const embedUrl = lesson.video_url ? getYoutubeEmbedUrl(lesson.video_url) : null;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-zinc-900 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">{lesson.title}</h1>
      
      {embedUrl && (
        <div className="aspect-video w-full bg-zinc-100 dark:bg-zinc-950 rounded-lg overflow-hidden mb-8 shadow-lg">
          <iframe
            src={embedUrl}
            title={lesson.title}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      <div className="prose-custom max-w-none mb-12 text-zinc-700 dark:text-zinc-300">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-zinc-900 dark:text-zinc-100" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-zinc-900 dark:text-zinc-100" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2 text-zinc-900 dark:text-zinc-100" {...props} />,
            p: ({node, ...props}) => <p className="my-4 leading-relaxed" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc ml-6 my-4 space-y-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal ml-6 my-4 space-y-2" {...props} />,
            li: ({node, ...props}) => <li {...props} />,
            code: ({node, ...props}) => <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
            pre: ({node, ...props}) => <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-zinc-200 dark:border-zinc-700 pl-4 italic my-4" {...props} />,
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-8 gap-4 mt-12">
        <div className="flex-1">
            {prevLesson && (
                <Link 
                    to={`/course/${prevLesson.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous: {prevLesson.title}</span>
                    <span className="sm:hidden">Previous</span>
                </Link>
            )}
        </div>

          <button 
            onClick={handleComplete}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                completed 
                ? 'bg-green-600/10 text-green-600 dark:text-green-400 border border-green-600/30 dark:border-green-600/50 hover:bg-green-600/20' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {completed ? 'Completed' : 'Mark as Complete'}
          </button>

        <div className="flex-1 flex justify-end">
            {nextLesson && (
                <Link 
                    to={`/course/${nextLesson.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 text-right"
                >
                    <span className="hidden sm:inline">Next: {nextLesson.title}</span>
                    <span className="sm:hidden">Next</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            )}
        </div>
      </div>
    </div>
  );
};

export default LessonContent;

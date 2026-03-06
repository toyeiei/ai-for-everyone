import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BookOpen, Cpu, Lightbulb, ArrowRight, Sun, Moon, Languages } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguageStore } from '../stores/languageStore';

const Home = () => {
  const [lessonCount, setLessonCount] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguageStore();

  const translations = {
    en: {
        title: 'AI for Everyone',
        subtitle: 'A minimalist, beginner-friendly guide to understanding Artificial Intelligence. Demystifying the technology that is shaping our future.',
        startLearning: 'Start Learning Now',
        conciseLessons: 'Concise Lessons',
        conciseDesc: (count: number) => `${count > 0 ? count : '10'} bite-sized lessons designed to be read in just a few minutes each.`,
        modernAi: 'Modern AI Tech',
        modernDesc: 'Learn about Neural Networks, LLMs, and Generative AI in simple, plain English.',
        practical: 'Practical Insights',
        practicalDesc: 'Understand how AI affects your daily life and what it means for the future of work.',
        curriculum: 'Curriculum Overview',
        footer: '© 2026 AI for Everyone. Made with heart by DataRockie and Trae 🍟',
        lessons: [
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
        ]
    },
    th: {
        title: 'AI สำหรับทุกคน',
        subtitle: 'คู่มือฉบับย่อและเข้าใจง่ายสำหรับผู้เริ่มต้นเรียนรู้ปัญญาประดิษฐ์ (AI) มาทำความเข้าใจเทคโนโลยีที่กำลังกำหนดอนาคตของเรา',
        startLearning: 'เริ่มเรียนรู้ทันที',
        conciseLessons: 'บทเรียนกระชับ',
        conciseDesc: (count: number) => `${count > 0 ? count : '10'} บทเรียนย่อยที่ออกแบบมาให้อ่านจบได้ในไม่กี่นาที`,
        modernAi: 'เทคโนโลยี AI ยุคใหม่',
        modernDesc: 'เรียนรู้เกี่ยวกับ Neural Networks, LLMs และ Generative AI ในภาษาที่เข้าใจง่าย',
        practical: 'ข้อมูลเชิงปฏิบัติ',
        practicalDesc: 'เข้าใจว่า AI ส่งผลต่อชีวิตประจำวันของคุณอย่างไร และมีความหมายอย่างไรต่ออนาคตของการทำงาน',
        curriculum: 'ภาพรวมหลักสูตร',
        footer: '© 2026 AI for Everyone. Made with heart by DataRockie and Trae 🍟',
        lessons: [
            "AI คืออะไร? - แนวคิดและนิยาม",
            "Machine Learning - AI เรียนรู้จากข้อมูลได้อย่างไร",
            "Neural Networks - สถาปัตยกรรมของ AI ยุคใหม่",
            "Generative AI - การสร้างสรรค์เนื้อหาใหม่",
            "Large Language Models - เครื่องมืออย่าง ChatGPT ทำงานอย่างไร",
            "จริยธรรม AI - อคติ, ความเป็นส่วนตัว และความปลอดภัย",
            "AI ในชีวิตประจำวัน - จากระบบแนะนำไปจนถึงผู้ช่วยเสมือน",
            "อนาคตของการทำงาน - การเสริมศักยภาพและบทบาทใหม่ๆ",
            "AI และความคิดสร้างสรรค์ - ศิลปะ, ดนตรี และการออกแบบ",
            "เริ่มต้นใช้งาน - เครื่องมือและขั้นตอนถัดไป"
        ]
    }
  };

  const t = translations[language];

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
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-end gap-2">
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
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
          {t.subtitle}
        </p>
        <Link 
          to="/course" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 rounded-full text-lg font-semibold text-white hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/25"
        >
          {t.startLearning}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Stats/Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 backdrop-blur">
            <BookOpen className="w-10 h-10 text-blue-500 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">{t.conciseLessons}</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t.conciseDesc(lessonCount)}
            </p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 backdrop-blur">
            <Cpu className="w-10 h-10 text-indigo-500 dark:text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">{t.modernAi}</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t.modernDesc}
            </p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 backdrop-blur">
            <Lightbulb className="w-10 h-10 text-yellow-500 dark:text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">{t.practical}</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t.practicalDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Course Content Preview */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t.curriculum}</h2>
        <div className="space-y-4">
            {t.lessons.map((item, index) => (
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
        <p>{t.footer}</p>
      </footer>
    </div>
  );
};

export default Home;

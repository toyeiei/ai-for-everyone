import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../lib/supabase';
import { Loader2, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import Quiz from './Quiz';

import Certificate from './Certificate';

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

// In a real app, content would likely be stored in separate columns or tables
// For this MVP, we'll use a mapping for the static content parts
const contentTranslations: Record<string, string> = {
  // Titles
  'What is AI?': 'AI คืออะไร?',
  'Machine Learning vs. AI': 'Machine Learning กับ AI',
  'Neural Networks': 'โครงข่ายประสาทเทียม',
  'Generative AI': 'Generative AI',
  'LLMs (Large Language Models)': 'LLMs (โมเดลภาษาขนาดใหญ่)',
  'AI Ethics': 'จริยธรรม AI',
  'AI in Everyday Life': 'AI ในชีวิตประจำวัน',
  'The Future of Work': 'อนาคตของการทำงาน',
  'AI and Creativity': 'AI และความคิดสร้างสรรค์',
  'Getting Started with AI': 'เริ่มต้นใช้งาน AI',
  'Final Exam': 'แบบทดสอบความรู้'
};

const bodyTranslations: Record<string, string> = {
  'What is AI?': `# AI คืออะไร?

ปัญญาประดิษฐ์ (AI) คือการจำลองกระบวนการคิดของมนุษย์โดยเครื่องจักร โดยเฉพาะระบบคอมพิวเตอร์ กระบวนการเหล่านี้รวมถึงการเรียนรู้ การใช้เหตุผล และการแก้ไขตนเอง

### แนวคิดหลัก
- **การเรียนรู้**: การได้รับข้อมูลและกฎเกณฑ์สำหรับการใช้ข้อมูลนั้น
- **การใช้เหตุผล**: การใช้กฎเกณฑ์เพื่อหาข้อสรุปที่ใกล้เคียงหรือแน่นอน
- **การแก้ไขตนเอง**: การปรับปรุงอัลกอริทึมตามผลการดำเนินงาน

AI ไม่ใช่เทคโนโลยีเดียว แต่เป็นสาขาวิชาที่ครอบคลุมวิธีการต่างๆ มากมายในการสร้างเครื่องจักรที่ชาญฉลาด`,

  'Machine Learning vs. AI': `# Machine Learning กับ AI

แม้ว่าจะมักใช้แทนกัน แต่ Machine Learning (ML) จริงๆ แล้วเป็นเพียงส่วนย่อยของ AI

### ความแตกต่าง
- **AI** เป็นแนวคิดกว้างๆ ของเครื่องจักรที่สามารถทำงานในลักษณะที่เราถือว่า "ฉลาด"
- **ML** เป็นการประยุกต์ใช้ AI เฉพาะทางที่ให้ระบบมีความสามารถในการเรียนรู้และปรับปรุงจากประสบการณ์โดยอัตโนมัติ โดยไม่ต้องถูกโปรแกรมไว้อย่างชัดเจน

ใน ML เราป้อนข้อมูลให้กับอัลกอริทึมและปล่อยให้มันหาแบบแผน แทนที่จะเขียนกฎเกณฑ์เฉพาะสำหรับทุกสถานการณ์`,

  'Neural Networks': `# โครงข่ายประสาทเทียม

โครงข่ายประสาทเทียมเป็นโมเดล Machine Learning ประเภทหนึ่งที่ได้รับแรงบันดาลใจจากโครงสร้างและการทำงานของสมองมนุษย์

### การทำงาน
ประกอบด้วยชั้นของ "เซลล์ประสาท" ที่เชื่อมต่อกันเพื่อประมวลผลข้อมูล
1. **ชั้นนำเข้า (Input Layer)**: รับข้อมูล (เช่น พิกเซลของรูปภาพ)
2. **ชั้นซ่อน (Hidden Layers)**: ทำการคำนวณทางคณิตศาสตร์เพื่อหาคุณลักษณะ
3. **ชั้นส่งออก (Output Layer)**: ให้ผลการทำนายสุดท้าย (เช่น "นี่คือแมว")

Deep Learning ก็คือโครงข่ายประสาทเทียมที่มีชั้นซ่อนจำนวนมากนั่นเอง`,

  'Generative AI': `# Generative AI

Generative AI หมายถึงอัลกอริทึมที่สามารถใช้สร้างเนื้อหาใหม่ รวมถึงเสียง โค้ด รูปภาพ ข้อความ การจำลอง และวิดีโอ

### ตัวอย่างยอดนิยม
- **ข้อความ**: ChatGPT, Claude, Gemini
- **รูปภาพ**: Midjourney, DALL-E, Stable Diffusion
- **เสียง**: Suno, Udio

ต่างจาก AI แบบดั้งเดิมที่วิเคราะห์ข้อมูลที่มีอยู่ Generative AI ใช้การฝึกฝนเพื่อ "จินตนาการ" และผลิตสิ่งใหม่ทั้งหมดตามคำสั่ง (Prompt)`,

  'LLMs (Large Language Models)': `# Large Language Models (LLMs)

LLMs เป็น AI ประเภทหนึ่งที่ได้รับการฝึกฝนด้วยข้อมูลข้อความจำนวนมหาศาล เป็นเทคโนโลยีเบื้องหลังเครื่องมืออย่าง ChatGPT

### การทำงานของ LLMs
ที่แก่นแท้ LLMs เป็นโมเดลทางสถิติที่ทำนายคำถัดไปในลำดับ โดยการประมวลผลประโยคหลายพันล้านประโยค พวกมันเรียนรู้ความซับซ้อนของไวยากรณ์ ข้อเท็จจริง และแม้แต่สไตล์การเขียน

**คุณสมบัติหลัก**: พวกมันไม่ได้ "เข้าใจ" ในความหมายของมนุษย์ แต่คำนวณความน่าจะเป็นของสิ่งที่ควรจะเกิดขึ้นถัดไปตามการฝึกฝน`,

  'AI Ethics': `# จริยธรรม AI

เมื่อ AI มีพลังมากขึ้น เราต้องพิจารณาผลกระทบทางศีลธรรมจากการใช้งาน

### ข้อกังวลหลัก
- **อคติ**: หากข้อมูลที่ใช้ฝึกฝนมีอคติ AI ก็จะมีอคติด้วย
- **ความเป็นส่วนตัว**: ข้อมูลของเราถูกนำไปใช้ฝึกโมเดลเหล่านี้อย่างไร?
- **ความโปร่งใส**: เราสามารถอธิบายได้ไหมว่าทำไม AI ถึงตัดสินใจแบบนั้น?
- **ความปลอดภัย**: การรับรองว่าระบบ AI จะไม่ก่อให้เกิดอันตรายโดยไม่ตั้งใจ

จริยธรรมใน AI คือการสร้างระบบที่ยุติธรรม รับผิดชอบได้ และเป็นประโยชน์ต่อทุกคน`,

  'AI in Everyday Life': `# AI ในชีวิตประจำวัน

คุณน่าจะกำลังใช้ AI อยู่ทุกวันโดยไม่รู้ตัว!

### ตัวอย่างทั่วไป
- **คำแนะนำ**: รายการแนะนำใน Netflix หรือเพลย์ลิสต์ใน Spotify
- **ผู้ช่วยเสมือน**: Siri, Alexa และ Google Assistant
- **การนำทาง**: Google Maps คำนวณเส้นทางที่เร็วที่สุด
- **ตัวกรองสแปม**: อีเมลของคุณซ่อนจดหมายขยะโดยอัตโนมัติ

AI ถูกรวมเข้ากับเครื่องมือดิจิทัลของเราอย่างแนบเนียนเพื่อทำให้พวกมันมีความเป็นส่วนตัวและมีประสิทธิภาพมากขึ้น`,

  'The Future of Work': `# อนาคตของการทำงาน

AI กำลังจะเปลี่ยนแปลงตลาดแรงงาน แต่จะเป็นเรื่องของ "การเสริมศักยภาพ" มากกว่า "การแทนที่"

### แนวโน้มสำคัญ
- **ระบบอัตโนมัติ**: งานประจำซ้ำซากจะถูกจัดการโดย AI
- **บทบาทใหม่**: งานอย่าง "Prompt Engineer" หรือ "AI Auditor" กำลังเกิดขึ้น
- **การเปลี่ยนแปลงทักษะ**: ความฉลาดทางอารมณ์และการคิดเชิงวิพากษ์จะมีค่ามากขึ้นเมื่อ AI จัดการงานเทคนิค

พนักงานที่ประสบความสำเร็จที่สุดคือผู้ที่เรียนรู้ที่จะทำงานร่วมกับเครื่องมือ AI`,

  'AI and Creativity': `# AI และความคิดสร้างสรรค์

เครื่องจักรมีความคิดสร้างสรรค์ได้ไหม? นี่เป็นหนึ่งในหัวข้อที่มีการถกเถียงกันมากที่สุดในวงการ AI ปัจจุบัน

### AI ในฐานะเครื่องมือ
ปัจจุบัน AI ทำหน้าที่เป็น "นักบินร่วม" สำหรับผู้สร้างสรรค์:
- **ศิลปิน** ใช้ AI เพื่อสำรวจสไตล์ใหม่ๆ
- **นักดนตรี** ใช้ AI เพื่อสร้างท่วงทำนองหรือมาสเตอร์เพลง
- **นักเขียน** ใช้ AI เพื่อระดมความคิดหรือเอาชนะอาการเขียนไม่ออก

แม้ว่า AI จะสามารถสร้างเนื้อหาได้ แต่ "ประกายของมนุษย์" ในเรื่องเจตนาและอารมณ์ยังคงเป็นหัวใจสำคัญของกระบวนการสร้างสรรค์`,

  'Getting Started with AI': `# เริ่มต้นใช้งาน AI

พร้อมที่จะเรียนรู้ให้ลึกซึ้งยิ่งขึ้นหรือยัง? วิธีที่ดีที่สุดในการเรียนรู้คือการลงมือทำ

### ขั้นตอนแนะนำ
1. **ทดลอง**: ใช้เครื่องมือฟรีอย่าง ChatGPT หรือ Claude เพื่อดูว่าพวกมันทำอะไรได้บ้าง
2. **เรียนรู้**: เข้าเรียนคอร์สสั้นๆ บนแพลตฟอร์มอย่าง Coursera หรือ YouTube
3. **ติดตามข่าวสาร**: AI เคลื่อนไหวเร็วมาก ติดตามจดหมายข่าวหรือบล็อกเทคโนโลยี
4. **สร้าง**: ลองสร้างโปรเจกต์เล็กๆ โดยใช้ AI API

ยินดีต้อนรับสู่โลกของ AI!`
};

const uiTranslations = {
  en: {
    loading: 'Loading...',
    selectLesson: 'Select a lesson to start learning',
    previous: 'Previous',
    next: 'Next',
    completed: 'Completed',
    markComplete: 'Mark as Complete'
  },
  th: {
    loading: 'กำลังโหลด...',
    selectLesson: 'เลือกบทเรียนเพื่อเริ่มเรียน',
    previous: 'ก่อนหน้า',
    next: 'ถัดไป',
    completed: 'เรียนจบแล้ว',
    markComplete: 'ทำเครื่องหมายว่าเรียนจบ'
  }
};

const LessonContent = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [prevLesson, setPrevLesson] = useState<LessonNav | null>(null);
  const [nextLesson, setNextLesson] = useState<LessonNav | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, completedLessons, addCompletedLesson, removeCompletedLesson } = useAuthStore();
  const { language } = useLanguageStore();
  const completed = lessonId ? completedLessons.has(lessonId) : false;
  const t = uiTranslations[language];

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

    fetchLesson();
    fetchNavigation();
  }, [lessonId]);

  const handleComplete = async () => {
    if (!lessonId) return;
    
    // Optimistic update
    if (completed) {
      removeCompletedLesson(lessonId);
    } else {
      addCompletedLesson(lessonId);
    }

    // If user is logged in, sync with server
    if (user) {
        const { error } = await supabase
            .from('user_progress')
            .upsert({ 
                user_id: user.id, 
                lesson_id: lessonId, 
                completed: !completed,
                completed_at: !completed ? new Date().toISOString() : null
            }, { onConflict: 'user_id,lesson_id' });

        if (error) {
            // Revert on error
            if (completed) {
              addCompletedLesson(lessonId);
            } else {
              removeCompletedLesson(lessonId);
            }
            console.error('Error updating progress:', error);
        }
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

  const getTranslatedTitle = (title: string) => {
    if (language === 'en') return title;
    // Handle titles with potential trailing spaces or subtle differences
    const key = Object.keys(contentTranslations).find(k => k.trim() === title.trim());
    return key ? contentTranslations[key] : title;
  };

  const getTranslatedBody = (title: string, content: string) => {
    if (language === 'en') return content;
    const key = Object.keys(bodyTranslations).find(k => k.trim() === title.trim());
    return key ? bodyTranslations[key] : content;
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
        {t.selectLesson}
      </div>
    );
  }

  const embedUrl = lesson.video_url ? getYoutubeEmbedUrl(lesson.video_url) : null;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-zinc-900 transition-colors duration-300">
      
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
          {getTranslatedBody(lesson.title, lesson.title === 'Final Exam' || lesson.title === 'Certificate' ? '' : lesson.content)}
        </ReactMarkdown>
      </div>

      {lesson.title === 'Final Exam' && (
        <div className="mb-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8 border border-blue-100 dark:border-blue-800">
            <p className="text-lg text-blue-800 dark:text-blue-200 font-medium text-center">
              {language === 'en' 
                ? "To earn your free certificate, you must score 100% on this final exam. Please read each question carefully and select the best answer. Good luck!"
                : "เพื่อรับใบประกาศนียบัตรฟรี คุณต้องทำคะแนนให้ได้ 100% ในการสอบนี้ กรุณาอ่านคำถามแต่ละข้ออย่างละเอียดและเลือกคำตอบที่ดีที่สุด ขอให้โชคดี!"
              }
            </p>
          </div>
          {/* We parse the quiz data from the lesson content or hardcode it for now since markdown doesn't support complex components easily without a parser */}
          <Quiz questions={[
            {
              id: 1,
              question: language === 'en' ? "What is the primary difference between AI and Machine Learning?" : "ข้อแตกต่างหลักระหว่าง AI และ Machine Learning คืออะไร?",
              options: language === 'en' ? [
                "There is no difference, they are the same thing",
                "AI is a subset of Machine Learning",
                "Machine Learning is a subset of AI that focuses on learning from data",
                "AI focuses on hardware while Machine Learning focuses on software"
              ] : [
                "ไม่มีความแตกต่างกัน เป็นสิ่งเดียวกัน",
                "AI เป็นส่วนย่อยของ Machine Learning",
                "Machine Learning เป็นส่วนย่อยของ AI ที่เน้นการเรียนรู้จากข้อมูล",
                "AI เน้นที่ฮาร์ดแวร์ ในขณะที่ Machine Learning เน้นที่ซอฟต์แวร์"
              ],
              correctAnswer: 2
            },
            {
              id: 2,
              question: language === 'en' ? "Which component of a Neural Network provides the final prediction?" : "ส่วนประกอบใดของโครงข่ายประสาทเทียมที่ให้ผลการทำนายสุดท้าย?",
              options: language === 'en' ? [
                "Input Layer",
                "Hidden Layer",
                "Output Layer",
                "Processing Layer"
              ] : [
                "ชั้นนำเข้า (Input Layer)",
                "ชั้นซ่อน (Hidden Layer)",
                "ชั้นส่งออก (Output Layer)",
                "ชั้นประมวลผล (Processing Layer)"
              ],
              correctAnswer: 2
            },
            {
              id: 3,
              question: language === 'en' ? "What is a key characteristic of Large Language Models (LLMs)?" : "คุณลักษณะสำคัญของ Large Language Models (LLMs) คืออะไร?",
              options: language === 'en' ? [
                "They truly understand human emotions",
                "They predict the next word in a sequence based on probability",
                "They can only process numbers, not text",
                "They are always 100% factually accurate"
              ] : [
                "เข้าใจอารมณ์ของมนุษย์อย่างแท้จริง",
                "ทำนายคำถัดไปในลำดับตามความน่าจะเป็น",
                "ประมวลผลได้เฉพาะตัวเลข ไม่ใช่ข้อความ",
                "ถูกต้องตามความเป็นจริง 100% เสมอ"
              ],
              correctAnswer: 1
            },
            {
              id: 4,
              question: language === 'en' ? "Which of the following is an example of Generative AI?" : "ข้อใดต่อไปนี้เป็นตัวอย่างของ Generative AI?",
              options: language === 'en' ? [
                "A spam filter in your email",
                "Google Maps navigation",
                "Midjourney creating an image from text",
                "A calculator app"
              ] : [
                "ตัวกรองสแปมในอีเมลของคุณ",
                "การนำทางของ Google Maps",
                "Midjourney สร้างภาพจากข้อความ",
                "แอปเครื่องคิดเลข"
              ],
              correctAnswer: 2
            },
            {
              id: 5,
              question: language === 'en' ? "In the context of AI ethics, what does 'Bias' refer to?" : "ในบริบทของจริยธรรม AI 'อคติ' (Bias) หมายถึงอะไร?",
              options: language === 'en' ? [
                "The AI running too slowly",
                "The AI favoring certain groups or outcomes based on skewed training data",
                "The cost of running the AI model",
                "The electricity consumed by the AI"
              ] : [
                "AI ทำงานช้าเกินไป",
                "AI เข้าข้างกลุ่มหรือผลลัพธ์บางอย่างตามข้อมูลการฝึกอบรมที่บิดเบือน",
                "ค่าใช้จ่ายในการรันโมเดล AI",
                "ไฟฟ้าที่ AI ใช้ไป"
              ],
              correctAnswer: 1
            }
          ]} 
            onPass={handleComplete}
          />
        </div>
      )}

      {lesson.title === 'Certificate' && (
        <div className="mb-12">
            <Certificate />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-8 gap-4 mt-12">
        <div className="flex-1">
            {prevLesson && (
                <Link 
                    to={`/course/${prevLesson.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.previous}: {getTranslatedTitle(prevLesson.title)}</span>
                    <span className="sm:hidden">{t.previous}</span>
                </Link>
            )}
        </div>

          {lesson.title !== 'Final Exam' && lesson.title !== 'Certificate' && (
            <button 
              onClick={handleComplete}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                  completed 
                  ? 'bg-green-600/10 text-green-600 dark:text-green-400 border border-green-600/30 dark:border-green-600/50 hover:bg-green-600/20' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              {completed ? t.completed : t.markComplete}
            </button>
          )}

        <div className="flex-1 flex justify-end">
            {nextLesson && (
                <Link 
                    to={`/course/${nextLesson.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 text-right"
                >
                    <span className="hidden sm:inline">{t.next}: {getTranslatedTitle(nextLesson.title)}</span>
                    <span className="sm:hidden">{t.next}</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            )}
        </div>
      </div>
    </div>
  );
};

export default LessonContent;

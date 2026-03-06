import React, { useState } from 'react';
import { useLanguageStore } from '../stores/languageStore';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: Question[];
  onPass?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onPass }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { language } = useLanguageStore();

  const t = {
    en: {
      submit: 'Submit Exam',
      score: 'Your Score',
      passed: 'Congratulations! You passed the exam.',
      failed: 'You did not pass. You need at least 80% to earn a certificate. Please try again.',
      retry: 'Try Again'
    },
    th: {
      submit: 'ส่งข้อสอบ',
      score: 'คะแนนของคุณ',
      passed: 'ยินดีด้วย! คุณสอบผ่านแล้ว',
      failed: 'คุณสอบไม่ผ่าน คุณต้องได้คะแนนอย่างน้อย 80% เพื่อรับใบประกาศนียบัตร กรุณาลองใหม่อีกครั้ง',
      retry: 'ลองอีกครั้ง'
    }
  }[language];

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setSubmitted(true);
    // Pass if score is 80% or higher
    const passThreshold = Math.ceil(questions.length * 0.8);
    const passed = newScore >= passThreshold;
    
    if (passed && onPass) {
        onPass();
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const passThreshold = Math.ceil(questions.length * 0.8);
  const passed = score >= passThreshold;

  return (
    <div className="space-y-8 my-8">
      {questions.map((q, index) => (
        <div key={q.id} className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
            {index + 1}. {q.question}
          </h3>
          <div className="space-y-3">
            {q.options.map((option, optIndex) => (
              <button
                key={optIndex}
                onClick={() => handleOptionSelect(q.id, optIndex)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedAnswers[q.id] === optIndex
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                } ${
                  submitted && q.correctAnswer === optIndex
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 ring-2 ring-green-500 ring-offset-2 dark:ring-offset-zinc-900'
                    : ''
                } ${
                  submitted && selectedAnswers[q.id] === optIndex && q.correctAnswer !== optIndex
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : ''
                }`}
                disabled={submitted}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length < questions.length}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.submit}
        </button>
      ) : (
        <div className={`p-6 rounded-xl border-2 text-center ${
          passed 
            ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
            : 'border-red-500 bg-red-50 dark:bg-red-900/10'
        }`}>
          <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
            {t.score}: {score} / {questions.length}
          </h2>
          <p className={`text-lg mb-6 ${
            passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {passed ? t.passed : t.failed}
          </p>
          
          {!passed && (
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 transition"
            >
              {t.retry}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;

import React from 'react';
import { Clock, BookOpen, HelpCircle } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';
import { useExamTimer } from '../hooks/useExamTimer';
import { getAnsweredCount } from '../utils/questionUtils';

export default function Header() {
  const { state, actions } = useExam();
  const { formatTime, remainingMs } = useExamTimer();
  const { examMeta, questions, currentIndex, answers } = state;

  if (!examMeta) return null;

  const answeredCount = getAnsweredCount(answers, questions);
  const isTimeRunningOut = remainingMs < 5 * 60 * 1000; // Less than 5 minutes

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {examMeta.title}
              </h1>
              <p className="text-sm text-gray-600">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
          </div>

          {/* Timer and Progress */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => actions.showRulesModal(true)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              title="View Rules"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Rules</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className={`flex items-center gap-2 ${isTimeRunningOut ? 'text-red-600' : 'text-gray-900'}`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-sm sm:text-base font-medium">
                    {formatTime(remainingMs)}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {answeredCount}/{questions.length} answered
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Progress</span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
        </div>
      </div>
    </header>
  );
}
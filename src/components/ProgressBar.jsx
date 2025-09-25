import React from 'react';
import { motion } from 'framer-motion';
import { useExam } from '../contexts/ExamContext';
import { getAnsweredCount } from '../utils/questionUtils';

export default function ProgressBar() {
  const { state } = useExam();
  const { questions, currentIndex, answers } = state;

  if (!questions.length) return null;

  const answeredCount = getAnsweredCount(answers, questions);
  const totalQuestions = questions.length;
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;
  const answeredPercentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900">Progress</h4>
        <span className="text-sm text-gray-600">
          {answeredCount}/{totalQuestions} answered
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3">
          {/* Current Progress */}
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Answered Questions Overlay */}
          <motion.div 
            className="absolute top-0 left-0 bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full opacity-70"
            initial={{ width: 0 }}
            animate={{ width: `${answeredPercentage}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>

        {/* Question Markers */}
        <div className="flex justify-between mt-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                answers[questions[index].id]
                  ? 'bg-green-500'
                  : index <= currentIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-600 mt-2">
        <span>Question {currentIndex + 1}</span>
        <span>{Math.round(progressPercentage)}% complete</span>
      </div>
    </div>
  );
}
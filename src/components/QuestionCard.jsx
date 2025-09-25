import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, ArrowRight, Flag } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';
import classNames from 'classnames';

export default function QuestionCard() {
  const { state, actions } = useExam();
  const { questions, currentIndex, answers, lockedQuestions } = state;
  
  const currentQuestion = questions[currentIndex];
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved answer when question changes
  useEffect(() => {
    if (currentQuestion) {
      setCurrentAnswer(answers[currentQuestion.id] || '');
    }
  }, [currentQuestion, answers]);

  if (!currentQuestion) return null;

  const isLocked = lockedQuestions[currentQuestion.id];
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasAnswer = currentAnswer !== '';

  const handleSubmitAnswer = async () => {
    if (isLocked || !hasAnswer) return;

    setIsSubmitting(true);
    
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    actions.submitAnswer(currentQuestion.id, currentAnswer);
    setIsSubmitting(false);
  };

  const renderQuestionInput = () => {
    if (currentQuestion.type === 'mcq') {
      return (
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <motion.label
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={classNames(
                'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
                {
                  'border-blue-500 bg-blue-50': currentAnswer === index.toString() && !isLocked,
                  'border-green-500 bg-green-50': currentAnswer === index.toString() && isLocked,
                  'border-gray-200 hover:border-gray-300 hover:bg-gray-50': currentAnswer !== index.toString() && !isLocked,
                  'border-gray-200 bg-gray-50': currentAnswer !== index.toString() && isLocked,
                  'cursor-not-allowed opacity-60': isLocked
                }
              )}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={index}
                checked={currentAnswer === index.toString()}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={isLocked}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-gray-900 font-medium select-none">
                {String.fromCharCode(65 + index)}. {option}
              </span>
              {currentAnswer === index.toString() && isLocked && (
                <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
              )}
            </motion.label>
          ))}
        </div>
      );
    }

    if (currentQuestion.type === 'truefalse') {
      return (
        <div className="space-y-3">
          {['true', 'false'].map((option) => (
            <motion.label
              key={option}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: option === 'true' ? 0 : 0.1 }}
              className={classNames(
                'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
                {
                  'border-blue-500 bg-blue-50': currentAnswer === option && !isLocked,
                  'border-green-500 bg-green-50': currentAnswer === option && isLocked,
                  'border-gray-200 hover:border-gray-300 hover:bg-gray-50': currentAnswer !== option && !isLocked,
                  'border-gray-200 bg-gray-50': currentAnswer !== option && isLocked,
                  'cursor-not-allowed opacity-60': isLocked
                }
              )}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={currentAnswer === option}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={isLocked}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-gray-900 font-medium capitalize select-none">
                {option}
              </span>
              {currentAnswer === option && isLocked && (
                <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
              )}
            </motion.label>
          ))}
        </div>
      );
    }

    if (currentQuestion.type === 'text') {
      return (
        <div>
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            disabled={isLocked}
            placeholder="Type your answer here..."
            maxLength={currentQuestion.maxLength}
            className={classNames(
              'w-full min-h-[120px] p-4 border-2 rounded-lg resize-none transition-colors',
              {
                'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200': !isLocked,
                'border-green-500 bg-green-50 cursor-not-allowed': isLocked,
              }
            )}
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Max {currentQuestion.maxLength} characters</span>
            <span>{currentAnswer.length}/{currentQuestion.maxLength}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <motion.div
      key={currentQuestion.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8"
    >
      {/* Question Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={classNames(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
            {
              'bg-blue-600 text-white': !isLocked,
              'bg-green-600 text-white': isLocked
            }
          )}>
            {currentIndex + 1}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Question {currentIndex + 1}
            </h3>
            <p className="text-sm text-gray-600">
              {currentQuestion.marks} mark{currentQuestion.marks > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        {isLocked && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Answered</span>
          </div>
        )}
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <p className="text-gray-900 text-lg leading-relaxed select-none">
          {currentQuestion.question}
        </p>
      </div>

      {/* Answer Input */}
      <div className="mb-8">
        {renderQuestionInput()}
      </div>

      {/* Submit Button */}
      {!isLocked && (
        <div className="flex justify-end">
          <motion.button
            onClick={handleSubmitAnswer}
            disabled={!hasAnswer || isSubmitting}
            className={classNames(
              'flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200',
              {
                'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg': hasAnswer && !isSubmitting,
                'bg-gray-300 text-gray-500 cursor-not-allowed': !hasAnswer || isSubmitting
              }
            )}
            whileHover={hasAnswer && !isSubmitting ? { scale: 1.02 } : {}}
            whileTap={hasAnswer && !isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Flag className="w-5 h-5" />
                {isLastQuestion ? 'Submit & Finish' : 'Submit Answer & Next'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
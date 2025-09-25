import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

import Header from '../components/Header';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import WarningHandler from '../components/WarningHandler';
import PDFGenerator from '../components/PDFGenerator';

import { useExam } from '../contexts/ExamContext';
import { useExamTimer } from '../hooks/useExamTimer';
import { useVisibilityWarning } from '../hooks/useVisibilityWarning';
import { usePreventCopyPaste } from '../hooks/usePreventCopyPaste';

import { submitExamResults } from '../utils/firebase';
import { generateRecordId } from '../utils/generateRecordId';
import { calculateScore } from '../utils/questionUtils';

export default function ExamPage() {
  const { state, actions } = useExam();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showFinalSubmitModal, setShowFinalSubmitModal] = useState(false);

  // Enable hooks
  useExamTimer();
  useVisibilityWarning();
  usePreventCopyPaste();

  const { uid, questions, currentIndex, answers, examMeta, examStatus } = state;

  const isLastQuestion = currentIndex === questions.length - 1;
  const allQuestionsAnswered = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== '');

  // Check if ready for final submission
  React.useEffect(() => {
    if (examStatus === 'in_progress' && isLastQuestion && answers[questions[currentIndex].id]) {
      setShowFinalSubmitModal(true);
    }
  }, [examStatus, isLastQuestion, answers, questions, currentIndex]);

  // Auto-submit when status changes
  React.useEffect(() => {
    if ((examStatus === 'completed' || examStatus === 'disqualified') && !submissionResult) {
      handleFinalSubmit(examStatus);
    }
  }, [examStatus, submissionResult]);

  const handleFinalSubmit = async (status = 'completed') => {
    setIsSubmitting(true);
    setShowFinalSubmitModal(false);

    try {
      const recordId = generateRecordId();
      const score = calculateScore(answers, questions);
      
      const payload = {
        uid,
        answers,
        submittedAt: new Date().toISOString(),
        status,
        recordId,
        examTitle: examMeta.title,
        score
      };

      await submitExamResults(payload);

      setSubmissionResult({
        success: true,
        data: payload
      });

      toast.success('Exam submitted successfully!', {
        position: 'top-center',
        autoClose: 3000,
      });

    } catch (error) {
      let errorMessage = 'Failed to submit exam. Please try again.';
      
      if (error.message === 'ALREADY_SUBMITTED') {
        errorMessage = 'You have already submitted this exam. Contact admin for assistance.';
      }

      setSubmissionResult({
        success: false,
        error: errorMessage
      });

      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnToMainSite = () => {
    // Clear exam data and return to main site
    localStorage.removeItem('exam_state');
    actions.resetExam();
    window.location.href = '/';
  };

  // Show submission result modal
  if (submissionResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className={`px-6 py-8 text-center text-white ${
            submissionResult.success 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600'
              : 'bg-gradient-to-r from-red-600 to-rose-600'
          }`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {submissionResult.success ? (
                <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 mx-auto mb-4" />
              )}
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">
              {submissionResult.success ? 'Exam Submitted!' : 'Submission Failed'}
            </h1>
            <p className="text-sm opacity-90">
              {submissionResult.success 
                ? 'Your responses have been recorded'
                : 'Please contact support for assistance'
              }
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {submissionResult.success ? (
              <>
                {/* Success Details */}
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">Submission Details:</h3>
                    <div className="space-y-1 text-sm text-green-700">
                      <p><span className="font-medium">Record ID:</span> {submissionResult.data.recordId}</p>
                      <p><span className="font-medium">Status:</span> {submissionResult.data.status === 'completed' ? 'Successfully Completed' : 'Disqualified'}</p>
                      <p><span className="font-medium">Score:</span> {submissionResult.data.score.totalScore}/{submissionResult.data.score.maxScore} marks</p>
                      <p><span className="font-medium">Submitted:</span> {new Date(submissionResult.data.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
                    </div>
                  </div>

                  {submissionResult.data.status === 'disqualified' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-red-800">Disqualification Notice</p>
                          <p className="text-red-700 text-sm mt-1">
                            Your exam was auto-submitted due to rule violations. Please contact administration for further details.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <PDFGenerator 
                    examData={submissionResult.data} 
                    onDownload={() => toast.success('Certificate downloaded successfully!')}
                  />
                  
                  <button
                    onClick={handleReturnToMainSite}
                    className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                  >
                    Return to Main Site
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Error Details */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{submissionResult.error}</p>
                </div>

                {/* Error Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleFinalSubmit()}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                  >
                    Retry Submission
                  </button>
                  
                  <button
                    onClick={handleReturnToMainSite}
                    className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                  >
                    Contact Support
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Show submission loading
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Submitting Exam...</h2>
          <p className="text-gray-600">Please do not close this window.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <WarningHandler />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <ProgressBar />
        <QuestionCard />

        {/* Final Submit Modal */}
        {showFinalSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Submit?</h3>
                <p className="text-gray-600">
                  You've answered all questions. Submit your exam to receive your results.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <span className="font-medium">Important:</span> Once submitted, you cannot make any changes to your answers.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFinalSubmitModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Review Answers
                </button>
                <button
                  onClick={() => handleFinalSubmit('completed')}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200"
                >
                  Submit Exam
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
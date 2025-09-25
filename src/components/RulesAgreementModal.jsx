import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';
import FullscreenHelper from './FullscreenHelper';

export default function RulesAgreementModal() {
  const { state, actions } = useExam();
  const { showRulesModal, examMeta, examStatus } = state;
  const [agreed, setAgreed] = useState(false);
  const [startingExam, setStartingExam] = useState(false);

  const isVisible = showRulesModal || examStatus === 'not_started';

  const handleStartExam = async () => {
    if (!agreed) return;

    setStartingExam(true);

    try {
      // Request fullscreen
      const success = await FullscreenHelper.requestFullscreen();
      if (!success) {
        alert('Please allow fullscreen mode to continue with the exam.');
        setStartingExam(false);
        return;
      }

      // Start the exam
      actions.startExam(examMeta.durationMinutes);
    } catch (error) {
      console.error('Error starting exam:', error);
      setStartingExam(false);
    }
  };

  const handleClose = () => {
    if (examStatus === 'in_progress') {
      actions.showRulesModal(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white relative">
              {examStatus === 'in_progress' && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-xl font-bold">Exam Rules & Agreement</h2>
              <p className="text-blue-100 text-sm mt-1">SkillUp Exam (Diplomax Academy)</p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800 mb-2">Important Instructions:</p>
                    <ul className="space-y-2 text-sm">
                      <li>• Sit in a proper network area. We are not responsible for disconnects or network issues.</li>
                      <li>• Switch your phone/computer to Do Not Disturb (DND) before starting.</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">1</span>
                    </div>
                    <p>Exam will enforce fullscreen. If you exit fullscreen or switch tabs/windows, it may lead to warnings or disqualification.</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">2</span>
                    </div>
                    <p>Copy, paste, right-click, and text selection are disabled.</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">3</span>
                    </div>
                    <p>You will get <strong>4 warnings</strong> for breaking rules. On the <strong>5th warning</strong>, your exam will be auto-submitted and you will be disqualified.</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">4</span>
                    </div>
                    <p>You can submit the test only once. Once an answer is submitted for a question, you cannot change it.</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                  <p className="text-red-800 text-sm">
                    By checking the box and clicking "I Agree, Start Exam", you confirm you understand and accept these rules. 
                    Diplomax Academy is not responsible for any issues arising from rule violations.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            {examStatus === 'not_started' && (
              <div className="border-t border-gray-200 p-6">
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0 focus:ring-2 mt-0.5"
                    />
                    <span className="text-sm text-gray-700">
                      I have read and agree to the exam rules and understand that violations may lead to auto-submission and disqualification.
                    </span>
                  </label>

                  <motion.button
                    onClick={handleStartExam}
                    disabled={!agreed || startingExam}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      agreed && !startingExam
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    whileHover={agreed && !startingExam ? { scale: 1.02 } : {}}
                    whileTap={agreed && !startingExam ? { scale: 0.98 } : {}}
                  >
                    {startingExam ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Starting Exam...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        I Agree — Start Exam
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
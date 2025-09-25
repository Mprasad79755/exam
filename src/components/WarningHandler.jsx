import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';

export default function WarningHandler() {
  const { state } = useExam();
  const { warningsCount, examStatus } = state;

  if (examStatus !== 'in_progress' || warningsCount === 0) return null;

  const getWarningColor = () => {
    if (warningsCount >= 4) return 'text-red-600 border-red-200 bg-red-50';
    if (warningsCount >= 2) return 'text-amber-600 border-amber-200 bg-amber-50';
    return 'text-yellow-600 border-yellow-200 bg-yellow-50';
  };

  const getWarningIcon = () => {
    if (warningsCount >= 4) return <AlertTriangle className="w-5 h-5 animate-pulse" />;
    return <Shield className="w-5 h-5" />;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-md w-full mx-4`}
      >
        <div className={`flex items-center gap-3 p-4 rounded-lg border-2 shadow-lg ${getWarningColor()}`}>
          {getWarningIcon()}
          <div className="flex-1">
            <p className="font-medium text-sm">
              Warning {warningsCount}/4
            </p>
            <p className="text-xs opacity-90">
              {warningsCount >= 4 
                ? 'Next violation will auto-submit your exam!'
                : 'Avoid switching tabs or exiting fullscreen'
              }
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
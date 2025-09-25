import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

export default function NotStarted({ startTime, examTitle }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const difference = start - now;

      if (difference <= 0) {
        window.location.reload(); // Refresh to check exam status
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        days > 0 
          ? `${days}d ${hours}h ${minutes}m ${seconds}s`
          : hours > 0 
          ? `${hours}h ${minutes}m ${seconds}s`
          : `${minutes}m ${seconds}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const startDate = new Date(startTime).toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center text-white">
          <Clock className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold mb-2">Exam Not Started</h1>
          <p className="text-blue-100 text-sm">SkillUp Exam by Diplomax Academy</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {examTitle}
            </h2>
          </div>

          {/* Countdown */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Exam starts in:</p>
            <div className="text-3xl font-bold text-indigo-600 font-mono">
              {timeLeft}
            </div>
          </div>

          {/* Start Time */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Exam Start Time:</p>
              <p className="text-gray-700 text-sm mt-1">{startDate} IST</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="flex items-start gap-3 p-4 border border-amber-200 bg-amber-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800 mb-1">Preparation Tips:</p>
              <ul className="text-amber-700 text-sm space-y-1">
                <li>• Ensure stable internet connection</li>
                <li>• Enable Do Not Disturb mode</li>
                <li>• Clear your workspace</li>
                <li>• Charge your device</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, Clock, AlertTriangle } from 'lucide-react';

export default function Closed({ examTitle, endTime }) {
  const endDate = new Date(endTime).toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-8 text-center text-white">
          <XCircle className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Exam Window Closed</h1>
          <p className="text-red-100 text-sm">SkillUp Exam by Diplomax Academy</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {examTitle}
            </h2>
            <p className="text-gray-600">
              The exam submission window has closed.
            </p>
          </div>

          {/* End Time */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Exam Ended:</p>
              <p className="text-gray-700 text-sm mt-1">{endDate} IST</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex items-start gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800 mb-1">Need Help?</p>
              <p className="text-blue-700 text-sm">
                Contact us at{' '}
                <a 
                  href="mailto:admin@diplomax.academy" 
                  className="underline hover:no-underline"
                >
                  admin@diplomax.academy
                </a>
                {' '}for any queries or concerns.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
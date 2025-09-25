import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useExamTimer } from '../hooks/useExamTimer';

export default function Timer() {
  const { remainingMs, formatTime } = useExamTimer();
  
  const isTimeRunningOut = remainingMs < 5 * 60 * 1000; // Less than 5 minutes
  const isCritical = remainingMs < 2 * 60 * 1000; // Less than 2 minutes

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg font-mono transition-colors ${
      isCritical 
        ? 'bg-red-100 text-red-700 border border-red-200' 
        : isTimeRunningOut 
        ? 'bg-amber-100 text-amber-700 border border-amber-200'
        : 'bg-gray-100 text-gray-700'
    }`}>
      {isCritical ? (
        <AlertTriangle className="w-4 h-4 animate-pulse" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {formatTime(remainingMs)}
      </span>
    </div>
  );
}
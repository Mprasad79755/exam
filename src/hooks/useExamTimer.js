import { useEffect } from 'react';
import { useExam } from '../contexts/ExamContext';

export function useExamTimer() {
  const { state, actions } = useExam();
  const { examStatus, startedAt, remainingMs, examMeta } = state;

  useEffect(() => {
    if (examStatus !== 'in_progress' || !startedAt || !examMeta) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - new Date(startedAt).getTime();
      const totalDuration = examMeta.durationMinutes * 60 * 1000;
      const remaining = Math.max(0, totalDuration - elapsed);
      
      actions.setRemainingTime(remaining);
      
      if (remaining <= 0) {
        actions.autoSubmit('completed');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [examStatus, startedAt, examMeta, actions]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return { remainingMs, formatTime };
}
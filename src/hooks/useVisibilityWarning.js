import { useEffect } from 'react';
import { useExam } from '../contexts/ExamContext';

export function useVisibilityWarning() {
  const { state, actions } = useExam();
  const { examStatus } = state;

  useEffect(() => {
    if (examStatus !== 'in_progress') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        actions.incrementWarning('visibility');
      }
    };

    const handleBlur = () => {
      actions.incrementWarning('blur');
    };

    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      actions.setFullscreen(isFullscreen);
      
      if (!isFullscreen && examStatus === 'in_progress') {
        actions.incrementWarning('fullscreen-exit');
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Detect DevTools (heuristic - not foolproof)
    const detectDevTools = setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        actions.incrementWarning('devtools-suspected');
      }
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearInterval(detectDevTools);
    };
  }, [examStatus, actions]);
}
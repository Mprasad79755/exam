import { useEffect } from 'react';
import { useExam } from '../contexts/ExamContext';

export function usePreventCopyPaste() {
  const { state } = useExam();
  const { examStatus } = state;

  useEffect(() => {
    if (examStatus !== 'in_progress') return;

    const preventCopy = (e) => {
      e.preventDefault();
      return false;
    };

    const preventPaste = (e) => {
      e.preventDefault();
      return false;
    };

    const preventCut = (e) => {
      e.preventDefault();
      return false;
    };

    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const preventSelectAll = (e) => {
      if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        return false;
      }
    };

    const preventF12 = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners
    document.addEventListener('copy', preventCopy);
    document.addEventListener('paste', preventPaste);
    document.addEventListener('cut', preventCut);
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventSelectAll);
    document.addEventListener('keydown', preventF12);

    // Prevent text selection via CSS
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('paste', preventPaste);
      document.removeEventListener('cut', preventCut);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventSelectAll);
      document.removeEventListener('keydown', preventF12);
      
      // Restore text selection
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.mozUserSelect = '';
      document.body.style.msUserSelect = '';
    };
  }, [examStatus]);
}
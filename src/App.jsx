import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ExamProvider, useExam } from './contexts/ExamContext';
import NotStarted from './pages/NotStarted';
import Closed from './pages/Closed';
import ExamPage from './pages/ExamPage';
import RulesAgreementModal from './components/RulesAgreementModal';

function AppContent() {
  const { state, actions } = useExam();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for UID in localStorage
        // const uid = localStorage.getItem('skillup_exam_uid');
        const uid = 12345;
        if (!uid) {
          setError('UID not found. Use main site to launch exam.');
          setLoading(false);
          return;
        }
        actions.setUID(uid);

        // Load questions
        const response = await fetch('/questions.json');
        if (!response.ok) throw new Error('Failed to load questions');
        
        const data = await response.json();
        actions.setQuestions(data);

        // Check exam window
        const now = new Date();
        const startTime = new Date(data.meta.startAt);
        const endTime = new Date(data.meta.endAt);

        if (now < startTime) {
          actions.setExamStatus('not_started');
        } else if (now > endTime) {
          actions.setExamStatus('closed');
        } else {
          // Within exam window - check for existing submission
          // In a real app, you'd check Firestore here
          actions.setExamStatus('not_started'); // Show rules modal
          actions.showRulesModal(true);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [actions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-200 p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-red-900 mb-2">Error</h1>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { examStatus, examMeta } = state;

  if (examStatus === 'not_started' && !state.showRulesModal) {
    return <NotStarted startTime={examMeta.startAt} examTitle={examMeta.title} />;
  }

  if (examStatus === 'closed') {
    return <Closed examTitle={examMeta.title} endTime={examMeta.endAt} />;
  }

  if (examStatus === 'in_progress') {
    return <ExamPage />;
  }

  return (
    <>
      <RulesAgreementModal />
      {examStatus === 'in_progress' && <ExamPage />}
    </>
  );
}

function App() {
  // Demo: Set a UID for testing purposes
  useEffect(() => {
    if (!localStorage.getItem('skillup_exam_uid')) {
      localStorage.setItem('skillup_exam_uid', `student_${Date.now()}_demo`);
    }
  }, []);

  return (
    <ExamProvider>
      <AppContent />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ExamProvider>
  );
}

export default App;
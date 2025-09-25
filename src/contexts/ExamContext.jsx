import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';

const ExamContext = createContext();

const initialState = {
  uid: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  lockedQuestions: {},
  warningsCount: 0,
  startedAt: null,
  remainingMs: 0,
  examStatus: 'not_started', // not_started | in_progress | submitted | disqualified | closed
  examMeta: null,
  isFullscreen: false,
  showRulesModal: false
};

function examReducer(state, action) {
  switch (action.type) {
    case 'SET_UID':
      return { ...state, uid: action.payload };
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload.questions, examMeta: action.payload.meta };
    case 'SET_EXAM_STATUS':
      return { ...state, examStatus: action.payload };
    case 'START_EXAM':
      return { 
        ...state, 
        examStatus: 'in_progress', 
        startedAt: new Date(),
        remainingMs: action.payload.duration * 60 * 1000,
        showRulesModal: false
      };
    case 'SUBMIT_ANSWER':
      const newAnswers = { ...state.answers, [action.payload.questionId]: action.payload.answer };
      const newLocked = { ...state.lockedQuestions, [action.payload.questionId]: true };
      return { 
        ...state, 
        answers: newAnswers, 
        lockedQuestions: newLocked,
        currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1)
      };
    case 'INCREMENT_WARNING':
      const newCount = state.warningsCount + 1;
      return { ...state, warningsCount: newCount };
    case 'SET_REMAINING_TIME':
      return { ...state, remainingMs: action.payload };
    case 'AUTO_SUBMIT':
      return { ...state, examStatus: action.payload.status };
    case 'SET_FULLSCREEN':
      return { ...state, isFullscreen: action.payload };
    case 'SHOW_RULES_MODAL':
      return { ...state, showRulesModal: action.payload };
    case 'RESET_EXAM':
      return initialState;
    default:
      return state;
  }
}

export function ExamProvider({ children }) {
  const [state, dispatch] = useReducer(examReducer, initialState);

  // Load UID from localStorage
  useEffect(() => {
    const uid = localStorage.getItem('skillup_exam_uid');
    if (uid) {
      dispatch({ type: 'SET_UID', payload: uid });
    }
  }, []);

  // Save state to localStorage for crash recovery
  useEffect(() => {
    if (state.examStatus === 'in_progress') {
      localStorage.setItem('exam_state', JSON.stringify({
        answers: state.answers,
        currentIndex: state.currentIndex,
        lockedQuestions: state.lockedQuestions,
        startedAt: state.startedAt,
        remainingMs: state.remainingMs
      }));
    }
  }, [state.answers, state.currentIndex, state.lockedQuestions, state.startedAt, state.remainingMs, state.examStatus]);

  const incrementWarning = (type) => {
    const newCount = state.warningsCount + 1;
    dispatch({ type: 'INCREMENT_WARNING' });
    
    if (newCount <= 4) {
      toast.warn(`Warning ${newCount}/4: Do not switch tabs or leave fullscreen. Further violations will lead to disqualification.`, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } else {
      // Auto-submit on 5th warning
      toast.error('5th warning reached. Your exam has been auto-submitted and you are disqualified.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      dispatch({ type: 'AUTO_SUBMIT', payload: { status: 'disqualified' } });
    }
  };

  const actions = {
    setUID: (uid) => dispatch({ type: 'SET_UID', payload: uid }),
    setQuestions: (data) => dispatch({ type: 'SET_QUESTIONS', payload: data }),
    setExamStatus: (status) => dispatch({ type: 'SET_EXAM_STATUS', payload: status }),
    startExam: (duration) => dispatch({ type: 'START_EXAM', payload: { duration } }),
    submitAnswer: (questionId, answer) => dispatch({ type: 'SUBMIT_ANSWER', payload: { questionId, answer } }),
    incrementWarning,
    setRemainingTime: (ms) => dispatch({ type: 'SET_REMAINING_TIME', payload: ms }),
    autoSubmit: (status) => dispatch({ type: 'AUTO_SUBMIT', payload: { status } }),
    setFullscreen: (isFullscreen) => dispatch({ type: 'SET_FULLSCREEN', payload: isFullscreen }),
    showRulesModal: (show) => dispatch({ type: 'SHOW_RULES_MODAL', payload: show }),
    resetExam: () => dispatch({ type: 'RESET_EXAM' })
  };

  return (
    <ExamContext.Provider value={{ state, actions }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
}
export function calculateScore(answers, questions) {
  let totalScore = 0;
  let maxScore = 0;

  questions.forEach(question => {
    maxScore += question.marks;
    const userAnswer = answers[question.id];
    
    if (!userAnswer) return;

    if (question.type === 'mcq') {
      // Assuming correct answer is always index 2 for demo (String in the example)
      const correctAnswers = {
        'q1': 2, // String
        'q4': 3, // All of the above
        'q7': 1, // 404
        'q10': 3 // Laravel
      };
      if (correctAnswers[question.id] === parseInt(userAnswer)) {
        totalScore += question.marks;
      }
    } else if (question.type === 'truefalse') {
      const correctAnswers = {
        'q2': 'true',  // HTML stands for...
        'q5': 'true',  // CSS stands for...
        'q8': 'false'  // React hooks can only be used...
      };
      if (correctAnswers[question.id] === userAnswer) {
        totalScore += question.marks;
      }
    } else if (question.type === 'text') {
      // Text questions get partial credit for any non-empty answer
      if (userAnswer.trim().length > 0) {
        totalScore += question.marks * 0.5; // Give 50% credit for attempting
      }
    }
  });

  return { totalScore, maxScore };
}

export function getAnsweredCount(answers, questions) {
  return questions.filter(q => answers[q.id] && answers[q.id] !== '').length;
}
export const calculateScore = (correctCount, totalQuestions) => {
  if (totalQuestions === 0) return 0;
  return (correctCount / totalQuestions) * 100;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

export const generateQuickLoginCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const getProgressPercentage = (completedLessons, totalLessons) => {
  if (totalLessons === 0) return 0;
  return (completedLessons / totalLessons) * 100;
};

// API routes test file to verify endpoints
module.exports = (req, res) => {
  // List all available API endpoints for documentation
  const endpoints = {
    status: "API is working",
    endpoints: {
      auth: {
        register: "/api/auth/register - POST",
        login: "/api/auth/login - POST",
        user: "/api/auth - GET (authenticated)",
        forgotPassword: "/api/auth/forgot-password - POST",
        resetPassword: "/api/auth/reset-password/:token - PUT"
      },
      users: {
        getAllUsers: "/api/users - GET",
        getUser: "/api/users/:id - GET",
        updateUser: "/api/users/:id - PUT",
        deleteUser: "/api/users/:id - DELETE"
      },
      quiz: {
        createQuiz: "/api/quizzes - POST",
        getAllQuizzes: "/api/quizzes - GET",
        getQuiz: "/api/quizzes/:quizId - GET",
        updateQuiz: "/api/quizzes/:quizId - PUT",
        deleteQuiz: "/api/quizzes/:quizId - DELETE"
      },
      quizResult: "/api/quizResult - Various endpoints",
      email: "/api/email - Email endpoints",
      categories: "/api/categories - Category endpoints",
      questions: "/api/questions - Question endpoints",
      classes: "/api/classes - Class endpoints"
    }
  };
  
  res.status(200).json(endpoints);
}; 
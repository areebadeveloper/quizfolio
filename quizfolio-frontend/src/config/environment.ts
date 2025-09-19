// Environment configuration for QuizFolio
export const environment = {
  production: false,
  apiUrl: 'http://192.168.1.101:5000/api' // Local network IP for phone testing
};

export const environmentProd = {
  production: true,
  apiUrl: 'https://quizfolio-api.onrender.com/api' // Update this with your deployed backend URL
};

// Auto-detect environment - use local network IP for mobile testing
export const config = {
  production: false,
  apiUrl: 'http://192.168.1.101:5000/api' // Always use network IP for phone testing
}; 
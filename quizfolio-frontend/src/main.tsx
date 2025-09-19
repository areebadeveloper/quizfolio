import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './theme/variables.css';
import './theme/themes.css'; // Import our themes

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
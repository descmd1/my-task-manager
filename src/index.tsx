import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TaskProvider } from './context/TaskContext';
import { DarkModeProvider } from './context/DarkModeContext'; 
import './index.css';

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <TaskProvider>
      <DarkModeProvider>
      <App />
      </DarkModeProvider>
      </TaskProvider>
  );
} else {
  console.error("Root element not found.");
}

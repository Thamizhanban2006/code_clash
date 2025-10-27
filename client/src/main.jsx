import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <App />
  </SocketProvider>
);

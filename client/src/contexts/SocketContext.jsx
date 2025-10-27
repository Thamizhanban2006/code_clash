// src/contexts/SocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      // force websocket transport to avoid polling issues during dev
      socketRef.current = io('http://localhost:3000', { transports: ['websocket'] });
      socketRef.current.on('connect', () => setConnected(true));
      socketRef.current.on('disconnect', () => setConnected(false));
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

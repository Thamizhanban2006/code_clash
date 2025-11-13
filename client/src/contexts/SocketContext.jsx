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
      const lastSocketId = localStorage.getItem('lastSocketId');
      socketRef.current = io('http://localhost:3000', {
        transports: ['websocket'],
        auth: { lastSocketId: lastSocketId || null },
        reconnectionAttempts: 5,
        reconnectionDelay: 500,
      });

      socketRef.current.on('connect', () => {
        setConnected(true);
        localStorage.setItem('lastSocketId', socketRef.current.id);
        console.log('✅ Connected socket:', socketRef.current.id);
      });

      socketRef.current.on('disconnect', () => {
        setConnected(false);
        console.log('🔴 Disconnected socket');
      });
    }

    return () => {
      // don’t fully disconnect on unmount — preserve session
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

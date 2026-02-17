import { createContext, useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Only initialize socket once on mount
    if (socketRef.current) return;

    // Direct connection to backend for Socket.IO
    const backendUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
    const newSocket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      withCredentials: true
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      if (isMountedRef.current) {
        setConnected(true);
        console.log('✅ Socket connected:', newSocket.id);
      }
    });

    newSocket.on('disconnect', () => {
      if (isMountedRef.current) {
        setConnected(false);
      }
    });

    newSocket.on('message', (message) => {
      if (isMountedRef.current) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    newSocket.on('typing', () => {
      if (isMountedRef.current) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    });

    if (isMountedRef.current) {
      setSocket(newSocket);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const startChat = async (chatData) => {
    if (socket) {
      socket.emit('startChat', chatData, (response) => {
        if (response.success) {
          setActiveChat(response.chat);
          setMessages(response.chat.messages);
        } else {
          console.error(response.error);
        }
      });
    }
  };

  const sendMessage = (message, type, metadata) => {
    if (socket && activeChat) {
      const newMessage = { message, type, metadata, sender: 'user' };
      socket.emit('sendMessage', { chatId: activeChat._id, ...newMessage });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  const sendTyping = () => {
    if (socket && activeChat) {
      socket.emit('typing', { chatId: activeChat._id });
    }
  };

  const closeChat = () => {
    if (socket && activeChat) {
      socket.emit('closeChat', { chatId: activeChat._id });
      setActiveChat(null);
      setMessages([]);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        connected,
        activeChat,
        messages,
        isTyping,
        unreadCount,
        startChat,
        sendMessage,
        sendTyping,
        closeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
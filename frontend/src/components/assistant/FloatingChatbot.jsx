import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import api from '../../services/api';

const INITIAL_MESSAGES = [
  { id: 'init-1', sender: 'bot', text: "Hello! I'm CivicAI Assistant. 🤖\nI'll help you create a civic complaint." },
  { id: 'init-2', sender: 'bot', text: "What issue are you facing today?" }
];

export default function FloatingChatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null); // Keep last attached image in state

  // Load chat state from sessionStorage on mount
  useEffect(() => {
    const savedMessages = sessionStorage.getItem('civic_chat_messages');
    const savedOpen = sessionStorage.getItem('civic_chat_open');
    const savedImage = sessionStorage.getItem('civic_chat_image');

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages(INITIAL_MESSAGES);
    }

    if (savedOpen) {
      setIsOpen(savedOpen === 'true');
    }

    if (savedImage) {
      setAttachedImage(savedImage);
    }
  }, []);

  // Save chat state to sessionStorage on updates
  const saveState = (newMessages, newOpen, newImage) => {
    sessionStorage.setItem('civic_chat_messages', JSON.stringify(newMessages));
    sessionStorage.setItem('civic_chat_open', String(newOpen));
    if (newImage) {
      sessionStorage.setItem('civic_chat_image', newImage);
    } else if (newImage === null) {
      sessionStorage.removeItem('civic_chat_image');
    }
  };

  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    saveState(messages, nextOpen, attachedImage);
  };

  const handleClear = () => {
    setMessages(INITIAL_MESSAGES);
    setAttachedImage(null);
    saveState(INITIAL_MESSAGES, isOpen, null);
  };

  const handleSendMessage = async (text, imageBase64) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      image: imageBase64,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    
    let currentImage = attachedImage;
    if (imageBase64) {
      currentImage = imageBase64;
      setAttachedImage(imageBase64);
    }
    saveState(updatedMessages, isOpen, currentImage);

    setIsTyping(true);

    try {
      // Map frontend messages to simple payload format
      // We filter out greeting to save tokens/make prompt focused if needed, 
      // but sending everything is cleaner for context.
      const chatHistory = updatedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text || "[Image Uploaded]"
      }));

      const response = await api.post('/assistant/chat', {
        messages: chatHistory,
        image: imageBase64 || currentImage // Pass base64 image if attached
      });

      if (response.data.success) {
        const { reply, complete, data } = response.data.chat;

        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const finalMessages = [...updatedMessages, botMsg];
        setMessages(finalMessages);
        saveState(finalMessages, isOpen, currentImage);

        // If complaint data gathering is complete
        if (complete && data) {
          // Store complete draft with the image attached
          const draft = {
            ...data,
            image: currentImage
          };
          
          sessionStorage.setItem('assistant_draft', JSON.stringify(draft));
          
          // Clear chat states for next session
          setTimeout(() => {
            handleClear();
            setIsOpen(false);
            navigate('/report-issue');
          }, 2500); // Small delay to let user read the bot's closing reply
        }
      }
    } catch (err) {
      console.error('Chat Assistant Error:', err);
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: 'Sorry, I encountered a temporary connection issue. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalMessages = [...updatedMessages, errorMsg];
      setMessages(finalMessages);
      saveState(finalMessages, isOpen, currentImage);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
      {/* Chat Window Panel */}
      {isOpen && (
        <ChatWindow
          onClose={handleToggle}
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          onClear={handleClear}
        />
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={handleToggle}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isOpen
            ? 'bg-slate-800 text-white rotate-90 border border-slate-700'
            : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white animate-pulse-slow'
        }`}
        style={{
          boxShadow: isOpen
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            : '0 10px 25px -5px rgba(37, 99, 235, 0.4), 0 0 0 4px rgba(37, 99, 235, 0.15)'
        }}
      >
        {isOpen ? '❌' : '🤖'}
      </button>

      {/* Custom Styles for animations */}
      <style>{`
        @keyframes pulseSlow {
          0%, 100% {
            box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4), 0 0 0 0px rgba(37, 99, 235, 0.2);
          }
          50% {
            box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4), 0 0 0 10px rgba(37, 99, 235, 0.15);
          }
        }
        .animate-pulse-slow {
          animation: pulseSlow 2s infinite;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

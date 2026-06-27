import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, X, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({
  onClose,
  messages,
  onSendMessage,
  isTyping,
  onClear
}) {
  const [inputValue, setInputValue] = useState('');
  const [attachedImage, setAttachedImage] = useState(null); // base64
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim() && !attachedImage) return;
    onSendMessage(inputValue, attachedImage);
    setInputValue('');
    setAttachedImage(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-[350px] h-[500px] rounded-2xl bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-slide-in select-none">
      
      {/* Header */}
      <header className="h-14 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 font-bold text-base">
            🤖
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide">CivicAI Assistant</h3>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-blue-100 font-semibold">Online & ready</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onClear}
            title="Reset Chat"
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            title="Close Assistant"
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-1 bg-slate-50/50">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing dots animation */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-1 shadow-xs">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Preview Bar for Attached Image */}
      {attachedImage && (
        <div className="p-2 border-t border-slate-100 bg-white/90 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200">
              <img src={attachedImage} alt="Attachment Preview" className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] text-slate-500 font-semibold">Image selected</span>
          </div>
          <button
            onClick={() => setAttachedImage(null)}
            className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input Footer Area */}
      <footer className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={triggerFileInput}
          type="button"
          title="Attach Image"
          className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors"
        >
          <Image className="h-5 w-5" />
        </button>

        <textarea
          rows={1}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 max-h-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
        />

        <button
          onClick={handleSend}
          disabled={!inputValue.trim() && !attachedImage}
          className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-100 disabled:text-slate-300 shadow-xs hover:shadow-md transition-all duration-200"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </footer>
    </div>
  );
}

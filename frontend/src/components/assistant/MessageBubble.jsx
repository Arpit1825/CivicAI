import React from 'react';

export default function MessageBubble({ message }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10'
            : 'bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-800 rounded-bl-none'
        }`}
      >
        {/* Render uploaded image preview if exists */}
        {message.image && (
          <div className="mb-2 max-w-full rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
            <img src={message.image} alt="Uploaded Proof" className="max-h-40 w-full object-cover" />
          </div>
        )}
        
        {message.text && (
          <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        )}
        
        <span
          className={`text-[9px] block mt-1 text-right font-medium ${
            isUser ? 'text-blue-200' : 'text-slate-400'
          }`}
        >
          {message.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

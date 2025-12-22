import React, { useEffect } from 'react';

interface ChatBotProps {
  className?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ className = '' }) => {
  useEffect(() => {
    // Check if the script is already loaded
    const existingScript = document.querySelector('script[src*="jotfor.ms/agent/embedjs"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jotfor.ms/agent/embedjs/01983f41eaeb74d98cfb9acd71a3b873ff5d/embed.js?isVoice=1';
      script.async = true;
      
      // Add error handling
      script.onerror = () => {
        console.warn('Failed to load chat bot script');
      };
      
      script.onload = () => {
        console.log('Chat bot script loaded successfully');
      };
      
      document.head.appendChild(script);
      
      // Cleanup function to remove script when component unmounts
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className={`chat-bot-container ${className}`}>
      {/* The chat bot will be injected here by the script */}
    </div>
  );
};
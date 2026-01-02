import React, { useEffect } from 'react';

interface ChatBotProps {
  className?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ className = '' }) => {
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="jotfor.ms/agent/embedjs"]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jotfor.ms/agent/embedjs/01983f41eaeb74d98cfb9acd71a3b873ff5d/embed.js?isVoice=1';
      script.async = true;

      script.onerror = () => {
        console.warn('Failed to load chat bot script');
      };

      script.onload = () => {
        repositionChatWidget();
      };

      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, []);

  useEffect(() => {
    const repositionInterval = setInterval(repositionChatWidget, 500);

    const handleResize = () => repositionChatWidget();
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(repositionInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const repositionChatWidget = () => {
    const isMobile = window.innerWidth <= 768;
    const bottomOffset = isMobile ? '80px' : '20px';
    const rightOffset = isMobile ? '8px' : '20px';

    const selectors = [
      '#jotformAgentPopup',
      '[id*="jotform"][id*="agent"]',
      '[class*="jotform"][class*="agent"]',
      '.jotform-agent-chatwidget',
      '#jfAgentChatWidget',
      'iframe[src*="jotfor.ms"]',
      'iframe[src*="jotform"]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.style) {
          htmlEl.style.setProperty('bottom', bottomOffset, 'important');
          htmlEl.style.setProperty('right', rightOffset, 'important');
          if (isMobile) {
            htmlEl.style.setProperty('z-index', '40', 'important');
          }
        }
      });
    });
  };

  return (
    <div className={`chat-bot-container ${className}`}>
    </div>
  );
};
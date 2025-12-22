'use client';
import { ArrowRight } from 'lucide-react';

interface FlowButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

export function FlowButton({ text = "Modern Button", onClick, className = "" }: FlowButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`group relative flex items-center justify-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-blue-500/40 bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:rounded-[12px] active:scale-[0.95] shadow-lg hover:shadow-xl ${className}`}
    >
      {/* Left arrow (arr-2) */}
      <ArrowRight 
        className="absolute w-5 h-5 left-[-25%] stroke-white fill-none z-[9] group-hover:left-6 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
      />

      {/* Text */}
      <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
        {text}
      </span>

      {/* Circle */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/20 rounded-[50%] opacity-0 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"></span>

      {/* Right arrow (arr-1) */}
      <ArrowRight 
        className="absolute w-5 h-5 right-6 stroke-white fill-none z-[9] group-hover:right-[-25%] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
      />
    </button>
  );
}
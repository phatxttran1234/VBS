import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-25 to-white">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 relative ring-2 ring-blue-200/50 shadow-lg">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 relative ring-2 ring-logo-blue-lightest/50 shadow-lg">
            <img 
              src="/Screenshot 2025-11-21 at 15.51.53.png" 
              alt="VBS Logo" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-logo-blue/20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading VBS</h2>
          <p className="text-gray-600">Initializing your volleyball study system...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
    )
  }
}
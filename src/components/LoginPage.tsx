import React, { useState } from 'react';
import { ArrowLeft, Shield, Users, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface LoginPageProps {
  onBack: () => void;
  onCoachLogin: () => void;
  onAdminLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack, onCoachLogin, onAdminLogin }) => {
  const { isDarkMode } = useTheme();
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === 'admin123') {
      onAdminLogin();
    } else {
      setError('Invalid password');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleCoachLogin = () => {
    onCoachLogin();
  };

  return (
    <div className={`min-h-screen flex relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
    }`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]'
            : 'bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]'
        }`}></div>
        <div className={`absolute top-0 left-0 w-full h-full ${
          isDarkMode
            ? 'bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.02)_50%,transparent_75%)]'
            : 'bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.01)_50%,transparent_75%)]'
        }`}></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-8 shadow-2xl ring-1 ring-white/20">
            <img 
              src="/Screenshot 2025-11-21 at 15.51.53.png" 
              alt="VBS Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            VBS
          </h1>
          <p className={`text-xl mb-8 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Volleyball Study System
          </p>
          <div className="space-y-4">
            <div className={`flex items-center space-x-3 p-4 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm border ${
              isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Learn & Practice
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Master volleyball techniques
                </p>
              </div>
            </div>
            <div className={`flex items-center space-x-3 p-4 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm border ${
              isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Track Progress
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Monitor your improvement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative">
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`absolute top-8 left-8 p-3 rounded-xl transition-all duration-200 ${
            isDarkMode 
              ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700/50' 
              : 'bg-white/50 hover:bg-white/80 text-slate-600 hover:text-slate-900 border border-slate-200/50'
          } backdrop-blur-sm`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Mobile Logo */}
        <div className="lg:hidden mb-8">
          <div className="w-16 h-16 rounded-xl overflow-hidden mx-auto mb-4 shadow-xl">
            <img 
              src="/Screenshot 2025-11-21 at 15.51.53.png" 
              alt="VBS Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className={`text-2xl font-bold text-center ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Welcome to VBS
          </h1>
        </div>

        <div className="w-full max-w-sm">
          {!showAdminForm ? (
            /* Login Options */
            <div className="space-y-4">
              <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Choose your role
                </h2>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Select how you'd like to access VBS
                </p>
              </div>

              {/* Coach Login */}
              <button
                onClick={handleCoachLogin}
                className={`w-full p-6 rounded-2xl border transition-all duration-200 text-left group ${
                  isDarkMode 
                    ? 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50 hover:border-blue-500/50' 
                    : 'bg-white/50 hover:bg-white/80 border-slate-200/50 hover:border-blue-500/50'
                } backdrop-blur-sm hover:shadow-xl hover:scale-[1.02]`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Continue as Coach
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Access player dashboard and training features
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 transition-colors duration-200 ${
                    isDarkMode 
                      ? 'border-slate-600 group-hover:border-blue-400' 
                      : 'border-slate-300 group-hover:border-blue-500'
                  }`}>
                    <div className="w-full h-full rounded-full bg-blue-500 scale-0 group-hover:scale-75 transition-transform duration-200"></div>
                  </div>
                </div>
              </button>

              {/* Admin Login */}
              <button
                onClick={() => setShowAdminForm(true)}
                className={`w-full p-6 rounded-2xl border transition-all duration-200 text-left group ${
                  isDarkMode 
                    ? 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50 hover:border-purple-500/50' 
                    : 'bg-white/50 hover:bg-white/80 border-slate-200/50 hover:border-purple-500/50'
                } backdrop-blur-sm hover:shadow-xl hover:scale-[1.02]`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Admin Access
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Manage system content and user accounts
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 transition-colors duration-200 ${
                    isDarkMode 
                      ? 'border-slate-600 group-hover:border-purple-400' 
                      : 'border-slate-300 group-hover:border-purple-500'
                  }`}>
                    <div className="w-full h-full rounded-full bg-purple-500 scale-0 group-hover:scale-75 transition-transform duration-200"></div>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            /* Admin Login Form */
            <div className={`${isShaking ? 'animate-shake' : ''}`}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Admin Login
                </h2>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Enter your admin credentials to continue
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-4 rounded-xl border transition-all duration-200 ${
                        isDarkMode 
                          ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 focus:border-purple-500/50 focus:bg-slate-800/80' 
                          : 'bg-white/50 border-slate-200/50 text-slate-900 placeholder-slate-500 focus:border-purple-500/50 focus:bg-white/80'
                      } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                      placeholder="Enter admin password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                        isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                      } transition-colors duration-200`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 hover:from-purple-600 hover:to-purple-700"
                  >
                    Sign In as Admin
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminForm(false);
                      setError('');
                      setPassword('');
                    }}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700/50' 
                        : 'bg-white/50 hover:bg-white/80 text-slate-600 hover:text-slate-900 border border-slate-200/50'
                    } backdrop-blur-sm`}
                  >
                    Back to Options
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-center">
          <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            © 2024 VBS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
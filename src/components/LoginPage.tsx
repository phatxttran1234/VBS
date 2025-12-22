import React, { useState } from 'react';
import { ArrowLeft, Shield, Users } from 'lucide-react';

interface LoginPageProps {
  onBack: () => void;
  onCoachLogin: () => void;
  onAdminLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack, onCoachLogin, onAdminLogin }) => {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen flex flex-col px-6 py-12 relative overflow-hidden z-10">
      
      {/* Header */}
      <div className="relative z-10 flex items-center mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">
          {showAdminForm ? 'Admin Login' : 'Choose Login Type'}
        </h1>
      </div>

      {/* Login Options */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        {!showAdminForm ? (
          <div className="w-full max-w-sm space-y-4">
            {/* Coach Login Button */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Login as Coach</h2>
                <p className="text-gray-600 text-sm mt-1">Access player dashboard and features</p>
              </div>
              <button
                onClick={handleCoachLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                Enter as Coach
              </button>
            </div>

            {/* Admin Login Button */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Admin Login</h2>
                <p className="text-gray-600 text-sm mt-1">Manage system content and users</p>
              </div>
              <button
                onClick={() => setShowAdminForm(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                Admin Login
              </button>
            </div>
          </div>
        ) : showAdminForm ? (
          /* Admin Login Form */
          <div className={`w-full max-w-sm bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 transition-all duration-300 ${isShaking ? 'animate-shake' : ''}`}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Admin Access</h2>
              <p className="text-gray-600 text-sm mt-1">Enter admin credentials</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-6">
              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter password"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                Login as Admin
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  setShowAdminForm(false);
                  setError('');
                  setPassword('');
                }}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Back to Login Options
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};
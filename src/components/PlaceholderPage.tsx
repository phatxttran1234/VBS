import React from 'react';
import { ArrowLeft, Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  onBack: () => void;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, onBack }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-100/50 px-6 py-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 capitalize">
            {title.replace('-', ' ')}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Construction className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600 mb-8 max-w-sm">
            This feature is currently under development. Check back soon for updates!
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
import { X, Clock, Target, Dumbbell, Lightbulb } from 'lucide-react';
import { parseVideoUrl } from '../utils/videoEmbed';

interface Drill {
  id: string;
  title: string;
  age_group: string;
  category: string;
  description: string;
  duration?: string;
  setup?: string;
  execution?: string;
  coaching_tips?: string;
  reps?: string;
  difficulty?: string;
  equipment?: string;
  video_url?: string;
}

interface DrillDetailModalProps {
  drill: Drill;
  onClose: () => void;
}

export default function DrillDetailModal({ drill, onClose }: DrillDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-[#0f1729] rounded-2xl shadow-2xl">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-8 border-b border-gray-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-400/10 rounded-full mb-3">
                    {drill.category}
                  </span>
                  <h2 className="text-4xl font-bold text-white mb-2">{drill.title}</h2>
                  <p className="text-gray-400">{drill.age_group}</p>
                </div>
                <div className="flex flex-col gap-2 text-right">
                  {drill.duration && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">{drill.duration}</span>
                    </div>
                  )}
                  {drill.difficulty && (
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      drill.difficulty === 'Beginner' ? 'bg-green-400/10 text-green-400' :
                      drill.difficulty === 'Intermediate' ? 'bg-yellow-400/10 text-yellow-400' :
                      'bg-red-400/10 text-red-400'
                    }`}>
                      {drill.difficulty}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {drill.video_url && (() => {
                const videoInfo = parseVideoUrl(drill.video_url);
                return videoInfo.isValid && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Video Demonstration</h3>
                    <div className="aspect-video bg-black rounded-xl overflow-hidden border border-gray-800">
                      {videoInfo.type === 'youtube' && (
                        <iframe
                          src={videoInfo.embedUrl}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                      {videoInfo.type === 'instagram' && (
                        <iframe
                          src={videoInfo.embedUrl}
                          className="w-full h-full"
                          frameBorder="0"
                          scrolling="no"
                          allowTransparency
                        />
                      )}
                      {videoInfo.type === 'tiktok' && (
                        <iframe
                          src={videoInfo.embedUrl}
                          className="w-full h-full"
                          allow="encrypted-media;"
                          allowFullScreen
                        />
                      )}
                    </div>
                  </div>
                );
              })()}

              {drill.description && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{drill.description}</p>
                </div>
              )}

              {drill.equipment && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-cyan-400" />
                    Equipment
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{drill.equipment}</p>
                </div>
              )}

              {drill.setup && (
                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-3">Setup</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{drill.setup}</p>
                </div>
              )}

              {drill.execution && (
                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-3">Execution</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{drill.execution}</p>
                </div>
              )}

              {drill.coaching_tips && (
                <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-xl p-6 border border-blue-500/20">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Coaching Points
                  </h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{drill.coaching_tips}</p>
                </div>
              )}

              {drill.reps && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Progressions</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{drill.reps}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

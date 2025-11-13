

import React from 'react';
import { MODULES } from '../../constants';
import { BookOpenIcon } from '../icons';
import type { User } from '../../types';

interface ContentPageProps {
  onStartModule: (moduleId: number) => void;
  unlockedModules: number[];
  user: User;
  allModuleScores: { [email: string]: { [key: number]: { preTestScore: number | null } } };
}

const ContentPage: React.FC<ContentPageProps> = ({ onStartModule, unlockedModules }) => {

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">خارطة التعلم</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map(module => {
          const isUnlocked = unlockedModules.includes(module.id);
          return (
            <div key={module.id} className={`p-6 rounded-lg shadow-lg text-white ${isUnlocked ? 'bg-blue-700' : 'bg-gray-500'}`}>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-white/20 rounded-full mr-4">
                  <BookOpenIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{module.title}</h2>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isUnlocked ? 'bg-green-400 text-green-900' : 'bg-gray-400 text-gray-800'}`}>
                    {module.level}
                  </span>
                </div>
              </div>
              <p className="text-blue-100 mb-4">
                ابدأ بالاختبار القبلي لفتح مسار التعلم الخاص بك.
              </p>
              <button
                onClick={() => onStartModule(module.id)}
                disabled={!isUnlocked}
                className={`w-full py-2 px-4 rounded-md font-semibold transition ${
                  isUnlocked
                    ? 'bg-white text-blue-700 hover:bg-blue-100'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {isUnlocked ? 'بدء الاختبار القبلي' : 'مغلق'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default ContentPage;
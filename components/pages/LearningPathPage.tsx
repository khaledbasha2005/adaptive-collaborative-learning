import React from 'react';
import EditableText from '../EditableText';

interface LearningPathPageProps {
  onSelectTopic: (topic: string) => void;
  onNavigateToGroupFormation: () => void;
  isAdmin: boolean;
  description: string;
  onUpdateDescription: (newText: string) => void;
}

const LearningPathPage: React.FC<LearningPathPageProps> = ({ onSelectTopic, onNavigateToGroupFormation, isAdmin, description, onUpdateDescription }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">مسار التعلم</h1>
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold mb-4">مسار التعلم الموحد</h2>
          <div className="relative">
            <EditableText 
              isAdmin={isAdmin}
              initialText={description}
              onSave={onUpdateDescription}
              textarea
            />
          </div>
          <div className="mt-6 space-y-4">
             <button onClick={() => onSelectTopic('الهدف العام')} className="w-full text-right bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
               الهدف العام
             </button>
             <button onClick={() => onSelectTopic('الاهداف التعلمية')} className="w-full text-right bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
               الاهداف التعلمية
             </button>
             <button onClick={() => onSelectTopic('تعليمات دراسة الموديول')} className="w-full text-right bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
               تعليمات دراسة الموديول
             </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={onNavigateToGroupFormation}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg transform hover:scale-105"
        >
          تكوين المجموعات التشاركية
        </button>
      </div>
    </div>
  );
};

export default LearningPathPage;

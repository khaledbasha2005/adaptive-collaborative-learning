

import React, { useEffect } from 'react';
import { moduleContent } from '../../moduleContent';

interface ModuleContentPageProps {
  onBack: () => void;
  completedLessons: number[];
  setCompletedLessons: React.Dispatch<React.SetStateAction<number[]>>;
  currentLessonIndex: number;
  currentPageIndex: number;
  onSetLesson: (index: number) => void;
  onSetPage: (index: number) => void;
  onNavigateToActivity: () => void;
  currentModuleId: number | null;
  onNavigateToContentPage: () => void;
}

const ModuleContentPage: React.FC<ModuleContentPageProps> = ({ 
  onBack, 
  completedLessons, 
  setCompletedLessons,
  currentLessonIndex,
  currentPageIndex,
  onSetLesson,
  onSetPage,
  onNavigateToActivity,
  currentModuleId,
  onNavigateToContentPage
}) => {
  const lessons = currentModuleId ? moduleContent[currentModuleId] || [] : [];
  
  // Reset page to 0 when lesson changes, but only if there are lessons to display
  useEffect(() => {
    if (lessons.length > 0) {
      onSetPage(0);
    }
  }, [currentLessonIndex, onSetPage, lessons.length]);

  
  const renderPageContent = (content: string) => {
    const parts = content.split('[IMAGE_PLACEHOLDER]');
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < parts.length - 1 && (
          <div className="my-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 not-prose">
            <img 
                src= "https://drive.google.com/file/d/1k6wVyWxgBf7aPlwW1ZXY3uuz534OM_yy/view?usp=drivesdk"
                alt="صورة توضيحية للمكتبة الافتراضية" 
                className="w-full max-w-lg mx-auto h-auto rounded-md shadow-md" 
            />
            <p className="text-sm text-gray-500 mt-2"></p>
          </div>
        )}
      </React.Fragment>
    ));
  };


  if (!currentModuleId || lessons.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">محتوى الموديول التعليمي</h1>
           <button
             onClick={onBack}
             className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
           >
             العودة إلى المسار
           </button>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <p className="text-xl text-gray-700">
                {!currentModuleId 
                    ? "يرجى إكمال الاختبار القبلي لأحد الموديولات أولاً للوصول إلى المحتوى التعليمي."
                    : "لا يوجد محتوى تعليمي متاح لهذا الموديول بعد."
                }
            </p>
            <button
              onClick={onNavigateToContentPage}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              العودة إلى قائمة الموديولات
            </button>
        </div>
      </div>
    );
  }

  const selectedLesson = lessons[currentLessonIndex];
  const isLessonCompleted = completedLessons.includes(currentLessonIndex);
  const allLessonsCompleted = lessons.length === completedLessons.length;

  const handleSelectLesson = (index: number) => {
    const isUnlocked = index === 0 || completedLessons.includes(index - 1);
    if (isUnlocked) {
      onSetLesson(index);
    }
  };

  const handleCompleteLesson = () => {
    if (!isLessonCompleted) {
      const newCompleted = [...completedLessons, currentLessonIndex];
      setCompletedLessons(newCompleted);

      // Automatically move to the next lesson if there is one and it's not completed
      if (currentLessonIndex < lessons.length - 1 && !newCompleted.includes(currentLessonIndex + 1)) {
        onSetLesson(currentLessonIndex + 1);
      }
    }
  };
  
  const handleNextPage = () => {
    if (currentPageIndex < selectedLesson.pages.length - 1) {
      onSetPage(currentPageIndex + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      onSetPage(currentPageIndex - 1);
    }
  };
  
  const isLastPage = currentPageIndex === selectedLesson.pages.length - 1;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">محتوى الموديول التعليمي</h1>
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          العودة إلى المسار
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Content Viewer */}
        <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow-inner flex flex-col">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 pb-2 border-b-2 border-blue-200">{selectedLesson.title}</h2>
          
          <div className="bg-white p-8 rounded-md shadow-lg flex-1 flex flex-col min-h-[60vh]">
            <div
              className="prose prose-lg max-w-none flex-grow whitespace-pre-wrap font-sans text-gray-700 text-lg leading-relaxed"
            >
              {renderPageContent(selectedLesson.pages[currentPageIndex])}
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center bg-white p-3 rounded-md shadow-lg">
            <button
              onClick={handlePrevPage}
              disabled={currentPageIndex === 0}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              السابق
            </button>
            <span className="text-gray-700 font-semibold">
              صفحة {currentPageIndex + 1} من {selectedLesson.pages.length}
            </span>
             {isLastPage ? (
               <button
                 onClick={handleCompleteLesson}
                 disabled={isLessonCompleted}
                 className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
               >
                 {isLessonCompleted ? '✓ تم الإكمال' : 'إكمال الدرس'}
               </button>
             ) : (
               <button
                 onClick={handleNextPage}
                 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
               >
                 التالي
               </button>
             )}
          </div>
        </div>

        {/* Lesson List */}
        <div className="w-full md:w-80 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">الدروس</h3>
          <div className="space-y-3">
            {lessons.map((lesson, index , imgsrc) => {
              const isUnlocked = index === 0 || completedLessons.includes(index - 1);
              const isSelected = index === currentLessonIndex;
              const isCompleted = completedLessons.includes(index);

              return (
                <button
                  key={lesson.title}
                  onClick={() => handleSelectLesson(index)}
                  disabled={!isUnlocked}
                  className={`w-full text-right p-4 rounded-md transition flex items-center justify-between ${
                    !isUnlocked ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 
                    isSelected ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400' : 
                    'bg-gray-100 hover:bg-blue-100'
                  }`}
                >
                  <span className="flex-1">{lesson.title}</span>
                  {isCompleted && <span className="text-green-600 mr-2">✓</span>}
                  {!isUnlocked && <span className="text-gray-400">🔒</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
       {allLessonsCompleted && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onNavigateToActivity}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg transform hover:scale-105"
          >
            الانتقال إلى الأنشطة
          </button>
        </div>
      )}
    </div>
  );
};

export default ModuleContentPage;
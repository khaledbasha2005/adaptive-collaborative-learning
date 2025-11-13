

import React, { useState, useCallback, useEffect } from 'react';
import type { User, Page, Group, Message } from './types';
import { Page as PageEnum } from './types';
import { PAGES, ADMIN_USER } from './constants';
import { quizQuestions as allQuizQuestions } from './quizQuestions';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import HomePage from './components/pages/HomePage';
import NewsPage from './components/pages/NewsPage';
import ContentPage from './components/pages/ContentPage';
import ProfilePage from './components/pages/ProfilePage';
import AdminDashboardPage from './components/pages/AdminDashboardPage';
import QuizzesPage from './components/pages/QuizzesPage';
import GoalsPage from './components/pages/GoalsPage';
import ModuleQuizPage from './components/pages/ModuleQuizPage';
import LearningPathPage from './components/pages/LearningPathPage';
import LearningPathDetailPage from './components/pages/LearningPathDetailPage';
import ModuleContentPage from './components/pages/ModuleContentPage';
import FinalQuizPage from './components/pages/FinalQuizPage';
import ActivityPage from './components/pages/ActivityPage';
import GroupFormationPage from './components/pages/GroupFormationPage';
import CollaborativeLearningPage from './components/pages/CollaborativeLearningPage';
import InstructionsPage from './components/pages/InstructionsPage';
import DescriptionPage from './components/pages/DescriptionPage';
import ToolsPage from './components/pages/ToolsPage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(PAGES[0]);
  const [quizActive, setQuizActive] = useState(false);
  const [showFinalQuiz, setShowFinalQuiz] = useState(false);
  
  // Global states for all users
  const [allModuleScores, setAllModuleScores] = useState<{ [email: string]: { [key: number]: { preTestScore: number | null, postTestScore: number | null, preTestTime: number | null, postTestTime: number | null } } }>({});
  const [allStudents, setAllStudents] = useState<User[]>([]);

  // User-specific states
  const [learningPathTopic, setLearningPathTopic] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<{ [key: number]: number[] }>({});
  const [finalQuizPassed, setFinalQuizPassed] = useState(false);
  const [unlockedModules, setUnlockedModules] = useState<number[]>([1]);
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState<number | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [discussions, setDiscussions] = useState<Message[]>([]);
  
  // State for Module Content Page progress
  const [moduleLessonIndex, setModuleLessonIndex] = useState(0);
  const [modulePageIndex, setModulePageIndex] = useState(0);

  const [quizQuestionsByModule, setQuizQuestionsByModule] = useState(allQuizQuestions);
  const [unifiedLearningPathDescription, setUnifiedLearningPathDescription] = useState(
    `مرحباً بك في مسار التعلم الموحد. سنركز هنا على المفاهيم الأساسية والأساسيات التي تحتاجها لبدء رحلتك في تطوير المكتبات الاftراضية.`
  );
  
  // Load global data (students, scores, groups, discussions) once on initial mount
  useEffect(() => {
    const savedStudentsRaw = localStorage.getItem('all_students');
    if (savedStudentsRaw) setAllStudents(JSON.parse(savedStudentsRaw));

    const savedScoresRaw = localStorage.getItem('all_module_scores');
    if (savedScoresRaw) setAllModuleScores(JSON.parse(savedScoresRaw));
    
    const allGroupsRaw = localStorage.getItem('all_groups');
    if (allGroupsRaw) setGroups(JSON.parse(allGroupsRaw));
    
    const allDiscussionsRaw = localStorage.getItem('all_discussions');
    if(allDiscussionsRaw) setDiscussions(JSON.parse(allDiscussionsRaw));
  }, []);

  // Load user-specific progress from localStorage when user logs in
  useEffect(() => {
    if (user) {
      const savedProgressRaw = localStorage.getItem(`progress_${user.email}`);
      if (savedProgressRaw) {
        try {
          const savedProgress = JSON.parse(savedProgressRaw);
          setCompletedLessons(savedProgress.completedLessons || {});
          setFinalQuizPassed(savedProgress.finalQuizPassed || false);
          setModuleLessonIndex(savedProgress.moduleLessonIndex || 0);
          setModulePageIndex(savedProgress.modulePageIndex || 0);
          setUnlockedModules(savedProgress.unlockedModules || [1]);
          setCurrentActivityId(savedProgress.currentActivityId || null);
          setCurrentModuleId(savedProgress.currentModuleId || null);
        } catch (e) {
          console.error("Error parsing saved progress", e);
        }
      }
    }
  }, [user]);

  // Save user-specific progress to localStorage
  useEffect(() => {
    if (user) {
      const progress = {
        completedLessons,
        finalQuizPassed,
        moduleLessonIndex,
        modulePageIndex,
        unlockedModules,
        currentActivityId,
        currentModuleId,
      };
      localStorage.setItem(`progress_${user.email}`, JSON.stringify(progress));
    }
  }, [completedLessons, finalQuizPassed, moduleLessonIndex, modulePageIndex, unlockedModules, currentActivityId, currentModuleId, user]);

  // Save shared global data to localStorage
  useEffect(() => {
    if (user) { // Only save if a user is logged in, to prevent logged-out state from clearing data
      localStorage.setItem('all_students', JSON.stringify(allStudents));
      localStorage.setItem('all_module_scores', JSON.stringify(allModuleScores));
      localStorage.setItem('all_groups', JSON.stringify(groups));
      localStorage.setItem('all_discussions', JSON.stringify(discussions));
    }
  }, [allStudents, allModuleScores, groups, discussions, user]);


  const handleUpdateQuestion = (moduleId: number, index: number, newText: string) => {
    setQuizQuestionsByModule(prev => {
        const updatedQuestions = [...prev[moduleId]];
        updatedQuestions[index].questionText = newText;
        return { ...prev, [moduleId]: updatedQuestions };
    });
  };
  
  const handleUpdateAnswerText = (moduleId: number, questionIndex: number, answerIndex: number, newText: string) => {
    setQuizQuestionsByModule(prev => {
        const updatedQuestions = [...prev[moduleId]];
        updatedQuestions[questionIndex].answerOptions[answerIndex].answerText = newText;
        return { ...prev, [moduleId]: updatedQuestions };
    });
  };

  const handleSetCorrectAnswer = (moduleId: number, questionIndex: number, correctAnserIndex: number) => {
    setQuizQuestionsByModule(prev => {
        const updatedQuestions = [...prev[moduleId]];
        updatedQuestions[questionIndex].answerOptions.forEach((option, index) => {
            option.isCorrect = index === correctAnserIndex;
        });
        return { ...prev, [moduleId]: updatedQuestions };
    });
  };

  const handleUpdateLearningPath = (newText: string) => {
    setUnifiedLearningPathDescription(newText);
  };

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage(PAGES[0]);

    // Add user to the global list if they don't exist
    setAllStudents(prev => {
        if (prev.some(student => student.email === loggedInUser.email)) {
            return prev;
        }
        return [...prev, loggedInUser];
    });
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setQuizActive(false);
    setShowFinalQuiz(false);
    setLearningPathTopic(null);
    setCompletedLessons({});
    setFinalQuizPassed(false);
    setModuleLessonIndex(0);
    setModulePageIndex(0);
    setUnlockedModules([1]);
    setCurrentActivityId(null);
    setCurrentModuleId(null);
    // Do not clear global data like students, scores, groups or discussions on logout
  }, []);

  const handleStartModule = useCallback((moduleId: number) => {
    setCurrentModuleId(moduleId);
    setQuizActive(true);
    setModuleLessonIndex(0);
    setModulePageIndex(0);
  }, []);

  const handleCompleteQuiz = useCallback((score: number, timeTaken: number) => {
    if (currentModuleId && user) {
        setAllModuleScores(prevScores => {
            const userScores = prevScores[user.email] || {};
            return {
                ...prevScores,
                [user.email]: {
                    ...userScores,
                    [currentModuleId]: {
                        // Fix: Provide a default object with all properties to satisfy the type.
                        ...(userScores[currentModuleId] || { preTestScore: null, postTestScore: null, preTestTime: null, postTestTime: null }),
                        preTestScore: score,
                        preTestTime: timeTaken,
                    }
                }
            };
        });
    }
    setQuizActive(false);
    setCurrentPage(PageEnum.LearningPath);
  }, [currentModuleId, user]);
  
  const handleStartFinalQuiz = useCallback(() => {
    setShowFinalQuiz(true);
  }, []);

  const handleCompleteFinalQuiz = useCallback((score: number, timeTaken: number) => {
    if (currentModuleId && user) {
        const questionsForModule = quizQuestionsByModule[currentModuleId] || [];
        const passingScore = Math.ceil(questionsForModule.length * 0.8); // Example: 80% to pass

        setAllModuleScores(prevScores => {
            const userScores = prevScores[user.email] || {};
            return {
                ...prevScores,
                [user.email]: {
                    ...userScores,
                    [currentModuleId]: {
                        ...(userScores[currentModuleId] || { preTestScore: null, postTestScore: null, preTestTime: null, postTestTime: null }),
                        postTestScore: score,
                        postTestTime: timeTaken,
                    }
                }
            };
        });
        if (score >= passingScore) {
            setFinalQuizPassed(true);
        }
    }
  }, [currentModuleId, user, quizQuestionsByModule]);

  const handleRetryModule = useCallback(() => {
    setShowFinalQuiz(false);
    setCurrentPage(PageEnum.ModuleContent);
  }, []);

  const handleNavigateToActivity = useCallback(() => {
    setCurrentPage(PageEnum.Activity);
  }, []);
  
  const handleUnlockAndNavigate = useCallback((moduleId: number, page: Page) => {
    setUnlockedModules(prev => {
        if(prev.includes(moduleId)) return prev;
        return [...prev, moduleId].sort((a,b) => a - b);
    });
    setCurrentPage(page);
    setShowFinalQuiz(false);
  }, []);
  
  const handleNavigateAndCloseQuiz = useCallback((page: Page) => {
    setCurrentPage(page);
    setShowFinalQuiz(false);
  }, []);


  const handleSelectTopic = useCallback((topic: string) => {
    setLearningPathTopic(topic);
    setCurrentPage(PageEnum.LearningPathDetail);
  }, []);

  const handleReturnToPath = useCallback(() => {
    setLearningPathTopic(null);
    setCurrentPage(PageEnum.LearningPath);
  }, []);

  const handleNavigateToModuleContent = useCallback(() => {
    setCurrentPage(PageEnum.ModuleContent);
  }, []);
  
  const handleNavigateToContent = useCallback(() => {
    setCurrentPage(PageEnum.Content);
  }, []);

  const handleNavigateToGroupFormation = useCallback(() => {
    setCurrentPage(PageEnum.GroupFormation);
  }, []);

  const handleStartActivity = useCallback((activityId: number) => {
    setCurrentActivityId(activityId);
    setCurrentPage(PageEnum.CollaborativeLearning);
  }, []);

  const handleBackToActivities = useCallback(() => {
    setCurrentActivityId(null);
    setCurrentPage(PageEnum.Activity);
  }, []);

  const handleCreateGroup = useCallback(() => {
    if (!user) return;
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: `المجموعة ${groups.length + 1}`,
      members: [user],
    };
    setGroups(prev => [...prev, newGroup]);
  }, [user, groups.length]);

  const handleJoinGroup = useCallback((groupId: string) => {
    if (!user) return;
    setGroups(prev => prev.map(group => {
      if (group.id === groupId && group.members.length < 4) {
        return { ...group, members: [...group.members, user] };
      }
      return group;
    }));
  }, [user]);

  const handleLeaveGroup = useCallback((groupId: string) => {
    if (!user) return;
    setGroups(prev => {
        const updatedGroups = prev
            .map(group => {
                if (group.id === groupId) {
                    return { ...group, members: group.members.filter(member => member.id !== user.id) };
                }
                return group;
            })
            .filter(group => group.members.length > 0);
        return updatedGroups;
    });
  }, [user]);

  const handleSendMessage = useCallback((activityId: number, text: string) => {
    if (!user || !text.trim() || !currentModuleId) return;
    const userGroup = groups.find(g => g.members.some(m => m.id === user.id));
    if (!userGroup) return;

    const newMessage: Message = {
        id: `msg-${Date.now()}`,
        groupId: userGroup.id,
        moduleId: currentModuleId,
        activityId,
        author: user,
        text,
        timestamp: new Date().toISOString(),
    };
    setDiscussions(prev => [...prev, newMessage]);

  }, [user, groups, currentModuleId]);


  const renderPage = () => {
    if (!user) return null;
    
    const isAdmin = user.email === ADMIN_USER.email;

    if (currentPage === PageEnum.LearningPathDetail && learningPathTopic) {
        return <LearningPathDetailPage topicTitle={learningPathTopic} onBack={handleReturnToPath} />;
    }

    switch (currentPage) {
      case PageEnum.Home:
        return <HomePage />;
      case PageEnum.Instructions:
        return <InstructionsPage />;
      case PageEnum.News:
        return <NewsPage />;
      case PageEnum.Description:
        return <DescriptionPage />;
      case PageEnum.Content:
        return <ContentPage 
                    onStartModule={handleStartModule} 
                    unlockedModules={unlockedModules} 
                    user={user}
                    allModuleScores={allModuleScores}
                />;
      case PageEnum.Tools:
        return <ToolsPage />;
      case PageEnum.Goals:
        return <GoalsPage />;
      case PageEnum.Profile:
        return <ProfilePage 
                    user={user} 
                    allModuleScores={allModuleScores} 
                    quizQuestionsByModule={quizQuestionsByModule}
                    isAdmin={isAdmin}
                    allStudents={allStudents}
                    groups={groups}
                />;
      case PageEnum.Quizzes:
        return <QuizzesPage />;
      case PageEnum.AdminDashboard:
        return <AdminDashboardPage 
                    groups={groups}
                    allStudents={allStudents}
                    allModuleScores={allModuleScores}
                    quizQuestionsByModule={quizQuestionsByModule}
                />;
      case PageEnum.LearningPath:
        return <LearningPathPage 
                    onSelectTopic={handleSelectTopic} 
                    onNavigateToGroupFormation={handleNavigateToGroupFormation} 
                    isAdmin={isAdmin} 
                    description={unifiedLearningPathDescription}
                    onUpdateDescription={handleUpdateLearningPath} 
                />;
      case PageEnum.ModuleContent:
        return <ModuleContentPage 
                    currentModuleId={currentModuleId}
                    onBack={handleReturnToPath} 
                    completedLessons={currentModuleId ? completedLessons[currentModuleId] || [] : []}
                    setCompletedLessons={(updater) => {
                      if (!currentModuleId) return;
                      setCompletedLessons(prev => {
                          const currentModuleCompleted = prev[currentModuleId] || [];
                          const newCompleted = typeof updater === 'function' ? updater(currentModuleCompleted) : updater;
                          return { ...prev, [currentModuleId]: newCompleted };
                      });
                    }}
                    currentLessonIndex={moduleLessonIndex}
                    currentPageIndex={modulePageIndex}
                    onSetLesson={setModuleLessonIndex}
                    onSetPage={setModulePageIndex}
                    onNavigateToActivity={handleNavigateToActivity}
                    onNavigateToContentPage={handleNavigateToContent}
                />;
      case PageEnum.GroupFormation:
        return <GroupFormationPage 
                    onNavigateToModuleContent={handleNavigateToModuleContent}
                    user={user}
                    groups={groups}
                    onCreateGroup={handleCreateGroup}
                    onJoinGroup={handleJoinGroup}
                    onLeaveGroup={handleLeaveGroup}
                />;
      case PageEnum.Activity:
        return <ActivityPage onStartFinalQuiz={handleStartFinalQuiz} onStartActivity={handleStartActivity} currentModuleId={currentModuleId} />;
      case PageEnum.CollaborativeLearning:
        return <CollaborativeLearningPage 
                    activityId={currentActivityId} 
                    moduleId={currentModuleId}
                    onBack={handleBackToActivities}
                    user={user}
                    groups={groups}
                    discussions={discussions}
                    onSendMessage={handleSendMessage}
                />;
      default:
        return <HomePage />;
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  const isAdmin = user.email === ADMIN_USER.email;

  if (quizActive && currentModuleId) {
    return <ModuleQuizPage 
      onComplete={handleCompleteQuiz} 
      questions={quizQuestionsByModule[currentModuleId] || []} 
      onUpdateQuestion={(index, newText) => handleUpdateQuestion(currentModuleId, index, newText)} 
      isAdmin={isAdmin} 
      onUpdateAnswerText={(qIndex, aIndex, newText) => handleUpdateAnswerText(currentModuleId, qIndex, aIndex, newText)}
      onSetCorrectAnswer={(qIndex, aIndex) => handleSetCorrectAnswer(currentModuleId, qIndex, aIndex)}
      currentModuleId={currentModuleId}
      />;
  }

  if (showFinalQuiz && currentModuleId) {
    const questionsForModule = quizQuestionsByModule[currentModuleId] || [];
    const passingScore = Math.ceil(questionsForModule.length * 0.8); // Example: 80% to pass

    return <FinalQuizPage 
      onComplete={handleCompleteFinalQuiz} 
      onRetry={handleRetryModule} 
      onUnlockAndNavigate={handleUnlockAndNavigate}
      onNavigateAndClose={handleNavigateAndCloseQuiz}
      questions={questionsForModule} 
      onUpdateQuestion={(index, newText) => handleUpdateQuestion(currentModuleId, index, newText)} 
      isAdmin={isAdmin}
      onUpdateAnswerText={(qIndex, aIndex, newText) => handleUpdateAnswerText(currentModuleId, qIndex, aIndex, newText)}
      onSetCorrectAnswer={(qIndex, aIndex) => handleSetCorrectAnswer(currentModuleId, qIndex, aIndex)}
      currentModuleId={currentModuleId}
      passingScore={passingScore}
    />;
  }

  return (
    <DashboardLayout
      user={user}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      onLogout={handleLogout}
      finalQuizPassed={finalQuizPassed}
    >
      {renderPage()}
    </DashboardLayout>
  );
};

export default App;
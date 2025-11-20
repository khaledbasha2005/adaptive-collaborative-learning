
import React, { useState, useCallback, useEffect } from 'react';
import type { User, Page, Group, Message, NewsItem, CognitiveLevel } from './types';
import { Page as PageEnum } from './types';
import { PAGES, ADMIN_USER, INITIAL_NEWS_ITEMS, MODULES } from './constants';
import { quizQuestions as allQuizQuestions } from './quizQuestions';
import { moduleContent } from './moduleContent';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import HomePage from './components/pages/HomePage';
import NewsPage from './components/pages/NewsPage';
import ContentPage from './components/pages/ContentPage';
import ProfilePage from './components/pages/ProfilePage';
import AdminDashboardPage from './components/pages/AdminDashboardPage';
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

// Data extracted from PDF for each module
const MODULE_DETAILS: { [key: number]: { goal: string; objectives: string } } = {
  1: {
    goal: "إلمام الطالب المعلم بنشأة المكتبات الافتراضية ثلاثية الأبعاد.",
    objectives: `يتوقع بعد انتهائك عزيزي الطالب من دراسة هذا الموضوع أن تصبح قادراً على أن:
• تتعرف على مراحل تطور المكتبات.
• تفرق بين أنواع المكتبات.
• تحدد سبب ظهور المكتبات الافتراضية ثلاثية الأبعاد.
• تعرف المكتبات الافتراضية ثلاثية الأبعاد.
• تتعرف على أنواع المكتبات الافتراضية.
• تتعرف على مسميات المكتبات الافتراضية ثلاثية الأبعاد.
• تحدد خدمات المكتبات الافتراضية ثلاثية الأبعاد.`
  },
  2: {
    goal: "إلمام الطالب المعلم بطبيعة المكتبات الافتراضية ثلاثية الأبعاد (المميزات-الخصائص-الأهمية-الصعوبات).",
    objectives: `يتوقع بعد انتهائك عزيزي الطالب من دراسة هذا الموضوع أن تصبح قادراً على أن:
• تعدد مميزات المكتبات الافتراضية ثلاثية الأبعاد.
• تذكر خصائص المكتبات الافتراضية ثلاثية الأبعاد.
• تحدد أهمية المكتبات الافتراضية ثلاثية الأبعاد في دعم العملية التعليمية.
• تحدد المتطلبات الأساسية اللازمة لتصميم وإنتاج المكتبات الافتراضية ثلاثية الأبعاد.
• تعدد التحديات (الصعوبات) التي تواجه تصميم وإنتاج المكتبات الافتراضية ثلاثية الأبعاد.`
  },
  3: {
    goal: "إلمام الطالب المعلم بتصميم المكتبة الافتراضية ثلاثية الأبعاد.",
    objectives: `يتوقع بعد انتهائك عزيزي الطالب من دراسة هذا الموضوع أن تصبح قادراً على أن:
• تحدد المعايير التي ينبغي توافرها عند تصميم المكتبة الافتراضية ثلاثية الأبعاد.
• تذكر المعايير التربوية الواجب توافرها عند تصميم المكتبة الافتراضية ثلاثية الأبعاد.
• تحدد المعايير الفنية الواجب توافرها عند تصميم المكتبة الافتراضية ثلاثية الأبعاد.
• توضح أهمية المعايير التربوية في تصميم المكتبة الافتراضية ثلاثية الأبعاد.
• توضح أهمية المعايير الفنية في تصميم المكتبة الافتراضية ثلاثية الأبعاد.
• تصوغ أهدافاً تعليمية واضحة ومحددة للمكتبة الافتراضية ثلاثية الأبعاد، مع مراعاة جميع الجوانب (المعرفية، المهارية، الوجدانية).
• تعدد أنواع المصادر الإلكترونية التي يمكن تضمينها في المكتبة الافتراضية.
• تنشئ مجلدات سحابية للموارد داخل Google Drive.
• تصمم دليل المستخدم للمكتبة الافتراضية ثلاثية الأبعاد.`
  },
  4: {
    goal: "إلمام الطالب المعلم بمهارات إنتاج المكتبات الافتراضية ثلاثية الأبعاد.",
    objectives: `يتوقع بعد انتهائك عزيزي الطالب من دراسة هذا الموضوع أن تصبح قادراً على أن:
• تُعرف مهارات إنتاج المكتبات الافتراضية ثلاثية الأبعاد.
• تتعرف على كيفية الوصول إلى منصة Frame VR عبر محركات البحث المختلفة.
• تتمكن من تسجيل الدخول إلى منصة Frame VR.
• تختار القالب المناسب لتطوير المكتبة الافتراضية من بين الخيارات المتاحة في المنصة.
• تضيف الأثاث المناسب داخل المكتبة الافتراضية.
• تضبط الإضاءة داخل المكتبة الافتراضية بحيث تكون مريحة وجذابة بصريًا.
• تتمكن من ضبط خصائص وإعدادات المكتبة الافتراضية لتحسين وظائفها وتفاعليتها.
• تكتب نصوصًا داخل المكتبة الافتراضية بألوان واضحة يسهل قراءتها.
• تذكر مفهوم التصنيف في المكتبات وأهميته في تنظيم المعلومات.
• تضيف شاشة عرض إرشادية لكيفية الإبحار.`
  }
};

// Helper function to determine cognitive level based on score percentage
const getCognitiveLevel = (score: number | null, totalQuestions: number): CognitiveLevel => {
    if (score === null || totalQuestions === 0) return 'أساسي';
    const percentage = (score / totalQuestions) * 100;
    if (percentage <= 47) return 'أساسي';
    if (percentage <= 73) return 'متوسط';
    return 'متقدم';
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(PAGES[0]);
  const [quizActive, setQuizActive] = useState(false);
  const [showFinalQuiz, setShowFinalQuiz] = useState(false);
  
  // Global states for all users
  const [allModuleScores, setAllModuleScores] = useState<{ [email: string]: { [key: number]: { preTestScore: number | null, postTestScore: number | null, preTestTime: number | null, postTestTime: number | null } } }>({});
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(INITIAL_NEWS_ITEMS);

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
    `مرحباً بك في مسار التعلم الموحد. سنركز هنا على المفاهيم الأساسية والأساسيات التي تحتاجها لبدء رحلتك في تطوير المكتبات الافتراضية.`
  );
  
  // Initial state for goals/objectives (will be updated by useEffect)
  const [learningPathGeneralGoal, setLearningPathGeneralGoal] = useState(MODULE_DETAILS[1].goal);
  const [learningPathObjectives, setLearningPathObjectives] = useState(MODULE_DETAILS[1].objectives);
  
  // Update Learning Path Goals and Objectives when currentModuleId changes
  useEffect(() => {
    const moduleId = currentModuleId || 1;
    if (MODULE_DETAILS[moduleId]) {
      setLearningPathGeneralGoal(MODULE_DETAILS[moduleId].goal);
      setLearningPathObjectives(MODULE_DETAILS[moduleId].objectives);
    }
  }, [currentModuleId]);

  // Load global data (students, scores, groups, discussions, news) once on initial mount
  useEffect(() => {
    try {
        const savedStudentsRaw = localStorage.getItem('all_students');
        if (savedStudentsRaw) setAllStudents(JSON.parse(savedStudentsRaw));

        const savedScoresRaw = localStorage.getItem('all_module_scores');
        if (savedScoresRaw) setAllModuleScores(JSON.parse(savedScoresRaw));
        
        const allGroupsRaw = localStorage.getItem('all_groups');
        if (allGroupsRaw) setGroups(JSON.parse(allGroupsRaw));
        
        const allDiscussionsRaw = localStorage.getItem('all_discussions');
        if(allDiscussionsRaw) setDiscussions(JSON.parse(allDiscussionsRaw));

        const savedNewsRaw = localStorage.getItem('news_items');
        if (savedNewsRaw) {
            const savedNews = JSON.parse(savedNewsRaw);
            if (Array.isArray(savedNews) && savedNews.length > 0) {
                setNewsItems(savedNews);
            }
        }
    } catch (e) {
        console.error("Error loading global data", e);
    }
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
      localStorage.setItem('news_items', JSON.stringify(newsItems));
    }
  }, [allStudents, allModuleScores, groups, discussions, newsItems, user]);


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
  
  const handleUpdateNewsItem = (id: number, newTitle: string, newContent: string) => {
    setNewsItems(prevItems =>
        prevItems.map(item =>
            item.id === id ? { ...item, title: newTitle, content: newContent } : item
        )
    );
  };

  const handleAddNewsItem = () => {
    setNewsItems(prevItems => [
        {
            id: Date.now(),
            title: 'عنوان جديد',
            content: 'محتوى جديد. انقر للتعديل.',
        },
        ...prevItems,
    ]);
  };

  const handleDeleteNewsItem = (id: number) => {
    setNewsItems(prevItems => prevItems.filter(item => item.id !== id));
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

  const handleSmartContentNavigation = useCallback(() => {
    if (!user) return;
    
    const userScores = allModuleScores[user.email];
    let lastPreTestModuleId: number | null = null;
    let isPostTestCompleted = false;

    if (userScores) {
        const moduleIds = Object.keys(userScores).map(Number);
        // Find modules where preTestScore exists (is not null)
        const modulesWithPreTest = moduleIds.filter(id => 
            userScores[id] && userScores[id].preTestScore !== null && userScores[id].preTestScore !== undefined
        );
        
        if (modulesWithPreTest.length > 0) {
            lastPreTestModuleId = Math.max(...modulesWithPreTest);
            
            // Check if post test is also completed for this module
            if (userScores[lastPreTestModuleId].postTestScore !== null && userScores[lastPreTestModuleId].postTestScore !== undefined) {
                isPostTestCompleted = true;
            }
        }
    }

    if (lastPreTestModuleId !== null) {
        if (isPostTestCompleted) {
             // If post-test is done, go to Content page (Modules list)
            setCurrentPage(PageEnum.Content);
        } else {
             // If post-test is NOT done, go to Learning Path
            setCurrentModuleId(lastPreTestModuleId);
            setCurrentPage(PageEnum.LearningPath);
        }
    } else {
        // No pre-test done at all
        setCurrentPage(PageEnum.Content);
    }
  }, [user, allModuleScores]);

  const handleStartModule = useCallback((moduleId: number) => {
    setCurrentModuleId(moduleId);
    setQuizActive(true);
    setModuleLessonIndex(0);
    setModulePageIndex(0);
  }, []);

  const handleContinueModule = useCallback((moduleId: number) => {
    // Reset page index to 0 to prevent out-of-bounds errors when switching modules
    setModulePageIndex(0);
    
    // Determine the appropriate lesson to start/resume
    const completed = completedLessons[moduleId] || [];
    const lessons = moduleContent[moduleId] || [];
    let nextLessonIndex = 0;

    if (lessons.length > 0 && completed.length > 0) {
        const maxCompleted = Math.max(...completed);
        if (maxCompleted + 1 < lessons.length) {
            nextLessonIndex = maxCompleted + 1;
        }
    }
    setModuleLessonIndex(nextLessonIndex);

    setCurrentModuleId(moduleId);
    setCurrentPage(PageEnum.ModuleContent);
  }, [completedLessons]);

  const handleCompleteQuiz = useCallback((score: number, timeTaken: number) => {
    if (currentModuleId && user) {
        setAllModuleScores(prevScores => {
            const userScores = prevScores[user.email] || {};
            const updatedUserScores = {
                ...userScores,
                [currentModuleId]: {
                    ...(userScores[currentModuleId] || { preTestScore: null, postTestScore: null, preTestTime: null, postTestTime: null }),
                    preTestScore: score,
                    preTestTime: timeTaken,
                }
            };
            return {
                ...prevScores,
                [user.email]: updatedUserScores
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
            
            // Auto-unlock next module upon passing
            const nextModuleId = currentModuleId + 1;
            setUnlockedModules(prev => {
                // Check if module exists and isn't already unlocked
                if (!prev.includes(nextModuleId) && nextModuleId <= MODULES.length) {
                    return [...prev, nextModuleId].sort((a, b) => a - b);
                }
                return prev;
            });

             // Automatic Removal from Group upon passing post-test
            setGroups(currentGroups => {
                 const updatedGroups = currentGroups
                    .map(group => {
                        if (group.members.some(m => m.id === user.id)) {
                            return { ...group, members: group.members.filter(member => member.id !== user.id) };
                        }
                        return group;
                    })
                    .filter(group => group.members.length > 0); // Remove empty groups
                return updatedGroups;
            });
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
     // Automatic Group Assignment if user is not in a group
     if (user && user.email !== ADMIN_USER.email) {
        setGroups(currentGroups => {
            const userIsInGroup = currentGroups.some(g => g.members.some(m => m.id === user.id));
            
            if (userIsInGroup) {
                return currentGroups; // Already in a group, do nothing
            }

            // Determine cognitive level based on LAST active module pre-test
            let level: CognitiveLevel = 'أساسي';
            const userScores = allModuleScores[user.email];
            if (userScores) {
                 const moduleIdsWithPreTest = Object.keys(userScores)
                    .map(Number)
                    .filter(moduleId => userScores[moduleId].preTestScore !== null && userScores[moduleId].preTestScore !== undefined);
                
                if (moduleIdsWithPreTest.length > 0) {
                    const latestModuleId = Math.max(...moduleIdsWithPreTest);
                    const latestScore = userScores[latestModuleId].preTestScore;
                    const totalQuestions = quizQuestionsByModule[latestModuleId]?.length || 0;
                    level = getCognitiveLevel(latestScore, totalQuestions);
                }
            }

            const suitableGroup = currentGroups.find(g => g.level === level && g.members.length < 4);
            
            if (suitableGroup) {
                return currentGroups.map(group => 
                    group.id === suitableGroup.id 
                        ? { ...group, members: [...group.members, user] } 
                        : group
                );
            } else {
                const levelGroupsCount = currentGroups.filter(g => g.level === level).length;
                const newGroup: Group = {
                    id: `group-${Date.now()}`,
                    name: `المجموعة ${level} ${levelGroupsCount + 1}`,
                    members: [user],
                    level: level,
                };
                return [...currentGroups, newGroup];
            }
        });
     }
    setCurrentPage(PageEnum.GroupFormation);
  }, [user, allModuleScores, quizQuestionsByModule]);

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
      members: [], // Admin creates an empty group
    };
    setGroups(prev => [...prev, newGroup]);
  }, [user, groups.length]);

  const handleJoinGroup = useCallback((groupId: string) => {
    if (!user) return;
    setGroups(prev => prev.map(group => {
      if (group.id === groupId && group.members.length < 4) {
        // Prevent joining if already in another group
        if (prev.some(g => g.members.some(m => m.id === user.id))) return group;
        return { ...group, members: [...group.members, user] };
      }
      return group;
    }));
  }, [user]);

  const handleRemoveUserFromGroup = useCallback((groupId: string, userId: number) => {
    setGroups(prev => {
        const updatedGroups = prev
            .map(group => {
                if (group.id === groupId) {
                    return { ...group, members: group.members.filter(member => member.id !== userId) };
                }
                return group;
            })
            .filter(group => group.members.length > 0); // Remove group if it becomes empty
        return updatedGroups;
    });
  }, []);
  
  const handleAddUserToGroup = useCallback((groupId: string, userId?: number) => {
    setGroups(currentGroups => {
        const targetGroup = currentGroups.find(g => g.id === groupId);
        if (!targetGroup || targetGroup.members.length >= 4) {
            return currentGroups; // Group not found or full
        }
        
        // Get user to add: either passed explicitly or find first unassigned
        let userToAdd: User | undefined;
        
        if (userId) {
             userToAdd = allStudents.find(s => s.id === userId);
        } else {
             const assignedStudentIds = new Set(currentGroups.flatMap(g => g.members.map(m => m.id)));
             userToAdd = allStudents.find(s => !assignedStudentIds.has(s.id) && s.email !== ADMIN_USER.email);
        }

        if (!userToAdd) {
            alert("لا يوجد مستخدم لإضافته.");
            return currentGroups;
        }

        return currentGroups.map(group => {
            if (group.id === groupId) {
                return { ...group, members: [...group.members, userToAdd!] };
            }
            return group;
        });
    });
  }, [allStudents]);


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

  // Handle Activity File Submission
  const handleActivitySubmission = useCallback((activityId: number, file: File) => {
    if (!user) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        const newMessage: Message = {
            id: `sub-${Date.now()}`,
            groupId: 'admin-inbox', // Virtual group ID for submissions
            moduleId: currentModuleId,
            activityId,
            author: user,
            text: `قام ${user.name} برفع ملف: ${file.name}`,
            timestamp: new Date().toISOString(),
            attachment: {
                name: file.name,
                type: file.type,
                data: base64Data
            },
            isSubmission: true
        };
        
        setDiscussions(prev => [...prev, newMessage]);
        alert("تم تحميل الملف وإرساله بنجاح!");
    };
    reader.readAsDataURL(file);
  }, [user, currentModuleId]);


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
        return <NewsPage 
                    newsItems={newsItems}
                    isAdmin={isAdmin}
                    onUpdateNewsItem={handleUpdateNewsItem}
                    onAddNewsItem={handleAddNewsItem}
                    onDeleteNewsItem={handleDeleteNewsItem}
                />;
      case PageEnum.Content:
        return <ContentPage 
                    onStartModule={handleStartModule} 
                    onContinueModule={handleContinueModule}
                    unlockedModules={unlockedModules} 
                    user={user}
                    allModuleScores={allModuleScores}
                />;
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
      case PageEnum.AdminDashboard:
        return <AdminDashboardPage 
                    groups={groups}
                    allStudents={allStudents}
                    allModuleScores={allModuleScores}
                    quizQuestionsByModule={quizQuestionsByModule}
                    discussions={discussions}
                />;
      case PageEnum.LearningPath:
        const userScores = user ? allModuleScores[user.email] : null;
        let level: CognitiveLevel = 'أساسي';
        
        if (userScores) {
            const moduleIdsWithPreTest = Object.keys(userScores)
                .map(Number)
                .filter(moduleId => userScores[moduleId].preTestScore !== null && userScores[moduleId].preTestScore !== undefined);
            
            if (moduleIdsWithPreTest.length > 0) {
                const latestModuleId = Math.max(...moduleIdsWithPreTest);
                const latestScore = userScores[latestModuleId].preTestScore;
                const totalQuestionsForLatestModule = quizQuestionsByModule[latestModuleId]?.length || 0;
                level = getCognitiveLevel(latestScore, totalQuestionsForLatestModule);
            }
        }

        return <LearningPathPage 
                    onSelectTopic={handleSelectTopic} 
                    onNavigateToGroupFormation={handleNavigateToGroupFormation} 
                    isAdmin={isAdmin} 
                    description={unifiedLearningPathDescription}
                    onUpdateDescription={handleUpdateLearningPath} 
                    generalGoal={learningPathGeneralGoal}
                    onUpdateGeneralGoal={setLearningPathGeneralGoal}
                    objectives={learningPathObjectives}
                    onUpdateObjectives={setLearningPathObjectives}
                    level={level}
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
                    onRemoveUserFromGroup={handleRemoveUserFromGroup}
                    onAddUserToGroup={handleAddUserToGroup}
                    isAdmin={isAdmin}
                    allUsers={allStudents} 
                />;
      case PageEnum.Activity:
        const activityModuleScores = (user && currentModuleId) ? allModuleScores[user.email]?.[currentModuleId] : null;
        const questions = currentModuleId ? quizQuestionsByModule[currentModuleId] || [] : [];
        const passingScore = Math.ceil(questions.length * 0.8);
        
        // Check if the user passed the final quiz (Post-Test)
        const isPostTestPassed = activityModuleScores?.postTestScore !== null && 
                                 activityModuleScores?.postTestScore !== undefined && 
                                 activityModuleScores.postTestScore >= passingScore;

        return <ActivityPage 
                  onStartFinalQuiz={handleStartFinalQuiz} 
                  onStartActivity={handleStartActivity} 
                  currentModuleId={currentModuleId}
                  isPostTestCompleted={isPostTestPassed}
                  onNavigateToModuleContent={handleNavigateToModuleContent}
                  isAdmin={isAdmin}
                  onSubmitActivity={handleActivitySubmission}
                />;
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
      onSmartContentNavigation={handleSmartContentNavigation}
    >
      {renderPage()}
    </DashboardLayout>
    
  );
  
};



export default App;

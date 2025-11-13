export enum Page {
  Home = 'الرئيسية',
  Instructions = 'التعليمات',
  News = 'الأخبار',
  Description = 'التوصيف',
  Content = 'المحتوى',
  Tools = 'الأدوات',
  Goals = 'الأهداف',
  Quizzes = 'الاختبارات',
  Profile = 'الصفحة الشخصية',
  Contact = 'اتصل بنا',
  Inbox = 'البريد الوارد',
  AdminDashboard = 'لوحة تحكم الباحثة',
  LearningPath = 'مسار التعلم',
  LearningPathDetail = 'تفاصيل مسار التعلم',
  ModuleContent = 'محتوى الموديول',
  Activity = 'النشاط',
  GroupFormation = 'تكوين المجموعات',
  CollaborativeLearning = 'التعليم التشاركي',
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
}

export interface Message {
  id: string;
  groupId: string;
  moduleId: number;
  activityId: number;
  author: User;
  text: string;
  timestamp: string;
}
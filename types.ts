
export enum Page {
  Home = 'الرئيسية',
  Instructions = 'التعليمات',
  News = 'الأخبار',
  Content = 'المحتوى',
  Goals = 'الأهداف',
  Profile = 'الصفحة الشخصية',
  Contact = 'اتصل بنا',
  AdminDashboard = 'لوحة تحكم الباحثة',
  LearningPath = 'مسار التعلم المخصص لك',
  LearningPathDetail = 'تفاصيل مسار التعلم',
  ModuleContent = 'محتوى الموديول',
  Activity = 'النشاط',
  GroupFormation = 'تكوين المجموعات',
  CollaborativeLearning = 'التعليم التشاركي',
  ModuleQuiz = 'الاختبار القبلي',
  FinalQuiz = 'الاختبار البعدي',
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export type CognitiveLevel = 'أساسي' | 'متوسط' | 'متقدم';

export interface Group {
  id: string;
  name: string;
  members: User[];
  level?: CognitiveLevel;
}

export interface Attachment {
  name: string;
  type: string;
  data: string; // Base64 Data URI
}

export interface Message {
  id: string;
  groupId: string;
  moduleId: number | null;
  activityId: number;
  author: User;
  text: string;
  timestamp: string;
  attachment?: Attachment;
  isSubmission?: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
}
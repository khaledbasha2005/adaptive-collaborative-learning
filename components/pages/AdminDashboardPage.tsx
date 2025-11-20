
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { User, Group, Message } from '../../types';
import { ADMIN_USER_EMAIL } from '../../constants';

interface Question {
  questionText: string;
  answerOptions: any[];
}
interface QuizQuestionsByModule {
    [key: number]: Question[];
}

interface AdminDashboardPageProps {
  groups: Group[];
  allStudents: User[];
  allModuleScores: { [email: string]: { [key: number]: { preTestScore: number | null, postTestScore: number | null, preTestTime: number | null, postTestTime: number | null } } };
  quizQuestionsByModule: QuizQuestionsByModule;
  discussions?: Message[];
}

const getCognitiveLevel = (score: number | null, totalQuestions: number): string => {
  if (score === null || score === undefined || totalQuestions === 0) return 'لم يحدد بعد';
  
  const percentage = (score / totalQuestions) * 100;

  if (percentage <= 47) return 'مبتدئ';
  if (percentage <= 73) return 'متوسط';
  return 'متقدم';
};


const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ groups, allStudents, allModuleScores, quizQuestionsByModule, discussions = [] }) => {
    
    const totalQuestionsForModule1 = quizQuestionsByModule[1]?.length || 0;

    // 1. Calculate stats for "عدد المجموعات حسب المستوى المعرفي"
    const groupLevels: { [key: string]: number } = { 'مبتدئ': 0, 'متوسط': 0, 'متقدم': 0, 'لم يحدد بعد': 0 };

    groups.forEach(group => {
        let totalScore = 0;
        let membersWithScores = 0;
        
        // Filter out the admin before calculating group scores
        const studentMembers = group.members.filter(member => member.email !== ADMIN_USER_EMAIL);

        studentMembers.forEach(member => {
            const scores = allModuleScores[member.email];
            const preTestScore = scores && scores[1] ? scores[1].preTestScore : null;
            if (preTestScore !== null) {
                totalScore += preTestScore;
                membersWithScores++;
            }
        });

        if (membersWithScores > 0) {
            const avgScore = totalScore / membersWithScores;
            const level = getCognitiveLevel(avgScore, totalQuestionsForModule1);
            groupLevels[level]++;
        } else if (studentMembers.length > 0) { // Only count groups that have actual students
            groupLevels['لم يحدد بعد']++;
        }
    });

    const groupLevelData = [
        { name: 'مبتدئ', 'عدد المجموعات': groupLevels['مبتدئ'], fill: '#3b82f6' },
        { name: 'متوسط', 'عدد المجموعات': groupLevels['متوسط'], fill: '#ef4444' },
        { name: 'متقدم', 'عدد المجموعات': groupLevels['متقدم'], fill: '#22c55e' },
    ];

    // 2. Prepare data for "المسار التعليمي" for every student
    const studentsToList = allStudents
      .filter(s => s.email !== ADMIN_USER_EMAIL)
      .map(student => {
        const studentScores = allModuleScores[student.email];
        const preTestScore = studentScores && studentScores[1] ? studentScores[1].preTestScore : null;
        const level = getCognitiveLevel(preTestScore, totalQuestionsForModule1);
        
        return {
          ...student,
          level,
          preTestScore,
        };
    });

    // 3. Filter for Submissions
    const submissions = discussions.filter(msg => msg.isSubmission);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">لوحة تحكم الباحثة - تحليلات الطلاب والمجموعات</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 mb-8">
        {/* Chart for Group Cognitive Level */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
          <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-4">عدد المجموعات حسب المستوى المعرفي</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupLevelData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip wrapperClassName="bg-white p-2 border rounded-md" />
              <Legend />
              <Bar dataKey="عدد المجموعات" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table for student learning paths */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
            <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-4">المسارات التعليمية للطلاب</h2>
            <div className="overflow-y-auto h-[300px]">
                {studentsToList.length > 0 ? (
                  <>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      {studentsToList.map(student => (
                        <div key={student.id} className="bg-gray-50 p-3 rounded-lg">
                           <p className="font-bold text-gray-800">{student.name}</p>
                           <div className="text-sm text-gray-600 mt-1">
                             <p>المسار: <span className="font-semibold text-blue-600">{student.level}</span></p>
                             <p>درجة الاختبار: <span className="font-semibold text-red-600">{student.preTestScore !== null ? `${student.preTestScore} / ${totalQuestionsForModule1}` : 'N/A'}</span></p>
                           </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table View */}
                    <table className="min-w-full bg-white hidden md:table">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr>
                                <th className="text-right py-3 px-4 font-semibold text-sm">اسم الطالب</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">المسار (المستوى)</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">درجة الاختبار القبلي</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {studentsToList.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{student.name}</td>
                                    <td className="py-3 px-4">{student.level}</td>
                                    <td className="py-3 px-4">
                                        {student.preTestScore !== null ? `${student.preTestScore} / ${totalQuestionsForModule1}` : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </>
                ) : (
                    <p className="text-center text-gray-500 py-4">لا يوجد طلاب مسجلون لعرض بياناتهم.</p>
                )}
            </div>
        </div>
      </div>

      {/* Activity Submissions Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
          <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-4">تسليمات الأنشطة الطلابية (الملفات المحملة)</h2>
          <div className="overflow-y-auto h-[300px]">
              {submissions.length > 0 ? (
                  <table className="min-w-full bg-white">
                      <thead className="bg-gray-100 sticky top-0">
                          <tr>
                              <th className="text-right py-3 px-4 font-semibold text-sm">اسم الطالب</th>
                              <th className="text-right py-3 px-4 font-semibold text-sm">النشاط</th>
                              <th className="text-right py-3 px-4 font-semibold text-sm">اسم الملف</th>
                              <th className="text-right py-3 px-4 font-semibold text-sm">تاريخ التسليم</th>
                              <th className="text-center py-3 px-4 font-semibold text-sm">تحميل</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                          {submissions.map(sub => (
                              <tr key={sub.id} className="hover:bg-gray-50">
                                  <td className="py-3 px-4 flex items-center gap-2">
                                      <img src={sub.author.avatar} className="w-6 h-6 rounded-full" alt="avatar" />
                                      {sub.author.name}
                                  </td>
                                  <td className="py-3 px-4">
                                      موديول {sub.moduleId} - نشاط {sub.activityId}
                                  </td>
                                  <td className="py-3 px-4 text-gray-600">
                                      {sub.attachment?.name}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-500">
                                      {new Date(sub.timestamp).toLocaleDateString('ar-EG')} {new Date(sub.timestamp).toLocaleTimeString('ar-EG')}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                      {sub.attachment && (
                                          <a 
                                            href={sub.attachment.data} 
                                            download={sub.attachment.name}
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded transition"
                                          >
                                              تنزيل
                                          </a>
                                      )}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              ) : (
                  <p className="text-center text-gray-500 py-4">لا توجد تسليمات حتى الآن.</p>
              )}
          </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;

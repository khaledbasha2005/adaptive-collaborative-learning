
import React, { useState } from 'react';
import type { User, Group } from '../../types';
import { MODULES, ADMIN_USER_EMAIL } from '../../constants';

interface Question {
  questionText: string;
  answerOptions: any[];
}
interface QuizQuestionsByModule {
    [key: number]: Question[];
}

interface ProfilePageProps {
    user: User;
    allModuleScores: { [email: string]: { [key: number]: { preTestScore: number | null, postTestScore: number | null, preTestTime: number | null, postTestTime: number | null } } };
    quizQuestionsByModule: QuizQuestionsByModule;
    isAdmin: boolean;
    allStudents: User[];
    groups: Group[];
}

const StudentProfileView: React.FC<{ student: User, scores: { [key: number]: any }, quizQuestionsByModule: QuizQuestionsByModule, groups: Group[] }> = ({ student, scores, quizQuestionsByModule, groups }) => {
    const formatTime = (totalSeconds: number | null) => {
        if (totalSeconds === null || totalSeconds === undefined) return '---';
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const studentGroup = groups.find(g => g.members.some(m => m.id === student.id));

    return (
        <>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-right">
                    <img src={student.avatar} alt="صورة الطالب" className="w-24 h-24 rounded-full mr-0 sm:mr-6 mb-4 sm:mb-0 border-4 border-blue-500" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
                        <p className="text-gray-600">{student.email}</p>
                        <p className="text-sm text-blue-600 font-semibold mt-1">نمط التعلم: تشاركي</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-green-600 mb-4 border-b pb-2">الدرجات والتقدم</h3>
                <div className="space-y-4">
                    {MODULES.map(module => {
                        const moduleScoresData = scores[module.id] || { preTestScore: null, postTestScore: null, preTestTime: null, postTestTime: null };
                        const totalQuestions = quizQuestionsByModule[module.id]?.length || 0;
                        const renderScore = (score: number | null) => {
                            if (score === null || totalQuestions === 0) return 'لم يتم';
                            return `${Math.round((score / totalQuestions) * 100)}% (${score}/${totalQuestions})`;
                        };

                        return (
                            <React.Fragment key={module.id}>
                                <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
                                    <div>
                                        <p className="font-semibold">الاختبار القبلي - {module.title}</p>
                                        <p className="text-sm text-gray-500">الزمن المستغرق: {formatTime(moduleScoresData.preTestTime)}</p>
                                    </div>
                                    <p className="font-bold text-lg text-red-500">
                                        {renderScore(moduleScoresData.preTestScore)}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
                                    <div>
                                        <p className="font-semibold">الاختبار البعدي - {module.title}</p>
                                        <p className="text-sm text-gray-500">الزمن المستغرق: {formatTime(moduleScoresData.postTestTime)}</p>
                                    </div>
                                    <p className="font-bold text-lg text-red-500">
                                        {renderScore(moduleScoresData.postTestScore)}
                                    </p>
                                </div>
                            </React.Fragment>
                        );
                    })}
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
                        <div>
                            <p className="font-semibold">الاختبار التحصيلي</p>
                            <p className="text-sm text-gray-500">الزمن: 30 دقيقة</p>
                        </div>
                        <p className="font-bold text-lg text-red-500">(قيد التقدم)</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-blue-600 mb-4 border-b pb-2">المجموعة التشاركية</h3>
                {studentGroup ? (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-semibold text-gray-700">اسم المجموعة:</p>
                            <p className="font-bold text-lg text-gray-800 bg-blue-100 px-3 py-1 rounded-full">{studentGroup.name}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700 mb-2">الزملاء في المجموعة:</p>
                            {studentGroup.members.filter(m => m.id !== student.id).length > 0 ? (
                                <ul className="space-y-2">
                                    {studentGroup.members.filter(m => m.id !== student.id).map(member => (
                                        <li key={member.id} className="text-gray-700 flex items-center bg-gray-100 p-2 rounded-lg">
                                            <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full ml-3" />
                                            <span>{member.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">أنت العضو الوحيد في هذه المجموعة حاليًا.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-4">لم ينضم الطالب إلى مجموعة بعد.</p>
                )}
            </div>
        </>
    );
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user, allModuleScores, quizQuestionsByModule, isAdmin, allStudents, groups }) => {
    const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

    const handleViewStudent = (student: User) => {
        setSelectedStudent(student);
    };

    const handleBackToList = () => {
        setSelectedStudent(null);
    };

    if (isAdmin) {
        if (selectedStudent) {
            return (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-red-600">الصفحة الشخصية للطالب: {selectedStudent.name}</h1>
                        <button onClick={handleBackToList} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
                            العودة
                        </button>
                    </div>
                    <StudentProfileView
                        student={selectedStudent}
                        scores={allModuleScores[selectedStudent.email] || {}}
                        quizQuestionsByModule={quizQuestionsByModule}
                        groups={groups}
                    />
                </div>
            );
        }

        const studentsToList = allStudents.filter(s => s.email !== ADMIN_USER_EMAIL);

        return (
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-6">قائمة الطلاب المسجلين</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-green-600 mb-4 border-b pb-2">اسماء الطلاب</h3>
                    {studentsToList.length > 0 ? (
                    <>
                        {/* Mobile View: Cards */}
                        <div className="md:hidden space-y-4">
                            {studentsToList.map(student => {
                                const studentGroup = groups.find(g => g.members.some(m => m.id === student.id));
                                const groupMates = studentGroup ? studentGroup.members.filter(m => m.id !== student.id).map(m => m.name).join(', ') : 'لا يوجد';
                                return (
                                     <div key={student.id} className="bg-gray-50 p-4 rounded-lg shadow">
                                        <div className="flex items-center mb-3">
                                            <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full ml-3" />
                                            <span className="font-bold text-gray-800">{student.name}</span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600 border-t pt-3 mt-3">
                                            <p><span className="font-semibold text-gray-700">المجموعة:</span> {studentGroup ? studentGroup.name : 'لم ينضم بعد'}</p>
                                            <p><span className="font-semibold text-gray-700">الزملاء:</span> {groupMates}</p>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <button onClick={() => handleViewStudent(student)} className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded-lg transition">
                                                عرض التفاصيل
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="overflow-x-auto hidden md:block">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-right py-3 px-4 font-semibold text-sm">اسم الطالب</th>
                                        <th className="text-right py-3 px-4 font-semibold text-sm">المجموعة</th>
                                        <th className="text-right py-3 px-4 font-semibold text-sm">الزملاء في المجموعة</th>
                                        <th className="text-center py-3 px-4 font-semibold text-sm">الإجراء</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsToList.map(student => {
                                        const studentGroup = groups.find(g => g.members.some(m => m.id === student.id));
                                        const groupMates = studentGroup ? studentGroup.members.filter(m => m.id !== student.id).map(m => m.name).join(', ') : 'لا يوجد';
                                        return (
                                            <tr key={student.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4 flex items-center">
                                                    <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full ml-3" />
                                                    {student.name}
                                                </td>
                                                <td className="py-3 px-4">{studentGroup ? studentGroup.name : 'لم ينضم لمجموعة'}</td>
                                                <td className="py-3 px-4">{groupMates}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <button onClick={() => handleViewStudent(student)} className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded-lg transition">
                                                        عرض التفاصيل
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                    ) : (
                        <p className="text-center text-gray-500 py-4">لا يوجد طلاب مسجلون بعد.</p>
                    )}
                </div>
            </div>
        );
    }

    // Default view for regular student
    return (
        <div>
            <h1 className="text-3xl font-bold text-red-600 mb-6">الصفحة الشخصية للطالب</h1>
            <StudentProfileView
                student={user}
                scores={allModuleScores[user.email] || {}}
                quizQuestionsByModule={quizQuestionsByModule}
                groups={groups}
            />
        </div>
    );
};

export default ProfilePage;
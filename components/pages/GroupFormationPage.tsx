import React from 'react';
import type { User, Group } from '../../types';

interface GroupFormationPageProps {
  onNavigateToModuleContent: () => void;
  user: User;
  groups: Group[];
  onCreateGroup: () => void;
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
}

const GroupFormationPage: React.FC<GroupFormationPageProps> = ({ 
  onNavigateToModuleContent,
  user,
  groups,
  onCreateGroup,
  onJoinGroup,
  onLeaveGroup
}) => {
  const userGroup = groups.find(group => group.members.some(member => member.id === user.id));
  const canJoinGroup = !userGroup;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">تكوين المجموعات التشاركية</h1>
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-blue-700">خطوات تكوين المجموعة</h2>
          <button 
            onClick={onCreateGroup} 
            disabled={!canJoinGroup}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            انشاء مجموعة جديدة
          </button>
        </div>
        
        {userGroup && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md mb-6">
                أنت حاليًا في <span className="font-bold">{userGroup.name}</span>. يمكنك الآن الانتقال إلى محتوى الموديول.
            </div>
        )}

        <div className="space-y-4">
          {groups.length === 0 ? (
            <p className="text-center text-gray-500 py-8">لا توجد مجموعات حاليًا. كن أول من ينشئ مجموعة!</p>
          ) : (
            groups.map(group => (
              <div key={group.id} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{group.name}</h3>
                    <p className="text-sm text-gray-600">{group.members.length} / 4 أعضاء</p>
                  </div>
                  {userGroup?.id === group.id ? (
                     <button onClick={() => onLeaveGroup(group.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition">
                       مغادرة
                     </button>
                  ) : canJoinGroup && group.members.length < 4 ? (
                     <button onClick={() => onJoinGroup(group.id)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition">
                       انضمام
                     </button>
                  ) : (
                    <button disabled className="bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-lg cursor-not-allowed">
                       {group.members.length >= 4 ? 'ممتلئة' : 'لا يمكن الانضمام'}
                    </button>
                  )}
                </div>
                <div className="mt-4 border-t pt-2">
                  <h4 className="text-sm font-semibold mb-2">الأعضاء:</h4>
                  <ul className="flex flex-wrap gap-2">
                    {group.members.map(member => (
                      <li key={member.id} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm">
                        <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full ml-2" />
                        {member.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={onNavigateToModuleContent}
            disabled={!userGroup}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            الانتقال إلى محتوى الموديول
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupFormationPage;

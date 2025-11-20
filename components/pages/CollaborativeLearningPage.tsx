import React, { useState, useEffect, useRef } from 'react';
import type { User, Group, Message } from '../../types';

interface CollaborativeLearningPageProps {
  activityId: number | null;
  moduleId: number | null;
  onBack: () => void;
  user: User;
  groups: Group[];
  discussions: Message[];
  onSendMessage: (activityId: number, text: string) => void;
}

const CollaborativeLearningPage: React.FC<CollaborativeLearningPageProps> = ({ 
  activityId, 
  moduleId,
  onBack, 
  user, 
  groups,
  discussions,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const userGroup = groups.find(g => g.members.some(m => m.id === user.id));
  
  const currentDiscussion = discussions.filter(
    msg => msg.groupId === userGroup?.id && msg.moduleId === moduleId && msg.activityId === activityId
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentDiscussion]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (activityId && newMessage.trim()) {
      onSendMessage(activityId, newMessage);
      setNewMessage('');
    }
  };

  if (!activityId || !moduleId) {
    return <div>نشاط غير محدد.</div>;
  }

  if (!userGroup) {
      return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600">خطأ</h2>
            <p className="text-gray-700 mt-2">يجب أن تكون عضوًا في مجموعة للمشاركة في هذا النشاط.</p>
        </div>
      );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          التعليم التشاركي - النشاط {activityId}
        </h1>
        <button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          العودة إلى الأنشطة
        </button>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg flex flex-col h-[75vh]">
        <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-4 border-b pb-2">
          مناقشة المجموعة: <span className="text-red-600">{userGroup.name}</span>
        </h2>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 rounded-lg space-y-4">
          {currentDiscussion.length === 0 ? (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">لا توجد رسائل بعد. كن أول من يبدأ النقاش!</p>
            </div>
          ) : (
            currentDiscussion.map(msg => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.author.id === user.id ? 'flex-row-reverse' : ''}`}>
                <img src={msg.author.avatar} alt={msg.author.name} className="w-10 h-10 rounded-full" />
                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.author.id === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  <p className="font-bold text-sm mb-1">{msg.author.id === user.id ? 'أنا' : msg.author.name}</p>
                  <p className="break-words">{msg.text}</p>
                   <p className={`text-xs mt-1 opacity-75 ${msg.author.id === user.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                   </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition">
            إرسال
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollaborativeLearningPage;
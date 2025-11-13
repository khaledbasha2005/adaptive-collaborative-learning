
import React from 'react';
import { NEWS_ITEMS } from '../../constants';

const NewsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">آخر الأخبار</h1>
      <div className="space-y-6">
        {NEWS_ITEMS.map(item => (
          <div key={item.id} className="bg-blue-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-2">{item.title}</h2>
            <p className="text-blue-200">{item.content}</p>
            <div className="text-right mt-4">
                <button className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition">
                    قراءة المزيد
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;

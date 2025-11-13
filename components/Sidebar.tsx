
import React from 'react';
import type { User, Page } from '../types';
import { Page as PageEnum } from '../types';
import { PAGES, ADMIN_USER } from '../constants';
import { ICONS } from './icons';

interface SidebarProps {
  user: User;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  finalQuizPassed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ user, currentPage, setCurrentPage, finalQuizPassed }) => {
  const visiblePages = PAGES.filter(
    page => {
      if (page === PageEnum.Activity && !finalQuizPassed) return false;
      if (page === PageEnum.AdminDashboard && user.email !== ADMIN_USER.email) return false;
      return true;
    }
  );

  return (
    <div className="w-64 bg-blue-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-blue-700">
        القائمة الرئيسية
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {visiblePages.map((page) => {
          const Icon = ICONS[page] || ICONS['الرئيسية'];
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-full flex items-center px-4 py-3 text-right text-base font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-900 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 ml-3" />
              <span>{page}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
import React from 'react';
import type { User, Page } from '../types';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  user: User;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
  children: React.ReactNode;
  finalQuizPassed: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, currentPage, setCurrentPage, onLogout, children, finalQuizPassed }) => {
  return (
    <div className="h-screen flex bg-gray-100 font-sans">
      <Sidebar user={user} currentPage={currentPage} setCurrentPage={setCurrentPage} finalQuizPassed={finalQuizPassed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={onLogout} setCurrentPage={setCurrentPage} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
import React, { useState } from 'react';
import type { User, Page } from '../types';
import { Page as PageEnum } from '../types';
import UniversityLogo from './UniversityLogo';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, setCurrentPage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-gray-200 shadow-md">
      <div className="flex items-center">
        <UniversityLogo className="h-10 w-auto" />
      </div>

      <div className="flex items-center relative">
        <span className="text-gray-700 text-sm font-semibold mr-4">مرحباً, {user.name}</span>
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="relative z-10 block h-10 w-10 rounded-full overflow-hidden border-2 border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500">
          <img className="h-full w-full object-cover" src={user.avatar} alt="صورة المستخدم" />
        </button>

        {dropdownOpen && (
          <>
            <button onClick={() => setDropdownOpen(false)} tabIndex={-1} className="fixed inset-0 h-full w-full bg-black opacity-50 cursor-default z-10"></button>
            <div className="absolute w-48 bg-white rounded-lg shadow-xl mt-2 top-full left-0 z-20">
              <button onClick={() => handleNavigate(PageEnum.Profile)} className="w-full text-right block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
                صفحتي الشخصية
              </button>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">طلب المساعدة</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">البريد الوارد</a>
              <div className="border-t border-gray-200"></div>
              <button onClick={onLogout} className="w-full text-right block px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white">
                تسجيل الخروج
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
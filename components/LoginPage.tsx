import React, { useState } from 'react';
import type { User } from '../types';
import { MOCK_USER, ADMIN_USER } from '../constants';
import UniversityLogo from './UniversityLogo';
import { loginUser } from "../src/authservice";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/firebase";
import { sendData } from '@/src/apiservice';



interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email === ADMIN_USER.email && password === '12345678') {
      onLogin(ADMIN_USER);
      return;
    }
     try {
    const token = await loginUser(email, password);  // Firebase Auth
    console.log("User Token:", token);

    // بعد تسجيل الدخول الناجح، نقدر نبني user object للـ onLogin
    const loggedInUser: User = {
      id: Date.now(),   // ممكن نستخدم UID من Firebase لو حبينا
      name: email.split("@")[0],  // مثال: اسم المستخدم من الإيميل
      email,
      avatar: "https://picsum.photos/seed/${Date.now()}/100/100",
    };

    onLogin(loggedInUser);
  } catch (err) {
    setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    console.error(err);
  }
};
  
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

  if (!name || !email || !password) {
    setError("يرجى ملء جميع الحقول");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    const newUser: User = {
      id: Date.now(),   // أو userCredential.user.uid
      name,
      email,
      avatar: 'https://picsum.photos/seed/${Date.now()}/100/100',
    };

    onLogin(newUser);
    await sendData (newUser);
  } catch (err) {
    setError("حدث خطأ أثناء إنشاء الحساب");
    console.error(err);
  }
};


  const toggleView = () => {
    resetForm();
    setIsLoginView(!isLoginView);
  }

  const backgroundStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
    backgroundColor: '#f8fafc',
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center bg-cover bg-center" style={backgroundStyle}>
      <div className="relative z-10 w-full max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 text-gray-800">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center w-full mb-4">
             <UniversityLogo className="h-24" />
          </div>
          <h1 className="text-4xl font-bold text-red-500">بيئة التعلم التكيفية التشاركية</h1>
          <p className="text-lg mt-2 text-gray-600">مرحبًا بك في بيئة التعلم المستقبلية</p>
        </div>
        
        <div className="p-8 bg-blue-800 rounded-lg text-white">
          {isLoginView ? (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">تسجيل الدخول</h2>
              {error && <p className="text-red-300 bg-red-800/50 p-3 rounded-md text-center mb-4">{error}</p>}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-blue-100">البريد الإلكتروني</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="student@example.com"
                    className="w-full px-4 py-2 bg-white text-black border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div>
                  <label htmlFor="password"  className="block text-sm font-medium mb-1 text-blue-100">كلمة المرور</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-white text-black border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  الدخول
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">إنشاء حساب جديد</h2>
              {error && <p className="text-red-300 bg-red-800/50 p-3 rounded-md text-center mb-4">{error}</p>}
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1 text-blue-100">الاسم الكامل</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="الاسم الكامل"
                    className="w-full px-4 py-2 bg-white text-black border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-blue-100">البريد الإلكتروني</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="example@example.com"
                    className="w-full px-4 py-2 bg-white text-black border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div>
                  <label htmlFor="password"  className="block text-sm font-medium mb-1 text-blue-100">كلمة المرور</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-white text-black border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  إنشاء حساب
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <button onClick={toggleView} className="text-sm text-blue-200 hover:text-white hover:underline">
              {isLoginView ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'لديك حساب بالفعل؟ تسجيل الدخول'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;  
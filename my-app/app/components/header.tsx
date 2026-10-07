'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface UserData {
  h_id: number;
  ovog: string;
  ner: string;
  gmail: string;
  utas: string;
  h_role: 'admin' | 'user';
}

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3002/auth/me', {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Not authorized');
        }

        const data: UserData = await res.json();
        setUser(data);
      } catch (err) {
        console.warn('[auth/me error]', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:3002/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    window.location.href = '/';
  };

  const isLoggedIn = !!user;

  return (
    <header className="bg-blue-950 text-white h-[100px] w-full shadow-md">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <Link href="/" className="font-bold text-xl leading-tight">AgriMN</Link>
            {!loading && (
              <span className="text-sm font-extralight leading-tight">
                {isLoggedIn ? `Тавтай морил, ${user?.ner}` : 'Сайн байна уу'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!loading && !isLoggedIn ? (
            <>
              <Link href="/login">
                <button className="bg-white hover:bg-blue-400 hover:text-white text-black font-light rounded-lg px-5 py-1">
                  Нэвтрэх
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-white hover:bg-blue-400 hover:text-white text-black font-light rounded-lg px-5 py-1">
                  Бүртгүүлэх
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-white hover:bg-red-500 hover:text-white text-black font-light rounded-lg px-5 py-1"
            >
              Гарах
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

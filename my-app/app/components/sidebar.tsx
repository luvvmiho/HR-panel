'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch('http://localhost:3002/auth/me', {
          credentials: 'include',
        });

        const data = await res.json();
        console.log('[auth/me response]', data);

        if (res.ok && data.h_role) {
          setRole(data.h_role);
        } else {
          setRole('guest');
        }
      } catch (err) {
        console.warn('[auth/me error]', err);
        setRole('guest');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) {
    return (
      <div className="left-0 w-[20%] h-[calc(100vh-2rem)] bg-blue-950 text-white shadow-lg flex items-center justify-center">
        <p className="text-sm text-gray-400">Уншиж байна...</p>
      </div>
    );
  }

  return (
    <div className="w-[20%] min-h-screen bg-blue-950 text-white shadow-lg overflow-y-auto">


      <hr className="border-blue-900 border-2" />

      <nav className="flex flex-col p-4 space-y-4">
        {role === 'guest' && (
          <p className="font-bold">Та эхлээд нэвтэрнэ үү.</p>
        )}

        {(role === 'user' || role === 'admin') && (
          <>
            <Link href="/" className="hover:bg-gray-700 p-2 rounded">
              Нүүр
            </Link>
            <Link href="/about" className="hover:bg-gray-700 p-2 rounded">
              Бидний тухай
            </Link>
            <Link href="/advertisement" className="hover:bg-gray-700 p-2 rounded">
              Зарууд
            </Link>
            <Link href="/weather" className="hover:bg-gray-700 p-2 rounded">
              Цаг агаар
            </Link>
            <Link href="/userTimeReg" className="hover:bg-gray-700 p-2 rounded">
              Цаг Бүртгэл
            </Link>
          </>
        )}

        {role === 'admin' && (
          <>
            <hr className="border-blue-900" />
            <p className="text-xs uppercase text-gray-400">Админ</p>
            <Link href="/users" className="hover:bg-gray-700 p-2 rounded">
              Хэрэглэгч засах
            </Link>
            <Link href="/timeRegistration" className="hover:bg-gray-700 p-2 rounded">
              Цаг бүртгэлийн тайлан
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notification } from 'antd';

export default function LoginPage() {
  const [gmail, setGmail] = useState('');
  const [nuutsUg, setNuutsUg] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:3002/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ gmail, nuutsUg }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      const data = await res.json();
      setSuccess(`Амжилттай нэвтэрлээ (${data.role})`);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Алдаа гарлаа');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gray-100 ">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
        <h2 className="text-xl text-center font-bold">Нэвтрэх</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <p>Мэйл хаяг</p>
        <input
          type="text"
          placeholder="Мэйл хаягаа оруулна уу"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
          className="w-full border px-3 p-2 rounded"
          required
        />
        <p>Нууц үг</p>
        <input
          type="password"
          placeholder="Нууц үг"
          value={nuutsUg}
          onChange={(e) => setNuutsUg(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <p className="text-right text-sm text-blue-600 hover:underline cursor-pointer"
          onClick={() => router.push('/resetPassword')}>
          Нууц үг сэргээх?
        </p>


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Нэвтрэх
        </button>

      </form>
    </div>
  );
}

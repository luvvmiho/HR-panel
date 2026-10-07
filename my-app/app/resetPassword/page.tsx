'use client';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch('http://localhost:3002/auth/reset-password-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setMessage('Нууц үг сэргээх холбоос илгээгдлээ. Мэйлээ шалгана уу.');
    } else {
      setMessage('Алдаа гарлаа. Дахин оролдоно уу.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
      <form onSubmit={handleReset} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Нууц үг сэргээх</h2>
        <input
          type="email"
          placeholder="Мэйл хаяг"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Илгээх
        </button>
        {message && <p className="text-center text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
}

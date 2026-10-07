'use client';
import { useState } from 'react';
import {useRouter} from 'next/navigation';

export default function SignUp() {
  const [ner, setNer] = useState('');
  const [nuutsUg, setNuutsUg] = useState('');
  const [error, setError] = useState('');
  const [utas, setUtas] = useState('');
  const [ovog, setOvog] = useState('');
  const [gmail, setGmail] = useState('');
  const router = useRouter();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); 
  setError('');

  const res = await fetch('http://localhost:3002/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ovog, ner, gmail, utas, nuutsUg }),
  });

  const text = await res.text();
  const data = JSON.parse(text);

  if (!res.ok || data.message.includes('аль хэдийн')) {
    setError(data.message);
    return;
  }
  setTimeout(() => {
    router.push('/login');
  }, 500);
  setNer('');
  setOvog('');
  setGmail('');
  setNuutsUg('');
  setUtas('');
};
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
        <h2 className="text-xl font-bold">Бүртгүүлэх</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <p>Овог</p>
         <input
          type="text"
          placeholder="Овог"
          value={ovog}
          onChange={(e) => setOvog(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <p>Нэр</p>
        <input
          type="text"
          placeholder="Нэр"
          value={ner}
          onChange={(e) => setNer(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <p>Мэйл хаяг</p>
        <input
          type="text"
          placeholder="Мэйл хаяг"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          
        />
       <p>Утасны дугаар</p> 
          <input
          type="text"
          placeholder="Утасны дугаар"
          value={utas}
          onChange={(e) => setUtas(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <p>Нууц үг</p>
        <input
          type="password"
          placeholder="Нууц үг"
          value={nuutsUg}
          onChange={(e) => setNuutsUg(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Ок
        </button>
      </form>
    </div>
  );
}

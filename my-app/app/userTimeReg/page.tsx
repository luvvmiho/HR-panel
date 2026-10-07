'use client';
import React, { useEffect, useState } from 'react';
import TotalTime from '../components/totalTime';

interface UserType {
  h_id: number;
  ovog: string;
  ner: string;
  utas: string;
  h_role: 'admin' | 'user';
}

interface AttendanceType {
  id: number;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  user: UserType;
}

export default function UserTimeReg() {
  const [attendanceData, setAttendanceData] = useState<AttendanceType[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [report, setReport] = useState({ totalWeekdays: 0, workedDays: 0, totalMinutes: 0, lateMinutes: 0 });
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const fetchLoggedInUser = async () => {
    try {
      const res = await fetch('http://localhost:3002/auth/me', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch user');
      const user = await res.json();
      setLoggedInUser(user);
      return user;
    } catch (err) {
      console.error('Error fetching logged in user:', err);
      return null;
    }
  };

  const fetchAllAttendanceByUser = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:3002/attendance/user/${userId}/report`, {
        credentials: 'include',
      });
      const records = await res.json();
      setAttendanceData(records);
      calculateMonthlyReport(records);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const calculateMonthlyReport = (records: AttendanceType[]) => {
    const month = selectedMonth;
    const year = selectedYear;
    if (![4, 5, 6].includes(month)) return; 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let totalWeekdays = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      if (date.getDay() >= 1 && date.getDay() <= 5) totalWeekdays++;
    }

    let workedDays = 0;
    let totalMinutes = 0;
    let lateMinutes = 0;

    records.forEach(({ date, checkInTime, checkOutTime }) => {
      const d = new Date(date);
      if (d.getMonth() !== month || d.getFullYear() !== year || d.getDay() === 0 || d.getDay() === 6) return;
      if (checkInTime && checkOutTime) {
        workedDays++;
        const inTime = new Date(checkInTime);
        const outTime = new Date(checkOutTime);

        let minutesWorked = (outTime.getTime() - inTime.getTime()) / 60000;
        const lunchStart = new Date(inTime);
        lunchStart.setHours(13, 0, 0, 0);
        const lunchEnd = new Date(inTime);
        lunchEnd.setHours(14, 0, 0, 0);

        if (inTime < lunchEnd && outTime > lunchStart) {
          const overlapStart = inTime > lunchStart ? inTime : lunchStart;
          const overlapEnd = outTime < lunchEnd ? outTime : lunchEnd;
          minutesWorked -= (overlapEnd.getTime() - overlapStart.getTime()) / 60000;
        }

        totalMinutes += Math.max(0, minutesWorked);

        const lateThreshold = new Date(inTime);
        lateThreshold.setHours(9, 30, 0, 0);
        if (inTime > lateThreshold) {
          lateMinutes += (inTime.getTime() - lateThreshold.getTime()) / 60000;
        }
      }
    });

    setReport({ totalWeekdays, workedDays, totalMinutes, lateMinutes });
  };

  const getToday = (): string => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset);
    return today.toISOString().split('T')[0];
  };

  const handleCheckIn = async () => {
    if (!loggedInUser) return;
    const todayDate = getToday();
    const existing = attendanceData.find((a) => a.date === todayDate);

    const endpoint = existing && existing.id !== 0
      ? `http://localhost:3002/attendance/${existing.id}/edit`
      : `http://localhost:3002/attendance/create`;

    const method = existing && existing.id !== 0 ? 'PATCH' : 'POST';

    const payload = {
      userHId: loggedInUser.h_id,
      date: todayDate,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
    };

    await fetch(endpoint, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    fetchAllAttendanceByUser(loggedInUser.h_id);
  };

  const handleCheckOut = async () => {
    if (!loggedInUser) return;
    const todayDate = getToday();
    const existing = attendanceData.find((a) => a.date === todayDate);

    const endpoint = existing && existing.id !== 0
      ? `http://localhost:3002/attendance/${existing.id}/edit`
      : `http://localhost:3002/attendance/create`;

    const method = existing && existing.id !== 0 ? 'PATCH' : 'POST';

    const payload = {
      userHId: loggedInUser.h_id,
      date: todayDate,
      checkInTime: existing?.checkInTime || null,
      checkOutTime: new Date().toISOString(),
    };

    await fetch(endpoint, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    fetchAllAttendanceByUser(loggedInUser.h_id);
  };

  const calculateWorkedHours = (checkIn?: string, checkOut?: string): string => {
    if (!checkIn || !checkOut) return '—';
    const inTime = new Date(checkIn);
    const outTime = new Date(checkOut);

    const lunchStart = new Date(inTime);
    lunchStart.setHours(13, 0, 0, 0);
    const lunchEnd = new Date(inTime);
    lunchEnd.setHours(14, 0, 0, 0);

    let breakMs = 0;
    if (inTime < lunchEnd && outTime > lunchStart) {
      const overlapStart = inTime > lunchStart ? inTime : lunchStart;
      const overlapEnd = outTime < lunchEnd ? outTime : lunchEnd;
      breakMs = overlapEnd.getTime() - overlapStart.getTime();
    }

    const workedMs = outTime.getTime() - inTime.getTime() - breakMs;
    const totalMinutes = Math.floor(workedMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} цаг ${minutes} минут / 8 цаг`;
  };

  useEffect(() => {
    fetchLoggedInUser().then((user) => {
      if (user) {
        fetchAllAttendanceByUser(user.h_id);
      }
    });
  }, [selectedMonth, selectedYear]);

  return (
  <div className='w-full'>
        <div className="text-2xl font-bold text-gray-800 m-4">
          {loggedInUser?.ovog} {loggedInUser?.ner} хэрэглэгчийн цагийн бүртгэл
        </div>
    <div className="w-full p-6">
      <div className="flex  items-center gap-6 mb-4">
        <TotalTime />
        {loggedInUser && (
          <div className=" items-center  pl-[200px] gap-3">
            <button onClick={handleCheckIn} className="w-30 h-30 sm:w-30 sm:h-30 rounded-full mr-5 text-white bg-fuchsia-600  hover:scale-105 hover:shadow-xl transition">Ирсэн</button>
            <button onClick={handleCheckOut} className="w-30 h-30 sm:w-30 sm:h-30 rounded-full text-white bg-sky-600 hover:scale-105 hover:shadow-xl transition">Явсан</button>
          </div>
        )}
        
      </div>
 <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100 space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700 text-center">САРЫН ТАЙЛАН</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="border rounded px-3 py-2"
        >
          {[2024, 2025].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="border rounded px-3 py-2"
        >
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => (
            <option key={m} value={idx}>{m}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-gray-700">
        <div className="bg-white border border-indigo-200 rounded-lg p-5 text-center">
          <p className="font-medium">Ажлын өдөр</p>
          <p className="text-lg font-bold text-indigo-800">{report.totalWeekdays}</p>
        </div>
        <div className="bg-white border border-indigo-200 rounded-lg p-5 text-center">
          <p className="font-medium">Ажилласан өдөр</p>
          <p className="text-lg font-bold text-indigo-800">{report.workedDays}</p>
        </div>
        <div className="bg-white border border-indigo-200 rounded-lg p-5 text-center">
          <p className="font-medium">Ажилласан цаг</p>
          <p className="text-lg font-bold text-indigo-800">{Math.floor(report.totalMinutes / 60)}ц {report.totalMinutes % 60}мин</p>
        </div>
        <div className="bg-white border border-indigo-200 rounded-lg p-5 text-center">
          <p className="font-medium">Хоцорсон</p>
          <p className="text-lg font-bold text-indigo-800">{Math.floor(report.lateMinutes)} мин</p>
        </div>
      </div>
    </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 rounded-xl overflow-hidden text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-center">Огноо</th>
              <th className="p-3 text-center">Өдөр</th>
              <th className="p-3 text-center">Ирсэн</th>
              <th className="p-3 text-center">Явсан</th>
              <th className="p-3 text-center">Ажилласан цаг</th>
            </tr>
          </thead>
          <tbody>
            {loggedInUser && attendanceData
              .filter(record => record.checkInTime || record.checkOutTime)
              .map((record) => {
                const date = new Date(record.date);
                const dayOfWeek = date.toLocaleDateString('mn-MN', { weekday: 'long' });
                return (
                  <tr key={record.id} className="border-t text-center">
                    <td className="p-3">{date.toLocaleDateString()}</td>
                    <td className="p-3">{dayOfWeek}</td>
                    <td className="p-3">
                      {record.checkInTime
                        ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td className="p-3">
                      {record.checkOutTime
                        ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td className="p-3">
                      {calculateWorkedHours(record.checkInTime, record.checkOutTime)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
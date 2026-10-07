import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AttendanceType {
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export default function TotalTime() {
  const [workedHours, setWorkedHours] = useState(0);
  const targetHours = 40;

  useEffect(() => {
    const fetchWeeklyAttendance = async () => {
      try {
        const res = await fetch('http://localhost:3002/attendance/user/week', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch weekly data');
        const records: AttendanceType[] = await res.json();

        let totalMinutes = 0;
        records.forEach(({ checkInTime, checkOutTime }) => {
          if (checkInTime && checkOutTime) {
            const inTime = new Date(checkInTime);
            const outTime = new Date(checkOutTime);

            let worked = (outTime.getTime() - inTime.getTime()) / 60000;

            const lunchStart = new Date(inTime);
            lunchStart.setHours(13, 0, 0, 0);
            const lunchEnd = new Date(inTime);
            lunchEnd.setHours(14, 0, 0, 0);

            if (inTime < lunchEnd && outTime > lunchStart) {
              const overlapStart = inTime > lunchStart ? inTime : lunchStart;
              const overlapEnd = outTime < lunchEnd ? outTime : lunchEnd;
              worked -= (overlapEnd.getTime() - overlapStart.getTime()) / 60000;
            }

            totalMinutes += Math.max(0, worked);
          }
        });

        setWorkedHours(Math.floor(totalMinutes / 60));
      } catch (error) {
        console.error('Error fetching weekly attendance:', error);
      }
    };

    fetchWeeklyAttendance();
  }, []);

  const workedPercentage = Math.min((workedHours / targetHours) * 100, 100);
  //const remainingHours = Math.max(0, targetHours - workedHours);

  return (
    <div className="w-full sm:w-[50%] p-6  bg-gradient-to-br from-blue-100 via-blue-300 to-indigo-700 rounded-3xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-xl text-white">Энэ 7 хоногт:</p>
        <Sparkles className="text-white animate-pulse" size={20} />
      </div>

      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">Нийт ажилласан:</p>
          <span className="font-bold text-indigo-700">{workedHours} цаг / {targetHours} цаг</span>
        </div>

        <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-4 bg-gradient-to-r from-indigo-400 to-indigo-700 transition-all duration-700"
            style={{ width: `${workedPercentage}%` }}
          />
        </div>

        <p className="text-xs text-gray-500 text-right mt-2">{workedPercentage.toFixed(1)}% гүйцэтгэл</p>

        <div className="mt-3 text-sm text-gray-600">
          {workedHours >= targetHours
            ? <span className="text-green-600 font-semibold">Та 7 хоногийн төлөвлөгөөг гүйцэтгэлээ!</span>
            : <span></span>}
        </div>
      </div>
    </div>
  );
}

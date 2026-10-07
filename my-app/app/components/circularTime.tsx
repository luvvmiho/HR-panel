'use client';

import React, { useEffect, useState } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function CircularTime() {
  const [time, setTime] = useState('00:00:00');
  const totalSeconds = 40 * 3600; // 40h
  const usedSeconds = 32 * 3600 + 12 * 60 + 29; // 32:12:29

  const percentage = (usedSeconds / totalSeconds) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB')); // HH:MM:SS
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-64 h-64 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-600 to-gray-400 shadow-md">
      <div className="w-56 h-56">
        <CircularProgressbarWithChildren
          value={percentage}
          styles={buildStyles({
            pathColor: 'white',
            trailColor: '#ccc',
            strokeLinecap: 'round',
          })}
        >
          <div className="text-center text-white">
            <div className="text-3xl font-semibold">32:12:29</div>
            <div className="text-sm opacity-60">/40h</div>
          </div>
        </CircularProgressbarWithChildren>
      </div>
    </div>
  );
}

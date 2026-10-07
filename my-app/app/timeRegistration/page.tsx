'use client';
import React, { useEffect, useState } from 'react';
import { Table, Button, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import Calendar from '../components/calendar';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';

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

interface EditRow {
  checkIn: string;
  checkOut: string;
}

export default function TimeReg() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => dayjs().format('YYYY-MM-DD'));
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ [userId: number]: EditRow }>({});

  const today = dayjs().startOf('day');
  const selected = dayjs(selectedDate).startOf('day');
  const isFutureDate = selected.isAfter(today);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:3002/user/all', { credentials: 'include' });
    const data = await res.json();
    setUsers(data);
  };

  const fetchAttendance = async () => {
    const res = await fetch(`http://localhost:3002/attendance?date=${selectedDate}`, { credentials: 'include' });
    const data: AttendanceType[] = await res.json();
    const formatted: { [userId: number]: EditRow } = {};
    data.forEach((entry) => {
      formatted[entry.user.h_id] = {
        checkIn: entry.checkInTime || '',
        checkOut: entry.checkOutTime || '',
      };
    });
    setAttendanceData(data);
    setEditData(formatted);
  };

  const handleEdit = (userId: number) => {
    if (isFutureDate) return message.warning('Ирээдүйн огноо засах боломжгүй');
    setEditingUserId(userId);
    if (!editData[userId]) {
      setEditData((prev) => ({
        ...prev,
        [userId]: { checkIn: '', checkOut: '' },
      }));
    }
  };

  const handleChange = (userId: number, field: 'checkIn' | 'checkOut', time: Dayjs | null) => {
    const formattedTime = time ? `${selectedDate}T${time.format('HH:mm')}` : '';
    setEditData((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: formattedTime },
    }));
  };

  const handleSave = async (user: UserType) => {
    if (isFutureDate) return message.warning('Ирээдүйн огноо хадгалах боломжгүй');
    const row = editData[user.h_id];
    if (!row) return;

    if (row.checkIn && row.checkOut && new Date(row.checkOut) < new Date(row.checkIn)) {
      message.error("Check-out must be after check-in");
      return;
    }

    const existing = attendanceData.find((a) => a.user.h_id === user.h_id && dayjs(a.date).format('YYYY-MM-DD') === selectedDate);
    const isNew = !existing || existing.id === 0;

    const response = await fetch(
      isNew
        ? 'http://localhost:3002/attendance/create'
        : `http://localhost:3002/attendance/${existing.id}/edit`,
      {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userHId: user.h_id,
          date: selectedDate,
          checkInTime: row.checkIn || null,
          checkOutTime: row.checkOut || null,
        }),
      }
    );

    if (!response.ok) {
      message.error("Failed to save attendance");
      return;
    }

    message.success("Амжилттай хадгалагдлаа");
    setEditingUserId(null);
    await fetchAttendance();
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
    fetchUsers();
    fetchAttendance();
  }, [selectedDate]);

  const columns: ColumnsType<UserType> = [
    {
      title: 'Овог',
      dataIndex: 'ovog',
      key: 'ovog',
    },
    {
      title: 'Нэр',
      dataIndex: 'ner',
      key: 'ner',
    },
    {
      title: 'Ирсэн',
      key: 'checkIn',
      render: (_, user) => {
        const isEditing = editingUserId === user.h_id;
        const time = editData[user.h_id]?.checkIn;
        return isEditing ? (
          <TimePicker
            disabled={isFutureDate}
            value={time ? dayjs(time, 'YYYY-MM-DDTHH:mm') : null}
            onChange={(t) => handleChange(user.h_id, 'checkIn', t)}
            format="HH:mm"
          />
        ) : time ? dayjs(time).format('HH:mm') : '—';
      },
    },
    {
      title: 'Явсан',
      key: 'checkOut',
      render: (_, user) => {
        const isEditing = editingUserId === user.h_id;
        const time = editData[user.h_id]?.checkOut;
        return isEditing ? (
          <TimePicker
            disabled={isFutureDate}
            value={time ? dayjs(time, 'YYYY-MM-DDTHH:mm') : null}
            onChange={(t) => handleChange(user.h_id, 'checkOut', t)}
            format="HH:mm"
          />
        ) : time ? dayjs(time).format('HH:mm') : '—';
      },
    },
    {
      title: 'Ажилласан цаг',
      key: 'worked',
      render: (_, user) => {
        const row = editData[user.h_id];
        return calculateWorkedHours(row?.checkIn, row?.checkOut);
      },
    },
    {
      title: 'Үйлдэл',
      key: 'actions',
      render: (_, user) => {
        const isEditing = editingUserId === user.h_id;
        return isEditing ? (
          <div className="flex gap-2">
            <Button type="primary" size="small" onClick={() => handleSave(user)} disabled={isFutureDate}>Хадгалах</Button>
            <Button danger size="small" onClick={() => setEditingUserId(null)}>Болих</Button>
          </div>
        ) : (
          <Button size="small" onClick={() => handleEdit(user.h_id)} disabled={isFutureDate}>Засах</Button>
        );
      },
    },
  ];

  return (
    <div className=" bg-gray-50 w-full flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-6xl space-y-6">
        <h1 className="text-2xl font-semibold text-gray-700 text-center">Бүх хэрэглэгчийн цаг бүртгэл</h1>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <Calendar onDateSelect={(date) => setSelectedDate(date)} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
          <Table
            dataSource={users}
            columns={columns}
            rowKey="h_id"
            pagination={false}
            bordered
            className="min-w-[700px]"
          />
        </div>
      </div>
    </div>
  );
}
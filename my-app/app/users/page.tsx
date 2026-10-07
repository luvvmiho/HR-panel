'use client';
import React, { useEffect, useState } from 'react';
import { Space,
  Table,
  Tag,
  Button,
  Popconfirm,
  message,
  Modal,
  Input,
  Select,
} from 'antd';


const { Column, ColumnGroup } = Table;
const { Option } = Select;

interface DataType {
  h_id: number;
  ovog: string;
  ner: string;
  gmail: string;
  utas: string;
  h_role: 'admin' | 'user';
}

export default function Users() {
  const [data, setData] = useState<DataType[]>([]);
  const [editingUser, setEditingUser] = useState<DataType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:3002/user/all', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const users = await res.json();
      setData(users);
    } catch (err) {
      console.error('Fetch users error:', err);
      message.error('Хэрэглэгчдийн мэдээлэл татаж чадсангүй');
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3002/user/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete');
      message.success('Хэрэглэгчийг устгалаа');
      fetchUser();
    } catch (err) {
      console.error('Delete user error:', err);
      message.error('Устгах үед алдаа гарлаа');
    }
  };

  const handleEdit = (user: DataType) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`http://localhost:3002/user/${editingUser.h_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ovog: editingUser.ovog,
          ner: editingUser.ner,
          gmail: editingUser.gmail,
          utas: editingUser.utas,
          h_role: editingUser.h_role,
        }),
      });
      if (!res.ok) throw new Error('Failed to update user');
      message.success('Хэрэглэгчийн мэдээллийг шинэчиллээ');
      setIsModalOpen(false);
      fetchUser();
    } catch (err) {
      console.error('Update user error:', err);
      message.error('Мэдээлэл шинэчлэхэд алдаа гарлаа');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="w-full mx-auto p-6">
      <Table<DataType> dataSource={data} pagination={false} rowKey="h_id">
        <Column title="ID" dataIndex="h_id" key="h_id" />
   
          <Column title="Овог" dataIndex="ovog" key="ovog" />
          <Column title="Нэр" dataIndex="ner" key="ner" />

        <Column title="Мэйл хаяг" dataIndex="gmail" key="gmail" />
        <Column title="Утасны дугаар" dataIndex="utas" key="utas" />
        <Column
          title="Роль"
          dataIndex="h_role"
          key="h_role"
          render={(role: string) => (
            <Tag color={role === 'admin' ? 'red' : 'green'}>{role}</Tag>
          )}
        />
        <Column
          title="Үйлдэл"
          key="action"
          render={(_, record: DataType) => (
            <Space size="middle">
              <Button onClick={() => handleEdit(record)}>Засах</Button>
              <Popconfirm
                title="Энэ хэрэглэгчийг устгах уу?"
                onConfirm={() => deleteUser(record.h_id)}
                okText="Тийм"
                cancelText="Үгүй"
              >
                <Button danger>Бүртгэл устгах</Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      <Modal
        title="Хэрэглэгч засах"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Хадгалах"
        cancelText="Болих"
      >
        <Input
          placeholder="Овог"
          value={editingUser?.ovog}
          onChange={(e) =>
            setEditingUser((prev) =>
              prev ? { ...prev, ovog: e.target.value } : null
            )
          }
          className="mb-2"
        />
        <Input
          placeholder="Нэр"
          value={editingUser?.ner}
          onChange={(e) =>
            setEditingUser((prev) =>
              prev ? { ...prev, ner: e.target.value } : null
            )
          }
          className="mb-2"
        />
        <Input
          placeholder="Мэйл"
          value={editingUser?.gmail}
          onChange={(e) =>
            setEditingUser((prev) =>
              prev ? { ...prev, gmail: e.target.value } : null
            )
          }
          className="mb-2"
        />
        <Input
          placeholder="Утас"
          value={editingUser?.utas}
          onChange={(e) =>
            setEditingUser((prev) =>
              prev ? { ...prev, utas: e.target.value } : null
            )
          }
          className="mb-2"
        />
        <Select
          value={editingUser?.h_role}
          onChange={(value) =>
            setEditingUser((prev) =>
              prev ? { ...prev, h_role: value } : null
            )
          }
          className="w-full"
        >
          <Option value="user">user</Option>
          <Option value="admin">admin</Option>
        </Select>
      </Modal>
    </div>
  );
}

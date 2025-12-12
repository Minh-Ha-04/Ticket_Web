import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm } from "antd";
import styles from "./UserAdmin.module.scss";
import classNames from "classnames/bind";
import instance from "../../utils/axiosInstance"; 

const cx = classNames.bind(styles);

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

function UserAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // GET all users
  const loadUsers = async () => {
    const res = await instance.get("/profile/all");
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    await instance.delete(`/users/${id}`);
    message.success("Xóa thành công");
    loadUsers();
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue();

    if (editingUser) {
      // UPDATE
      await instance.put(`/users/${editingUser.id}`, values);
      message.success("Cập nhật thành công");
    } else {
      // CREATE
      await instance.post("/users", values);
      message.success("Thêm mới thành công");
    }

    setOpen(false);
    loadUsers();
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Username", dataIndex: "username" },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Hành động",
      render: (_: any, r: User) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(r)}>Sửa</Button>

          <Popconfirm title="Xóa user này?" onConfirm={() => handleDelete(r.id)}>
            <Button type="default">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <h2>Quản lý User</h2>
        <Button type="primary" onClick={handleOpenAdd}>Thêm User</Button>
      </div>

      <Table rowKey="id" dataSource={users} columns={columns} bordered />

      <Modal
        title={editingUser ? "Cập nhật User" : "Thêm User mới"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Username" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Input placeholder="admin | user" />
          </Form.Item>

          {!editingUser && (
            <Form.Item label="Password" name="password" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default UserAdmin;

import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Card,
  message,
  Table,
  Space,
  Popconfirm,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import instance from "../../utils/axiosInstance";

interface Stadium {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
  shortname: string;
  logo: string;
  stadiumId: number; // nếu BE trả về populate
}

function TeamAdmin() {
  const [form] = Form.useForm();
  const [teams, setTeams] = useState<Team[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Lấy dữ liệu sân + đội
  useEffect(() => {
    fetchStadiums();
    fetchTeams();
  }, []);

  const fetchStadiums = async () => {
    try {
      const res = await instance.get("/stadiums");
      setStadiums(res.data.stadiums);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await instance.get("/teams");
      setTeams(res.data.teams);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("shortname", values.shortname);
    if (logo) formData.append("logo", logo);
    if (values.stadiumId) formData.append("stadiumId", values.stadiumId);

    try {
      if (editingId) {
        await instance.put(`/teams/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Cập nhật đội thành công!");
      } else {
        await instance.post("/teams", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Tạo đội thành công!");
      }
      form.resetFields();
      setLogo(null);
      setEditingId(null);
      fetchTeams();
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi lưu đội bóng!");
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (team: Team) => {
    setEditingId(team.id);
    form.setFieldsValue({
      name: team.name,
      shortname: team.shortname,
      stadiumId: team.stadiumId,
    });
    setLogo(null); // không load lại file, BE có thể trả logo link để preview
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      await instance.delete(`/teams/${id}`);
      message.success("Xóa đội thành công!");
      fetchTeams();
    } catch (err) {
      console.error(err);
      message.error("Xóa đội thất bại!");
    }
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (logo: string) =>
        logo ? <img src={logo} alt="logo" style={{ width: 50 }} /> : "—",
    },
    { title: "Tên đội", dataIndex: "name", key: "name" },
    { title: "Tên viết tắt", dataIndex: "shortname", key: "shortname" },
    {
      title: "Sân nhà ",
      dataIndex: "stadiumId",
      key: "stadiumName",
      render: (stadiumId: number) =>
      stadiums.find((s) => s.id === stadiumId)?.name || "—",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, team: Team) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(team)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(team.id)}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      <Card title={editingId ? "Sửa đội bóng" : "Tạo đội bóng"}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên đội"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên đội!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Tên viết tắt" name="shortname">
            <Input maxLength={3} />
          </Form.Item>

          <Form.Item label="Logo">
            <Upload
              beforeUpload={(file) => {
                setLogo(file);
                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn logo</Button>
            </Upload>
            {logo && (
              <img
                src={URL.createObjectURL(logo)}
                alt="preview"
                style={{ width: 100, marginTop: 10, borderRadius: 8 }}
              />
            )}
          </Form.Item>

          <Form.Item label="Sân nhà" name="stadiumId">
            <Select placeholder="Chọn sân">
              {stadiums.map((stadium) => (
                <Select.Option key={stadium.id} value={stadium.id}>
                  {stadium.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingId ? "Cập nhật" : "Tạo đội"}
              </Button>
              {editingId && (
                <Button
                  onClick={() => {
                    form.resetFields();
                    setLogo(null);
                    setEditingId(null);
                  }}
                >
                  Hủy
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Danh sách đội bóng" style={{ marginTop: 20 }}>
        <Table dataSource={teams} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}

export default TeamAdmin;

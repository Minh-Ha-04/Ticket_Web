import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./SectionSeatAdmin.module.scss";
import classNames from "classnames/bind";
import instance from "../../utils/axiosInstance";
import {
  Table,
  Form,
  Input,
  InputNumber,
  Button,
  Modal,
  message,
  Space,
  Typography,
  Card,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const cx = classNames.bind(styles);
const { Title } = Typography;

interface Section {
  id: number;
  name: string;
  seatCount: number;
  price: number;
}

function SectionSeatAdmin() {
  const { id: stadiumId } = useParams<{ id: string }>();
  const [sections, setSections] = useState<Section[]>([]);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // 🔹 Lấy danh sách khu vực
  useEffect(() => {
    if (stadiumId) fetchSections();
  }, [stadiumId]);

  const fetchSections = async () => {
    try {
      const res = await instance.get(`/sections/stadium/${stadiumId}`);
      setSections(res.data.sections);
    } catch (err) {
      console.error("❌ Lỗi khi tải khu vực:", err);
      message.error("Không thể tải danh sách khu vực!");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingId) {
        await instance.put(`/sections/${editingId}`, values);
        alert("Cập nhật khu vực thành công!");
      } else {
        await instance.post(`/sections`, { ...values, stadiumId: Number(stadiumId) });
        
        alert("Thêm khu vực mới thành công!");
      }
      
      form.resetFields();
      setEditingId(null);
      fetchSections();
    } catch (err) {
      console.error(err);
      message.error("❌ Thao tác thất bại!");
    }
  };

  const handleEdit = (section: Section) => {
    form.setFieldsValue(section);
    setEditingId(section.id);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await instance.delete(`/sections/${deleteId}`);
      alert("🗑️ Xóa khu vực thành công!");
      fetchSections();
    } catch (err) {
      console.error(err);
      message.error("❌ Xóa thất bại!");
    } finally {
      setIsModalVisible(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      title: "Tên khu vực",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số ghế",
      dataIndex: "seatCount",
      key: "seatCount",
    },
    {
      title: "Giá vé (VNĐ)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price.toLocaleString(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Section) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={cx("wrapper")}>
      <Card className={cx("card")}>
        <Title level={3} className={cx("title")}>
          ⚙️ Quản lý khu vực & ghế của sân
        </Title>

        <Form
          form={form}
          layout="inline"
          onFinish={handleSubmit}
          className={cx("form")}
        >
          <Form.Item
            name="name"
            label="Tên khu vực"
            rules={[{ required: true, message: "Nhập tên khu vực!" }]}
          >
            <Input placeholder="Ví dụ: Khán đài A" />
          </Form.Item>

          <Form.Item
            name="seatCount"
            label="Số ghế"
            rules={[{ required: true, message: "Nhập số ghế!" }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá vé"
            rules={[{ required: true, message: "Nhập giá vé!" }]}
          >
            <InputNumber min={0} step={10000} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              htmlType="submit"
              className={cx("submit-btn")}
            >
              {editingId ? "Cập nhật" : "Thêm mới"}
            </Button>
            {editingId && (
              <Button
                onClick={() => {
                  form.resetFields();
                  setEditingId(null);
                }}
                className={cx("cancel-btn")}
              >
                Hủy
              </Button>
            )}
          </Form.Item>
        </Form>

        <Table
          dataSource={sections}
          columns={columns}
          rowKey="id"
          bordered
          className={cx("table")}
        />
      </Card>

      <Modal
        title="Xác nhận xóa khu vực"
        open={isModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa khu vực này không?</p>
      </Modal>
    </div>
  );
}

export default SectionSeatAdmin;

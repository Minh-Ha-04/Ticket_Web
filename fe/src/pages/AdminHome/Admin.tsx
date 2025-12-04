import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Upload,
  Card,
  message,
  Table,
  Popconfirm,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import instance from "../../utils/axiosInstance";

interface Picture {
  id: number;
  url: string;
  public_id: string;
  type: "poster" | "ad" | "sponsor";
}

function PictureAdmin() {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null); // chỉ 1 file
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"poster" | "ad" | "sponsor">("poster");

  useEffect(() => {
    fetchPictures();
  }, []);

  const fetchPictures = async () => {
    try {
      const res = await instance.get("/pictures");
      console.log(res.data.data)
      setPictures(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!file) return message.error("Bạn chưa chọn ảnh!");

    const formData = new FormData();
    formData.append("type", type);
    formData.append("image", file);

    setLoading(true);

    try {
      await instance.post(`/pictures`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Upload thành công!");
      setFile(null); // clear file
      fetchPictures();
    } catch (err) {
      console.error(err);
      message.error("Upload thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await instance.delete(`/pictures/${id}`);
      message.success("Xoá thành công!");
      fetchPictures();
    } catch (err) {
      console.error(err);
      message.error("Xoá thất bại!");
    }
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "url",
      key: "url",
      render: (url: string) => <img src={url} alt="" style={{ width: 80 }} />,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (t: string) =>
        t === "poster"
          ? "Poster chính"
          : t === "ad"
          ? "Quảng cáo"
          : "Nhà tài trợ",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, pic: Picture) => (
        <Popconfirm title="Bạn muốn xoá ảnh này?" onConfirm={() => handleDelete(pic.id)}>
          <Button danger type="link">Xoá</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      <Card title="Quản lý hình ảnh">
        <Form layout="vertical" form={form}>
          
          {/* chọn loại ảnh */}
          <Form.Item label="Loại ảnh">
            <Select
              value={type}
              onChange={(val) => {
                setType(val);
                setFile(null); // reset file khi đổi loại
              }}
            >
              <Select.Option value="poster">Poster chính</Select.Option>
              <Select.Option value="ad">Ảnh quảng cáo</Select.Option>
              <Select.Option value="sponsor">Nhà tài trợ</Select.Option>
            </Select>
          </Form.Item>

          {/* Upload ảnh */}
          <Form.Item label="Tải ảnh lên">
            <Upload
              beforeUpload={(f) => {
                setFile(f);
                return false;
              }}
              onRemove={() => {
                setFile(null); // xoá preview khi remove
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>

            {/* Preview ảnh */}
            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                style={{ width: 120, marginTop: 10, borderRadius: 8 }}
              />
            )}
          </Form.Item>

          <Button type="primary" loading={loading} onClick={handleSubmit}>
            Upload
          </Button>
        </Form>
      </Card>

      <Card title="Danh sách ảnh" style={{ marginTop: 20 }}>
        <Table dataSource={pictures} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}

export default PictureAdmin;

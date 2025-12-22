import { useEffect, useState } from "react";
import styles from "./MatchAdmin.module.scss";
import classNames from "classnames/bind";
import instance from "../../utils/axiosInstance";
import {
  Table,
  Button,
  Modal,
  message,
  Space,
  Typography,
  Form,
  Select,
  DatePicker,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const cx = classNames.bind(styles);
const { Title } = Typography;
const { Option } = Select;

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Stadium {
  id: number;
  name: string;
}

interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  stadiumId: number;
  matchDate: string;
  poster: string;
  homeTeam: Team;
  awayTeam: Team;
  stadium: Stadium;
}

function MatchAdmin() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [m, t, s] = await Promise.all([
        instance.get("/matches"),
        instance.get("/teams"),
        instance.get("/stadiums"),
      ]);
      setMatches(m.data);
      setTeams(t.data.teams);
      setStadiums(s.data.stadiums);
    } catch {
      message.error("❌ Không tải được dữ liệu");
    }
  };

  const openModal = (match?: Match) => {
    if (match) {
      setEditingMatch(match);
      form.setFieldsValue({
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        stadiumId: match.stadiumId,
        matchDate: dayjs(match.matchDate),
      });
      setPosterPreview(match.poster || null);
    } else {
      setEditingMatch(null);
      form.resetFields();
      setPosterPreview(null);
    }
    setPosterFile(null);
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("homeTeamId", values.homeTeamId);
      formData.append("awayTeamId", values.awayTeamId);
      formData.append("stadiumId", values.stadiumId);
      formData.append(
        "matchDate",
        values.matchDate.format("YYYY-MM-DD HH:mm:ss")
      );

      if (posterFile) {
        formData.append("poster", posterFile);
      }
      const obj: any = {};
      formData.forEach((v, k) => (obj[k] = v));
      console.log(obj);

      if (editingMatch) {
        await instance.put(`/matches/${editingMatch.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Cập nhật thành công");
      } else {
        await instance.post("/matches", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Thêm trận đấu thành công");
      }

      setIsModalVisible(false);
      fetchAll();
    } catch (err) {
      console.error(err);
      message.error("Thao tác thất bại");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await instance.delete(`/matches/${deleteId}`);
      message.success("Xóa thành công");
      fetchAll();
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      title: "Đội nhà",
      key: "homeTeam",
      render: (_: any, r: Match) => (
        <div className={cx("teamCell")}>
          {r.homeTeam && (
            <>
              <img src={r.homeTeam.logo} alt={r.homeTeam.name} />
              <span>{r.homeTeam.name}</span>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Đội khách",
      key: "awayTeam",
      render: (_: any, r: Match) => (
        <div className={cx("teamCell")}>
          {r.awayTeam && (
            <>
              <img src={r.awayTeam.logo} alt={r.awayTeam.name} />
              <span>{r.awayTeam.name}</span>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Sân",
      dataIndex: ["Stadium", "name"],
      key: "stadium",
    },
    {
      title: "Ngày thi đấu",
      dataIndex: "matchDate",
      key: "matchDate",
      render: (date: string) => dayjs(date).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Poster",
      key: "poster",
      render: (_: any, r: Match) =>
        r.poster ? <img src={r.poster} style={{ width: 80 }} /> : "—",
    },
    {
      title: "Hành động",
      render: (_: any, r: Match) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(r)}>
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteId(r.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={cx("wrapper")}>
      <Title level={3}> Quản lý trận đấu</Title>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => openModal()}
      >
        Thêm trận đấu
      </Button>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={matches}
        style={{ marginTop: 16 }}
      />

      <Modal
        title={editingMatch ? "Cập nhật trận đấu" : "Thêm trận đấu"}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="homeTeamId" label="Đội nhà" rules={[{ required: true }]}>
            <Select>
              {teams.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="awayTeamId" label="Đội khách" rules={[{ required: true }]}>
            <Select>
              {teams.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="stadiumId" label="Sân" rules={[{ required: true }]}>
            <Select>
              {stadiums.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="matchDate" label="Ngày thi đấu" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <strong>Poster:</strong>
            <Upload
              beforeUpload={(file) => {
                setPosterFile(file);
                setPosterPreview(URL.createObjectURL(file));
                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>

            {posterPreview && (
              <img
                src={posterPreview}
                style={{ width: "100%", marginTop: 12 }}
              />
            )}
          </div>
        </Form>
      </Modal>
      <Modal
        title="Xác nhận xóa"
        open={!!deleteId}
        onOk={confirmDelete}
        onCancel={() => setDeleteId(null)}
      >
        <p>Bạn có chắc chắn muốn xóa trận đấu này?</p>
      </Modal>
    </div>
  );
}

export default MatchAdmin;

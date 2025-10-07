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
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const cx = classNames.bind(styles);
const { Title } = Typography;
const { Option } = Select;

interface Team {
  id: number;
  name: string;
  logo:string;
}

interface Stadium {
  id: number;
  name: string;
}

interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  matchDate: string;
  stadiumId: number;
  homeTeam : Team;
  awayTeam : Team;
  stadium : Stadium;
}

function MatchAdmin() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const [form] = Form.useForm();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // 🔹 Load dữ liệu
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [matchRes, teamRes, stadiumRes] = await Promise.all([
        instance.get("/matches"),
        instance.get("/teams"),
        instance.get("/stadiums"),
      ]);
      setMatches(matchRes.data);
      setTeams(teamRes.data.teams);
      setStadiums(stadiumRes.data.stadiums);
    } catch (err) {
      console.error(err);
      message.error("❌ Lỗi khi tải dữ liệu!");
    }
  };

  // 🔹 Modal Thêm/Sửa
  const openModal = (match?: Match) => {
    if (match) {
      setEditingMatch(match);
      form.setFieldsValue({
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        stadiumId: match.stadiumId,
        matchDate: dayjs(match.matchDate),
      });
    } else {
      setEditingMatch(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        matchDate: values.matchDate.format("YYYY-MM-DD HH:mm:ss"),
      };
      if (editingMatch) {
        console.log(payload);
        await instance.put(`/matches/${editingMatch.id}`, payload);
        alert("Cập nhật trận đấu thành công!");
      } else {
        await instance.post("/matches", payload);
        alert("Thêm trận đấu mới thành công!");
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingMatch(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      message.error("❌ Thao tác thất bại!");
    }
  };

  // 🔹 Xóa trận đấu
  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await instance.delete(`/matches/${deleteId}`);
      alert("🗑️ Xóa trận đấu thành công!");
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("❌ Xóa thất bại!");
    } finally {
      setDeleteId(null);  
      setIsModalVisible(false);
    }
  };

  const columns = [
    {
      title: "Đội nhà",
      key: "homeTeam",
      render: (_: any, record: Match) => (
        <div className={cx("teamCell")}>
          <img src={record.homeTeam.logo} alt={record.homeTeam.name} />
          <span>{record.homeTeam.name}</span>
        </div>
      ),
    },
    {
      title: "Đội khách",
      key: "awayTeam",
      render: (_: any, record: Match) => (
        <div className={cx("teamCell")}>
          <img src={record.awayTeam.logo} alt={record.awayTeam.name} />
          <span>{record.awayTeam.name}</span>
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
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Match) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => openModal(record)}>
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => setDeleteId(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={cx("wrapper")}>
      <Title level={3} className={cx("title")}>
        ⚽ Quản lý trận đấu
      </Title>

      <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
        Thêm trận đấu
      </Button>

      <Table dataSource={matches} columns={columns} rowKey="id" bordered className={cx("table")} style={{ marginTop: 16 }} />

      {/* Modal Thêm/Sửa */}
      <Modal
        title={editingMatch ? "Cập nhật trận đấu" : "Thêm trận đấu mới"}
        open={isModalVisible && !deleteId}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        okText={editingMatch ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="homeTeamId" label="Đội nhà" rules={[{ required: true }]}>
            <Select placeholder="Chọn đội nhà">
              {teams.map((t) => (
                <Option key={t.id} value={t.id}>{t.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="awayTeamId" label="Đội khách" rules={[{ required: true }]}>
            <Select placeholder="Chọn đội khách">
              {teams.map((t) => (
                <Option key={t.id} value={t.id}>{t.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="stadiumId" label="Sân" rules={[{ required: true }]}>
            <Select placeholder="Chọn sân">
              {stadiums.map((s) => (
                <Option key={s.id} value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="matchDate" label="Ngày thi đấu" rules={[{ required: true }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xóa */}
      <Modal
        title="Xác nhận xóa trận đấu"
        open={!!deleteId}
        onOk={confirmDelete}
        onCancel={() => setDeleteId(null)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa trận đấu này không?</p>
      </Modal>
    </div>
  );
}

export default MatchAdmin;

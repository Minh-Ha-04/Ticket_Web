import { useEffect, useState } from "react";
import styles from "./TicketAdmin.module.scss";
import classNames from "classnames/bind";
import instance from "../../utils/axiosInstance";
import {
  Table,
  Button,
  Space,
  message,
  Typography,
  Modal,
  InputNumber,
  Upload
} from "antd";
import {UploadOutlined, EyeOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const cx = classNames.bind(styles);
const stadiumId = process.env.REACT_APP_HOME_STADIUM_ID;

interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  matchDate: string;
  stadiumId: number;
  isTicketCreated: boolean;
  homeTeam: Team;
  awayTeam: Team;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Section {
  id: number;
  name: string;
  seatCount: number;
  price: number;
}

function TicketAdmin() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);

  const [isUpdateMode, setIsUpdateMode] = useState(false);


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchMatches = async () => {
    try {
      const res = await instance.get("/matches/home");
      setMatches(res.data);
    } catch (err) {
      message.error("Không tải được danh sách trận đấu!");
    }
  };

  const fetchSections = async () => {
    try {
      const res = await instance.get(`/sections/stadium/${stadiumId}`);
      setSections(res.data.sections);
    } catch (err) {
      console.error("Lỗi khi tải khu vực:", err);
      message.error("Không thể tải danh sách khu vực!");
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleViewTickets = (matchId: number) => {
    message.info(`Xem vé cho trận đấu ID: ${matchId}`);
  };

  const handleAddTickets = (matchId: number) => {
    setSelectedMatchId(matchId);
    fetchSections();
    setIsModalOpen(true);
  };

  const fetchTicketSections = async (matchId: number) => {
    try {
      const res = await instance.get(`/tickets/match/${matchId}`);
      setSections(res.data.sections);
    } catch (err) {
      console.error("Lỗi khi tải giá vé từ ticket:", err);
    }
  };
  
  const handleUpdateTickets = (matchId: number) => {
    setSelectedMatchId(matchId);
    setIsUpdateMode(true);
    fetchTicketSections(matchId);
    setIsModalOpen(true);
  };
  

  const showDeleteModal = (matchId: number) => {
    setDeleteId(matchId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await instance.delete(`/tickets/${deleteId}`);
      fetchMatches();
      alert("Xóa thành công!");
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại!");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };
  

  const handleModalOk = async () => {
    try {
      const formData = new FormData();
      if (posterFile) formData.append("poster", posterFile);

      formData.append("sections", JSON.stringify(
        sections.map((s) => ({ sectionId: s.id, price: s.price }))
      ));

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (isUpdateMode) {
        await instance.put(`/tickets/${selectedMatchId}`, formData,config);
        alert("Cập nhật vé thành công!");
      } else {
        await instance.post(`/tickets/generate/${selectedMatchId}`, formData,config);
        alert("Tạo vé thành công!");
      }
      setIsModalOpen(false);
      setPosterFile(null);
      setIsUpdateMode(false);
      fetchMatches();
    } catch (err) {
      console.error(err);
      alert("Tạo vé thất bại!");
    }
  };
  const handlePriceChange = (sectionId: number, value: number) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, price: value } : s))
    );
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
          {record.isTicketCreated ? (
            <>
              <Button
                icon={<EyeOutlined />}
                onClick={() => handleViewTickets(record.id)}
              >
                Xem vé
              </Button>
              <Button
              type="default"
              onClick={() => handleUpdateTickets(record.id)}
              >
              Cập nhật vé
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() =>showDeleteModal(record.id)}
              >
                Xóa vé
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAddTickets(record.id)}
            >
              Thêm vé
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={cx("TicketAdmin")}>
      <Typography.Title level={3}>Quản lý vé sân nhà</Typography.Title>
      <Table
        style={{ marginTop: 16 }}
        rowKey="id"
        dataSource={matches}
        columns={columns}
        pagination={false}
      />

        <Modal
          title={isUpdateMode ? "Cập nhật vé & poster" : "Tạo vé cho các khu vực"}
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={() => {
            setIsModalOpen(false);
            setIsUpdateMode(false);
          }}
          okText={isUpdateMode ? "Lưu thay đổi" : "Tạo vé"}
        >
        <div style={{ marginBottom: 16 }}>
          <strong>Ảnh poster:</strong>
          <Upload
            beforeUpload={(file) => {
              setPosterFile(file);
              return false; // ngăn upload tự động
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          {posterFile && <p>Đã chọn: {posterFile.name}</p>}
        </div>

        {sections.map((section) => (
          <div key={section.id} style={{ marginBottom: 12 }}>
            <span>{section.name} ({section.seatCount} ghế): </span>
            <InputNumber
              min={0}
              value={section.price}
              onChange={(value) => handlePriceChange(section.id, value as number)}
            />
          </div>
        ))}
      </Modal>

      <Modal
        title="Xóa vé"
        open={isDeleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa vé trận này?</p>
      </Modal>

    </div>
  );
}

export default TicketAdmin;

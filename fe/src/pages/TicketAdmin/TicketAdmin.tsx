import { useEffect, useState } from "react";
import styles from "./TicketAdmin.module.scss";
import classNames from "classnames/bind";
import instance from "../../utils/axiosInstance";
import { Table, Button, Space, message, Typography } from "antd";
import { EyeOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const cx = classNames.bind(styles);

interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  matchDate: string;
  stadiumId: number;
  homeTeam : Team;
  awayTeam : Team;
}

interface Team {
  id: number;
  name: string;
  logo:string;
}

function TicketAdmin() {
  const [matches, setMatches] = useState<Match[]>([]);

  const fetchMatches = async () => {
    try {
      const res = await instance.get("/matches/home");
      console.log(res.data);
      setMatches(res.data);
    } catch (err) {
      message.error("Không tải được danh sách trận đấu!");
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleViewTickets = (matchId: number) => {
    message.info(`Xem vé cho trận đấu ID: ${matchId}`);
    // Có thể navigate đến /tickets/:matchId nếu bạn làm trang chi tiết vé riêng
  };

  const handleAddTickets = (matchId: number) => {
    message.success(`Thêm vé cho trận đấu ID: ${matchId}`);
    // Có thể mở Modal tạo vé mới
  };

  const handleDeleteTickets = (matchId: number) => {
    message.warning(`Xóa toàn bộ vé của trận đấu ID: ${matchId}`);
    // Gọi API delete ticket theo matchId
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
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewTickets(record.id)}
          >
            Xem vé
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAddTickets(record.id)}
          >
            Thêm vé
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTickets(record.id)}
          >
            Xóa vé
          </Button>
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
    </div>
  );
}

export default TicketAdmin;

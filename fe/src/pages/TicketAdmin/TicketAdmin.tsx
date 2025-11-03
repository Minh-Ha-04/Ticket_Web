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
  Upload,
  Input
} from "antd";
import { UploadOutlined, EyeOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
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

interface Discount {
  id?: number; 
  code: string;
  discountType: "percent" | "amount";
  value: number;
  maxUsage: number;
  usedCount?: number;
  isActive?: boolean;
}


function TicketAdmin() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);


  const [matchPoster, setMatchPoster] = useState<string | null>(null);


  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const [openTicketModal, setOpenTicketModal] = useState(false);
  const [ticketStats, setTicketStats] = useState<any[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [discounts, setDiscounts] = useState<any[]>([]);
  const [openDiscountModal, setOpenDiscountModal] = useState(false);
  const [discountInput, setDiscountInput] = useState<Discount>({
    code: "",
    discountType: "percent",
    value: 0,
    maxUsage: 1,
  });


  const safeRequest = async (callback: () => Promise<void>, errorMsg: string) => {
    try {
      await callback();
    } catch (err) {
      console.error(err);
      message.error(errorMsg);
    }
  };
  const fetchMatches = async () => {
    await safeRequest(async () => {
      const res = await instance.get("/matches/home");
      setMatches(res.data);
    }, "Không tải được danh sách trận đấu!");
  };

  const fetchSections = async () => {
    await safeRequest(async () => {
      const res = await instance.get(`/sections/stadium/${stadiumId}`);
      setSections(res.data.sections);
    }, "Không thể tải danh sách khu vực!");
  };

  const fetchTicketSections = async (matchId: number) => {
    await safeRequest(async () => {
      const res = await instance.get(`/tickets/match/${matchId}`);
      setSections(res.data.sections.sections);
      setMatchPoster(res.data.sections.match_poster || null);
    }, "Lỗi khi tải giá vé từ ticket!");
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleViewTickets = async (matchId: number) => {
    try {
      const res = await instance.get(`/tickets/stats/${matchId}`);
      console.log("stats: ", res);
      setTicketStats(res.data);
      setSelectedMatchId(matchId);
      setOpenTicketModal(true);
    }
    catch (err) {
      console.error("Lỗi khi tải giá vé từ ticket:", err);
    }
  };

  const handleAddTickets = (matchId: number) => {
    setSelectedMatchId(matchId);
    fetchSections();
    setIsModalOpen(true);
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

      const endpoint = isUpdateMode
        ? `/tickets/${selectedMatchId}`
        : `/tickets/generate/${selectedMatchId}`;
      await instance[isUpdateMode ? "put" : "post"](endpoint, formData, config);
      alert(isUpdateMode ? "Cập nhật vé thành công!" : "Tạo vé thành công!");

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

  const fetchDiscounts = async (matchId: number) => {
    try {
      const res = await instance.get(`/discounts/${matchId}`);
      console.log(res.data);
      setDiscounts(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách mã giảm giá!");
    }
  };

  const handleAddDiscount = async () => {
    try {
      const payload = {
        ...discountInput,
        matchId: selectedMatchId,
        isActive: true
      };
      console.log(payload);
      await instance.post("/discounts", payload);
      alert("Tạo mã giảm giá thành công!");
      fetchDiscounts(selectedMatchId!);
      setDiscountInput({ code: "", value: 0, maxUsage: 1 , discountType : "percent"});
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tạo mã giảm giá!");
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    try {
      await instance.delete(`/discounts/${id}`);
      alert("Đã xóa mã giảm giá!");
      fetchDiscounts(selectedMatchId!);
    } catch (err) {
      console.error(err);
      message.error("Không thể xóa mã!");
    }
  };

  const handleOpenDiscountModal = (matchId: number) => {
    setSelectedMatchId(matchId);
    fetchDiscounts(matchId);
    setOpenDiscountModal(true);
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
              <Button type="primary"
                onClick={() => handleOpenDiscountModal(record.id)}
              >
                Mã giảm giá
              </Button>
              <Button
                type="default"
                onClick={() => handleViewTickets(record.id)}
              >
                Tình trạng vé
              </Button>
              <Button
                type="primary"
                onClick={() => handleUpdateTickets(record.id)}
              >
                Cập nhật vé
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => showDeleteModal(record.id)}
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
          setPosterFile(null);
          setPosterPreview(null);
        }}
        okText={isUpdateMode ? "Lưu thay đổi" : "Tạo vé"}
      >
        <div style={{ marginBottom: 16 }}>
          <strong>Ảnh poster:</strong>
          <Upload
            beforeUpload={(file) => {
              setPosterFile(file);
              setPosterPreview(URL.createObjectURL(file));
              return false; // ngăn upload tự động
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          {posterPreview && (

            <div style={{ marginTop: 12, textAlign: "center" }}>
              <p style={{ color: "#888", marginTop: 4 }}>Xem trước poster mới</p>
              <img
                src={posterPreview}
                alt="Xem trước poster mới"
                style={{
                  width: "100%",
                  maxHeight: "250px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}
        </div>
        {matchPoster && !posterFile && (
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <p style={{ color: "#888", marginTop: 4 }}>Poster hiện tại</p>
            <img
              src={matchPoster}
              alt="Poster hiện tại"
              style={{
                width: "100%",
                maxHeight: "250px",
                objectFit: "contain",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>
        )}

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

      <Modal
        title={`Tình trạng vé trận đấu #${selectedMatchId}`}
        open={openTicketModal}
        onCancel={() => setOpenTicketModal(false)}
        footer={[
          <Button key="close" onClick={() => setOpenTicketModal(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        <Table
          dataSource={ticketStats}
          pagination={false}
          columns={[
            {
              title: "Khu vực",
              dataIndex: "sectionName",
              key: "sectionName",
            },
            {
              title: "Tổng vé",
              dataIndex: "totalTickets",
              key: "totalTickets",
            },
            {
              title: "Đã bán",
              dataIndex: "soldTickets",
              key: "soldTickets",
            },
            {
              title: "Còn trống",
              dataIndex: "availableTickets",
              key: "availableTickets",
            },
          ]}
          rowKey="sectionId"
        />
      </Modal>

      <Modal
        title={`🎟️ Mã giảm giá cho trận #${selectedMatchId}`}
        open={openDiscountModal}
        onCancel={() => setOpenDiscountModal(false)}
        footer={null}
        width={600}
        className={cx("discountModal")}
      >
        <div className={cx("discountForm")}>
          <div className={cx("formRow")}>
            <label>Mã giảm giá</label>
            <Input
              placeholder="VD: SAVE10"
              value={discountInput.code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDiscountInput({ ...discountInput, code: e.target.value })
              }
            />
          </div>

          <div className={cx("formRow")}>
            <label>Loại giảm</label>
            <select
              value={discountInput.discountType}
              onChange={(e) =>
                setDiscountInput({
                  ...discountInput,
                  discountType: e.target.value as "percent" | "amount",
                })
              }
              className={cx("selectType")}
            >
              <option value="percent">Phần trăm (%)</option>
              <option value="amount">Số tiền (VNĐ)</option>
            </select>
          </div>

          <div className={cx("formRow")}>
            <label>
              Giá trị giảm{" "}
              {discountInput.discountType === "percent" ? "(%)" : "(VNĐ)"}
            </label>
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              max={discountInput.discountType === "percent" ? 100 : 1000000}
              value={discountInput.value}
              onChange={(value) =>
                setDiscountInput({ ...discountInput, value: value ?? 0 })
              }
            />
          </div>

          <div className={cx("formRow")}>
            <label>Số lượt sử dụng tối đa</label>
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              value={discountInput.maxUsage}
              onChange={(value) =>
                setDiscountInput({ ...discountInput, maxUsage: value ?? 1 })
              }
            />
          </div>

          <Button type="primary" onClick={handleAddDiscount} block>
             Thêm mã giảm giá
          </Button>
        </div>

        <Table
          dataSource={discounts}
          rowKey="id"
          columns={[
            { title: "Mã", dataIndex: "code" },
            {
              title: "Loại",
              dataIndex: "discountType",
              render: (t) => (t === "percent" ? "%" : "VNĐ"),
            },
            {
              title: "Giá trị",
              render: (_, d) =>
                d.discountType === "percent" ? `${d.value}%` : `${d.value.toLocaleString()}₫`,
            },
            {
              title: "Lượt dùng",
              render: (_, d) => `${d.usedCount}/${d.maxUsage}`,
            },
            {
              title: "Trạng thái",
              dataIndex: "isActive",
              render: (v) => (v ? "🟢 Hoạt động" : "🔴 Tắt"),
            },
            {
              title: "Hành động",
              render: (_, d) => (
                <Button danger size="small" onClick={() => handleDeleteDiscount(d.id)}>
                  Xóa
                </Button>
              ),
            },
          ]}
          pagination={false}
        />
      </Modal>



    </div>
  );
}

export default TicketAdmin;

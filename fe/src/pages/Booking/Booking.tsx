import { useEffect, useState } from "react";
import styles from "./Booking.module.scss";
import classNames from "classnames/bind";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../utils/axiosInstance";
import { InputNumber, Button, message, Row, Col, Card } from "antd";

const cx = classNames.bind(styles);

interface SectionMatch {
  id: number;
  name: string;
  price: number;
  availableSeats: number;
}

interface BookingItem {
  sectionMatchId: number;
  quantity: number;
}

function Booking() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState<SectionMatch[]>([]);
  const [selectedItems, setSelectedItems] = useState<BookingItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserId(JSON.parse(storedUser).id);
    const fetchSections = async () => {
      try {
        const res = await instance.get(`/section-match/${matchId}`);
        setSections(res.data.data);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải danh sách khu vực vé!");
      }
    };

    if (matchId) fetchSections();
  }, [matchId]);

  const handleQuantityChange = (sectionId: number, value: number) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.sectionMatchId === sectionId);
      if (exists) {
        return prev.map(i =>
          i.sectionMatchId === sectionId ? { ...i, quantity: value } : i
        );
      }
      return [...prev, { sectionMatchId: sectionId, quantity: value }];
    });
  };

  const totalPrice = selectedItems.reduce((sum, item) => {
    const section = sections.find(s => s.id === item.sectionMatchId);
    return sum + (section?.price || 0) * item.quantity;
  }, 0);

  const handleConfirm = async () => {
    if (!userId) {
      message.warning("Vui lòng đăng nhập để đặt vé!");
      navigate("/login");
      return;
    }

    const filteredItems = selectedItems.filter(i => i.quantity > 0);
    if (!filteredItems.length) {
      message.warning("Vui lòng chọn số lượng ghế!");
      return;
    }

    try {
      const filteredItems = selectedItems.filter(i => i.quantity > 0);
      const res = await instance.post("/bookings", {
        userId,
        matchId,
        items: filteredItems
      });
      message.success("Đặt vé thành công! Chuyển đến trang thanh toán...");
      navigate(`/payment/${res.data.data.booking.id}`);
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || "Đặt vé thất bại");
    }
  };

  return (
    <div className={cx("booking")}>
      <h2>Đặt vé trận đấu</h2>

      <Row gutter={[16, 16]}>
        {sections.map(section => {
          const quantity = selectedItems.find(i => i.sectionMatchId === section.id)?.quantity || 0;
          return (
            <Col key={section.id} xs={24} sm={12} md={8} lg={6}>
              <Card title={section.name} variant="outlined">
                <p>Giá: {section.price.toLocaleString("vi-VN")}₫</p>
                <p>Còn lại: {section.availableSeats} ghế</p>
                <InputNumber
                  min={0}
                  max={section.availableSeats}
                  value={quantity}
                  onChange={value => handleQuantityChange(section.id, value || 0)}
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      <div className={cx("footer")}>
        <div className={cx("total")}>
          Tổng tiền: {totalPrice.toLocaleString("vi-VN")}₫
        </div>
        <Button
          type="primary"
          onClick={handleConfirm}
          className={cx("confirm-btn")}
          disabled={selectedItems.reduce((sum, i) => sum + i.quantity, 0) === 0}
        >
          Xác nhận đặt vé ({selectedItems.reduce((sum, i) => sum + i.quantity, 0)})
        </Button>
      </div>
    </div>
  );
}

export default Booking;

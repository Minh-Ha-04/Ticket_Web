import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import instance from '../../utils/axiosInstance';
import { Card, List, Typography, Input, Button, Radio, Alert } from 'antd';
import styles from "./Payment.module.scss";
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
const { Title, Text } = Typography;

interface Team {
  id: number;
  name: string;
  logo: string;
  shortname: string;
}

interface Stadium {
  id: number;
  name: string;
  capacity: number;
}

interface Match {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  matchDate: string;
  Stadium: Stadium;
}

interface Section {
  id: number;
  name: string;
  seatCount: number;
}

interface SectionMatch {
  id: number;
  section: Section;
  match: Match;
}

interface Ticket {
  id: number;
  code: string;
  price: number;
  status: string;
  sectionMatchId: number;
  sectionMatch: SectionMatch;
}

interface Booking {
  id: number;
  userId: number;
  matchId: number;
  status: string;
  tickets: Ticket[];
}

function Payment() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!bookingId) return;
    const fetchBooking = async () => {
      try {
        const { data } = await instance.get(`/bookings/${bookingId}`);
        setBooking(data.data); // dựa vào cấu trúc API
        if (data?.data?.tickets?.length) {
          const holds = data.data.tickets
            .filter((t: Ticket) => t.status === 'held')
            .map((t: Ticket) => t.sectionMatch?.match?.matchDate ? new Date(t.sectionMatch.match.matchDate).getTime() : 0);
          if (holds.length > 0) {
            const earliestHold = Math.min(...holds);
            const diff = Math.max(Math.floor((earliestHold - Date.now()) / 1000), 0);
            setTimeLeft(diff);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Hết thời gian giữ vé! Vui lòng đặt lại.");
          navigate("/ticket");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  if (!booking) return <p>Đang tải dữ liệu...</p>;

  const tickets = booking.tickets || [];
  const subtotal = tickets.reduce((sum, t) => sum + t.price, 0);
  const total = subtotal - discountAmount;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const applyDiscount = async () => {
    if (!discountCode.trim()) {
      setError("Vui lòng nhập mã giảm giá");
      setDiscountAmount(0);
      return;
    }
    try {
      const res = await instance.get(`/discounts/${booking.matchId}/validate/${discountCode.trim()}`);
      const discount = res.data;
      if (discount) {
        let amount = discount.discountType === "percent"
          ? subtotal * (discount.value / 100)
          : discount.value;
        if (subtotal - amount < 0) amount = subtotal;
        setDiscountAmount(amount);
        setError('');
      } else {
        setDiscountAmount(0);
        setError("Mã giảm giá không hợp lệ hoặc đã hết lượt");
      }
    } catch (err) {
      console.error(err);
      setDiscountAmount(0);
      setError("Lỗi kiểm tra mã giảm giá");
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) { alert('Vui lòng chọn phương thức thanh toán!'); return; }
    const token = localStorage.getItem("token");
    if (!token) { alert("Bạn chưa đăng nhập!"); return; }

    try {
      const res = await instance.post(
        `/pays/create`,
        {
          method: paymentMethod.toLowerCase() === 'momo' ? 'momo' : 'vnpay',
          amount: total,
          bookingId,
          discountCode,
          orderInfo: `Thanh toán đơn ${bookingId}`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.payUrl) window.location.href = res.data.payUrl;
      else alert("Không thể tạo phiên thanh toán, vui lòng thử lại!");
    } catch (err) {
      console.error(err);
      alert("Thanh toán thất bại!");
    }
  };

  return (
    <Card className={cx('payment-card')}>
      <Title level={3}>Thanh toán đơn mã : {bookingId}</Title>

      <Text type="secondary">
         Giữ vé: {minutes}:{seconds.toString().padStart(2,'0')}
      </Text>

      <List
        style={{ marginTop: 16 }}
        header={<Text strong>Danh sách vé</Text>}
        bordered
        dataSource={tickets}
        renderItem={(t: Ticket) => (
          <List.Item>
            <Text>Mã vé: {t.code} - Khu: {t.sectionMatch.section.name} - Giá: {t.price.toLocaleString()}đ</Text>
            <Text>Trận: {t.sectionMatch.match.homeTeam.name} vs {t.sectionMatch.match.awayTeam.name}</Text>
          </List.Item>
        )}
      />

      <div style={{ marginTop: 16 }}>
        <Text strong>Tạm tính: {subtotal.toLocaleString()}đ</Text>
        {discountAmount > 0 && <Text type="success" style={{ marginLeft: 8 }}>Giảm: -{discountAmount.toLocaleString()}đ</Text>}
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <Input 
          placeholder="Nhập mã giảm giá" 
          value={discountCode} 
          onChange={e => setDiscountCode(e.target.value)}
        />
        <Button type="primary" onClick={applyDiscount}>Áp dụng</Button>
      </div>

      {error && <Alert type="error" message={error} style={{ marginTop: 8 }} />}

      <div style={{ marginTop: 16 }}>
        <Text strong>Phương thức thanh toán:</Text>
        <Radio.Group
          onChange={e => setPaymentMethod(e.target.value)}
          value={paymentMethod}
          style={{ marginLeft: 16 }}
        >
          <Radio value="Momo">Ví MoMo</Radio>
          <Radio value="VnPay">VNPay</Radio>
        </Radio.Group>
      </div>

      <div style={{ marginTop: 16 }}>
        <Text strong>Tổng tiền: {total.toLocaleString()}đ</Text>
      </div>

      <Button type="primary" block style={{ marginTop: 16 }} onClick={handlePayment}>
        Xác nhận thanh toán
      </Button>
    </Card>
  );
}

export default Payment;

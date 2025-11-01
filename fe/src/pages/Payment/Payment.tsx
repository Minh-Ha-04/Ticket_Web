import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import instance from '../../utils/axiosInstance';
import styles from "./Payment.module.scss";
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Payment() {
  const { bookingId } = useParams<{ bookingId: string }>(); // ✅ nhận bookingId từ URL
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 phút = 300 giây

  // 🔹 Lấy thông tin booking từ API
  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const { data } = await instance.get(`/bookings/${bookingId}`);
        setBooking(data);
      } catch (err) {
        console.error("Lỗi khi lấy booking:", err);
      }
    };

    fetchBooking();
  }, [bookingId]);

  // 🔹 Đếm ngược giữ vé
  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Hết thời gian giữ vé! Vui lòng đặt lại.");
      navigate("/");
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  if (!booking) return <p>Đang tải dữ liệu...</p>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const tickets = booking.tickets || [];
  const subtotal = tickets.reduce((sum: number, t: any) => sum + t.price, 0);
  const total = subtotal - discountAmount;

  const validVouchers: Record<string, number> = {
    'SALE10': 0.1,
    'VIP20': 0.2,
    'FAN50': 0.5,
  };

  const applyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (validVouchers[code]) {
      const discount = subtotal * validVouchers[code];
      setDiscountAmount(discount);
      setError('');
    } else {
      setError('Mã giảm giá không hợp lệ');
      setDiscountAmount(0);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }

    try {
      await instance.put(`/bookings/${bookingId}/pay`, {
        paymentMethod,
        amount: total,
      });
      alert(`Thanh toán thành công bằng ${paymentMethod}! Tổng: ${total.toLocaleString()}đ`);
      navigate("/success");
    } catch (err) {
      console.error("Lỗi thanh toán:", err);
    }
  };

  return (
    <div className={cx('payment')}>
      <h2>Thanh toán đơn #{bookingId}</h2>

      <p className={cx('countdown')}>
        ⏳ Giữ vé trong: <strong>{minutes}:{seconds.toString().padStart(2, "0")}</strong>
      </p>

      <ul className={cx('ticket-list')}>
        {tickets.map((t: any) => (
          <li key={t.id}>
            {t.seat.number}  : {t.price.toLocaleString()}đ
          </li>
        ))}
      </ul>

      <p className={cx('subtotal')}>Tạm tính: {subtotal.toLocaleString()}đ</p>

      <div className={cx('voucher')}>
        <input
          type="text"
          placeholder="Nhập mã giảm giá"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />
        <button onClick={applyDiscount}>Áp dụng</button>
      </div>

      {error && <p className={cx('error')}>{error}</p>}
      {discountAmount > 0 && (
        <p className={cx('discount')}>Giảm: -{discountAmount.toLocaleString()}đ</p>
      )}

      <div className={cx('payment-methods')}>
        <h3>Phương thức thanh toán</h3>
        <label>
          <input type="radio" name="payment" value="Momo" onChange={(e) => setPaymentMethod(e.target.value)} /> Ví Momo
        </label>
        <label>
          <input type="radio" name="payment" value="Thẻ ngân hàng" onChange={(e) => setPaymentMethod(e.target.value)} /> Thẻ ngân hàng
        </label>
        <label>
          <input type="radio" name="payment" value="Tiền mặt" onChange={(e) => setPaymentMethod(e.target.value)} /> Tiền mặt khi nhận vé
        </label>
      </div>

      <p className={cx('total')}><strong>Tổng tiền: {total.toLocaleString()}đ</strong></p>

      <button className={cx('pay-btn')} onClick={handlePayment}>Xác nhận thanh toán</button>
    </div>
  );
}

export default Payment;

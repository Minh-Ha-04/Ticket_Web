import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import instance from '../../utils/axiosInstance';
import styles from "./Payment.module.scss";
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Payment() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // ======= Lấy thông tin booking =======
  useEffect(() => {
    if (!bookingId) return;
    const fetchBooking = async () => {
      try {
        const { data } = await instance.get(`/bookings/${bookingId}`);
        setBooking(data);
        if (data?.tickets?.length) {
          const holds = data.tickets
            .filter((t: any) => t.holdExpiresAt)
            .map((t: any) => new Date(t.holdExpiresAt).getTime());

          if (holds.length > 0) {
            const earliestHold = Math.min(...holds);
            const diff = Math.max(Math.floor((earliestHold - Date.now()) / 1000), 0);
            setTimeLeft(diff);
          }

        }
      } catch (err) {
        console.error("Lỗi khi lấy booking:", err);
      }
    };
    fetchBooking();
  }, [bookingId]);

  // ======= Đếm ngược giữ vé =======
  useEffect(() => {
    if (timeLeft <= 0) return; // không chạy interval nếu đã hết
  
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
  }, [navigate]); 

  if (!booking) return <p>Đang tải dữ liệu...</p>;

  const tickets = booking.tickets || [];
  const subtotal = tickets.reduce((sum: number, t: any) => sum + t.price, 0);
  const total = subtotal - discountAmount;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // ======= Áp dụng mã giảm giá =======
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
        let amount = 0;
        if (discount.discountType === "percent") {
          amount = subtotal * (discount.value / 100);
        } else if (discount.discountType === "amount") {
          amount = discount.value;
        }

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

  // ======= Xử lý thanh toán =======
  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
      }
  
      // Gọi API thanh toán thật
      const res = await instance.post(
        `/pays/create`,
        {
          method: paymentMethod.toLowerCase() === 'momo' ? 'momo' : 'vnpay',
          amount: total,
          bookingId,
          discountCode,
          orderInfo: `Thanh toán đơn #${bookingId}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 
          },
        }
      );
  
      if (res.data.payUrl) {
        window.location.href = res.data.payUrl;
      } else {
        alert("Không thể tạo phiên thanh toán, vui lòng thử lại!");
      }
    } catch (err) {
      console.error("Lỗi thanh toán:", err);
      alert("Thanh toán thất bại!");
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
            {t.seat.number} : {t.price.toLocaleString()}đ
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
      {discountAmount > 0 && <p className={cx('discount')}>Giảm: -{discountAmount.toLocaleString()}đ</p>}

      <div className={cx('payment-methods')}>
        <h3>Phương thức thanh toán</h3>
        <label>
          <input
            type="radio"
            name="payment"
            value="Momo"
            onChange={(e) => setPaymentMethod(e.target.value)}
          /> Ví MoMo
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="VnPay"
            onChange={(e) => setPaymentMethod(e.target.value)}
          /> VNPay
        </label>
      </div>

      <p className={cx('total')}>
        <strong>Tổng tiền: {total.toLocaleString()}đ</strong>
      </p>

      <button className={cx('pay-btn')} onClick={handlePayment}>
        Xác nhận thanh toán
      </button>
    </div>
  );
}

export default Payment;

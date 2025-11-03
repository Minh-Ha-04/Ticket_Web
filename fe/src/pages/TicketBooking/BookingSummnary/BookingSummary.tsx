import styles from "./BookingSummary.module.scss";
import classNames from 'classnames/bind';
import { useNavigate } from "react-router-dom";
import instance from "../../../utils/axiosInstance";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

interface Section {
  id: number;
  name: string;
  price: number;
}

interface Seat {
  id: number;
  number: string;
  ticketId:number;
}

interface Ticket {
  id:number;
  price :number;
  section: Section;
  seat: Seat;
}

interface SelectedTicket {
  ticket: Ticket;
}

interface BookingSummaryProps {
  selectedTickets: { ticket:Ticket; ticketId: number }[];
  onRemoveTicket: (ticket: Ticket  ) => void;
}

function BookingSummary({ selectedTickets , onRemoveTicket }: BookingSummaryProps) {

  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);

  // 🔐 Giả sử userId được lưu trong localStorage khi đăng nhập
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed.id);
    }
  }, []);

  if (!selectedTickets .length) return null;
  console.log(selectedTickets);
  const total = selectedTickets.reduce((sum, s) => sum + s.ticket.price, 0);

  // 🔹 Gom ghế theo khu vực
  const grouped = selectedTickets.reduce((acc, s) => {
    acc[s.ticket.seat.number] = acc[s.ticket.seat.number] || [];
    acc[s.ticket.seat.number].push(s);
    return acc;
  }, {} as Record<string, SelectedTicket[]>);

  const handleConfirm = async () => {
    if (!userId) {
      alert("Vui lòng đăng nhập để đặt vé!");
      navigate("/login");
      return;
    }

    try {
      console.log(selectedTickets);
      const ticketIds = selectedTickets.map(t => t.ticket.id);

      console.log("Gửi request booking:", { userId, ticketIds });
      const res = await instance.post("/bookings", { userId, ticketIds});
            console.log(res.data.booking);
      const bookingId = res.data.booking.newBooking.id;
      navigate(`/payment/${bookingId}`);
    } catch (err: any) {
      console.error("Lỗi khi tạo booking:", err);
      alert(err.response?.data?.message || "Đặt vé thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div className={cx('summary')}>
      <h3 className={cx('title')}>Tóm tắt đặt vé</h3>

      {Object.entries(grouped).map(([section, tickets]) => (
        <div key={section} className={cx('section')}>
          <strong className={cx('section-name')}>{section}</strong>:
          <div className={cx('seats')}>
            {tickets.map(t => (
              <span key={t.ticket.id} className={cx('seat')}>
                {t.ticket.seat.number}
                <button
                  className={cx('remove-btn')}
                  onClick={() => onRemoveTicket(t.ticket)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}

      <p className={cx('total')}>Tổng tiền: {total.toLocaleString("vi-VN")}đ</p>

      <button
        className={cx('confirm-btn')}
        onClick={handleConfirm}
      >
        Xác nhận đặt vé
      </button>
    </div>
  );
}

export default BookingSummary;
